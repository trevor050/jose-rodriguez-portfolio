# Contact Form Backend Setup Guide

**Why we ditched Formspree:** $10/month for 200 API calls to store basic text is absolutely ridiculous.

Our Vercel function handles everything Formspree does (and more) for **FREE**.

## Email Service Options (Pick One)

### Option 1: SendGrid (Recommended)
- **Free tier:** 100 emails/day (3,000/month)
- **Cost:** Free forever for this use case
- **Setup time:** 5 minutes

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify your domain or use Single Sender Verification
3. Create an API key
4. Add to Vercel environment variables:
   ```
   SENDGRID_API_KEY=your_api_key_here
   TO_EMAIL=jose.rodriguez.engineer@gmail.com
   FROM_EMAIL=noreply@your-domain.com
   ```

### Option 2: Resend (Modern Alternative)
- **Free tier:** 3,000 emails/month
- **Cost:** Free forever for this use case
- **Setup time:** 3 minutes

1. Sign up at [resend.com](https://resend.com)
2. Add your domain
3. Create an API key
4. Add to Vercel environment variables:
   ```
   RESEND_API_KEY=your_api_key_here
   TO_EMAIL=jose.rodriguez.engineer@gmail.com
   ```

### Option 3: Gmail SMTP (Quick & Free)
- **Free tier:** Unlimited (within Gmail limits)
- **Cost:** Free
- **Setup time:** 2 minutes

1. Enable 2FA on your Gmail account
2. Generate an App Password
3. Add to Vercel environment variables:
   ```
   GMAIL_USER=your.email@gmail.com
   GMAIL_PASS=your_app_password
   TO_EMAIL=jose.rodriguez.engineer@gmail.com
   ```

## Vercel Environment Variables Setup

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings > Environment Variables
4. Add the variables for your chosen email service
5. Redeploy your site

## What You Get vs Formspree

| Feature | Our Backend | Formspree ($10/month) |
|---------|-------------|----------------------|
| **Cost** | FREE | $10/month |
| **Limit** | 3,000+ emails/month | 200 submissions |
| **Customization** | Full control | Limited |
| **Data ownership** | Your data | Their database |
| **Spam protection** | Built-in + Vercel edge | Basic filtering |
| **Performance** | Edge functions | Third-party API |
| **Reliability** | Vercel's 99.99% uptime | Formspree's uptime |

## Security Features Included

✅ **Honeypot spam detection**  
✅ **Rate limiting by IP**  
✅ **Input validation & sanitization**  
✅ **CORS protection**  
✅ **Conservative spam filtering**  
✅ **Vercel edge protection**  
✅ **Error logging & monitoring**

## Testing

Once deployed, test the form and check:
1. Vercel Function logs for successful submissions
2. Your email inbox for formatted messages
3. Console logs for any blocked spam attempts

**Total setup time:** Under 10 minutes  
**Monthly savings:** $10+ (plus no ridiculous limits)

## Why This Approach Is Better

1. **No vendor lock-in** - Your code, your control
2. **Better performance** - Runs on Vercel's edge network
3. **More features** - Custom spam detection, logging, analytics
4. **Cost effective** - Free for thousands of submissions
5. **Professional** - No "powered by" branding nonsense 