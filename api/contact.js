// Vercel Serverless Function for Contact Form
// Much better than Formspree's overpriced service
import SpamScanner from 'spamscanner'

// Initialize SpamScanner with optimized settings for contact forms
const scanner = new SpamScanner({
  debug: false, // Set to true for debugging in development
  // We'll use it to scan just the text content, not full email headers
})

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

    // STAGE 3: PROFESSIONAL SPAM ANALYSIS & ROUTING (Discord)
    const emailSent = await sendEmail({ // sendEmail now handles professional spam filtering & Discord routing
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

// EMAIL SENDING FUNCTION (now with professional SpamScanner integration)
async function sendEmail({ name, email, subject, message }) {
  
  // OPTION 1: Discord Webhook with Professional Spam Analysis
  const mainWebhookUrl = process.env.DISCORD_MAIN_WEBHOOK || null // Set this for main channel
  const spamWebhookUrl = process.env.DISCORD_SPAM_WEBHOOK || 'https://discord.com/api/webhooks/1378615327851675769/VOATvHtlI7Aw-3RV6cl7hY9MUIo2bRWuud8zmD4g_fBxMx6cKnmYwtj-NjgbCfSOzYoz' // Default to spam if no main
  
  if (mainWebhookUrl || spamWebhookUrl) { // Proceed if at least one webhook is configured
    console.log('🚀 Attempting Discord webhook with professional SpamScanner filtering...')
    
    // STAGE 2: Professional SpamScanner Analysis
    const spamAnalysis = await analyzeProfessionalSpam({ name, email, subject, message })
    console.log('🔍 Professional Spam Analysis Result:', spamAnalysis)
    
    // Determine target webhook and channel type
    let targetWebhookUrl = spamWebhookUrl // Default to spam channel
    let channelType = 'SPAM'

    // Route to main channel only if we have it AND message is clean
    if (mainWebhookUrl && !spamAnalysis.isSpam) {
      targetWebhookUrl = mainWebhookUrl
      channelType = 'MAIN'
    }

    if (targetWebhookUrl) {
        console.log(`📤 Routing to ${channelType} channel (Professional Analysis: ${spamAnalysis.riskLevel})`)
        
        const discordSent = await sendViaDiscord({ 
          name, email, subject, message, 
          spamAnalysis, channelType 
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

// PROFESSIONAL SPAM ANALYSIS with SpamScanner + Custom Contact Form Heuristics
async function analyzeProfessionalSpam({ name, email, subject, message }) {
  try {
    // Create a mock email message for SpamScanner
    // SpamScanner expects email format, so we'll construct one
    const mockEmail = `From: ${name} <${email}>
To: jose@joserodriguez.com
Subject: ${subject}
Date: ${new Date().toUTCString()}
Content-Type: text/plain; charset=utf-8

${message}
`

    console.log('📧 Analyzing with professional SpamScanner...')
    
    // Run professional spam analysis
    const scanResult = await scanner.scan(mockEmail)
    
    // SpamScanner provides comprehensive analysis
    const professionalScore = scanResult.is_spam ? 8 : 0 // Convert boolean to our scale
    const spamReasons = scanResult.message ? [scanResult.message] : []
    
    // Add contact form specific analysis (lightweight custom heuristics)
    let customScore = 0
    const customFlags = []
    
    // Quick contact form specific checks
    const allText = `${name} ${subject} ${message}`.toLowerCase()
    const emailDomain = email.split('@')[1]?.toLowerCase() || ''
    
    // Suspicious domains (moderate scoring since we handled extreme ones in Stage 1)
    const suspiciousDomains = ['tempmail', 'guerrillamail', 'mailinator', 'yopmail', 'throwaway']
    if (suspiciousDomains.some(domain => emailDomain.includes(domain))) {
      customScore += 3
      customFlags.push(`Temporary email domain: ${emailDomain}`)
    }
    
    // Very short or generic messages
    if (message.length < 30) {
      customScore += 2
      customFlags.push('Suspiciously short message')
    }
    
    // Generic names
    const genericNames = ['test', 'user', 'admin', 'contact', 'info']
    if (genericNames.some(generic => name.toLowerCase().includes(generic))) {
      customScore += 2
      customFlags.push('Generic name detected')
    }
    
    // Excessive special characters or gibberish
    if (/(.)\1{5,}/gi.test(allText)) {
      customScore += 3
      customFlags.push('Repeated character pattern (gibberish)')
    }
    
    // Positive indicators (reduce custom score)
    const trustedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com']
    const eduGovDomains = ['.edu', '.gov', '.ac.uk']
    
    if (trustedDomains.includes(emailDomain)) {
      customScore = Math.max(0, customScore - 1)
      customFlags.push('Trusted email provider')
    }
    
    if (eduGovDomains.some(domain => emailDomain.includes(domain))) {
      customScore = Math.max(0, customScore - 2)
      customFlags.push('Educational/government domain')
    }
    
    // Engineering/academic keywords
    const legitimateKeywords = [
      'engineering', 'college', 'university', 'student', 'application',
      'mechanical', 'portfolio', 'project', 'internship', 'academic'
    ]
    if (legitimateKeywords.some(keyword => allText.includes(keyword))) {
      customScore = Math.max(0, customScore - 1)
      customFlags.push('Contains academic/engineering keywords')
    }
    
    // Combine scores (professional takes priority)
    const combinedScore = Math.max(professionalScore, customScore)
    const allFlags = [...spamReasons, ...customFlags]
    
    // Determine final classification
    const isSpam = scanResult.is_spam || customScore >= 4
    const riskLevel = combinedScore >= 8 ? 'CRITICAL' :
                     combinedScore >= 6 ? 'HIGH' :
                     combinedScore >= 4 ? 'MEDIUM' :
                     combinedScore >= 2 ? 'LOW' : 'CLEAN'

    return {
      score: combinedScore,
      isSpam,
      riskLevel,
      flags: allFlags,
      professionalAnalysis: {
        isSpam: scanResult.is_spam,
        message: scanResult.message,
        // Include other SpamScanner details if available
        results: scanResult.results || null
      },
      customAnalysis: {
        score: customScore,
        flags: customFlags
      },
      recommendation: isSpam ? 'Route to spam channel' : 'Route to main channel',
      confidence: scanResult.is_spam ? 'Professional spam detection' :
                 combinedScore >= 4 ? 'Suspicious patterns detected' :
                 'Appears legitimate'
    }
    
  } catch (error) {
    console.error('❌ Professional spam analysis failed:', error)
    
    // Fallback to basic custom analysis if SpamScanner fails
    console.log('↪️ Falling back to basic custom analysis...')
    
    let fallbackScore = 0
    const fallbackFlags = []
    
    const allText = `${name} ${subject} ${message}`.toLowerCase()
    const emailDomain = email.split('@')[1]?.toLowerCase() || ''
    
    // Basic fallback checks
    const suspiciousDomains = ['tempmail', 'guerrillamail', 'mailinator']
    if (suspiciousDomains.some(domain => emailDomain.includes(domain))) {
      fallbackScore += 4
      fallbackFlags.push(`Suspicious domain: ${emailDomain}`)
    }
    
    if (message.length < 20) {
      fallbackScore += 3
      fallbackFlags.push('Very short message')
    }
    
    const spamKeywords = ['buy now', 'click here', 'free money', 'make money']
    spamKeywords.forEach(keyword => {
      if (allText.includes(keyword)) {
        fallbackScore += 4
        fallbackFlags.push(`Spam keyword: "${keyword}"`)
      }
    })
    
    const isSpam = fallbackScore >= 4
    
    return {
      score: fallbackScore,
      isSpam,
      riskLevel: fallbackScore >= 6 ? 'HIGH' : fallbackScore >= 4 ? 'MEDIUM' : 'LOW',
      flags: fallbackFlags,
      professionalAnalysis: null,
      customAnalysis: { score: fallbackScore, flags: fallbackFlags },
      recommendation: isSpam ? 'Route to spam channel' : 'Route to main channel',
      confidence: 'Fallback analysis (professional scanner unavailable)',
      error: error.message
    }
  }
}

// Discord Webhook implementation (SECURE - URL hidden on backend)
async function sendViaDiscord({ name, email, subject, message, spamAnalysis, channelType }, discordWebhookUrl) {
  try {
    console.log('📤 Preparing Discord embed message...')
    
    // Color based on spam risk level (more dramatic colors)
    const embedColor = spamAnalysis.riskLevel === 'CRITICAL' ? 0xFF0000 :        // Bright Red
                      spamAnalysis.riskLevel === 'HIGH' ? 0xFF4500 :            // Orange Red  
                      spamAnalysis.riskLevel === 'MEDIUM' ? 0xFFD700 :          // Gold
                      spamAnalysis.riskLevel === 'LOW' ? 0x32CD32 :             // Lime Green
                      0x00AA44                                                  // Green
    
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
          value: `**${spamAnalysis.riskLevel}** (${spamAnalysis.score}/12)`,
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
          name: "🔍 Custom Spam Analysis",
          value: `
**Status:** ${spamAnalysis.confidence}
**Action:** ${spamAnalysis.recommendation}
**Flags:** ${spamAnalysis.flags.length > 0 ? spamAnalysis.flags.slice(0, 3).join(', ') + (spamAnalysis.flags.length > 3 ? '...' : '') : 'None detected'}
          `.trim(),
          inline: false
        }
      ],
      footer: {
        text: `Jose Rodriguez Portfolio • ${new Date().toLocaleString()} • ${channelType} Channel • Custom Filter: ${spamAnalysis.score}/12`
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
          `🚨 **Potential spam detected** (Score: ${spamAnalysis.score}/12)` :
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