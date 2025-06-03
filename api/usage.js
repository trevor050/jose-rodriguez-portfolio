import pkg from 'content-guard';
const { createGuard } = pkg;

const guard = createGuard('balanced');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { event, details } = req.body || {};

    const heuristics = collectHeuristics(req);

    let analysis = null;
    if (details && typeof details.message === 'string') {
      analysis = await guard.analyze(details.message);
    }

    const embed = buildEmbed(event, details, heuristics, analysis);

    const webhook = process.env.DISCORD_USAGE_WEBHOOK || process.env.DISCORD_MAIN_WEBHOOK || process.env.DISCORD_SPAM_WEBHOOK;

    if (!webhook) {
      return res.status(200).json({ success: false, error: 'No webhook configured' });
    }

    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed], username: 'Usage Analytics Bot' })
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const text = await response.text();
      console.error('Discord webhook failed:', response.status, text);
      return res.status(500).json({ success: false });
    }
  } catch (err) {
    console.error('Usage analytics error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}

function collectHeuristics(req) {
  const headers = req.headers || {};
  const ipRaw = headers['x-forwarded-for'] || headers['x-real-ip'] || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';
  const ip = typeof ipRaw === 'string' ? ipRaw.split(',')[0].trim() : 'unknown';
  const ipPartial = ip.replace(/(\d+)(\.(\d+)){2}.*$/, '$1.$3.*.*');
  return {
    ip: ipPartial,
    userAgent: headers['user-agent'] || 'unknown',
    referer: headers['referer'] || headers['referrer'] || 'direct'
  };
}

function buildEmbed(event = 'unknown', details = {}, heuristics = {}, analysis) {
  const fields = [
    { name: 'Event', value: event, inline: true },
    { name: 'IP', value: heuristics.ip, inline: true },
    { name: 'User Agent', value: heuristics.userAgent.substring(0, 70), inline: false },
    { name: 'Referer', value: heuristics.referer, inline: false }
  ];

  Object.keys(details || {}).forEach(key => {
    if (key !== 'message') {
      fields.push({ name: key, value: String(details[key]), inline: true });
    }
  });

  if (analysis) {
    fields.push({ name: 'ContentGuard', value: `Spam: ${analysis.isSpam}\nScore: ${analysis.score}`, inline: false });
  }

  return {
    title: 'Usage Analytics',
    color: 0x7289da,
    fields,
    timestamp: new Date().toISOString()
  };
}
