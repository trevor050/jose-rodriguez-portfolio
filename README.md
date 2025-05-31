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