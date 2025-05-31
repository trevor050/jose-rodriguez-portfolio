# Jose Rodriguez - Engineering Portfolio

A professional portfolio website showcasing mechanical engineering projects and achievements, designed for college applications and professional networking.

## 🎯 Easy Customization Guide

Hey Jose! This website is designed to be super easy for you to customize without needing to know how to code. Here's how to update your portfolio:

### 📁 **Project Management** (src/data/projects.js)

**To add a new project:**
1. Open `src/data/projects.js` 
2. Copy an existing project (everything between the `{ }` brackets)
3. Paste it at the end of the list
4. Update the information:
   - `id`: Use the next number (9, 10, 11, etc.)
   - `title`: Your project name
   - `description`: Short summary for the project card
   - `image`: Path to your photo (put images in `public/images/` folder)
   - `details`: Longer description for when people click on the project
   - `tools`: List of materials/tools you used
   - `timeline`: How long it took
   - `learnings`: What you learned
   - `category`: Choose from existing ones or create new categories
   - `difficulty`: Beginner, Intermediate, Advanced, or Expert
   - `status`: Usually "Completed"

**Filter buttons are automatic!** When you add new categories to your projects, filter buttons appear automatically. No extra work needed!

### 👤 **About Page** (src/data/about.js)

**To update your personal information:**
1. Open `src/data/about.js`
2. Edit any text in quotation marks
3. Add new skills, update progress percentages, change your philosophy

**To add a new skill:**
1. Find the `skills` section
2. Copy an existing skill line
3. Paste it at the end
4. Update the name, level, and progress number (0-100)

### ⚙️ **Contact & Links** (src/data/settings.js)

**To update your contact information:**
1. Open `src/data/settings.js`
2. Replace the placeholder email with your real email
3. Add your actual LinkedIn profile URL
4. Update any other social media links

### 🖼️ **Adding Images**

1. Put your project photos in the `public/images/` folder
2. Use the filename in your project data like: `"/images/your-photo.jpg"`
3. Supported formats: JPG, PNG, WebP

## 🚀 Quick Start

1. **Edit your data files** (in `src/data/` folder)
2. **Add your images** (in `public/images/` folder)  
3. **Save and refresh** your website to see changes

## 📊 Current Categories

Your filter buttons are automatically created from these categories:
- Mechanical Systems
- Physics Application
- Structural Engineering
- Materials Engineering
- Mechanical Design
- Renewable Energy
- Fluid Mechanics
- Precision Instruments

**Want a new category?** Just use it in any project and the filter button will appear automatically!

## 🔧 Technical Details

This portfolio is built with:
- **Vite** - Fast development server
- **Vanilla JavaScript** - No complex frameworks
- **Modern CSS** - Professional styling with dark/light themes
- **Responsive Design** - Works on all devices
- **SEO Optimized** - Search engine friendly

## 📱 Features

- ✅ **Automatic filter generation** from project categories
- ✅ **Dark/Light theme toggle**
- ✅ **Mobile responsive design**
- ✅ **Professional animations**
- ✅ **Accessibility features**
- ✅ **SEO meta tags**
- ✅ **Contact form** (ready for backend integration)
- ✅ **Professional favicon**
- ✅ **Easy customization system**

## 🌐 Deployment

This website is deployed on **Vercel** and automatically updates when you make changes to the main branch on GitHub.

**Live URL:** [Your Portfolio URL]

## 🆘 Need Help?

If you need to make changes and aren't sure how:

1. **Read the comments** in the data files - they explain everything in plain language
2. **Look at existing examples** - copy the pattern and change the content
3. **Make small changes** - edit one thing at a time and test it
4. **Keep backups** - save copies of your files before making big changes

## 📋 File Structure

```
joses-site/
├── src/
│   ├── data/                  ← **EDIT THESE FILES**
│   │   ├── projects.js        ← Your project information
│   │   ├── about.js          ← About page content
│   │   └── settings.js       ← Contact info & links
│   ├── components/           ← Don't edit (website code)
│   ├── style.css            ← Don't edit (website styling)
│   └── main.js              ← Don't edit (website logic)
├── public/
│   └── images/              ← **PUT YOUR PHOTOS HERE**
└── README.md                ← This file
```

## 🎨 Customization Tips

- **Keep descriptions clear and professional** - remember, college admissions officers will read this
- **Use high-quality images** - they make a huge difference
- **Update your stats regularly** - keep the numbers current
- **Test on mobile** - many people will view this on their phones
- **Proofread everything** - spelling and grammar matter for college applications

---

**Built with precision and passion for mechanical engineering** 🔧 

## 📧 Contact Form Backend Setup

Your contact form is ready to connect to a backend service! Here are the most cost-effective options:

### 🆓 **Option 1: Netlify Forms (Recommended - FREE)**

**Cost:** Completely free for up to 100 submissions/month
**Setup time:** 2 minutes

1. Add `netlify` attribute to your form in `src/components/Views.js`:
```html
<form class="contact-form" id="contact-form" netlify>
```

2. Deploy to Netlify (instead of Vercel)
3. Form submissions automatically appear in your Netlify dashboard
4. No code changes needed!

**Pros:** Zero setup, free, reliable, spam filtering included
**Cons:** Need to switch from Vercel to Netlify

### 🆓 **Option 2: Formspree (FREE tier)**

**Cost:** Free for 50 submissions/month, then $10/month
**Setup time:** 5 minutes

1. Sign up at [formspree.io](https://formspree.io)
2. Get your form endpoint URL
3. Update `src/main.js`:

```javascript
// Replace the submitContactForm function
const submitContactForm = async (data) => {
  try {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: new FormData(document.getElementById('contact-form'))
    })
    
    if (response.ok) {
      return { success: true, message: 'Message sent successfully!' }
    } else {
      throw new Error('Failed to send message')
    }
  } catch (error) {
    return { success: false, message: 'Failed to send message' }
  }
}
```

**Pros:** Easy setup, works with any hosting (Vercel/Netlify)
**Cons:** Limited free submissions

### 💰 **Option 3: Vercel + Supabase (Almost FREE)**

**Cost:** $0-5/month (Supabase free tier is very generous)
**Setup time:** 15 minutes

1. **Set up Supabase database:**
   - Go to [supabase.com](https://supabase.com)
   - Create a free project
   - Create a table called `contact_submissions`:

```sql
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. **Create Vercel API endpoint:**
   Create `api/contact.js` in your project root:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, subject, message } = req.body

    const { error } = await supabase
      .from('contact_submissions')
      .insert([{ name, email, subject, message }])

    if (error) throw error

    res.status(200).json({ success: true, message: 'Message sent successfully!' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
```

3. **Add environment variables to Vercel:**
   - Go to your Vercel dashboard
   - Settings → Environment Variables
   - Add:
     - `SUPABASE_URL` = your Supabase project URL
     - `SUPABASE_ANON_KEY` = your Supabase anon key

4. **Update your main.js:**
```javascript
const submitContactForm = async (data) => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    const result = await response.json()
    return result
  } catch (error) {
    return { success: false, message: 'Failed to send message' }
  }
}
```

**Pros:** Full control, database storage, can add features later
**Cons:** Slightly more complex setup

### 🚀 **My Recommendation**

**Start with Formspree** - it's the easiest to set up and works perfectly with your current Vercel deployment. You get 50 free submissions per month, which is plenty for a portfolio site.

**Implementation steps:**
1. Sign up at formspree.io (2 minutes)
2. Replace the contact form submission code (5 minutes)
3. Test it works (1 minute)
4. Total time: 8 minutes!

**When to upgrade:** If you start getting more than 50 messages per month (which would be awesome!), then consider switching to the Vercel + Supabase option for unlimited submissions.

### 📊 **Sample Backend Code Templates**

I've already prepared your frontend code to work with any of these backends. The error handling, validation, and user feedback are all ready to go!

**Need help setting any of these up?** The setup is very straightforward, and I can provide more detailed steps for whichever option you choose.

--- 