// Vercel Serverless Function for Contact Form
// ENHANCED USER TRACKING + CONTENTGUARD INTEGRATION
import pkg from 'content-guard'
const { createGuard } = pkg

// Initialize ContentGuard with balanced variant for good accuracy and reasonable speed
const contentGuard = createGuard('balanced', {
  spamThreshold: 5 // Standard threshold for contact forms
})

console.log('🛡️ ContentGuard Spam Detection System Initialized')
console.log('  ↳ Variant: Balanced (~0.3ms, 93%+ accuracy)')
console.log('  ↳ Spam Threshold: 5')

export default async function handler(req, res) {
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
      // Return a generic success to not alert bots, but don't process further.
      return res.status(200).json({ success: true, message: 'Message received.' })
    }

    // STAGE 1: COLLECT COMPREHENSIVE USER HEURISTICS
    const userHeuristics = await collectUserHeuristics(req)
    console.log('📊 User heuristics collected:', JSON.stringify(userHeuristics, null, 2))

    // STAGE 2: INSTANT SPAM DETECTION FOR 1000% OBVIOUS SPAM
    const instantSpamVerdict = isInstantSpam({ name, email, subject, message })
    if (instantSpamVerdict.isSpam) {
      console.log('🗑️ INSTANT SPAM REJECTION:', instantSpamVerdict.reason)
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
    console.log('🛡️ Running ContentGuard analysis...')
    const contentGuardResult = await analyzeWithContentGuard({ name, email, subject, message })
    console.log('🛡️ ContentGuard Result:', contentGuardResult)

    // STAGE 5: SEND EMAIL WITH ENHANCED REPORTING
    const emailSent = await sendEmail({ 
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      userHeuristics,
      contentGuardResult
    })

    if (emailSent) {
      console.log('✅ Enhanced notification process completed.')
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully! I\'ll get back to you soon.'
      })
    } else {
      console.log('❌ All notification methods failed.')
      return res.status(500).json({
        error: 'Failed to send message due to an internal issue. Please try LinkedIn.'
      })
    }

  } catch (error) {
    console.error('💥 Contact form main handler error:', error)
    return res.status(500).json({
      error: 'Failed to process message. Please try again or contact via LinkedIn.'
    })
  }
}

// ENHANCED USER HEURISTICS COLLECTION
async function collectUserHeuristics(req) {
  const headers = req.headers
  const ip = headers['x-forwarded-for'] || 
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
  
  // Parse User Agent for more details
  const userAgentData = parseUserAgent(userAgent)
  
  // Attempt to get geolocation from IP (you can integrate with services like ipapi.co)
  const geoData = await getGeoLocation(ip)
  
  // Calculate request timing
  const timestamp = new Date().toISOString()
  const timezone = headers['timezone'] || 'unknown' // If frontend sends this
  
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

  return {
    // Network Information
    ip: ip,
    ipType: ip.includes(':') ? 'IPv6' : 'IPv4',
    
    // User Agent Analysis
    userAgent: userAgent,
    ...userAgentData,
    
    // Request Details  
    referer: referer,
    acceptLanguage: acceptLanguage,
    acceptEncoding: acceptEncoding,
    connection: connection,
    cacheControl: cacheControl,
    dnt: dnt,
    
    // Geolocation
    ...geoData,
    
    // Timing
    timestamp: timestamp,
    timezone: timezone,
    
    // Security Headers (helpful for bot detection)
    ...securityHeaders,
    
    // Additional Analysis
    isLikelyBot: detectBotBehavior(userAgent, headers),
    riskScore: calculateInitialRiskScore(userAgent, ip, referer, headers)
  }
}

// USER AGENT PARSING
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

// GEOLOCATION LOOKUP  
async function getGeoLocation(ip) {
  try {
    // Skip for localhost/private IPs
    if (ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return { country: 'local', region: 'local', city: 'local' }
    }

    // You can integrate with services like:
    // - ipapi.co (free tier available)
    // - ipinfo.io 
    // - ipgeolocation.io
    // For now, we'll just log and return basic info
    
    console.log(`🌍 Would lookup geolocation for IP: ${ip}`)
    
    // Placeholder - you can implement actual API calls here
    return {
      country: 'unknown',
      region: 'unknown', 
      city: 'unknown',
      timezone: 'unknown'
    }
    
  } catch (error) {
    console.error('Geolocation lookup failed:', error)
    return { country: 'error', region: 'error', city: 'error' }
  }
}

// BOT BEHAVIOR DETECTION
function detectBotBehavior(userAgent, headers) {
  const ua = (userAgent || '').toLowerCase()
  
  // Known bot patterns
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 
    'python', 'php', 'java', 'go-http-client', 'okhttp'
  ]
  
  const hasbotPattern = botPatterns.some(pattern => ua.includes(pattern))
  
  // Suspicious header patterns
  const hasMinimalHeaders = Object.keys(headers).length < 5
  const missingCommonHeaders = !headers['accept'] || !headers['accept-language']
  
  return hasbotPattern || hasMinimalHeaders || missingCommonHeaders
}

// INITIAL RISK SCORING
function calculateInitialRiskScore(userAgent, ip, referer, headers) {
  let score = 0
  
  // User Agent risks
  if (!userAgent || userAgent === 'unknown') score += 3
  if (detectBotBehavior(userAgent, headers)) score += 2
  
  // IP risks  
  if (ip === 'unknown') score += 2
  
  // Referer risks
  if (referer === 'direct') score += 1 // Not necessarily bad, but worth noting
  
  // Header analysis
  if (Object.keys(headers).length < 5) score += 2
  
  return Math.min(score, 10) // Cap at 10
}

// CONTENTGUARD INTEGRATION
async function analyzeWithContentGuard({ name, email, subject, message }) {
  console.log('🔍 Starting ContentGuard analysis...')
  
  try {
    // Analyze the complete content
    const contentToAnalyze = {
      name: name,
      email: email, 
      subject: subject,
      message: message
    }
    
    const result = await contentGuard.analyze(contentToAnalyze)
    
    console.log(`🛡️ ContentGuard Analysis Complete:`)
    console.log(`   ↳ Spam Status: ${result.isSpam ? 'SPAM' : 'CLEAN'}`)
    console.log(`   ↳ Score: ${result.score}/10+`)
    console.log(`   ↳ Confidence: ${result.confidence}`)
    console.log(`   ↳ Risk Level: ${result.riskLevel}`)
    console.log(`   ↳ Flags: ${result.flags?.length || 0}`)
    
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
    console.error('❌ ContentGuard analysis failed:', error)
    
    // Fallback to basic checks if ContentGuard fails
    console.log('↪️ Falling back to basic spam detection...')
    
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
async function sendEmail({ name, email, subject, message, userHeuristics, contentGuardResult }) {
  
  // Discord Webhook with Enhanced Reporting
  const mainWebhookUrl = process.env.DISCORD_MAIN_WEBHOOK || null
  const spamWebhookUrl = process.env.DISCORD_SPAM_WEBHOOK || 'https://discord.com/api/webhooks/1378615327851675769/VOATvHtlI7Aw-3RV6cl7hY9MUIo2bRWuud8zmD4g_fBxMx6cKnmYwtj-NjgbCfSOzYoz'
  
  if (mainWebhookUrl || spamWebhookUrl) {
    console.log('🚀 Attempting Discord webhook with enhanced reporting...')
    
    // Determine target webhook based on ContentGuard analysis
    let targetWebhookUrl = spamWebhookUrl // Default to spam channel
    let channelType = 'SPAM'

    // Route to main channel only if we have it AND ContentGuard says it's clean
    if (mainWebhookUrl && !contentGuardResult.isSpam) {
      targetWebhookUrl = mainWebhookUrl
      channelType = 'MAIN'
    }

    if (targetWebhookUrl) {
        console.log(`📤 Routing to ${channelType} channel (ContentGuard: ${contentGuardResult.riskLevel})`)
        
        const discordSent = await sendViaDiscord({ 
          name, email, subject, message, 
          userHeuristics, contentGuardResult, channelType 
        }, targetWebhookUrl)
        
        if (discordSent) {
          console.log('✅ Discord notification successful')
          return true
        } else {
          console.log('❌ Discord webhook failed. Attempting email fallbacks...')
        }
    } else {
        console.log('🚫 No Discord webhook configured')
    }
  }
  
  // Fallback to email services (keeping the existing fallback chain)
  console.log('↪️ Discord notification failed or not configured. Attempting email fallbacks...')

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
  console.log('⚠️ All notification methods failed. Complete data logged for manual outreach.')
  console.log('📋 Complete contact form submission:')
  console.log(`Name: ${name}`)
  console.log(`Email: ${email}`)
  console.log(`Subject: ${subject}`)
  console.log(`Message: ${message}`)
  console.log(`ContentGuard Analysis:`, JSON.stringify(contentGuardResult, null, 2))
  console.log(`User Heuristics:`, JSON.stringify(userHeuristics, null, 2))
  console.log(`Timestamp: ${new Date().toISOString()}`)
  
  return false
}

// ENHANCED DISCORD WEBHOOK WITH COMPREHENSIVE REPORTING
async function sendViaDiscord({ name, email, subject, message, userHeuristics, contentGuardResult, channelType }, discordWebhookUrl) {
  try {
    console.log('📤 Preparing enhanced Discord embed message...')
    
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
**Initial Risk Score:** ${userHeuristics.riskScore}/10
**ContentGuard Variant:** ${contentGuardResult.variant}
**Processing Time:** ${contentGuardResult.processingTime}ms
          `.trim(),
          inline: false
        }
      ],
      footer: {
        text: `Jose Rodriguez Portfolio • ${new Date().toLocaleString()} • ${channelType} Channel • ContentGuard: ${contentGuardResult.score}/10+ (${contentGuardResult.riskLevel}) • User Risk: ${userHeuristics.riskScore}/10`
      },
      timestamp: new Date().toISOString()
    }

    console.log('🌐 Sending to Discord webhook:', discordWebhookUrl.substring(0, 50) + '...')

    const response = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: channelType === 'SPAM' ? 
          `🛡️ **ContentGuard Alert** (Score: ${contentGuardResult.score}/10+, Risk: ${contentGuardResult.riskLevel}, User Risk: ${userHeuristics.riskScore}/10)` :
          "📬 **New contact form submission!**",
        embeds: [embed],
        username: "Enhanced Anti-Spam Bot"
      })
    })

    console.log('📡 Discord response status:', response.status)

    if (response.ok) {
      console.log('✅ Discord notification sent successfully')
      return true
    } else {
      const errorText = await response.text()
      console.error('❌ Discord webhook failed:', response.status, response.statusText)
      console.error('Error details:', errorText)
      return false
    }

  } catch (error) {
    console.error('💥 Discord webhook error:', error.message)
    console.error('Full error:', error)
    return false
  }
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