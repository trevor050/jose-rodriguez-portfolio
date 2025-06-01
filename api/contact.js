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

    // 5. SEND EMAIL (multiple options)
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
      throw new Error('Failed to send email')
    }

  } catch (error) {
    console.error('Contact form error:', error)
    
    return res.status(500).json({
      error: 'Failed to send message. Please try again or contact via LinkedIn.'
    })
  }
}

// EMAIL SENDING FUNCTION - Multiple options
async function sendEmail({ name, email, subject, message }) {
  
  // OPTION 1: SendGrid (recommended - 100 emails/day free)
  if (process.env.SENDGRID_API_KEY) {
    return await sendViaSendGrid({ name, email, subject, message })
  }
  
  // OPTION 2: Resend (modern, good free tier)
  if (process.env.RESEND_API_KEY) {
    return await sendViaResend({ name, email, subject, message })
  }
  
  // OPTION 3: EmailJS (frontend-only solution)
  // You'd handle this in the frontend instead
  
  // OPTION 4: Gmail SMTP (free but needs app password)
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    return await sendViaGmail({ name, email, subject, message })
  }
  
  console.error('No email service configured')
  return false
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