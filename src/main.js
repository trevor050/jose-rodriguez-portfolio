import './style.css'
import { renderProjects, renderAbout, renderContact } from './components/Views.js'
import { renderProjectModal } from './components/ProjectCard.js'
import { track, inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import { 
  ANALYTICS_CONFIG, 
  trackPerformance, 
  initScrollTracking, 
  initSessionTracking 
} from './data/analytics.js'

/*
===========================================
    EASY CUSTOMIZATION SYSTEM
===========================================

Hi Jose! This file loads your portfolio data from separate files 
that are much easier to edit. Here's what each file does:

- src/data/projects.js = All your project information
- src/data/about.js = Your About page content  
- src/data/settings.js = Contact info and website settings

HOW FILTERS WORK:
The filter buttons are automatically created based on the 
"category" field in each of your projects. You don't need 
to manually create them - just use category names in your 
projects and the website will automatically make filter buttons!

ADDING NEW FILTERS:
1. Open src/data/projects.js
2. Add a new category name to any project
3. Save the file - the filter button appears automatically!

CURRENT CATEGORIES BEING USED:
(These will automatically become filter buttons)
*/

// Import all the data from the separate, easy-to-edit files
import { projectsData, portfolioStats } from './data/projects.js'
import { aboutData } from './data/about.js'
import { contactInfo, siteInfo } from './data/settings.js'

// Combine everything into the format the website expects
const portfolioData = {
  projects: projectsData,
  stats: portfolioStats,
  about: aboutData,
  contact: contactInfo,
  siteInfo: siteInfo
}

// Application state
let currentView = 'projects'
let isDarkMode = true
let currentFilters = ['All'] // Changed to array for multi-select

// CONSERVATIVE anti-spam state management - prioritizes NEVER blocking real opportunities
let submissionAttempts = 0
let lastSubmissionTime = 0
let suspiciousActivity = false
let suspiciousCount = 0
const SUBMISSION_COOLDOWN = 60000 // 1 minute between submissions (more lenient)
const MAX_DAILY_SUBMISSIONS = 5 // More generous daily limit
const SUSPICIOUS_THRESHOLD = 3 // Allow more attempts before flagging

// Much more targeted profanity list (only truly inappropriate words)
const PROFANITY_LIST = [
  'fuck', 'shit', 'bitch', 'whore', 'slut', 'cunt', 'cock', 'pussy',
  'nigger', 'faggot', 'retard', 'nazi', 'kill yourself', 'kys'
]

// VERY targeted spam keywords (only obvious promotional spam)
const OBVIOUS_SPAM = [
  'buy now', 'click here', 'free money', 'make money fast', 'viagra', 
  'casino online', 'lottery winner', 'crypto investment', 'get rich quick',
  'limited time offer', 'act now', 'guaranteed income', '$$$'
]

// Comprehensive disposable email domains (much better than TLD checking)
const DISPOSABLE_DOMAINS = [
  '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org',
  'yopmail.com', 'throwaway.email', 'temp-mail.org', 'mailnesia.com',
  'getairmail.com', 'mailcatch.com', 'sharklasers.com', 'trashmail.com'
]

// Suspicious URL patterns (expanded)
const SUSPICIOUS_URL_PATTERNS = [
  /https?:\/\/[^\s]+\.(tk|ml|ga|cf|bit\.ly|tinyurl|t\.co|ow\.ly)/gi,
  /mailto:[^\s]+/gi,
  /discord\.gg\/[^\s]+/gi,
  /t\.me\/[^\s]+/gi,
  /tg:\/\/[^\s]+/gi
]

// Cookie-based submission tracking
const getSubmissionCount = () => {
  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('sub_count='))
    
    if (cookie) {
      const encoded = cookie.split('=')[1]
      const decoded = atob(encoded)
      return parseInt(decoded) || 0
    }
    return 0
  } catch (error) {
    return 0
  }
}

const incrementSubmissionCount = () => {
  try {
    const currentCount = getSubmissionCount()
    const newCount = currentCount + 1
    const encoded = btoa(newCount.toString())
    
    // Set cookie to expire in 24 hours
    const expiry = new Date()
    expiry.setTime(expiry.getTime() + (24 * 60 * 60 * 1000))
    document.cookie = `sub_count=${encoded}; expires=${expiry.toUTCString()}; path=/; SameSite=Strict`
    
    return newCount
  } catch (error) {
    return 0
  }
}

// Check if shadowban has expired
const checkShadowBanExpiry = () => {
  if (shadowBanned && shadowBanTime > 0) {
    const now = Date.now()
    if (now - shadowBanTime > SHADOWBAN_DURATION) {
      shadowBanned = false
      shadowBanTime = 0
      submissionAttempts = 0
    }
  }
}

// Sneaky console logging function for testing (minimally different from real success)
const logFormInteraction = (type, data) => {
  const timestamp = new Date().toISOString()
  const userAgent = navigator.userAgent.substring(0, 20)
  
  if (type === 'success') {
    console.log(`[${timestamp}] Form submission completed successfully`)
    console.log(`User-Agent: ${userAgent}...`)
    console.log(`Form data validated and processed`)
  } else if (type === 'shadow') {
    console.log(`[${timestamp}] Form submission completed successfully`) // Same message!
    console.log(`User-Agent: ${userAgent}...`)
    console.log(`Form data validated and processed`) // Identical logging
    // The difference is subtle - no actual API call happens
  }
}

/*
===========================================
    AUTOMATIC FILTER GENERATION
===========================================

This function automatically creates filter buttons based on 
what categories you use in your projects. You never need to 
manually add or remove filter buttons!
*/
const getAvailableCategories = () => {
  // Get all unique categories from projects
  const categories = [...new Set(projectsData.map(project => project.category))]
  
  // Always include "All" as the first option
  return ['All', ...categories.sort()]
}

// Log the current categories so Jose can see what's available
console.log('📁 Current project categories (auto-generated filter buttons):')
console.log(getAvailableCategories())
console.log('💡 To add new categories, just edit src/data/projects.js and add new category names!')

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -30px 0px' // Trigger earlier
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
      
      // Trigger skill progress animations
      if (entry.target.classList.contains('skills-section')) {
        animateSkillBars()
      }
      
      // Trigger counter animations
      if (entry.target.classList.contains('stats-grid')) {
        animateCounters()
      }
    }
  })
}, observerOptions)

// Animate skill progress bars
const animateSkillBars = () => {
  const skillBars = document.querySelectorAll('.skill-progress')
  skillBars.forEach((bar, index) => {
    const progress = bar.dataset.progress
    setTimeout(() => {
      bar.style.width = `${progress}%`
    }, index * 100) // Faster staggering
  })
}

// Faster, smoother counter animation
const animateCounters = () => {
  const counters = document.querySelectorAll('[data-count]')
  counters.forEach((counter, index) => {
    const target = parseInt(counter.dataset.count)
    let current = 0
    const increment = target / 50 // Faster animation (50 frames instead of 60)
    
    const updateCounter = () => {
      if (current < target) {
        current += increment
        counter.textContent = Math.floor(current) + '+'
        requestAnimationFrame(updateCounter)
      } else {
        counter.textContent = target + '+'
      }
    }
    
    setTimeout(updateCounter, index * 150) // Faster staggering
  })
}

// Scroll to top functionality
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Show/hide scroll to top button
const handleScroll = () => {
  const scrollButton = document.getElementById('scroll-to-top')
  if (window.pageYOffset > 300) {
    scrollButton.classList.add('visible')
  } else {
    scrollButton.classList.remove('visible')
  }
}

/*
===========================================
    MULTI-SELECT FILTER FUNCTIONALITY
===========================================

This handles multi-select filtering with a reset button.
Users can select multiple categories or reset to view all.
*/
const filterProjects = (category) => {
  const projectCards = document.querySelectorAll('.project-card')
  const filterButtons = document.querySelectorAll('.filter-btn')
  const resetButton = document.querySelector('.filter-reset')
  
  // Track filter usage analytics
  track('Project Filter Used', {
    category: category,
    previousFilters: [...currentFilters],
    timestamp: new Date().toISOString(),
    device: isMobile() ? 'mobile' : 'desktop'
  })
  
  // Handle multi-select logic
  if (category === 'All') {
    currentFilters = ['All']
  } else {
    // Remove 'All' if selecting specific categories
    if (currentFilters.includes('All')) {
      currentFilters = []
    }
    
    // Toggle the selected category
    if (currentFilters.includes(category)) {
      currentFilters = currentFilters.filter(f => f !== category)
    } else {
      currentFilters.push(category)
    }
    
    // If no filters selected, default to 'All'
    if (currentFilters.length === 0) {
      currentFilters = ['All']
    }
  }
  
  // Update active filter buttons
  filterButtons.forEach(btn => {
    const btnCategory = btn.dataset.category
    btn.classList.toggle('active', 
      currentFilters.includes(btnCategory) || 
      (currentFilters.includes('All') && btnCategory === 'All')
    )
  })
  
  // Show/hide reset button
  if (resetButton) {
    resetButton.style.display = currentFilters.includes('All') ? 'none' : 'inline-flex'
  }
  
  // Filter project cards with faster animation
  projectCards.forEach(card => {
    card.classList.add('filtering')
    const projectCategory = card.dataset.category || 'All'
    
    const shouldShow = currentFilters.includes('All') || currentFilters.includes(projectCategory)
    
    if (shouldShow) {
      setTimeout(() => {
        card.classList.remove('hidden')
        card.classList.remove('filtering')
      }, 100) // Faster showing
    } else {
      card.classList.add('hidden')
      setTimeout(() => {
        card.classList.remove('filtering')
      }, 300) // Faster hiding
    }
  })
}

// Reset filters function
const resetFilters = () => {
  filterProjects('All')
}

// Enhanced keyboard navigation
const handleKeyboardNavigation = (e) => {
  // Close modal on Escape
  if (e.key === 'Escape') {
    closeProjectModal()
  }
  
  // Navigate with arrow keys when modal is open
  if (document.getElementById('project-modal')) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Implement project navigation in modal if desired
    }
  }
  
  // Quick navigation shortcuts (only on desktop)
  if (!isMobile() && (e.ctrlKey || e.metaKey)) {
    switch (e.key) {
      case '1':
        e.preventDefault()
        handleNavigation('projects')
        break
      case '2':
        e.preventDefault()
        handleNavigation('about')
        break
      case '3':
        e.preventDefault()
        handleNavigation('contact')
        break
      case '\\':
        e.preventDefault()
        toggleTheme()
        break
    }
  }
}

// Mobile detection utility
const isMobile = () => {
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Show loading indicator
const showLoading = () => {
  const loading = document.getElementById('loading-indicator')
  if (loading) {
    loading.classList.remove('hidden')
  }
}

// Hide loading indicator
const hideLoading = () => {
  const loading = document.getElementById('loading-indicator')
  if (loading) {
    loading.classList.add('hidden')
  }
}

// Theme toggle functionality
const toggleTheme = () => {
  isDarkMode = !isDarkMode
  document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  
  // Track theme change analytics
  track('Theme Changed', {
    newTheme: isDarkMode ? 'dark' : 'light',
    timestamp: new Date().toISOString(),
    device: isMobile() ? 'mobile' : 'desktop'
  })
  
  // Update the icon
  const themeIcon = document.querySelector('.theme-icon')
  if (themeIcon) {
    themeIcon.innerHTML = isDarkMode ? 
      '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/></svg>' : 
      '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/></svg>'
  }
}

// Header component with mobile-friendly footer
const renderHeader = () => {
  const lightIcon = '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/></svg>'
  const darkIcon = '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/></svg>'
  
  return `
    <header class="header" role="banner">
      <div class="container">
        <div class="header-top">
          <h1>Jose Rodriguez</h1>
          <button class="theme-toggle" onclick="toggleTheme()" title="Toggle theme" aria-label="Toggle between light and dark theme">
            <span class="theme-icon">${isDarkMode ? lightIcon : darkIcon}</span>
          </button>
        </div>
        <p class="subtitle">Aspiring Mechanical Engineer</p>
        <p class="tagline">Dedicated to solving complex engineering challenges through innovative design, precise execution, and creative problem-solving.</p>
        <nav class="nav" role="navigation" aria-label="Main navigation">
          <a href="#" class="nav-item ${currentView === 'projects' ? 'active' : ''}" data-view="projects" aria-current="${currentView === 'projects' ? 'page' : 'false'}">
            <span>Projects</span>
          </a>
          <a href="#" class="nav-item ${currentView === 'about' ? 'active' : ''}" data-view="about" aria-current="${currentView === 'about' ? 'page' : 'false'}">
            <span>About</span>
          </a>
          <a href="#" class="nav-item ${currentView === 'contact' ? 'active' : ''}" data-view="contact" aria-current="${currentView === 'contact' ? 'page' : 'false'}">
            <span>Contact</span>
          </a>
        </nav>
    </div>
    </header>
  `
}

// Navigation handler with FIXED mobile content loading
const handleNavigation = (view) => {
  if (view === currentView) return
  
  // Track navigation analytics
  track('Page Navigation', {
    from: currentView,
    to: view,
    timestamp: new Date().toISOString(),
    device: isMobile() ? 'mobile' : 'desktop'
  })
  
  // Don't show loading on mobile to prevent content appearing below fold
  if (!isMobile()) {
    showLoading()
  }
  
  const transitionTime = isMobile() ? 50 : 100 // Faster on mobile
  
  setTimeout(() => {
    currentView = view
    renderApp()
    
    if (!isMobile()) {
      hideLoading()
    }
    
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Announce page change to screen readers
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = `Navigated to ${view} section`
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, transitionTime)
}

// Project interactions
const handleProjectClick = (projectId) => {
  const project = portfolioData.projects.find(p => p.id === parseInt(projectId))
  if (project) {
    // Track project view analytics
    track('Project Viewed', {
      projectId: project.id,
      projectTitle: project.title,
      category: project.category,
      timestamp: new Date().toISOString(),
      device: isMobile() ? 'mobile' : 'desktop'
    })
    
    showProjectModal(project)
  }
}

const showProjectModal = (project) => {
  const modalHTML = renderProjectModal(project)
  document.body.insertAdjacentHTML('beforeend', modalHTML)
  
  const modal = document.getElementById('project-modal')
  const closeBtn = modal.querySelector('.modal-close')
  
  closeBtn.addEventListener('click', closeProjectModal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProjectModal()
  })
  
  document.body.style.overflow = 'hidden'
}

const closeProjectModal = () => {
  const modal = document.getElementById('project-modal')
  if (modal) {
    modal.remove()
    document.body.style.overflow = 'auto'
  }
}

// Enhanced contact form validation with MINIMAL frontend checks (backend handles spam)
const validateContactForm = (data) => {
  const errors = []
  
  // 1. HONEYPOT CHECK - Silent bot detection
  if (data.website && data.website.trim() !== '') {
    // Don't show error, just silently reject
    return ['Please try again in a moment.']
  }
  
  // 2. BASIC REQUIRED FIELD validation only
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address')
  }
  if (!data.subject || data.subject.trim().length < 3) {
    errors.push('Subject must be at least 3 characters long')
  }
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long')
  }
  
  // REMOVED ALL FRONTEND SPAM DETECTION - Backend handles everything now
  
  return errors
}

// Backend API - Discord webhook + multiple fallbacks for email service chaos
const submitContactForm = async (data) => {
  try {
    // Try our custom Vercel function (now with Discord webhook!)
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject.trim(),
        message: data.message.trim(),
        website: data.website || '' // Honeypot field
      })
    })
    
    const result = await response.json()
    
    if (response.ok && result.success) {
      return { success: true, message: result.message }
    } else {
      throw new Error(result.error || 'Failed to send message')
    }
    
  } catch (error) {
    console.error('Contact form error:', error)
    
    // Fallback: Log the submission data for manual follow-up
    console.log('📧 Contact Form Submission (for manual follow-up):', {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      timestamp: new Date().toISOString(),
      status: 'backend_failed'
    })
    
    return { 
      success: false, 
      message: 'Failed to send message. Please try again or reach out via LinkedIn.' 
    }
  }
}

// Enhanced contact form handler with backup logging for missed opportunities
const handleContactForm = async (e) => {
  e.preventDefault()
  
  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)
  
  // Validate form data
  const validationErrors = validateContactForm(data)
  if (validationErrors.length > 0) {
    
    // CRITICAL: Log blocked submissions for manual review
    if (validationErrors.some(error => error.includes('promotional content') || error.includes('Please try again'))) {
      console.log('🚨 BLOCKED SUBMISSION - MANUAL REVIEW NEEDED:', {
        submission: {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message.substring(0, 200) + '...',
          timestamp: new Date().toISOString(),
          reason: validationErrors.join(', ')
        },
        note: 'This submission was blocked but may be legitimate. Consider manual follow-up.'
      })
      
      // Show softer error message
      showFormErrors(['Your message needs review. Please try contacting via LinkedIn if urgent.'])
    } else {
      showFormErrors(validationErrors)
    }
    
    submissionAttempts++
    return
  }
  
  const btn = e.target.querySelector('.btn')
  const originalText = btn.innerHTML
  
  // Show loading state
  btn.innerHTML = '<span>Sending...</span>'
  btn.disabled = true
  clearFormErrors()
  
  try {
    const result = await submitContactForm(data)
    
    if (result.success) {
      // Update rate limiting and submission tracking
      lastSubmissionTime = Date.now()
      submissionAttempts = 0 // Reset on successful submission
      incrementSubmissionCount() // Track successful submission in cookie
      
      // Track successful contact form submission
      track('Contact Form Submitted', {
        timestamp: new Date().toISOString(),
        nameLength: data.name.length,
        emailDomain: data.email.split('@')[1] || 'unknown',
        subjectLength: data.subject.length,
        messageLength: data.message.length,
        device: isMobile() ? 'mobile' : 'desktop'
      })
      
      // Show success state
      btn.innerHTML = '<span>Message Sent Successfully!</span>'
      btn.style.background = 'var(--accent)'
      
      // Reset form after delay
      setTimeout(() => {
        btn.innerHTML = originalText
        btn.disabled = false
        btn.style.background = 'var(--primary)'
        e.target.reset()
      }, 3000)
      
    } else {
      throw new Error(result.message || 'Failed to send message')
    }
    
  } catch (error) {
    console.error('Contact form error:', error)
    
    // Log failed submissions too (might be infrastructure issues)
    console.log('📧 FAILED SUBMISSION - CHECK INFRASTRUCTURE:', {
      submission: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message.substring(0, 100) + '...',
        timestamp: new Date().toISOString(),
        error: error.message
      }
    })
    
    submissionAttempts++
    
    // Show error state
    btn.innerHTML = '<span>Failed to Send - Try Again</span>'
    btn.style.background = '#ef4444'
    
    // Reset button after delay
    setTimeout(() => {
      btn.innerHTML = originalText
      btn.disabled = false
      btn.style.background = 'var(--primary)'
    }, 3000)
    
    showFormErrors(['Failed to send message. Please try again or contact directly via LinkedIn.'])
  }
}

// Form error display functions
const showFormErrors = (errors) => {
  clearFormErrors()
  
  const form = document.getElementById('contact-form')
  if (!form) return
  
  const errorContainer = document.createElement('div')
  errorContainer.id = 'form-errors'
  errorContainer.style.cssText = `
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid #ef4444;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    color: #ef4444;
  `
  
  errors.forEach(error => {
    const errorElement = document.createElement('p')
    errorElement.textContent = error
    errorElement.style.margin = '0.25rem 0'
    errorContainer.appendChild(errorElement)
  })
  
  form.insertBefore(errorContainer, form.firstChild)
}

const clearFormErrors = () => {
  const existingErrors = document.getElementById('form-errors')
  if (existingErrors) {
    existingErrors.remove()
  }
}

// Enhanced project card with better attributes
const enhanceProjectCard = (card, project) => {
  card.setAttribute('tabindex', '0')
  card.setAttribute('role', 'button')
  card.setAttribute('aria-label', `View details for ${project.title}`)
  card.dataset.category = project.category
}

// Make functions available globally
window.toggleTheme = toggleTheme
window.resetFilters = resetFilters

// Enhanced render function with mobile-friendly footer
const renderApp = () => {
  const app = document.querySelector('#app')
  
  let content = ''
  switch (currentView) {
    case 'projects':
      content = renderProjects(portfolioData)
      break
    case 'about':
      content = renderAbout(portfolioData)
      break
    case 'contact':
      content = renderContact()
      break
  }
  
  // Mobile-friendly footer
  const footerText = isMobile() ? 
    '© 2024 Jose Rodriguez' : 
    '© 2024 Jose Rodriguez Engineering Portfolio | Built with precision and passion for mechanical engineering'
  
  const keyboardShortcuts = isMobile() ? '' : `
    <p class="footer-shortcuts">
      Keyboard shortcuts: Ctrl+1 (Projects), Ctrl+2 (About), Ctrl+3 (Contact), Ctrl+\\ (Theme)
    </p>
  `
  
  app.innerHTML = renderHeader() + `<main id="main-content" role="main">` + content + `</main>` + `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-content">
          <p class="footer-main">${footerText}</p>
          ${keyboardShortcuts}
        </div>
  </div>
    </footer>
  `
  
  addEventListeners()
  setupIntersectionObserver()
}

// Setup intersection observer for animations
const setupIntersectionObserver = () => {
  // Clear previous observers
  observer.disconnect()
  
  // Observe new elements
  const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .skills-section, .stats-grid')
  animatedElements.forEach(el => observer.observe(el))
}

// Enhanced event listeners
const addEventListeners = () => {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      const view = e.target.closest('.nav-item').dataset.view
      handleNavigation(view)
    })
  })
  
  // Project cards with enhanced attributes
  document.querySelectorAll('.project-card').forEach(card => {
    const projectId = card.dataset.projectId
    const project = portfolioData.projects.find(p => p.id === parseInt(projectId))
    
    if (project) {
      enhanceProjectCard(card, project)
      
      card.addEventListener('click', () => handleProjectClick(projectId))
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleProjectClick(projectId)
        }
      })
    }
  })
  
  // Project filters - Multi-select functionality
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = e.target.dataset.category
      filterProjects(category)
    })
  })
  
  // Reset filters button
  const resetButton = document.querySelector('.filter-reset')
  if (resetButton) {
    resetButton.addEventListener('click', resetFilters)
  }
  
  // Contact form
  const contactForm = document.getElementById('contact-form')
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm)
  }
  
  // Anti-Ad-Blocker: Professional network link handler
  const professionalNetworkLink = document.querySelector('.professional-network-link')
  if (professionalNetworkLink) {
    // Add enhanced click tracking and fallback
    professionalNetworkLink.addEventListener('click', (e) => {
      // Track LinkedIn click analytics
      track('LinkedIn Profile Clicked', {
        timestamp: new Date().toISOString(),
        device: isMobile() ? 'mobile' : 'desktop',
        referrer: document.referrer || 'direct'
      })
      
      // Let the normal link work, but add fallback handling
      // Minimal obfuscation: TGlua2VkSW4= is base64 for "LinkedI n"
      const platform = atob('TGlua2VkSW4=') 
      console.log(`🔗 ${platform} connection initiated`)
      
      // Fallback for ad blockers that might block the direct link
      setTimeout(() => {
        if (!document.hidden) {
          // If user is still on the page after 100ms, the link might have been blocked
          // We could show a modal with instructions here if needed
        }
      }, 100)
    })
  }
  
  // Scroll to top button
  const scrollButton = document.getElementById('scroll-to-top')
  if (scrollButton) {
    scrollButton.addEventListener('click', scrollToTop)
  }
}

// Initialize the application with enhanced features
const init = () => {
  // Initialize comprehensive analytics tracking
  const performanceData = trackPerformance()
  
  // Initialize Vercel Analytics
  inject()
  
  // Initialize Speed Insights
  injectSpeedInsights()
  
  // Track initial portfolio load
  track('Portfolio Loaded', {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent.substring(0, 50),
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    theme: isDarkMode ? 'dark' : 'light',
    ...performanceData,
    ...ANALYTICS_CONFIG.customDimensions
  })
  
  // Initialize advanced tracking features
  if (ANALYTICS_CONFIG.trackScrollDepth) {
    window.scrollTracker = initScrollTracking()
  }
  
  if (ANALYTICS_CONFIG.trackSessionData) {
    window.sessionTracker = initSessionTracking()
  }
  
  // Make analytics available globally for other functions
  window.track = track
  
  // Set initial theme from localStorage
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode = savedTheme === 'dark'
  }
  document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  
  // Add event listeners
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('keydown', handleKeyboardNavigation)
  
  // Initial render
  renderApp()
  
  // Hide loading indicator after initial load
  setTimeout(hideLoading, 300) // Faster initial load
  
  console.log('🔧 Jose Rodriguez Engineering Portfolio')
  console.log('✅ System initialized successfully')
  console.log('📊 Project data loaded from: src/data/projects.js')
  console.log('👤 About data loaded from: src/data/about.js') 
  console.log('⚙️  Settings loaded from: src/data/settings.js')
  console.log('📈 Analytics and Speed Insights enabled')
  console.log('🎯 Advanced tracking: scroll depth, session data, performance metrics')
  if (!isMobile()) {
    console.log('⌨️  Keyboard shortcuts available: Ctrl+1, Ctrl+2, Ctrl+3, Ctrl+\\')
  }
}

// Start the application
init()