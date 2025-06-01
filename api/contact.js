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
  console.log('🔍 === STARTING PROFESSIONAL SPAM ANALYSIS ===')
  console.log('Input data:', { name, email, subject, messageLength: message.length })
  
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

    console.log('📧 Mock email for SpamScanner:')
    console.log('---EMAIL START---')
    console.log(mockEmail)
    console.log('---EMAIL END---')
    
    console.log('🔬 Running SpamScanner professional analysis...')
    
    // Run professional spam analysis
    const scanResult = await scanner.scan(mockEmail)
    
    console.log('📊 SpamScanner raw result:', JSON.stringify(scanResult, null, 2))
    
    // SpamScanner provides comprehensive analysis
    const professionalScore = scanResult.is_spam ? 8 : 0 // Convert boolean to our scale
    const spamReasons = scanResult.message ? [scanResult.message] : []
    
    console.log(`🎯 Professional score: ${professionalScore} (is_spam: ${scanResult.is_spam})`)
    
    // Add AGGRESSIVE contact form specific analysis
    let customScore = 0
    const customFlags = []
    
    console.log('🛠️ Running aggressive custom analysis...')
    
    // Combine all text for analysis
    const allText = `${name} ${subject} ${message}`.toLowerCase()
    const emailDomain = email.split('@')[1]?.toLowerCase() || ''
    
    console.log('All text for analysis:', allText)
    console.log('Email domain:', emailDomain)
    
    // 1. AGGRESSIVE TROLLING/SPAM DETECTION
    const aggressiveSpamKeywords = [
      // Trolling/harassment
      'kill ya self', 'kill yourself', 'kys', 'kill ya', 'kill you',
      'hop on fortnite', 'fortnite', 'gaming', 'vro', 'bro',
      
      // Obvious spam patterns  
      'buy now', 'click here', 'free money', 'make money', 'earn cash',
      'limited time', 'act now', 'guaranteed', 'winner', 'congratulations',
      'claim your', 'selected', 'bitcoin', 'crypto', 'investment',
      'work from home', 'business opportunity', 'no experience',
      
      // Generic/meaningless content
      'its dope', 'i love you', 'love this game', 'bye!', 'okay bye',
      'test message', 'hello world', 'sample text'
    ]
    
    aggressiveSpamKeywords.forEach(keyword => {
      if (allText.includes(keyword)) {
        customScore += 4
        customFlags.push(`Aggressive spam keyword: "${keyword}"`)
        console.log(`🚨 Found spam keyword: "${keyword}" (+4 points)`)
      }
    })
    
    // 2. SUSPICIOUS DOMAINS (more aggressive)
    const suspiciousDomains = [
      'tempmail', 'guerrillamail', 'mailinator', 'yopmail', 'throwaway',
      '10minutemail', 'sharklasers', 'trashmail', 'dispostable'
    ]
    if (suspiciousDomains.some(domain => emailDomain.includes(domain))) {
      customScore += 5
      customFlags.push(`Temporary email domain: ${emailDomain}`)
      console.log(`🚨 Suspicious domain: ${emailDomain} (+5 points)`)
    }
    
    // 3. FAKE/NONSENSE NAMES (more aggressive)
    const nonsenseNames = [
      'test', 'user', 'admin', 'contact', 'info', 'hello',
      'why would i tell you', 'not telling', 'nope', 'no name',
      'anonymous', 'anon', 'none', 'asdf', 'qwerty'
    ]
    if (nonsenseNames.some(fake => name.toLowerCase().includes(fake))) {
      customScore += 4
      customFlags.push(`Fake/nonsense name: "${name}"`)
      console.log(`🚨 Fake name detected: "${name}" (+4 points)`)
    }
    
    // 4. INAPPROPRIATE/HOSTILE SUBJECTS
    const hostileSubjects = [
      'kill', 'die', 'hate you', 'stupid', 'dumb', 'idiot',
      'test', 'hello', 'hi', 'hey', 'sup', 'yo'
    ]
    if (hostileSubjects.some(hostile => subject.toLowerCase().includes(hostile))) {
      customScore += 4
      customFlags.push(`Hostile/inappropriate subject: "${subject}"`)
      console.log(`🚨 Hostile subject: "${subject}" (+4 points)`)
    }
    
    // 5. LOW QUALITY CONTENT (aggressive scoring)
    
    // Very short messages
    if (message.length < 50) {
      customScore += 3
      customFlags.push(`Very short message (${message.length} chars)`)
      console.log(`🚨 Short message: ${message.length} chars (+3 points)`)
    }
    
    // Nonsense/gaming content
    const gamingKeywords = ['fortnite', 'minecraft', 'roblox', 'cod', 'apex', 'valorant']
    if (gamingKeywords.some(game => allText.includes(game))) {
      customScore += 3
      customFlags.push('Gaming-related content (likely spam)')
      console.log(`🚨 Gaming content detected (+3 points)`)
    }
    
    // Excessive slang/informal language
    const slangWords = ['vro', 'bro', 'yo', 'sup', 'lit', 'dope', 'fire', 'lowkey', 'highkey']
    const slangCount = slangWords.filter(slang => allText.includes(slang)).length
    if (slangCount >= 2) {
      customScore += 3
      customFlags.push(`Excessive slang (${slangCount} terms)`)
      console.log(`🚨 Excessive slang: ${slangCount} terms (+3 points)`)
    }
    
    // Gibberish or repeated characters
    if (/(.)\1{4,}/gi.test(allText)) {
      customScore += 3
      customFlags.push('Repeated character pattern (gibberish)')
      console.log(`🚨 Gibberish pattern detected (+3 points)`)
    }
    
    // 6. FAKE EMAIL PATTERNS
    const fakeEmailPatterns = [
      'no@no.com', 'nope@nope.com', 'fake@fake.com', 'test@test.com',
      'spam@spam.com', 'notreal@notreal.com'
    ]
    if (fakeEmailPatterns.includes(email.toLowerCase())) {
      customScore += 5
      customFlags.push(`Obvious fake email: ${email}`)
      console.log(`🚨 Fake email pattern: ${email} (+5 points)`)
    }
    
    // Generic numbered emails
    if (/\d{4,}/.test(email) && !emailDomain.includes('gmail')) {
      customScore += 2
      customFlags.push('Email contains many numbers (suspicious)')
      console.log(`🚨 Suspicious email numbers (+2 points)`)
    }
    
    // 7. POSITIVE INDICATORS (reduce custom score)
    console.log('🔍 Checking positive indicators...')
    
    const trustedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com']
    const eduGovDomains = ['.edu', '.gov', '.ac.uk', '.edu.au']
    
    if (trustedDomains.includes(emailDomain)) {
      customScore = Math.max(0, customScore - 1)
      customFlags.push('Trusted email provider')
      console.log(`✅ Trusted domain: ${emailDomain} (-1 point)`)
    }
    
    if (eduGovDomains.some(domain => emailDomain.includes(domain))) {
      customScore = Math.max(0, customScore - 3)
      customFlags.push('Educational/government domain')
      console.log(`✅ Educational/gov domain: ${emailDomain} (-3 points)`)
    }
    
    // Professional/academic keywords
    const legitimateKeywords = [
      'engineering', 'college', 'university', 'student', 'application',
      'mechanical', 'portfolio', 'project', 'internship', 'academic',
      'job', 'career', 'position', 'opportunity', 'collaboration',
      'research', 'thesis', 'degree', 'graduation', 'professor'
    ]
    const legitCount = legitimateKeywords.filter(keyword => allText.includes(keyword)).length
    if (legitCount > 0) {
      const reduction = Math.min(3, legitCount)
      customScore = Math.max(0, customScore - reduction)
      customFlags.push(`Contains ${legitCount} academic/professional keywords`)
      console.log(`✅ Professional keywords: ${legitCount} found (-${reduction} points)`)
    }
    
    // Well-structured content
    const sentences = message.split(/[.!?]+/).filter(s => s.trim().length > 15)
    if (sentences.length >= 3 && message.length > 150) {
      customScore = Math.max(0, customScore - 2)
      customFlags.push('Well-structured message')
      console.log(`✅ Well-structured content (-2 points)`)
    }
    
    console.log(`📊 Custom analysis score: ${customScore}`)
    console.log(`📋 Custom flags:`, customFlags)
    
    // Combine scores (take the higher of the two)
    const combinedScore = Math.max(professionalScore, customScore)
    const allFlags = [...spamReasons, ...customFlags]
    
    console.log(`🎯 Combined score: ${combinedScore} (professional: ${professionalScore}, custom: ${customScore})`)
    
    // Determine final classification (more aggressive threshold)
    const isSpam = scanResult.is_spam || customScore >= 3  // Lowered threshold from 4 to 3
    const riskLevel = combinedScore >= 8 ? 'CRITICAL' :
                     combinedScore >= 6 ? 'HIGH' :
                     combinedScore >= 4 ? 'MEDIUM' :
                     combinedScore >= 2 ? 'LOW' : 'CLEAN'

    const finalResult = {
      score: combinedScore,
      isSpam,
      riskLevel,
      flags: allFlags,
      professionalAnalysis: {
        isSpam: scanResult.is_spam,
        message: scanResult.message,
        // Include other SpamScanner details if available
        results: scanResult.results || null,
        rawScanResult: scanResult // Include full result for debugging
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
    
    console.log(`🏁 Final analysis result:`, JSON.stringify(finalResult, null, 2))
    console.log('🔍 === SPAM ANALYSIS COMPLETE ===')
    
    return finalResult
    
  } catch (error) {
    console.error('❌ Professional spam analysis failed:', error)
    console.error('Full error stack:', error.stack)
    
    // Fallback to aggressive custom analysis if SpamScanner fails
    console.log('↪️ Falling back to aggressive custom analysis...')
    
    let fallbackScore = 0
    const fallbackFlags = []
    
    const allText = `${name} ${subject} ${message}`.toLowerCase()
    const emailDomain = email.split('@')[1]?.toLowerCase() || ''
    
    console.log('Fallback analysis for:', { name, email, subject, messagePreview: message.substring(0, 100) })
    
    // Aggressive fallback checks
    const aggressiveKeywords = [
      'kill', 'fortnite', 'gaming', 'vro', 'bro', 'yo', 'sup',
      'buy now', 'click here', 'free money', 'test', 'hello'
    ]
    
    aggressiveKeywords.forEach(keyword => {
      if (allText.includes(keyword)) {
        fallbackScore += 4
        fallbackFlags.push(`Fallback spam keyword: "${keyword}"`)
        console.log(`🚨 Fallback found: "${keyword}" (+4 points)`)
      }
    })
    
    // Check for fake names/emails
    if (name.toLowerCase().includes('why would') || email.includes('no@no')) {
      fallbackScore += 6
      fallbackFlags.push('Obviously fake name/email')
      console.log(`🚨 Fake identity detected (+6 points)`)
    }
    
    // Short messages
    if (message.length < 30) {
      fallbackScore += 4
      fallbackFlags.push(`Very short message (${message.length} chars)`)
      console.log(`🚨 Short message: ${message.length} chars (+4 points)`)
    }
    
    const isSpam = fallbackScore >= 3
    
    const fallbackResult = {
      score: fallbackScore,
      isSpam,
      riskLevel: fallbackScore >= 8 ? 'CRITICAL' : fallbackScore >= 6 ? 'HIGH' : fallbackScore >= 4 ? 'MEDIUM' : 'LOW',
      flags: fallbackFlags,
      professionalAnalysis: null,
      customAnalysis: { score: fallbackScore, flags: fallbackFlags },
      recommendation: isSpam ? 'Route to spam channel' : 'Route to main channel',
      confidence: 'Fallback analysis (professional scanner failed)',
      error: error.message
    }
    
    console.log(`🏁 Fallback result:`, JSON.stringify(fallbackResult, null, 2))
    
    return fallbackResult
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
          name: "🔬 Professional SpamScanner",
          value: spamAnalysis.professionalAnalysis ? `
**Status:** ${spamAnalysis.professionalAnalysis.isSpam ? '🚨 SPAM DETECTED' : '✅ Clean'}
**SpamScanner Message:** ${spamAnalysis.professionalAnalysis.message || 'No specific message'}
**Raw Detection:** ${JSON.stringify(spamAnalysis.professionalAnalysis.rawScanResult?.is_spam || false)}
          `.trim() : '❌ Scanner Failed',
          inline: true
        },
        {
          name: "🛠️ Custom Analysis",
          value: `
**Score:** ${spamAnalysis.customAnalysis?.score || 0}/12
**Top Flags:** ${spamAnalysis.customAnalysis?.flags?.slice(0, 2).join(', ') || 'None'}
**Threshold:** ${spamAnalysis.customAnalysis?.score >= 3 ? '🚨 Above threshold (3+)' : '✅ Below threshold'}
          `.trim(),
          inline: true
        },
        {
          name: "🔍 Detailed Analysis",
          value: `
**Final Confidence:** ${spamAnalysis.confidence}
**Action:** ${spamAnalysis.recommendation}
**All Flags (${spamAnalysis.flags.length}):** ${spamAnalysis.flags.length > 0 ? spamAnalysis.flags.slice(0, 3).join(', ') + (spamAnalysis.flags.length > 3 ? `... (+${spamAnalysis.flags.length - 3} more)` : '') : 'None detected'}
**Error:** ${spamAnalysis.error || 'None'}
          `.trim(),
          inline: false
        }
      ],
      footer: {
        text: `Jose Rodriguez Portfolio • ${new Date().toLocaleString()} • ${channelType} Channel • Professional: ${spamAnalysis.professionalAnalysis?.isSpam ? 'SPAM' : 'CLEAN'} | Custom: ${spamAnalysis.customAnalysis?.score || 0}/12`
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
          `🚨 **Potential spam detected** (Combined: ${spamAnalysis.score}/12, Professional: ${spamAnalysis.professionalAnalysis?.isSpam ? 'SPAM' : 'CLEAN'}, Custom: ${spamAnalysis.customAnalysis?.score || 0}/12)` :
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