// Ensure any ML libraries that might be used by dependencies cache to /tmp (writeable on serverless)
if (!process.env.TRANSFORMERS_CACHE) process.env.TRANSFORMERS_CACHE = '/tmp/transformers'
if (!process.env.HF_HOME) process.env.HF_HOME = '/tmp/hf'
if (!process.env.XDG_CACHE_HOME) process.env.XDG_CACHE_HOME = '/tmp'

import pkg from 'content-guard'
const { createGuard } = pkg
import crypto from 'node:crypto'

const guard = createGuard('balanced', {
  spamThreshold: 5,
  // Attempt to keep dependencies lightweight in serverless
  ml: false,
  enableML: false
})

// In-memory storage for batching events per session
const sessionEvents = new Map();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute

// NOTE: In serverless environments, instances are ephemeral; avoid long-lived timers
// We'll do opportunistic cleanup on each request instead of setInterval

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { event, details, shouldSendBatch = false } = req.body || {};

    const heuristics = collectHeuristics(req);
    const sessionId = generateSessionId(heuristics.ip, heuristics.userAgent);

    // Opportunistic cleanup of stale sessions
    {
      const now = Date.now()
        for (const [sid, sdata] of sessionEvents.entries()) {
          if (now - (sdata.lastActivity ?? sdata.firstActivity ?? 0) > SESSION_TIMEOUT) sessionEvents.delete(sid)
        }
    }

    // Initialize session if it doesn't exist
    if (!sessionEvents.has(sessionId)) {
      sessionEvents.set(sessionId, {
        events: [],
        heuristics: heuristics,
        firstActivity: Date.now(),
        lastActivity: Date.now()
      });
    }

    const sessionData = sessionEvents.get(sessionId);
    sessionData.lastActivity = Date.now();

    // Add the current event to the session
    if (event && event !== 'batch_send') {
      let analysis = null;
      if (details && typeof details.message === 'string') {
        analysis = await guard.analyze(details.message);
      }

      sessionData.events.push({
        event: event,
        details: details || {},
        analysis: analysis,
        timestamp: new Date().toISOString()
      });

      // Minimal log for observability without spamming
      if (process.env.LOG_LEVEL === 'debug') {
        console.log(`usage: event=${event} session=${sessionId.substring(0,8)} count=${sessionData.events.length}`)
      }
    }

    // Send batch if requested (usually after contact form submission)
    if (shouldSendBatch || event === 'contact_form_submitted') {
      if (process.env.LOG_LEVEL === 'debug') {
        console.log(`usage: sending batch session=${sessionId.substring(0,8)} count=${sessionData.events.length}`)
      }
      
      const sent = await sendBatchedAnalytics(sessionData, sessionId);
      
      if (sent) {
        // Clear events after successful send, but keep session for future events
        sessionData.events = [];
        if (process.env.LOG_LEVEL === 'debug') {
          console.log(`usage: batch ok session=${sessionId.substring(0,8)}`)
        }
      }
      
      return res.status(200).json({ 
        success: sent, 
        eventCount: sessionData.events.length,
        sessionId: sessionId.substring(0, 8) + '...'
      });
    }

    return res.status(200).json({ 
      success: true, 
      eventCount: sessionData.events.length,
      sessionId: sessionId.substring(0, 8) + '...'
    });

  } catch (err) {
    console.error('usage: error', err?.message || err);
    return res.status(500).json({ error: 'Internal error' });
  }
}

function collectHeuristics(req) {
  const headers = req.headers || {};
  const ipRaw = headers['x-forwarded-for'] || headers['x-real-ip'] || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';
  const ip = typeof ipRaw === 'string' ? ipRaw.split(',')[0].trim() : 'unknown';
  
  // Return full IP instead of truncating it
  return {
    ip: ip, // Full IP address
    userAgent: headers['user-agent'] || 'unknown',
    referer: headers['referer'] || headers['referrer'] || 'direct',
    acceptLanguage: headers['accept-language'] || 'unknown',
    acceptEncoding: headers['accept-encoding'] || 'unknown',
    secFetchSite: headers['sec-fetch-site'] || 'unknown',
    secFetchMode: headers['sec-fetch-mode'] || 'unknown'
  };
}

function generateSessionId(ip, userAgent) {
  // Create a simple hash-based session ID
  return crypto
    .createHash('md5')
    .update(`${ip}-${userAgent}-${Date.now()}`)
    .digest('hex')
    .substring(0, 16)
}

async function sendBatchedAnalytics(sessionData, sessionId) {
  // Send to spam channel for analytics if configured
  const webhook = process.env.DISCORD_SPAM_WEBHOOK

  if (!webhook) {
    if (process.env.LOG_LEVEL === 'debug') console.log('usage: no spam webhook configured')
    return false;
  }

  try {
    const embed = buildBatchedEmbed(sessionData, sessionId);

    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        embeds: [embed], 
        username: 'Usage Analytics Bot',
        content: `📊 **Batched User Analytics** (${sessionData.events.length} events from session ${sessionId.substring(0, 8)}...)`
      })
    });

    if (response.ok) return true;
    // Gracefully handle common webhook failures without noisy logs
    const status = response.status
    if (status === 404 || status === 401 || status === 403) {
      console.warn('usage: webhook rejected (status ' + status + ')')
      return false
    }
    const text = await response.text().catch(() => '')
    console.error('usage: webhook error', status, text?.slice?.(0, 140) || '')
    return false
  } catch (error) {
    console.error('usage: webhook exception', error?.message || error)
    return false;
  }
}

function buildBatchedEmbed(sessionData, sessionId) {
  const { events, heuristics, firstActivity, lastActivity } = sessionData;
  
  // Calculate session duration
  const sessionDuration = Math.round((lastActivity - firstActivity) / 1000); // seconds
  
  // Build event list
  const eventList = events.map((event, index) => {
    let eventString = `${index + 1}. **${event.event}**`;
    
    if (event.details && Object.keys(event.details).length > 0) {
      const detailsString = Object.entries(event.details)
        .filter(([key, value]) => key !== 'message' && value) // Exclude message content and empty values
        .map(([key, value]) => `${key}: ${String(value).substring(0, 50)}`)
        .join(', ');
      
      if (detailsString) {
        eventString += ` (${detailsString})`;
      }
    }
    
    if (event.analysis) {
      eventString += ` - CG: ${event.analysis.isSpam ? '🚫SPAM' : '✅CLEAN'} (${event.analysis.score})`;
    }
    
    return eventString;
  }).join('\n');

  // Build fields for the embed
  const fields = [
    {
      name: "🌐 Session Information",
      value: `**Session ID:** ${sessionId.substring(0, 12)}...\n**Duration:** ${sessionDuration}s\n**Events:** ${events.length}`,
      inline: true
    },
    {
      name: "📍 User Information", 
      value: `**IP:** ${heuristics.ip}\n**User Agent:** ${heuristics.userAgent.substring(0, 60)}...\n**Referer:** ${heuristics.referer}`,
      inline: true
    },
    {
      name: "🔍 Security Headers",
      value: `**Fetch Site:** ${heuristics.secFetchSite}\n**Fetch Mode:** ${heuristics.secFetchMode}\n**Language:** ${heuristics.acceptLanguage.substring(0, 20)}`,
      inline: true
    }
  ];

  // Add events list if there are events
  if (events.length > 0) {
    fields.push({
      name: "📊 User Activity Events",
      value: eventList.length > 1900 ? eventList.substring(0, 1900) + '...' : eventList,
      inline: false
    });
  }

  // Check for any spam content
  const hasSpamContent = events.some(event => event.analysis && event.analysis.isSpam);
  const embedColor = hasSpamContent ? 0xFF4500 : 0x7289da; // Orange for spam, blue for clean

  return {
    title: hasSpamContent ? "🚫 User Session Analytics (SPAM DETECTED)" : "📊 User Session Analytics",
    color: embedColor,
    fields: fields,
    footer: {
      text: `Jose Rodriguez Portfolio Analytics • Session: ${sessionId.substring(0, 8)}... • Events: ${events.length}`
    },
    timestamp: new Date().toISOString()
  };
}
