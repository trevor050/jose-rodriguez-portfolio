/*
===========================================
    WEBSITE SETTINGS & CONFIGURATION
===========================================

This file contains all the website settings that Jose can 
easily customize without touching the code. Perfect for 
updating contact information, social links, and site settings!

EASY TO UPDATE:
- Contact information
- Social media links  
- Website metadata
- Form settings
*/

// Contact Information (Easy to update!)
export const contactInfo = {
  email: "jose.rodriguez.engineer@gmail.com", // Your real email here
  phone: "+1 (555) 123-4567", // Your phone if you want to share it
  location: "United States", // Your general location
  
  // Social Media Links (Update these with your real profiles!)
  social: {
    linkedin: "https://linkedin.com/in/jose-rodriguez-engineer",
    github: "https://github.com/jose-rodriguez", // Add if you have one
    instagram: "", // Add if you want to share
    twitter: "", // Add if you have one
  },
  
  // Response time information
  responseTime: {
    typical: "24-48 hours",
    urgent: "Please mention urgency in subject line"
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
  description: "Innovative mechanical engineering projects by high school student Jose Rodriguez",
  author: "Jose Rodriguez",
  
  // This appears in browser tabs and bookmarks
  shortTitle: "Jose Rodriguez Portfolio",
  
  // Keywords that help people find your website in search engines
  keywords: "mechanical engineering, portfolio, high school, projects, college application",
  
  // Your website URL (update this when you know your final domain)
  url: "https://jose-rodriguez-portfolio.vercel.app", // Update with your real URL
  
  // Social media preview settings
  // This is what appears when someone shares your website on social media
  ogImage: "/images/portfolio-preview.jpg", // Create this image if you want custom previews
  
  // Analytics & Tracking (Optional)
  googleAnalytics: "", // Add Google Analytics ID if you want more detailed tracking
  
  // Contact Form Settings
  contactForm: {
    maxSubmissionsPerDay: 3,
    enableSpamProtection: true,
    formspreeEndpoint: "https://formspree.io/f/mblyrbkg" // Your Formspree endpoint
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