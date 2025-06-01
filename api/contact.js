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

    // 1. HONEYPOT CHECK - Silent bot rejection
    if (website && website.trim() !== '') {
      console.log('🍯 Honeypot triggered - bot detected')
      // Return success to not alert bots
      return res.status(200).json({ success: true, message: 'Message sent successfully!' })
    }

    // 2. BASIC VALIDATION
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

    // 3. SIMPLE RATE LIMITING (IP-based)
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const rateLimitKey = `ratelimit_${clientIP}`
    
    // In production, you'd use Redis or a database
    // For now, we'll just log and continue (Vercel handles most bot protection)
    
    // 4. SPAM DETECTION (conservative)
    const allText = `${name} ${subject} ${message}`.toLowerCase()
    const obviousSpam = [
      'buy now', 'click here', 'free money', 'casino', 'viagra',
      'crypto investment', 'get rich quick', 'limited time offer'
    ]
    
    const isSpam = obviousSpam.some(spam => allText.includes(spam)) ||
                   /(.)\1{10,}/gi.test(allText) || // Excessive repeated chars
                   allText.length < 20 // Extremely short

    if (isSpam) {
      console.log('🚫 Spam detected:', { name: name.substring(0, 10), email: email.split('@')[1] })
      return res.status(400).json({ error: 'Message appears to contain spam content' })
    }

    // 5. SEND EMAIL (multiple options) - Handle email service chaos
    const emailSent = await sendEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    })

    if (emailSent) {
      // Log successful submission for analytics
      console.log('✅ Contact form submission:', {
        name: name.substring(0, 10) + '...',
        emailDomain: email.split('@')[1],
        timestamp: new Date().toISOString(),
        ip: clientIP
      })

      return res.status(200).json({
        success: true,
        message: 'Message sent successfully! I\'ll get back to you soon.'
      })
    } else {
      // If no email service configured, log for manual follow-up
      console.log('📧 EMAIL SERVICE NOT CONFIGURED - MANUAL FOLLOW-UP NEEDED:', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString(),
        ip: clientIP,
        note: 'Email services are down/suspended. Manual outreach required.'
      })
      
      // Still return success to avoid user frustration
      return res.status(200).json({
        success: true,
        message: 'Message received! I\'ll get back to you soon via your provided email.'
      })
    }

  } catch (error) {
    console.error('Contact form error:', error)
    
    return res.status(500).json({
      error: 'Failed to send message. Please try again or contact via LinkedIn.'
    })
  }
}

// EMAIL SENDING FUNCTION - Handle email service suspensions gracefully
async function sendEmail({ name, email, subject, message }) {
  
  // OPTION 1: Discord Webhook with Smart Spam Routing
  const mainWebhookUrl = process.env.DISCORD_MAIN_WEBHOOK || null // Set this for main channel
  const spamWebhookUrl = process.env.DISCORD_SPAM_WEBHOOK || 'https://discord.com/api/webhooks/1378615327851675769/VOATvHtlI7Aw-3RV6cl7hY9MUIo2bRWuud8zmD4g_fBxMx6cKnmYwtj-NjgbCfSOzYoz'
  
  if (spamWebhookUrl) {
    console.log('🚀 Attempting Discord webhook with spam filtering...')
    
    // Analyze the message for spam
    const spamAnalysis = analyzeSpamLevel({ name, email, subject, message })
    console.log('🔍 Spam analysis result:', spamAnalysis)
    
    // Route to appropriate channel
    const webhookUrl = (spamAnalysis.isSpam || !mainWebhookUrl) ? spamWebhookUrl : mainWebhookUrl
    const channelType = (spamAnalysis.isSpam || !mainWebhookUrl) ? 'SPAM' : 'MAIN'
    
    console.log(`📤 Routing to ${channelType} channel (score: ${spamAnalysis.score}/10)`)
    
    const discordSent = await sendViaDiscord({ 
      name, email, subject, message, 
      spamAnalysis, channelType 
    }, webhookUrl)
    
    if (discordSent) {
      console.log('✅ Discord webhook successful - email sending not needed')
      return true
    } else {
      console.log('❌ Discord webhook failed - trying other options')
    }
  }
  
  // OPTION 2: SendGrid (if available)
  if (process.env.SENDGRID_API_KEY) {
    console.log('Attempting SendGrid...')
    return await sendViaSendGrid({ name, email, subject, message })
  }
  
  // OPTION 3: Resend (if available)
  if (process.env.RESEND_API_KEY) {
    console.log('Attempting Resend...')
    return await sendViaResend({ name, email, subject, message })
  }
  
  // OPTION 4: Gmail SMTP (if available)
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    console.log('Attempting Gmail SMTP...')
    return await sendViaGmail({ name, email, subject, message })
  }
  
  // No notification service worked - log everything for manual follow-up
  console.log('⚠️ No notification service worked. Contact details logged for manual outreach.')
  console.log('📋 Complete contact form submission:')
  console.log(`Name: ${name}`)
  console.log(`Email: ${email}`)
  console.log(`Subject: ${subject}`)
  console.log(`Message: ${message}`)
  console.log(`Timestamp: ${new Date().toISOString()}`)
  console.log('👆 Manual follow-up required via email or LinkedIn')
  
  // Return false to trigger the manual logging path
  return false
}

// COMPREHENSIVE SPAM ANALYSIS SYSTEM
function analyzeSpamLevel({ name, email, subject, message }) {
  let spamScore = 0
  const flags = []
  
  // Combine all text for analysis
  const allText = `${name} ${subject} ${message}`.toLowerCase()
  const emailDomain = email.split('@')[1]?.toLowerCase() || ''
  
  // 1. OBVIOUS SPAM KEYWORDS (High weight - 3 points each)
  const hardSpamKeywords = [
    'buy now', 'click here', 'free money', 'make money fast', 'viagra', 
    'casino online', 'lottery winner', 'crypto investment', 'get rich quick',
    'limited time offer', 'act now', 'guaranteed income', '$$$', 'bitcoin',
    'forex', 'investment opportunity', 'work from home', 'earn cash',
    'no experience required', 'double your money'
  ]
  
  hardSpamKeywords.forEach(keyword => {
    if (allText.includes(keyword)) {
      spamScore += 3
      flags.push(`Hard spam keyword: "${keyword}"`)
    }
  })
  
  // 2. SUSPICIOUS URL PATTERNS (2 points each)
  const suspiciousUrls = [
    /https?:\/\/[^\s]+\.(tk|ml|ga|cf|bit\.ly|tinyurl|t\.co|ow\.ly)/gi,
    /discord\.gg\/[^\s]+/gi,
    /t\.me\/[^\s]+/gi,
    /telegram\.me\/[^\s]+/gi
  ]
  
  suspiciousUrls.forEach(pattern => {
    if (pattern.test(allText)) {
      spamScore += 2
      flags.push('Suspicious URL pattern detected')
    }
  })
  
  // 3. DISPOSABLE EMAIL DOMAINS (2 points)
  const disposableDomains = [
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org',
    'yopmail.com', 'throwaway.email', 'temp-mail.org', 'mailnesia.com',
    'getairmail.com', 'sharklasers.com', 'trashmail.com', 'dispostable.com'
  ]
  
  if (disposableDomains.includes(emailDomain)) {
    spamScore += 2
    flags.push(`Disposable email domain: ${emailDomain}`)
  }
  
  // 4. CONTENT QUALITY CHECKS (1 point each)
  
  // Very short messages
  if (message.length < 20) {
    spamScore += 1
    flags.push('Message too short')
  }
  
  // Excessive repeated characters
  if (/(.)\1{10,}/gi.test(allText)) {
    spamScore += 1
    flags.push('Excessive repeated characters')
  }
  
  // Too many special characters
  if (/[^\w\s@.-]{5,}/gi.test(allText)) {
    spamScore += 1
    flags.push('Too many special characters')
  }
  
  // ALL CAPS MESSAGE
  if (message.length > 20 && message === message.toUpperCase()) {
    spamScore += 1
    flags.push('All caps message')
  }
  
  // Excessive punctuation
  if (/[!?]{3,}/gi.test(allText)) {
    spamScore += 1
    flags.push('Excessive punctuation')
  }
  
  // 5. SUSPICIOUS PATTERNS (1 point each)
  
  // Email doesn't match name pattern (basic check)
  const nameWords = name.toLowerCase().split(' ')
  const emailLocal = email.split('@')[0]?.toLowerCase() || ''
  const hasNameInEmail = nameWords.some(word => 
    word.length > 2 && emailLocal.includes(word.substring(0, 3))
  )
  
  if (!hasNameInEmail && nameWords.length > 1) {
    spamScore += 1
    flags.push('Email doesn\'t seem to match name')
  }
  
  // Generic subjects
  const genericSubjects = ['hello', 'hi', 'contact', 'question', 'inquiry']
  if (genericSubjects.includes(subject.toLowerCase().trim())) {
    spamScore += 1
    flags.push('Generic subject line')
  }
  
  // 6. POSITIVE INDICATORS (reduce spam score)
  
  // Professional/educational domains
  const professionalDomains = [
    '.edu', '.gov', '.org', 'gmail.com', 'outlook.com', 'yahoo.com',
    'company.com', 'university.edu', 'college.edu'
  ]
  
  if (professionalDomains.some(domain => emailDomain.includes(domain.replace('.', '')))) {
    spamScore = Math.max(0, spamScore - 1)
    flags.push('Professional/trusted email domain')
  }
  
  // Engineering/college keywords (reduce spam score)
  const legitimateKeywords = [
    'engineering', 'college', 'university', 'student', 'application',
    'admissions', 'program', 'mechanical', 'portfolio', 'project',
    'internship', 'scholarship', 'research', 'academic'
  ]
  
  if (legitimateKeywords.some(keyword => allText.includes(keyword))) {
    spamScore = Math.max(0, spamScore - 2)
    flags.push('Contains legitimate academic/engineering keywords')
  }
  
  // Proper grammar and sentence structure (basic check)
  const sentences = message.split(/[.!?]+/).filter(s => s.trim().length > 0)
  if (sentences.length >= 2 && sentences.every(s => s.trim().length > 10)) {
    spamScore = Math.max(0, spamScore - 1)
    flags.push('Well-structured message')
  }
  
  // 7. DETERMINE SPAM STATUS
  const isSpam = spamScore >= 4 // Threshold: 4+ points = spam
  const riskLevel = spamScore >= 6 ? 'HIGH' : spamScore >= 4 ? 'MEDIUM' : spamScore >= 2 ? 'LOW' : 'CLEAN'
  
  return {
    score: Math.min(spamScore, 10), // Cap at 10
    isSpam,
    riskLevel,
    flags,
    recommendation: isSpam ? 'Route to spam channel' : 'Route to main channel',
    confidence: spamScore >= 6 ? 'High confidence' : spamScore >= 4 ? 'Medium confidence' : 'Low risk'
  }
}

// Discord Webhook implementation (SECURE - URL hidden on backend)
async function sendViaDiscord({ name, email, subject, message, spamAnalysis, channelType }, discordWebhookUrl) {
  try {
    console.log('📤 Preparing Discord embed message...')
    
    // Color based on spam risk level
    const embedColor = spamAnalysis.riskLevel === 'HIGH' ? 0xFF4444 :      // Red
                      spamAnalysis.riskLevel === 'MEDIUM' ? 0xFF8800 :    // Orange  
                      spamAnalysis.riskLevel === 'LOW' ? 0xFFDD00 :       // Yellow
                      0x00AA44                                            // Green
    
    const embed = {
      title: channelType === 'SPAM' ? "⚠️ Potential Spam Contact" : "🔧 New Portfolio Contact!",
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
          value: `${spamAnalysis.riskLevel} (${spamAnalysis.score}/10)`,
          inline: true
        },
        {
          name: "📋 Subject",
          value: subject,
          inline: false
        },
        {
          name: "💬 Message",
          value: message.length > 1000 ? message.substring(0, 1000) + "..." : message,
          inline: false
        },
        {
          name: "🔍 Spam Analysis",
          value: `
**Confidence:** ${spamAnalysis.confidence}
**Recommendation:** ${spamAnalysis.recommendation}
**Flags:** ${spamAnalysis.flags.length > 0 ? spamAnalysis.flags.join(', ') : 'None detected'}
          `.trim(),
          inline: false
        }
      ],
      footer: {
        text: `Jose Rodriguez Portfolio • ${new Date().toLocaleString()} • ${channelType} Channel`
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