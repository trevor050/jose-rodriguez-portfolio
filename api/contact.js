// Vercel Serverless Function for Contact Form
// THE ULTIMATE ANTI-TROLL SYSTEM - Multi-Layer Defense
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity'
import Sentiment from 'sentiment'
import TextModerate from 'text-moderate'

// Initialize professional anti-troll libraries
const profanityMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
})

const sentiment = new Sentiment()
const textModerate = new TextModerate()

console.log('🛡️ Ultimate Anti-Troll System Initialized')
console.log('  ↳ Obscenity: Advanced profanity detection')
console.log('  ↳ Sentiment: AFINN-based hostility analysis') 
console.log('  ↳ TextModerate: Multi-language toxicity detection')

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

    // STAGE 3: ULTIMATE ANTI-TROLL ANALYSIS & ROUTING (Discord)
    const emailSent = await sendEmail({ // sendEmail now handles ultimate anti-troll filtering & Discord routing
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

// EMAIL SENDING FUNCTION (now with ULTIMATE ANTI-TROLL SYSTEM)
async function sendEmail({ name, email, subject, message }) {
  
  // OPTION 1: Discord Webhook with Ultimate Anti-Troll Analysis
  const mainWebhookUrl = process.env.DISCORD_MAIN_WEBHOOK || null // Set this for main channel
  const spamWebhookUrl = process.env.DISCORD_SPAM_WEBHOOK || 'https://discord.com/api/webhooks/1378615327851675769/VOATvHtlI7Aw-3RV6cl7hY9MUIo2bRWuud8zmD4g_fBxMx6cKnmYwtj-NjgbCfSOzYoz' // Default to spam if no main
  
  if (mainWebhookUrl || spamWebhookUrl) { // Proceed if at least one webhook is configured
    console.log('🚀 Attempting Discord webhook with ULTIMATE ANTI-TROLL SYSTEM...')
    
    // STAGE 2: Ultimate Anti-Troll Analysis (3-Layer Defense)
    const antiTrollAnalysis = await analyzeUltimateAntiTroll({ name, email, subject, message })
    console.log('🛡️ Ultimate Anti-Troll Analysis Result:', antiTrollAnalysis)
    
    // Determine target webhook and channel type
    let targetWebhookUrl = spamWebhookUrl // Default to spam channel
    let channelType = 'SPAM'

    // Route to main channel only if we have it AND message is clean
    if (mainWebhookUrl && !antiTrollAnalysis.isSpam) {
      targetWebhookUrl = mainWebhookUrl
      channelType = 'MAIN'
    }

    if (targetWebhookUrl) {
        console.log(`📤 Routing to ${channelType} channel (Anti-Troll Analysis: ${antiTrollAnalysis.riskLevel})`)
        
        const discordSent = await sendViaDiscord({ 
          name, email, subject, message, 
          spamAnalysis: antiTrollAnalysis, channelType 
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

// ULTIMATE ANTI-TROLL ANALYSIS - 3-Layer Defense System
async function analyzeUltimateAntiTroll({ name, email, subject, message }) {
  console.log('🛡️ === STARTING ULTIMATE ANTI-TROLL ANALYSIS ===')
  console.log('Input data:', { name, email, subject, messageLength: message.length })
  
  try {
    const allText = `${name} ${subject} ${message}`
    const emailDomain = email.split('@')[1]?.toLowerCase() || ''
    
    // ==========================================
    // LAYER 1: OBSCENITY - Advanced Profanity Detection
    // ==========================================
    console.log('🔍 LAYER 1: Running Obscenity profanity analysis...')
    
    let layer1Score = 0
    const layer1Flags = []
    
    // Check each field separately for detailed analysis
    const profanityChecks = [
      { field: 'name', text: name },
      { field: 'subject', text: subject }, 
      { field: 'message', text: message },
      { field: 'combined', text: allText }
    ]
    
    profanityChecks.forEach(({ field, text }) => {
      const matches = profanityMatcher.getAllMatches(text)
      if (matches.length > 0) {
        const score = matches.length * 4 // 4 points per profane word
        layer1Score += score
        matches.forEach(match => {
          const { phraseMetadata } = englishDataset.getPayloadWithPhraseMetadata(match)
          layer1Flags.push(`Profanity in ${field}: "${phraseMetadata.originalWord}"`)
          console.log(`🚨 LAYER 1: Profanity detected in ${field}: "${phraseMetadata.originalWord}" (+4 points)`)
        })
      }
    })
    
    console.log(`📊 LAYER 1 (Obscenity) Score: ${layer1Score}`)
    
    // ==========================================
    // LAYER 2: SENTIMENT - Hostility Detection
    // ==========================================
    console.log('🔍 LAYER 2: Running Sentiment hostility analysis...')
    
    let layer2Score = 0
    const layer2Flags = []
    
    // Analyze sentiment of combined text
    const sentimentResult = sentiment.analyze(allText)
    console.log('LAYER 2 Raw sentiment:', sentimentResult)
    
    // Hostile/negative sentiment scoring
    if (sentimentResult.comparative <= -0.5) {
      layer2Score += 6
      layer2Flags.push(`Highly negative sentiment (${sentimentResult.comparative.toFixed(3)})`)
      console.log(`🚨 LAYER 2: Highly negative sentiment: ${sentimentResult.comparative.toFixed(3)} (+6 points)`)
    } else if (sentimentResult.comparative <= -0.2) {
      layer2Score += 3
      layer2Flags.push(`Negative sentiment (${sentimentResult.comparative.toFixed(3)})`)
      console.log(`🚨 LAYER 2: Negative sentiment: ${sentimentResult.comparative.toFixed(3)} (+3 points)`)
    }
    
    // Specific hostile words detected
    if (sentimentResult.negative && sentimentResult.negative.length > 0) {
      const hostileCount = sentimentResult.negative.length
      if (hostileCount >= 3) {
        layer2Score += 4
        layer2Flags.push(`Multiple hostile words (${hostileCount}): ${sentimentResult.negative.slice(0,3).join(', ')}`)
        console.log(`🚨 LAYER 2: Multiple hostile words: ${sentimentResult.negative.slice(0,3).join(', ')} (+4 points)`)
      } else if (hostileCount >= 1) {
        layer2Score += 2
        layer2Flags.push(`Hostile words (${hostileCount}): ${sentimentResult.negative.join(', ')}`)
        console.log(`🚨 LAYER 2: Hostile words: ${sentimentResult.negative.join(', ')} (+2 points)`)
      }
    }
    
    console.log(`📊 LAYER 2 (Sentiment) Score: ${layer2Score}`)
    
    // ==========================================
    // LAYER 3: TEXT-MODERATE - Multi-Language Toxicity
    // ==========================================
    console.log('🔍 LAYER 3: Running TextModerate toxicity analysis...')
    
    let layer3Score = 0
    const layer3Flags = []
    
    // Check for profanity with TextModerate
    const isProfane = textModerate.isProfane(allText)
    if (isProfane) {
      layer3Score += 5
      layer3Flags.push('TextModerate detected profanity')
      console.log(`🚨 LAYER 3: TextModerate profanity detected (+5 points)`)
    }
    
    // Clean text and see what gets filtered
    const cleanedText = textModerate.clean(allText)
    const hasFilteredContent = cleanedText !== allText
    if (hasFilteredContent) {
      layer3Score += 3
      layer3Flags.push('Content required filtering')
      console.log(`🚨 LAYER 3: Content filtering required (+3 points)`)
    }
    
    // Analyze sentiment with TextModerate
    try {
      const tmSentiment = textModerate.analyzeSentiment(allText)
      console.log('LAYER 3 TextModerate sentiment:', tmSentiment)
      
      if (tmSentiment.comparative <= -0.4) {
        layer3Score += 4
        layer3Flags.push(`TextModerate negative sentiment (${tmSentiment.comparative.toFixed(3)})`)
        console.log(`🚨 LAYER 3: TextModerate negative sentiment: ${tmSentiment.comparative.toFixed(3)} (+4 points)`)
      }
    } catch (e) {
      console.log('LAYER 3: TextModerate sentiment analysis failed:', e.message)
    }
    
    console.log(`📊 LAYER 3 (TextModerate) Score: ${layer3Score}`)
    
    // ==========================================
    // LAYER 4: CUSTOM TROLL-SPECIFIC PATTERNS
    // ==========================================
    console.log('🔍 LAYER 4: Running custom troll pattern analysis...')
    
    let layer4Score = 0
    const layer4Flags = []
    
    const allTextLower = allText.toLowerCase()
    
    // Gaming/troll culture keywords (aggressive detection)
    const gamingTrollKeywords = [
      'fortnite', 'minecraft', 'roblox', 'cod', 'apex', 'valorant', 'cs:go', 'csgo',
      'hop on', 'lets play', 'gaming', 'gamer', 'noob', 'pwned', 'rekt', 'git gud',
      'skill issue', 'mad cuz bad', 'cope', 'seethe', 'cringe', 'based', 'ratio',
      'touch grass', 'go outside', 'basement dweller'
    ]
    
    gamingTrollKeywords.forEach(keyword => {
      if (allTextLower.includes(keyword)) {
        layer4Score += 3
        layer4Flags.push(`Gaming/troll keyword: "${keyword}"`)
        console.log(`🚨 LAYER 4: Gaming/troll keyword: "${keyword}" (+3 points)`)
      }
    })
    
    // Harassment/violent keywords
    const harassmentKeywords = [
      'kill yourself', 'kys', 'kill ya self', 'off yourself', 'end yourself',
      'rope yourself', 'jump off', 'die in a fire', 'get cancer', 'hope you die',
      'nobody likes you', 'everyone hates you', 'worthless', 'pathetic loser'
    ]
    
    harassmentKeywords.forEach(keyword => {
      if (allTextLower.includes(keyword)) {
        layer4Score += 8 // Severe penalty for direct harassment
        layer4Flags.push(`Harassment detected: "${keyword}"`)
        console.log(`🚨 LAYER 4: HARASSMENT DETECTED: "${keyword}" (+8 points)`)
      }
    })
    
    // Slang/informal patterns that suggest trolling
    const slangPatterns = [
      'vro', 'bruh', 'bruv', 'bro', 'sis', 'bestie', 'fr', 'no cap', 'periodt',
      'slaps', 'bussin', 'sus', 'amogus', 'among us', 'imposter', 'sussy',
      'deadass', 'finna', 'gonna', 'wanna', 'lowkey', 'highkey', 'ngl'
    ]
    
    const slangCount = slangPatterns.filter(slang => allTextLower.includes(slang)).length
    if (slangCount >= 3) {
      layer4Score += 4
      layer4Flags.push(`Excessive slang/informal language (${slangCount} terms)`)
      console.log(`🚨 LAYER 4: Excessive slang: ${slangCount} terms (+4 points)`)
    } else if (slangCount >= 1) {
      layer4Score += 2
      layer4Flags.push(`Informal slang detected (${slangCount} terms)`)
      console.log(`🚨 LAYER 4: Slang detected: ${slangCount} terms (+2 points)`)
    }
    
    // Fake/troll names and emails
    const trollNames = [
      'why would i tell you', 'not telling', 'nope', 'none of your business',
      'anonymous', 'anon', 'test', 'user', 'admin', 'lol', 'lmao', 'ligma',
      'joe mama', 'deez nuts', 'candice', 'sawcon', 'sugma'
    ]
    
    if (trollNames.some(trollName => name.toLowerCase().includes(trollName))) {
      layer4Score += 6
      layer4Flags.push(`Troll/fake name: "${name}"`)
      console.log(`🚨 LAYER 4: Troll name detected: "${name}" (+6 points)`)
    }
    
    // Fake email patterns
    const fakeEmailPatterns = [
      'no@no.com', 'nope@nope.com', 'fake@fake.com', 'test@test.com',
      'troll@troll.com', 'spam@spam.com', 'lol@lol.com', 'bruh@bruh.com'
    ]
    
    if (fakeEmailPatterns.includes(email.toLowerCase())) {
      layer4Score += 6
      layer4Flags.push(`Obvious fake email: ${email}`)
      console.log(`🚨 LAYER 4: Fake email pattern: ${email} (+6 points)`)
    }
    
    // Short nonsensical messages
    if (message.length < 30 && !message.match(/engineering|portfolio|internship|job|college|university/i)) {
      layer4Score += 3
      layer4Flags.push(`Very short non-professional message (${message.length} chars)`)
      console.log(`🚨 LAYER 4: Short message: ${message.length} chars (+3 points)`)
    }
    
    console.log(`📊 LAYER 4 (Custom Troll) Score: ${layer4Score}`)
    
    // ==========================================
    // COMBINE ALL LAYERS & POSITIVE INDICATORS
    // ==========================================
    console.log('🔍 Checking positive indicators...')
    
    let totalScore = layer1Score + layer2Score + layer3Score + layer4Score
    const allFlags = [...layer1Flags, ...layer2Flags, ...layer3Flags, ...layer4Flags]
    
    // Positive indicators (reduce score)
    const trustedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com']
    const eduGovDomains = ['.edu', '.gov', '.ac.uk', '.edu.au']
    
    if (trustedDomains.includes(emailDomain)) {
      totalScore = Math.max(0, totalScore - 1)
      allFlags.push('Trusted email provider')
      console.log(`✅ Trusted domain: ${emailDomain} (-1 point)`)
    }
    
    if (eduGovDomains.some(domain => emailDomain.includes(domain))) {
      totalScore = Math.max(0, totalScore - 4)
      allFlags.push('Educational/government domain')
      console.log(`✅ Educational/gov domain: ${emailDomain} (-4 points)`)
    }
    
    // Professional keywords
    const professionalKeywords = [
      'engineering', 'engineer', 'mechanical', 'college', 'university', 'student',
      'application', 'portfolio', 'project', 'internship', 'academic', 'job',
      'career', 'position', 'opportunity', 'collaboration', 'research', 'thesis',
      'degree', 'graduation', 'professor', 'resume', 'cv', 'hire', 'employment'
    ]
    
    const professionalCount = professionalKeywords.filter(keyword => allTextLower.includes(keyword)).length
    if (professionalCount > 0) {
      const reduction = Math.min(5, professionalCount * 2)
      totalScore = Math.max(0, totalScore - reduction)
      allFlags.push(`Professional keywords (${professionalCount}): -${reduction} points`)
      console.log(`✅ Professional keywords: ${professionalCount} found (-${reduction} points)`)
    }
    
    // Well-structured content
    const sentences = message.split(/[.!?]+/).filter(s => s.trim().length > 15)
    if (sentences.length >= 3 && message.length > 150) {
      totalScore = Math.max(0, totalScore - 3)
      allFlags.push('Well-structured message')
      console.log(`✅ Well-structured content (-3 points)`)
    }
    
    // ==========================================
    // FINAL CLASSIFICATION 
    // ==========================================
    const isSpam = totalScore >= 5 // Aggressive threshold: 5+ points = spam
    const riskLevel = totalScore >= 15 ? 'CRITICAL' :
                     totalScore >= 10 ? 'HIGH' :
                     totalScore >= 7 ? 'MEDIUM' :
                     totalScore >= 3 ? 'LOW' : 'CLEAN'

    const finalResult = {
      score: totalScore,
      isSpam,
      riskLevel,
      flags: allFlags,
      layerAnalysis: {
        layer1_obscenity: { score: layer1Score, flags: layer1Flags },
        layer2_sentiment: { score: layer2Score, flags: layer2Flags },
        layer3_textmoderate: { score: layer3Score, flags: layer3Flags },
        layer4_custom: { score: layer4Score, flags: layer4Flags }
      },
      recommendation: isSpam ? 'Route to spam channel' : 'Route to main channel',
      confidence: totalScore >= 10 ? 'High confidence troll/spam detection' :
                 totalScore >= 5 ? 'Moderate confidence spam patterns detected' :
                 'Appears legitimate'
    }
    
    console.log(`🏁 ULTIMATE ANTI-TROLL RESULT:`)
    console.log(`   Total Score: ${totalScore}/20+`)
    console.log(`   Classification: ${riskLevel} (${isSpam ? 'SPAM' : 'CLEAN'})`)
    console.log(`   Layer Breakdown: L1=${layer1Score} L2=${layer2Score} L3=${layer3Score} L4=${layer4Score}`)
    console.log('🛡️ === ANTI-TROLL ANALYSIS COMPLETE ===')
    
    return finalResult
    
  } catch (error) {
    console.error('❌ Ultimate anti-troll analysis failed:', error)
    console.error('Full error stack:', error.stack)
    
    // Ultra-aggressive fallback analysis
    console.log('↪️ Falling back to ultra-aggressive analysis...')
    
    let fallbackScore = 0
    const fallbackFlags = []
    
    const allText = `${name} ${subject} ${message}`.toLowerCase()
    
    // Check for obvious troll patterns
    const trollPatterns = [
      'kill', 'die', 'fortnite', 'gaming', 'vro', 'bro', 'bruh', 'yo', 'sup',
      'cringe', 'cope', 'seethe', 'ratio', 'based', 'sus', 'amogus'
    ]
    
    trollPatterns.forEach(pattern => {
      if (allText.includes(pattern)) {
        fallbackScore += 5
        fallbackFlags.push(`Fallback troll pattern: "${pattern}"`)
        console.log(`🚨 Fallback found: "${pattern}" (+5 points)`)
      }
    })
    
    // Check for fake identity
    if (name.toLowerCase().includes('why would') || email.includes('no@no')) {
      fallbackScore += 8
      fallbackFlags.push('Obviously fake identity')
      console.log(`🚨 Fake identity detected (+8 points)`)
    }
    
    const isSpam = fallbackScore >= 5
    
    return {
      score: fallbackScore,
      isSpam,
      riskLevel: fallbackScore >= 15 ? 'CRITICAL' : fallbackScore >= 10 ? 'HIGH' : fallbackScore >= 7 ? 'MEDIUM' : 'LOW',
      flags: fallbackFlags,
      layerAnalysis: null,
      recommendation: isSpam ? 'Route to spam channel' : 'Route to main channel',
      confidence: 'Fallback analysis (libraries failed)',
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
        `🛡️ ${spamAnalysis.riskLevel} RISK DETECTED` : 
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
          value: `**${spamAnalysis.riskLevel}** (${spamAnalysis.score}/20+)`,
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
          name: "🛡️ Layer 1: Obscenity (Profanity)",
          value: spamAnalysis.layerAnalysis ? `
**Score:** ${spamAnalysis.layerAnalysis.layer1_obscenity.score}/20
**Flags:** ${spamAnalysis.layerAnalysis.layer1_obscenity.flags.length > 0 ? spamAnalysis.layerAnalysis.layer1_obscenity.flags.slice(0,2).join(', ') : 'None'}
          `.trim() : '❌ Analysis Failed',
          inline: true
        },
        {
          name: "💭 Layer 2: Sentiment (Hostility)",
          value: spamAnalysis.layerAnalysis ? `
**Score:** ${spamAnalysis.layerAnalysis.layer2_sentiment.score}/20
**Flags:** ${spamAnalysis.layerAnalysis.layer2_sentiment.flags.length > 0 ? spamAnalysis.layerAnalysis.layer2_sentiment.flags.slice(0,2).join(', ') : 'None'}
          `.trim() : '❌ Analysis Failed',
          inline: true
        },
        {
          name: "🧬 Layer 3: TextModerate (Toxicity)",
          value: spamAnalysis.layerAnalysis ? `
**Score:** ${spamAnalysis.layerAnalysis.layer3_textmoderate.score}/20
**Flags:** ${spamAnalysis.layerAnalysis.layer3_textmoderate.flags.length > 0 ? spamAnalysis.layerAnalysis.layer3_textmoderate.flags.slice(0,2).join(', ') : 'None'}
          `.trim() : '❌ Analysis Failed',
          inline: true
        },
        {
          name: "🎮 Layer 4: Custom (Troll Patterns)",
          value: spamAnalysis.layerAnalysis ? `
**Score:** ${spamAnalysis.layerAnalysis.layer4_custom.score}/20
**Flags:** ${spamAnalysis.layerAnalysis.layer4_custom.flags.length > 0 ? spamAnalysis.layerAnalysis.layer4_custom.flags.slice(0,2).join(', ') : 'None'}
          `.trim() : '❌ Analysis Failed',
          inline: true
        },
        {
          name: "📊 Combined Analysis",
          value: `
**Final Confidence:** ${spamAnalysis.confidence}
**Action:** ${spamAnalysis.recommendation}
**Total Flags:** ${spamAnalysis.flags.length}
**Top Issues:** ${spamAnalysis.flags.length > 0 ? spamAnalysis.flags.slice(0, 2).join(', ') + (spamAnalysis.flags.length > 2 ? `... (+${spamAnalysis.flags.length - 2} more)` : '') : 'None detected'}
**Error:** ${spamAnalysis.error || 'None'}
          `.trim(),
          inline: false
        }
      ],
      footer: {
        text: `Jose Rodriguez Portfolio • ${new Date().toLocaleString()} • ${channelType} Channel • Ultimate Anti-Troll: ${spamAnalysis.score}/20+ (${spamAnalysis.layerAnalysis ? `L1:${spamAnalysis.layerAnalysis.layer1_obscenity.score} L2:${spamAnalysis.layerAnalysis.layer2_sentiment.score} L3:${spamAnalysis.layerAnalysis.layer3_textmoderate.score} L4:${spamAnalysis.layerAnalysis.layer4_custom.score}` : 'Fallback'})`
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
          `🛡️ **Anti-Troll System Alert** (Score: ${spamAnalysis.score}/20+, Layers: ${spamAnalysis.layerAnalysis ? `${spamAnalysis.layerAnalysis.layer1_obscenity.score}+${spamAnalysis.layerAnalysis.layer2_sentiment.score}+${spamAnalysis.layerAnalysis.layer3_textmoderate.score}+${spamAnalysis.layerAnalysis.layer4_custom.score}` : 'Fallback'})` :
          "📬 **New contact form submission!**",
        embeds: [embed],
        username: "Ultimate Anti-Troll Bot"
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