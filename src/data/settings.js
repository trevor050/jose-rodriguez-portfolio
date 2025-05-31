/*
===========================================
    JOSE'S WEBSITE SETTINGS & LINKS
===========================================

Hi Jose! This file contains all your contact information and website settings.
This makes it super easy to update your LinkedIn, email, or any other links
without digging through code.

HOW TO UPDATE YOUR LINKS:
1. Find the link you want to change below
2. Replace the URL with your new link
3. Keep the quotation marks around the links
4. Save the file and refresh your website

IMPORTANT:
- Make sure your links start with "https://" 
- Test your links before adding them
- Keep backup copies of your old links
*/

export const contactInfo = {
  // Your main contact information
  email: "jose.rodriguez.engineering@email.com", // Replace with your real email
  
  // Social media and professional links
  socialMedia: {
    linkedin: "https://linkedin.com/in/jose-rodriguez-engineering", // Your actual LinkedIn profile
    github: "https://github.com/jose-rodriguez", // If you have GitHub projects
    instagram: "", // Optional: your Instagram if professional
    twitter: ""    // Optional: your Twitter if professional
  },
  
  // Contact form settings
  contactForm: {
    successMessage: "Thanks for reaching out! I'll get back to you soon.",
    errorMessage: "Sorry, there was an issue sending your message. Please try reaching out via LinkedIn.",
    // In the future, you can add your actual form submission service here
    // For now, the form just logs the message and shows a demo response
  },
  
  // Professional links (for future use)
  portfolio: {
    resumeLink: "", // Link to your PDF resume when you have one
    portfolioPDF: "", // Link to a PDF version of your portfolio
    projectRepository: "", // If you want to share code/files
  }
}

/*
===========================================
    WEBSITE INFORMATION
===========================================

Basic information about your website.
This appears in search results and when people share your site.
*/

export const siteInfo = {
  // Basic website information
  title: "Jose Rodriguez - Mechanical Engineering Portfolio",
  description: "Dedicated high school junior showcasing innovative mechanical engineering projects and preparing for college applications.",
  author: "Jose Rodriguez",
  
  // This appears in browser tabs and bookmarks
  shortTitle: "Jose Rodriguez Portfolio",
  
  // Keywords that help people find your website in search engines
  keywords: [
    "mechanical engineering",
    "high school engineering", 
    "engineering portfolio",
    "STEM student",
    "college applications",
    "engineering projects",
    "innovation",
    "design thinking"
  ],
  
  // Your website URL (update this when you know your final domain)
  siteUrl: "https://your-portfolio-site.vercel.app",
  
  // Social media preview settings
  // This is what appears when someone shares your website on social media
  socialPreview: {
    title: "Jose Rodriguez - Engineering Portfolio",
    description: "High school mechanical engineering student with a passion for innovative design and problem-solving.",
    // You can add a preview image path here later
    image: "/images/portfolio-preview.jpg" // Add this image to your public/images folder
  }
}

/*
===========================================
    EASY CUSTOMIZATION TIPS
===========================================

TO UPDATE YOUR EMAIL:
1. Find "email:" above
2. Replace the email address with yours
3. Keep the quotation marks

TO ADD YOUR LINKEDIN:
1. Go to your LinkedIn profile
2. Copy the URL from your browser
3. Replace the linkedin link above
4. Keep the quotation marks

TO UPDATE WEBSITE DESCRIPTION:
1. Find the "description:" in siteInfo
2. Write a new description about yourself
3. Keep it under 160 characters for best search results

TESTING YOUR CHANGES:
1. Save this file
2. Refresh your website
3. Check that your new links work
4. Try the contact form to see your new messages

NEED HELP?
- Make sure all links start with "https://"
- Don't delete commas between items
- Keep quotation marks around text
- Ask someone to test your links on a different computer
*/ 