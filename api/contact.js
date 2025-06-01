// Vercel Serverless Function for Contact Form
// Much better than Formspree's overpriced service

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

    // STAGE 1: INSTANT OBLITERATION FOR 1000% SPAM
    const instantSpamVerdict = isInstantSpam({ name, email, subject, message })
    if (instantSpamVerdict.isSpam) {
      console.log('🗑️ INSTANT SPAM REJECTION:', instantSpamVerdict.reason)
      return res.status(400).json({
        error: 'Message identified as high-confidence spam. If this is a legitimate inquiry, please contact Jose directly via LinkedIn.',
        reason: instantSpamVerdict.reason
      })
    }

    // STAGE 2: BASIC VALIDATION
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

    // IP-based rate limiting (basic implementation)
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    // You'd ideally use a proper rate limiting solution (Redis, etc.) in production
    console.log('Client IP for potential rate limiting:', clientIP)

    // STAGE 3: ADVANCED SPAM ANALYSIS & ROUTING (Discord)
    const emailSent = await sendEmail({ // sendEmail now handles advanced spam & Discord routing
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    })

    if (emailSent) {
      console.log('✅ Discord notification process completed.')
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully! I\'ll get back to you soon.'
      })
    } else {
      // This path is taken if Discord fails AND all email fallbacks fail
      console.log('❌ All notification methods failed (Discord and email fallbacks).')
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

// HELPER: INSTANT SPAM DETECTION (1000% SPAM)
function isInstantSpam({ name, email, subject, message }) {
  const allText = `${name} ${subject} ${message}`.toLowerCase()
  
  const instantSpamKeywords = [
    'enlarge your p3nis', 'xxx video', 'hot singles', 'male enhancement',
    'russian brides', 'nigerian prince', 'cheap viagra', 'buy followers',
    'adult content', 'earn $1000 a day', 'work from home scheme'
    // Add more absolutely undeniable spam phrases here
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

  // Add more instant rejection rules if needed (e.g., specific Unicode ranges, known bad IPs via a list)

  return { isSpam: false }
}

// EMAIL SENDING FUNCTION (now primarily Discord routing & advanced spam)
async function sendEmail({ name, email, subject, message }) {
  
  // OPTION 1: Discord Webhook with Smart Spam Routing
  const mainWebhookUrl = process.env.DISCORD_MAIN_WEBHOOK || null // Set this for main channel
  const spamWebhookUrl = process.env.DISCORD_SPAM_WEBHOOK || 'https://discord.com/api/webhooks/1378615327851675769/VOATvHtlI7Aw-3RV6cl7hY9MUIo2bRWuud8zmD4g_fBxMx6cKnmYwtj-NjgbCfSOzYoz' // Default to spam if no main
  
  if (mainWebhookUrl || spamWebhookUrl) { // Proceed if at least one webhook is configured
    console.log('🚀 Attempting Discord webhook with multi-stage spam filtering...')
    
    // STAGE 2 (Continued): Call the now ASYNCHRONOUS spam analysis
    const spamAnalysis = await analyzeSpamLevel({ name, email, subject, message })
    console.log('🔍 Advanced Spam Analysis Result:', spamAnalysis)
    
    // Determine target webhook and channel type
    let targetWebhookUrl = spamWebhookUrl // Default to spam channel
    let channelType = 'SPAM'

    if (mainWebhookUrl && !spamAnalysis.isSpam) {
      targetWebhookUrl = mainWebhookUrl
      channelType = 'MAIN'
    } else if (!mainWebhookUrl && !spamWebhookUrl) {
        console.log('🤷 No Discord webhooks configured. Skipping Discord notification.')
        // Fall through to email backups if any, or just log
    } else if (!targetWebhookUrl) { // Safety net if logic is off
        console.log('⚠️ Could not determine target webhook, defaulting to spam if available or logging.')
        targetWebhookUrl = spamWebhookUrl // Try spam one last time
    }

    if (targetWebhookUrl) {
        console.log(`📤 Routing to ${channelType} channel (Score: ${spamAnalysis.score}/15) using webhook ending in ...${targetWebhookUrl.slice(-10)}`)
        
        const discordSent = await sendViaDiscord({ 
          name, email, subject, message, 
          spamAnalysis, channelType 
        }, targetWebhookUrl)
        
        if (discordSent) {
          console.log('✅ Discord notification successful. No further action needed.')
          return true // Primary notification succeeded
        } else {
          console.log('❌ Discord webhook failed. Will attempt email fallbacks if configured.')
        }
    } else {
        console.log('🚫 No suitable Discord webhook URL to send to. Logging submission.')
    }
  }
  
  // Fallback to email services ONLY if Discord fails or isn't configured
  console.log('↪️ Discord notification failed or not configured. Attempting email fallbacks...')

  // OPTION 2: SendGrid (if available)
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
  
  // If all notification methods fail, log everything for manual follow-up
  console.log('⚠️ All notification methods (Discord & Email) failed. Contact details logged for manual outreach.')
  console.log('📋 Complete contact form submission for manual follow-up:')
  console.log(`Name: ${name}`)
  console.log(`Email: ${email}`)
  console.log(`Subject: ${subject}`)
  console.log(`Message: ${message}`)
  console.log(`Timestamp: ${new Date().toISOString()}`)
  console.log('👆 Manual follow-up required.')
  
  return false // Indicates all notification attempts failed
}

// AGGRESSIVE SPAM ANALYSIS SYSTEM - Now with OOPSpam API integration
async function analyzeSpamLevel({ name, email, subject, message }) {
  let spamScore = 0
  const flags = []
  let externalFilterScore = 0
  let externalFilterDetails = 'N/A'

  // Combine all text for analysis
  const allText = `${name} ${subject} ${message}`.toLowerCase()
  const emailDomain = email.split('@')[1]?.toLowerCase() || ''
  const emailLocal = email.split('@')[0]?.toLowerCase() || ''

  // --- STAGE 1: OUR CUSTOM HEURISTICS (Applied first) ---

  // 1. INSTANT SPAM DOMAINS (5 points - almost always spam)
  const bannedDomains = [
    'tk', 'ml', 'ga', 'cf', 'suslink.tk', 'guerrillamail.com', 'mailinator.com',
    'tempmail.org', 'yopmail.com', 'throwaway.email', 'temp-mail.org',
    'dispostable.com', 'getairmail.com', 'sharklasers.com', 'trashmail.com'
  ]
  if (bannedDomains.some(domain => emailDomain.includes(domain))) {
    spamScore += 5
    flags.push(`High-risk domain: ${emailDomain}`)
  }

  // 2. OBVIOUS SPAM CONTENT (4 points each - hard spam)
  const hardSpamKeywords = [
    'buy now', 'click here', 'free money', 'make money fast', 'viagra',
    'casino online', 'lottery winner', 'crypto investment', 'get rich quick',
    'limited time offer', 'act now', 'guaranteed income', '$$$', 'bitcoin',
    'forex', 'investment opportunity', 'work from home', 'earn cash',
    'no experience required', 'double your money', 'winner', 'congratulations',
    'claim your prize', 'selected', 'million dollars', 'inheritance'
  ]
  hardSpamKeywords.forEach(keyword => {
    if (allText.includes(keyword)) {
      spamScore += 4
      flags.push(`Hard spam keyword: "${keyword}"`)
    }
  })

  // 3. GIBBERISH/REPEATED CHARACTERS (3 points)
  if (/(.)\1{6,}/gi.test(allText)) {
    spamScore += 3
    flags.push('Excessive repeated characters (gibberish)')
  }
  
  // 4. SUSPICIOUS PATTERNS (2 points each)
  
  // Random email addresses
  if (/\d{4,}/.test(emailLocal) || emailLocal.length > 15) {
    spamScore += 2
    flags.push('Suspicious email pattern (random numbers/too long)')
  }
  
  // Generic/meaningless names
  const genericNames = ['test', 'user', 'admin', 'contact', 'info', 'hello', 'john doe']
  if (genericNames.some(generic => name.toLowerCase().includes(generic))) {
    spamScore += 2
    flags.push('Generic/fake name detected')
  }
  
  // Suspicious URLs
  const suspiciousUrls = [
    /https?:\/\/[^\s]+\.(tk|ml|ga|cf|bit\.ly|tinyurl|t\.co|ow\.ly)/gi,
    /discord\.gg\/[^\s]+/gi,
    /t\.me\/[^\s]+/gi,
    /telegram\.me\/[^\s]+/gi,
    /whatsapp\.com\/[^\s]+/gi
  ]
  
  suspiciousUrls.forEach(pattern => {
    if (pattern.test(allText)) {
      spamScore += 2
      flags.push('Suspicious URL/link detected')
    }
  })
  
  // 5. QUALITY ISSUES (1-2 points each)
  
  // Very short messages
  if (message.length < 30) {  // Increased from 20
    spamScore += 2
    flags.push('Message too short (likely spam)')
  }
  
  // Meaningless content
  if (message.length < 50 && !/[.!?]/.test(message)) {
    spamScore += 2
    flags.push('No punctuation in short message')
  }
  
  // ALL CAPS
  if (message.length > 20 && message === message.toUpperCase()) {
    spamScore += 2
    flags.push('All caps message (shouting)')
  }
  
  // Excessive punctuation
  if (/[!?]{2,}/gi.test(allText)) {  // 2+ (was 3+)
    spamScore += 1
    flags.push('Excessive punctuation')
  }
  
  // Too many special characters
  if (/[^\w\s@.-]{3,}/gi.test(allText)) {  // 3+ (was 5+)
    spamScore += 1
    flags.push('Too many special characters')
  }
  
  // Generic subjects
  const genericSubjects = ['hello', 'hi', 'contact', 'question', 'inquiry', 'hey', 'test']
  if (genericSubjects.includes(subject.toLowerCase().trim())) {
    spamScore += 1
    flags.push('Generic subject line')
  }
  
  // Email-name mismatch (more aggressive)
  const nameWords = name.toLowerCase().split(' ').filter(word => word.length > 2)
  const hasNameInEmail = nameWords.some(word => 
    emailLocal.includes(word.substring(0, Math.min(4, word.length)))
  )
  
  if (!hasNameInEmail && nameWords.length > 0) {
    spamScore += 1
    flags.push('Email doesn\'t match provided name')
  }
  
  // 6. POSITIVE INDICATORS (reduce spam score - but less generous)
  
  // Trusted domains (only major ones)
  const trustedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com']
  const eduGovDomains = ['.edu', '.gov', '.ac.uk', 'university', 'college']
  
  if (trustedDomains.includes(emailDomain)) {
    spamScore = Math.max(0, spamScore - 1)
    flags.push('Trusted email provider')
  }
  
  if (eduGovDomains.some(domain => emailDomain.includes(domain))) {
    spamScore = Math.max(0, spamScore - 2)
    flags.push('Educational/government domain')
  }
  
  // Engineering/academic keywords (but less weight)
  const legitimateKeywords = [
    'engineering', 'college', 'university', 'student', 'application',
    'admissions', 'program', 'mechanical', 'portfolio', 'project',
    'internship', 'scholarship', 'research', 'academic', 'degree'
  ]
  
  if (legitimateKeywords.some(keyword => allText.includes(keyword))) {
    spamScore = Math.max(0, spamScore - 1)  // Reduced from -2
    flags.push('Contains academic/engineering keywords')
  }
  
  // Well-structured content
  const sentences = message.split(/[.!?]+/).filter(s => s.trim().length > 15)
  if (sentences.length >= 2 && message.length > 100) {
    spamScore = Math.max(0, spamScore - 1)
    flags.push('Well-structured message')
  }
  
  // --- STAGE 2: EXTERNAL SPAM FILTER (OOPSpam API) ---
  if (process.env.OOPSPAM_API_KEY) {
    try {
      console.log('🔍 Calling OOPSpam API...')
      const oopspamResponse = await fetch('https://oopspam.com/v1/spamdetection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.OOPSPAM_API_KEY
        },
        body: JSON.stringify({
          senderIP: '127.0.0.1', // Placeholder, Vercel might provide real IP
          email: email,
          content: message,
          // We can add more fields like 'name' or 'subject' if API supports
        })
      })

      if (oopspamResponse.ok) {
        const oopspamResult = await oopspamResponse.json()
        console.log('💡 OOPSpam API Result:', oopspamResult)
        externalFilterScore = oopspamResult.Score || 0 // OOPSpam score (0-6, higher is more spammy)
        externalFilterDetails = `OOPSpam (${oopspamResult.Score}/6): ${oopspamResult.Details || 'No details'}`
        flags.push(externalFilterDetails)
        
        // Integrate OOPSpam score into our system (e.g., add to our score directly or use a multiplier)
        // OOPSpam: 0-1 (Not spam), 2-3 (Suspicious), 4 (Likely spam), 5-6 (Spam)
        if (externalFilterScore >= 5) spamScore += 4; // High confidence spam from OOPSpam
        else if (externalFilterScore >= 4) spamScore += 3;
        else if (externalFilterScore >= 2) spamScore += 1;

      } else {
        console.error('❌ OOPSpam API Error:', oopspamResponse.status, await oopspamResponse.text())
        flags.push('OOPSpam API call failed')
      }
    } catch (error) {
      console.error('💥 Error calling OOPSpam API:', error)
      flags.push('OOPSpam API exception')
    }
  }

  // --- STAGE 3: FINAL VERDICT (Combine scores) ---

  // 7. DETERMINE SPAM STATUS (More aggressive thresholds)
  const isSpam = spamScore >= 4 // Adjusted threshold, OOPSpam adds to this
  const riskLevel = spamScore >= 10 ? 'EXTREME' : // New level for very high scores
                   spamScore >= 8 ? 'CRITICAL' :
                   spamScore >= 6 ? 'HIGH' :
                   spamScore >= 4 ? 'MEDIUM' :
                   spamScore >= 2 ? 'LOW' : 'CLEAN'
  
  return {
    score: Math.min(spamScore, 15), // Allow higher scores now with combined system
    isSpam,
    riskLevel,
    flags,
    recommendation: isSpam ? 'Route to spam channel' : 'Route to main channel',
    confidence: spamScore >= 8 ? 'Very high confidence spam' :
               spamScore >= 6 ? 'High confidence spam' :
               spamScore >= 4 ? 'Likely spam' :
               spamScore >= 2 ? 'Suspicious' : 'Legitimate'
  }
}

// Discord Webhook implementation (SECURE - URL hidden on backend)
async function sendViaDiscord({ name, email, subject, message, spamAnalysis, channelType }, discordWebhookUrl) {
  try {
    console.log('📤 Preparing Discord embed message...')
    
    // Color based on spam risk level (more dramatic colors)
    const embedColor = spamAnalysis.riskLevel === 'CRITICAL' ? 0x8B0000 :   // Dark Red
                      spamAnalysis.riskLevel === 'HIGH' ? 0xFF0000 :        // Bright Red
                      spamAnalysis.riskLevel === 'MEDIUM' ? 0xFF4500 :      // Orange Red  
                      spamAnalysis.riskLevel === 'LOW' ? 0xFFD700 :         // Gold
                      0x00AA44                                              // Green
    
    const embed = {
      title: channelType === 'SPAM' ? 
        `🚨 ${spamAnalysis.riskLevel} RISK SPAM` : 
        "🔧 New Portfolio Contact!",
      color: embedColor,
      fields: [
        {
          name: "👤 Name",
          value: name,
          inline: true
        },
        {
          name: "📧 Email", 
          value: email,
          inline: true
        },
        {
          name: "🎯 Risk Level",
          value: `**${spamAnalysis.riskLevel}** (${spamAnalysis.score}/10)`,
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
          name: "🔍 Spam Analysis",
          value: `
**Status:** ${spamAnalysis.confidence}
**Action:** ${spamAnalysis.recommendation}
**Flags:** ${spamAnalysis.flags.length > 0 ? spamAnalysis.flags.slice(0, 3).join(', ') + (spamAnalysis.flags.length > 3 ? '...' : '') : 'None detected'}
          `.trim(),
          inline: false
        }
      ],
      footer: {
        text: `Jose Rodriguez Portfolio • ${new Date().toLocaleString()} • ${channelType} Channel • Score: ${spamAnalysis.score}/10`
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
          `🚨 **Potential spam detected** (Score: ${spamAnalysis.score}/10)` :
          "📬 **New contact form submission!**",
        embeds: [embed],
        username: "Portfolio Bot"
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

// SendGrid implementation
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

// Resend implementation (modern alternative)
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