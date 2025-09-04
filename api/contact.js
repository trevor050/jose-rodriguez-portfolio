// Vercel Serverless Function for Contact Form
// ENHANCED USER TRACKING + CONTENTGUARD INTEGRATION + IMPROVED ANALYTICS
// Ensure ML libraries (used by dependencies) cache to /tmp in serverless
if (!process.env.TRANSFORMERS_CACHE) process.env.TRANSFORMERS_CACHE = '/tmp/transformers'
if (!process.env.HF_HOME) process.env.HF_HOME = '/tmp/hf'
if (!process.env.XDG_CACHE_HOME) process.env.XDG_CACHE_HOME = '/tmp'

import pkg from 'content-guard'
const { createGuard } = pkg
import { UAParser } from 'ua-parser-js'
import geoip from 'geoip-lite'
import crypto from 'node:crypto'

// Initialize ContentGuard with balanced variant
const contentGuard = createGuard('balanced', {
  spamThreshold: 5,
  ml: false,
  enableML: false
})

if (process.env.LOG_LEVEL === 'debug') {
  console.log('content-guard initialized (balanced, ml disabled)')
}

// Analytics tracking for usage insights
const analyticsData = {
  totalRequests: 0,
  spamBlocked: 0,
  legitimateMessages: 0,
  topCountries: new Map(),
  topBrowsers: new Map(),
  topDevices: new Map(),
  hourlyStats: new Map()
}

export default async function handler(req, res) {
  // Increment total requests counter
  analyticsData.totalRequests++
  
  // Track hourly statistics
  const currentHour = new Date().getHours()
  analyticsData.hourlyStats.set(currentHour, (analyticsData.hourlyStats.get(currentHour) || 0) + 1)

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  try {
    const { name, email, subject, message, website } = req.body

    // STAGE 0: HONEYPOT CHECK - INSTANT BOT REJECTION
    if (website && website.trim() !== '') {
      console.log('🍯 Honeypot triggered - INSTANT BOT REJECTION')
      analyticsData.spamBlocked++
      // Return a generic success to not alert bots, but don't process further.
      return res.status(200).json({ success: true, message: 'Message received.' })
    }

    // STAGE 1: COLLECT COMPREHENSIVE USER HEURISTICS WITH IMPROVED ANALYTICS
    const userHeuristics = await collectUserHeuristics(req)
    if (process.env.LOG_LEVEL === 'debug') {
      console.log('heuristics collected')
    }

    // Update analytics with user data
    updateAnalytics(userHeuristics)

    // STAGE 2: INSTANT SPAM DETECTION FOR 1000% OBVIOUS SPAM
    const instantSpamVerdict = isInstantSpam({ name, email, subject, message })
    if (instantSpamVerdict.isSpam) {
      console.log('🗑️ INSTANT SPAM REJECTION:', instantSpamVerdict.reason)
      analyticsData.spamBlocked++
      return res.status(400).json({
        error: 'Message identified as high-confidence spam. If this is a legitimate inquiry, please contact Jose directly via LinkedIn.',
        reason: instantSpamVerdict.reason
      })
    }

    // STAGE 3: BASIC VALIDATION
    const errors = []
    
    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters')
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Valid email address required')
    }
    if (!subject || subject.trim().length < 3) {
      errors.push('Subject must be at least 3 characters')
    }
    if (!message || message.trim().length < 10) {
      errors.push('Message must be at least 10 characters')
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') })
    }

    // STAGE 4: CONTENTGUARD SPAM ANALYSIS
    if (process.env.LOG_LEVEL === 'debug') console.log('running ContentGuard analysis...')
    const contentGuardResult = await analyzeWithContentGuard({ name, email, subject, message })
    if (process.env.LOG_LEVEL === 'debug') console.log('ContentGuard result ready')

    // Update spam analytics based on ContentGuard result
    if (contentGuardResult.isSpam) {
      analyticsData.spamBlocked++
    } else {
      analyticsData.legitimateMessages++
    }

    // STAGE 5: SEND EMAIL WITH ENHANCED REPORTING INCLUDING ANALYTICS
    const emailSent = await sendEmail({ 
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      userHeuristics,
      contentGuardResult,
      analytics: getAnalyticsSummary()
    })

    if (emailSent) {
      if (process.env.LOG_LEVEL === 'debug') console.log('notification completed')
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully! I\'ll get back to you soon.'
      })
    } else {
      console.warn('contact: notifications failed')
      return res.status(500).json({
        error: 'Failed to send message due to an internal issue. Please try LinkedIn.'
      })
    }

  } catch (error) {
    console.error('contact: handler error', error?.message || error)
    return res.status(500).json({
      error: 'Failed to process message. Please try again or contact via LinkedIn.'
    })
  }
}

// ENHANCED USER HEURISTICS COLLECTION WITH IMPROVED ANALYTICS
async function collectUserHeuristics(req) {
  const headers = req.headers
  const ip = headers['x-forwarded-for']?.split(',')[0]?.trim() || 
             headers['x-real-ip'] || 
             req.connection?.remoteAddress || 
             req.socket?.remoteAddress || 
             'unknown'

  const userAgent = headers['user-agent'] || 'unknown'
  const referer = headers['referer'] || headers['referrer'] || 'direct'
  const acceptLanguage = headers['accept-language'] || 'unknown'
  const acceptEncoding = headers['accept-encoding'] || 'unknown'
  const dnt = headers['dnt'] || 'unknown' // Do Not Track
  const connection = headers['connection'] || 'unknown'
  const cacheControl = headers['cache-control'] || 'unknown'
  
  // Enhanced User Agent parsing with UAParser
  const userAgentData = parseUserAgentEnhanced(userAgent)
  
  // Enhanced geolocation with geoip-lite
  const geoData = await getGeoLocationEnhanced(ip)
  
  // Calculate request timing and session data
  const timestamp = new Date().toISOString()
  const timezone = headers['timezone'] || 'unknown'
  const sessionId = generateSessionId(ip, userAgent)
  
  // Security-related headers
  const securityHeaders = {
    secFetchSite: headers['sec-fetch-site'],
    secFetchMode: headers['sec-fetch-mode'], 
    secFetchDest: headers['sec-fetch-dest'],
    secFetchUser: headers['sec-fetch-user'],
    secChUa: headers['sec-ch-ua'],
    secChUaPlatform: headers['sec-ch-ua-platform'],
    secChUaMobile: headers['sec-ch-ua-mobile']
  }

  // Enhanced fingerprinting
  const fingerprint = generateFingerprint(ip, userAgent, acceptLanguage, acceptEncoding)

  return {
    // Network Information
    ip: ip,
    ipType: ip.includes(':') ? 'IPv6' : 'IPv4',
    
    // Enhanced User Agent Analysis
    userAgent: userAgent,
    ...userAgentData,
    
    // Request Details  
    referer: referer,
    acceptLanguage: acceptLanguage,
    acceptEncoding: acceptEncoding,
    connection: connection,
    cacheControl: cacheControl,
    dnt: dnt,
    
    // Enhanced Geolocation
    ...geoData,
    
    // Timing and Session
    timestamp: timestamp,
    timezone: timezone,
    sessionId: sessionId,
    fingerprint: fingerprint,
    
    // Security Headers (helpful for bot detection)
    ...securityHeaders,
    
    // Enhanced Analysis
    isLikelyBot: detectBotBehaviorEnhanced(userAgent, headers, userAgentData),
    riskScore: calculateEnhancedRiskScore(userAgent, ip, referer, headers, userAgentData, geoData),
    
    // Performance metrics
    requestSize: JSON.stringify(req.body).length,
    headerCount: Object.keys(headers).length
  }
}

// ENHANCED USER AGENT PARSING WITH UAPARSER
function parseUserAgentEnhanced(userAgent) {
  if (!userAgent || userAgent === 'unknown') {
    return { 
      browser: 'unknown', 
      browserVersion: 'unknown',
      os: 'unknown', 
      osVersion: 'unknown',
      device: 'unknown',
      deviceType: 'unknown',
      deviceVendor: 'unknown',
      cpu: 'unknown',
      isBot: true // Unknown UA is suspicious
    }
  }

  try {
    const parser = new UAParser(userAgent)
    const result = parser.getResult()
    
    return {
      browser: result.browser.name || 'unknown',
      browserVersion: result.browser.version || 'unknown',
      os: result.os.name || 'unknown',
      osVersion: result.os.version || 'unknown',
      device: result.device.model || 'unknown',
      deviceType: result.device.type || 'desktop',
      deviceVendor: result.device.vendor || 'unknown',
      cpu: result.cpu.architecture || 'unknown',
      isBot: detectBotFromUA(userAgent)
    }
  } catch (error) {
    console.error('Error parsing user agent:', error)
    return parseUserAgent(userAgent) // Fallback to original method
  }
}

// ENHANCED GEOLOCATION WITH GEOIP-LITE
async function getGeoLocationEnhanced(ip) {
  try {
    // Skip for localhost/private IPs
    if (ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return { 
        country: 'local', 
        region: 'local', 
        city: 'local', 
        timezone: 'local',
        coordinates: { lat: 0, lon: 0 },
        isp: 'local'
      }
    }

    const geo = geoip.lookup(ip)
    
    if (geo) {
      if (process.env.LOG_LEVEL === 'debug') console.log(`geo ok for ${ip}`)
      return {
        country: geo.country || 'unknown',
        region: geo.region || 'unknown',
        city: geo.city || 'unknown',
        timezone: geo.timezone || 'unknown',
        coordinates: {
          lat: geo.ll?.[0] || 0,
          lon: geo.ll?.[1] || 0
        },
        isp: 'unknown' // geoip-lite doesn't provide ISP info
      }
    } else {
      if (process.env.LOG_LEVEL === 'debug') console.log(`geo miss for ${ip}`)
      return {
        country: 'unknown',
        region: 'unknown',
        city: 'unknown',
        timezone: 'unknown',
        coordinates: { lat: 0, lon: 0 },
        isp: 'unknown'
      }
    }
    
  } catch (error) {
    console.error('Enhanced geolocation lookup failed:', error)
    return { 
      country: 'error', 
      region: 'error', 
      city: 'error',
      timezone: 'error',
      coordinates: { lat: 0, lon: 0 },
      isp: 'error'
    }
  }
}

// ENHANCED BOT DETECTION
function detectBotBehaviorEnhanced(userAgent, headers, userAgentData) {
  const ua = (userAgent || '').toLowerCase()
  
  // Known bot patterns
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 
    'python', 'php', 'java', 'go-http-client', 'okhttp',
    'postman', 'insomnia', 'httpie'
  ]
  
  const hasBotPattern = botPatterns.some(pattern => ua.includes(pattern))
  
  // Suspicious header patterns
  const hasMinimalHeaders = Object.keys(headers).length < 5
  const missingCommonHeaders = !headers['accept'] || !headers['accept-language']
  
  // Check if UAParser detected it as a bot
  const uaParserBot = userAgentData.isBot
  
  // Check for headless browser indicators
  const headlessIndicators = ['headless', 'phantom', 'selenium', 'webdriver']
  const hasHeadlessIndicators = headlessIndicators.some(indicator => ua.includes(indicator))
  
  return hasBotPattern || hasMinimalHeaders || missingCommonHeaders || uaParserBot || hasHeadlessIndicators
}

// ENHANCED RISK SCORING
function calculateEnhancedRiskScore(userAgent, ip, referer, headers, userAgentData, geoData) {
  let score = 0
  
  // User Agent risks
  if (!userAgent || userAgent === 'unknown') score += 3
  if (userAgentData.isBot) score += 2
  if (userAgentData.browser === 'unknown') score += 2
  
  // IP risks  
  if (ip === 'unknown') score += 2
  if (ip.startsWith('10.') || ip.startsWith('192.168.')) score += 1 // Private IP
  
  // Geolocation risks
  if (geoData.country === 'unknown' || geoData.country === 'error') score += 1
  
  // Referer risks
  if (referer === 'direct') score += 0.5 // Not necessarily bad, but worth noting
  
  // Header analysis
  if (Object.keys(headers).length < 5) score += 2
  if (!headers['accept-language']) score += 1
  if (!headers['accept']) score += 1
  
  // Device type risks
  if (userAgentData.deviceType === 'unknown') score += 1
  
  return Math.min(score, 10) // Cap at 10
}

// SESSION AND FINGERPRINTING
function generateSessionId(ip, userAgent) {
  return crypto.createHash('md5').update(`${ip}-${userAgent}-${Date.now()}`).digest('hex').substring(0, 16)
}

function generateFingerprint(ip, userAgent, acceptLanguage, acceptEncoding) {
  return crypto.createHash('sha256').update(`${ip}-${userAgent}-${acceptLanguage}-${acceptEncoding}`).digest('hex').substring(0, 32)
}

function detectBotFromUA(userAgent) {
  const ua = userAgent.toLowerCase()
  const botIndicators = ['bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'php']
  return botIndicators.some(indicator => ua.includes(indicator))
}

// ANALYTICS FUNCTIONS
function updateAnalytics(userHeuristics) {
  // Update country statistics
  if (userHeuristics.country && userHeuristics.country !== 'unknown') {
    analyticsData.topCountries.set(
      userHeuristics.country, 
      (analyticsData.topCountries.get(userHeuristics.country) || 0) + 1
    )
  }
  
  // Update browser statistics
  if (userHeuristics.browser && userHeuristics.browser !== 'unknown') {
    analyticsData.topBrowsers.set(
      userHeuristics.browser, 
      (analyticsData.topBrowsers.get(userHeuristics.browser) || 0) + 1
    )
  }
  
  // Update device statistics
  if (userHeuristics.deviceType && userHeuristics.deviceType !== 'unknown') {
    analyticsData.topDevices.set(
      userHeuristics.deviceType, 
      (analyticsData.topDevices.get(userHeuristics.deviceType) || 0) + 1
    )
  }
}

function getAnalyticsSummary() {
  return {
    totalRequests: analyticsData.totalRequests,
    spamBlocked: analyticsData.spamBlocked,
    legitimateMessages: analyticsData.legitimateMessages,
    spamRate: analyticsData.totalRequests > 0 ? (analyticsData.spamBlocked / analyticsData.totalRequests * 100).toFixed(2) + '%' : '0%',
    topCountries: Array.from(analyticsData.topCountries.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5),
    topBrowsers: Array.from(analyticsData.topBrowsers.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5),
    topDevices: Array.from(analyticsData.topDevices.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3),
    hourlyStats: Array.from(analyticsData.hourlyStats.entries()).sort((a, b) => a[0] - b[0])
  }
}

// CONTENTGUARD INTEGRATION
async function analyzeWithContentGuard({ name, email, subject, message }) {
  if (process.env.LOG_LEVEL === 'debug') console.log('content-guard: start')
  
  try {
    // Analyze the complete content
    const contentToAnalyze = {
      name: name,
      email: email, 
      subject: subject,
      message: message
    }
    
    const result = await contentGuard.analyze(contentToAnalyze)
    
    if (process.env.LOG_LEVEL === 'debug') {
      console.log('content-guard: complete', {
        isSpam: result.isSpam,
        score: result.score,
        risk: result.riskLevel,
        flags: result.flags?.length || 0
      })
    }
    
    return {
      isSpam: result.isSpam,
      score: result.score,
      confidence: result.confidence,
      riskLevel: result.riskLevel,
      flags: result.flags || [],
      recommendation: result.recommendation,
      variant: result.variant,
      processingTime: result.metadata?.processingTime || 0,
      rawResult: result
    }
    
  } catch (error) {
    console.error('content-guard: error', error?.message || error)
    // Fallback to basic checks if ContentGuard fails (noisy logs avoided)
    
    const allText = `${name} ${subject} ${message}`.toLowerCase()
    let fallbackScore = 0
    const fallbackFlags = []
    
    // Basic spam patterns
    const spamPatterns = ['kill yourself', 'kys', 'die', 'fortnite', 'gaming', 'vro', 'bruh']
    spamPatterns.forEach(pattern => {
      if (allText.includes(pattern)) {
        fallbackScore += 3
        fallbackFlags.push(`Basic spam pattern: "${pattern}"`)
      }
    })
    
    return {
      isSpam: fallbackScore >= 5,
      score: fallbackScore,
      confidence: 0.5, // Lower confidence for fallback
      riskLevel: fallbackScore >= 7 ? 'HIGH' : fallbackScore >= 4 ? 'MEDIUM' : 'LOW',
      flags: fallbackFlags,
      recommendation: fallbackScore >= 5 ? 'Block - Spam detected' : 'Allow - Clean content',
      variant: 'fallback-basic',
      processingTime: 0,
      error: error.message
    }
  }
}

// LEGACY INSTANT SPAM DETECTION (keep for obviously bad stuff)
function isInstantSpam({ name, email, subject, message }) {
  const allText = `${name} ${subject} ${message}`.toLowerCase()
  
  const instantSpamKeywords = [
    'enlarge your p3nis', 'xxx video', 'hot singles', 'male enhancement',
    'russian brides', 'nigerian prince', 'cheap viagra', 'buy followers',
    'adult content', 'earn $1000 a day', 'work from home scheme'
  ]

  for (const keyword of instantSpamKeywords) {
    if (allText.includes(keyword)) {
      return { isSpam: true, reason: `Contains instant spam keyword: "${keyword}"` }
    }
  }
  
  // Extremely aggressive TLDs (almost exclusively spam)
  const bannedTlds = ['.xyz', '.club', '.site', '.online', '.top', '.buzz', '.loan', '.bid', '.icu']
  const emailDomain = email.split('@')[1]?.toLowerCase() || ''
  if (bannedTlds.some(tld => emailDomain.endsWith(tld))) {
    return { isSpam: true, reason: `Email from banned TLD: ${emailDomain}` }
  }

  return { isSpam: false }
}

// ENHANCED EMAIL SENDING WITH HEURISTICS AND CONTENTGUARD RESULTS
async function sendEmail({ name, email, subject, message, userHeuristics, contentGuardResult, analytics }) {
  
  // Discord Webhook with Enhanced Reporting
  const mainWebhookUrl = process.env.DISCORD_MAIN_WEBHOOK
  const spamWebhookUrl = process.env.DISCORD_SPAM_WEBHOOK 
  
  if (mainWebhookUrl || spamWebhookUrl) {
    if (process.env.LOG_LEVEL === 'debug') console.log('attempting Discord webhook...')
    
    // Determine target webhook based on ContentGuard analysis
    let targetWebhookUrl = spamWebhookUrl // Default to spam channel
    let channelType = 'SPAM'

    // Route to main channel only if we have it AND ContentGuard says it's clean
    if (mainWebhookUrl && !contentGuardResult.isSpam) {
      targetWebhookUrl = mainWebhookUrl
      channelType = 'MAIN'
    }

    if (targetWebhookUrl) {
        if (process.env.LOG_LEVEL === 'debug') console.log(`routing to ${channelType} channel`)
        
        const discordSent = await sendViaDiscord({ 
          name, email, subject, message, 
          userHeuristics, contentGuardResult, channelType, analytics 
        }, targetWebhookUrl)
        
        if (discordSent) {
          if (process.env.LOG_LEVEL === 'debug') console.log('discord notification ok')
          return true
        } else {
          console.warn('discord webhook failed; trying email fallbacks')
        }
    } else {
        console.warn('no Discord webhook configured')
    }
  }
  
  // Fallback to email services (keeping the existing fallback chain)
  if (process.env.LOG_LEVEL === 'debug') console.log('Discord not configured or failed; trying email providers...')

  if (process.env.SENDGRID_API_KEY) {
    console.log('Attempting SendGrid...')
    const sgSent = await sendViaSendGrid({ name, email, subject, message })
    if (sgSent) return true
  }
  
  if (process.env.RESEND_API_KEY) {
    console.log('Attempting Resend...')
    const rsSent = await sendViaResend({ name, email, subject, message })
    if (rsSent) return true
  }
  
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    console.log('Attempting Gmail SMTP...')
    const gmSent = await sendViaGmail({ name, email, subject, message })
    if (gmSent) return true
  }
  
  // If all methods fail, log everything for manual follow-up
  // Avoid logging PII in production
  console.error('contact: all notification methods failed')
  
  return false
}

// ENHANCED DISCORD WEBHOOK WITH COMPREHENSIVE REPORTING
async function sendViaDiscord({ name, email, subject, message, userHeuristics, contentGuardResult, channelType, analytics }, discordWebhookUrl) {
  try {
    if (process.env.LOG_LEVEL === 'debug') console.log('prepare Discord embed...')
    
    // Color based on ContentGuard risk level
    const embedColor = contentGuardResult.riskLevel === 'CRITICAL' ? 0xFF0000 :    // Bright Red
                      contentGuardResult.riskLevel === 'HIGH' ? 0xFF4500 :        // Orange Red  
                      contentGuardResult.riskLevel === 'MEDIUM' ? 0xFFD700 :      // Gold
                      contentGuardResult.riskLevel === 'LOW' ? 0x32CD32 :         // Lime Green
                      0x00AA44                                                    // Green
    
    const embed = {
      title: channelType === 'SPAM' ? 
        `🛡️ ${contentGuardResult.riskLevel} RISK DETECTED` : 
        "🔧 New Portfolio Contact!",
      color: embedColor,
      fields: [
        {
          name: "👤 Contact Info",
          value: `**Name:** ${name}\n**Email:** ${email}`,
          inline: true
        },
        {
          name: "🛡️ ContentGuard Analysis", 
          value: `**Status:** ${contentGuardResult.isSpam ? 'SPAM' : 'CLEAN'}\n**Score:** ${contentGuardResult.score}/10+\n**Risk:** ${contentGuardResult.riskLevel}\n**Confidence:** ${contentGuardResult.confidence}`,
          inline: true
        },
        {
          name: "🌐 User Heuristics",
          value: `**IP:** ${userHeuristics.ip}\n**Browser:** ${userHeuristics.browser}\n**OS:** ${userHeuristics.os}\n**Device:** ${userHeuristics.device}\n**Bot:** ${userHeuristics.isBot ? 'Yes' : 'No'}`,
          inline: true
        },
        {
          name: "📋 Subject",
          value: subject,
          inline: false
        },
        {
          name: "💬 Message",
          value: message.length > 800 ? message.substring(0, 800) + "..." : message,
          inline: false
        },
        {
          name: "🚩 Detection Flags",
          value: contentGuardResult.flags.length > 0 ? 
            contentGuardResult.flags.slice(0, 5).join('\n') + 
            (contentGuardResult.flags.length > 5 ? `\n... (+${contentGuardResult.flags.length - 5} more)` : '') : 
            'None detected',
          inline: false
        },
        {
          name: "🔍 Technical Details",
          value: `
**User Agent:** ${userHeuristics.userAgent.substring(0, 100)}${userHeuristics.userAgent.length > 100 ? '...' : ''}
**Referer:** ${userHeuristics.referer}
**Language:** ${userHeuristics.acceptLanguage}
**Location:** ${userHeuristics.country || 'unknown'}
**Timezone:** ${userHeuristics.timezone}
**Session ID:** ${userHeuristics.sessionId}
**Fingerprint:** ${userHeuristics.fingerprint.substring(0, 16)}...
**Initial Risk Score:** ${userHeuristics.riskScore}/10
**ContentGuard Variant:** ${contentGuardResult.variant}
**Processing Time:** ${contentGuardResult.processingTime}ms
          `.trim(),
          inline: false
        },
        {
          name: "📈 Current Analytics Summary",
          value: `
**Total Requests:** ${analytics.totalRequests}
**Spam Blocked:** ${analytics.spamBlocked}
**Legitimate Messages:** ${analytics.legitimateMessages}
**Spam Rate:** ${analytics.spamRate}
**Top Countries:** ${analytics.topCountries.map(([country, count]) => `${country}: ${count}`).join(', ') || 'None'}
**Top Browsers:** ${analytics.topBrowsers.map(([browser, count]) => `${browser}: ${count}`).join(', ') || 'None'}
**Top Devices:** ${analytics.topDevices.map(([device, count]) => `${device}: ${count}`).join(', ') || 'None'}
          `.trim(),
          inline: false
        }
      ],
      footer: {
        text: `Jose Rodriguez Portfolio • ${new Date().toLocaleString()} • ${channelType} Channel • ContentGuard: ${contentGuardResult.score}/10+ (${contentGuardResult.riskLevel}) • User Risk: ${userHeuristics.riskScore}/10 • Session: ${analytics.totalRequests}`
      },
      timestamp: new Date().toISOString()
    }

    // Never log webhook URLs

    const response = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: channelType === 'SPAM' ? 
          `🛡️ **ContentGuard Alert** (Score: ${contentGuardResult.score}/10+, Risk: ${contentGuardResult.riskLevel}, User Risk: ${userHeuristics.riskScore}/10, Session: ${analytics.totalRequests})` :
          `📬 **New contact form submission!** (Session: ${analytics.totalRequests}, Spam Rate: ${analytics.spamRate})`,
        embeds: [embed],
        username: "Enhanced Anti-Spam Bot"
      })
    })

    if (process.env.LOG_LEVEL === 'debug') console.log('discord status', response.status)

    if (response.ok) return true
    const status = response.status
    if (status === 404 || status === 401 || status === 403) {
      console.warn('contact: webhook rejected (status ' + status + ')')
      return false
    }
    // Other errors
    return false

  } catch (error) {
    console.error('contact: discord exception', error?.message || error)
    return false
  }
}

// ORIGINAL USER AGENT PARSING (FALLBACK)
function parseUserAgent(userAgent) {
  if (!userAgent || userAgent === 'unknown') {
    return { 
      browser: 'unknown', 
      os: 'unknown', 
      device: 'unknown',
      isBot: true // Unknown UA is suspicious
    }
  }

  const ua = userAgent.toLowerCase()
  
  // Browser detection
  let browser = 'unknown'
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'chrome'
  else if (ua.includes('firefox')) browser = 'firefox'
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'safari'
  else if (ua.includes('edg')) browser = 'edge'
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'opera'

  // OS detection
  let os = 'unknown'
  if (ua.includes('windows')) os = 'windows'
  else if (ua.includes('mac os x') || ua.includes('macos')) os = 'macos'
  else if (ua.includes('linux')) os = 'linux'
  else if (ua.includes('android')) os = 'android'
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'ios'

  // Device detection
  let device = 'desktop'
  if (ua.includes('mobile') || ua.includes('android')) device = 'mobile'
  else if (ua.includes('tablet') || ua.includes('ipad')) device = 'tablet'

  // Bot detection
  const botIndicators = ['bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'php']
  const isBot = botIndicators.some(indicator => ua.includes(indicator))

  return { browser, os, device, isBot }
}

// EXISTING EMAIL FALLBACK FUNCTIONS (unchanged)
async function sendViaSendGrid({ name, email, subject, message }) {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: process.env.TO_EMAIL || 'jose.rodriguez.engineer@gmail.com' }],
          subject: `Portfolio Contact: ${subject}`
        }],
        from: { 
          email: process.env.FROM_EMAIL || 'noreply@jose-rodriguez-portfolio.vercel.app',
          name: 'Jose Rodriguez Portfolio'
        },
        reply_to: { email: email },
        content: [{
          type: 'text/html',
          value: `
            <h3>New Portfolio Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #007acc;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <hr>
            <p><small>Sent via Jose Rodriguez Portfolio - ${new Date().toISOString()}</small></p>
          `
        }]
      })
    })

    return response.ok
  } catch (error) {
    console.error('SendGrid error:', error)
    return false
  }
}

async function sendViaResend({ name, email, subject, message }) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Jose Rodriguez Portfolio <noreply@jose-rodriguez-portfolio.vercel.app>',
        to: [process.env.TO_EMAIL || 'jose.rodriguez.engineer@gmail.com'],
        reply_to: email,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <h3>New Portfolio Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #007acc;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        `
      })
    })

    return response.ok
  } catch (error) {
    console.error('Resend error:', error)
    return false
  }
} 

async function sendViaGmail({ name, email, subject, message }) {
  // This would require nodemailer setup - placeholder for now
  console.log('Gmail SMTP not implemented yet')
  return false
} 
