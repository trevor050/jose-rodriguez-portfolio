import './style.css'
import { renderProjects, renderAbout, renderContact } from './components/Views.js'
import { renderProjectModal } from './components/ProjectCard.js'

// Portfolio data - professional and college-focused
const portfolioData = {
  projects: [
    {
      id: 1,
      title: "Cardboard 4-Cylinder Engine",
      description: "A functional 4-cylinder engine replica demonstrating mechanical engineering principles, precision assembly, and innovative material application in mechanical systems design.",
      image: "/images/Cardboard Engine.png",
      details: "This project demonstrates advanced understanding of internal combustion mechanics through unconventional material application. Built over three weeks with precise measurements and careful component integration, the model features working pistons and accurate cylinder timing. The project showcases problem-solving skills, attention to detail, and the ability to translate theoretical mechanical concepts into physical prototypes.",
      tools: ["Precision Cutting Tools", "Engineering Rulers", "Technical Cardboard", "CAD Software", "Mathematical Analysis"],
      timeline: "3 weeks",
      learnings: "Advanced spatial reasoning, mechanical system integration, precision engineering tolerances, and innovative material application",
      category: "Mechanical Systems",
      difficulty: "Advanced",
      status: "Completed"
    },
    {
      id: 2,
      title: "Rubber Band Crossbow",
      description: "A precision-engineered projectile system utilizing elastic potential energy and mechanical advantage principles with focus on accuracy and safety considerations.",
      image: "/images/diy crossbow.jpg",
      details: "This project applies physics and engineering principles to create a functional projectile system. Features include adjustable draw weight, precision sighting mechanisms, and optimized launch mechanics. The design process included force analysis calculations, projectile motion modeling, and iterative testing for performance optimization while maintaining safety standards.",
      tools: ["Hardwood Materials", "Precision Tools", "Physics Calculations", "Safety Testing Equipment"],
      timeline: "2 weeks",
      learnings: "Applied physics in engineering design, elastic energy systems, mechanical advantage principles, and safety-focused engineering",
      category: "Physics Application",
      difficulty: "Intermediate",
      status: "Completed"
    },
    {
      id: 3,
      title: "Modular Cardboard Armor",
      description: "A wearable protection system demonstrating structural engineering principles, ergonomic design considerations, and advanced material stress distribution analysis.",
      image: "/images/Modular Cardboard Armor.jpg",
      details: "This comprehensive design project encompasses the complete engineering process from initial concept to functional prototype. The system considers weight distribution, joint mobility, protection coverage, and manufacturing constraints. Each component is engineered for optimal protection while maintaining user comfort and range of motion, demonstrating human-centered design principles.",
      tools: ["Structural Materials", "CAD Design Software", "Ergonomic Analysis", "Stress Testing Methods"],
      timeline: "4 weeks",
      learnings: "Human-centered design, structural load distribution, manufacturing optimization, and systems integration",
      category: "Structural Engineering",
      difficulty: "Expert",
      status: "Completed"
    },
    {
      id: 4,
      title: "Precision Textile Engineering",
      description: "Custom garment construction demonstrating textile engineering principles, precision manufacturing techniques, and material stress point analysis.",
      image: "/images/Jeans Zipper.webp",
      details: "This project explores the intersection of engineering principles and textile manufacturing. Features precision-sewn construction with reinforced stress points, custom fitting methodology, and durability optimization. The project demonstrates understanding of material properties, manufacturing processes, and quality control standards in textile engineering applications.",
      tools: ["Industrial Equipment", "Quality Materials", "Pattern Design Software", "Stress Analysis"],
      timeline: "1 week",
      learnings: "Textile engineering principles, manufacturing efficiency, quality control processes, and material science applications",
      category: "Materials Engineering",
      difficulty: "Intermediate",
      status: "Completed"
    },
    {
      id: 5,
      title: "Mechanical Pencil Dispenser",
      description: "An automated dispensing mechanism demonstrating mechanical engineering principles including gear ratios, spring mechanics, and user interface design.",
      image: "/images/Pencil Dispenser DIY.jpg",
      details: "This project focuses on creating a reliable dispensing mechanism for mechanical pencils in an educational environment. The design incorporates gear reduction systems, spring-loaded mechanisms, and ergonomic considerations. The project required analysis of mechanical advantage, force distribution, and user interaction patterns to create an efficient and reliable system.",
      tools: ["3D Printing", "Mechanical Components", "Spring Analysis", "Ergonomic Testing"],
      timeline: "2 weeks",
      learnings: "Mechanical advantage systems, user interface design, reliability engineering, and iterative prototyping",
      category: "Mechanical Design",
      difficulty: "Intermediate",
      status: "Completed"
    },
    {
      id: 6,
      title: "Solar Panel Tracking System",
      description: "A dual-axis solar tracking mechanism optimizing energy collection through automated positioning and real-time solar tracking algorithms.",
      image: "/images/Solar Tracker DIY.webp",
      details: "This project combines mechanical engineering with renewable energy optimization. The system uses servo motors and sensor feedback to continuously orient solar panels toward maximum sunlight exposure. The design process involved calculations for torque requirements, gear ratios, and control system integration while considering weather resistance and reliability factors.",
      tools: ["Servo Motors", "Light Sensors", "Control Systems", "CAD Design", "Energy Analysis"],
      timeline: "5 weeks",
      learnings: "Control systems integration, renewable energy optimization, sensor feedback loops, and sustainable engineering practices",
      category: "Renewable Energy",
      difficulty: "Advanced",
      status: "Completed"
    },
    {
      id: 7,
      title: "Hydraulic Press Demonstrator",
      description: "A scaled hydraulic press system demonstrating Pascal's principle, force multiplication, and hydraulic engineering fundamentals in mechanical applications.",
      image: "/images/DIY Hydraulic Press.jpg",
      details: "This educational demonstration tool illustrates fundamental hydraulic principles through hands-on engineering. The project required careful analysis of pressure systems, force calculations, and safety considerations. The design incorporates clear visual elements to demonstrate force multiplication while maintaining safe operating parameters for educational use.",
      tools: ["Hydraulic Components", "Pressure Analysis", "Safety Systems", "Educational Design"],
      timeline: "3 weeks",
      learnings: "Hydraulic system design, pressure calculations, safety engineering, and educational tool development",
      category: "Fluid Mechanics",
      difficulty: "Advanced",
      status: "Completed"
    },
    {
      id: 8,
      title: "Precision Balance Scale",
      description: "A mechanical balance system demonstrating precision measurement principles, calibration techniques, and mechanical sensitivity optimization.",
      image: "/images/DIY Balance Scale.jpg",
      details: "This project focuses on creating a highly sensitive mechanical balance capable of precise measurements. The design required analysis of lever mechanics, friction reduction, and calibration methodologies. Special attention was given to minimizing environmental factors and optimizing mechanical sensitivity while maintaining structural stability.",
      tools: ["Precision Machining", "Calibration Weights", "Friction Analysis", "Sensitivity Testing"],
      timeline: "4 weeks",
      learnings: "Precision engineering, calibration techniques, mechanical sensitivity, and measurement system design",
      category: "Precision Instruments",
      difficulty: "Expert",
      status: "Completed"
    }
  ],
  stats: {
    projectsCompleted: 18,
    hoursEngineering: 312,
    materialsUsed: 12,
    problemsSolved: 47
  }
}

// Application state
let currentView = 'projects'
let isDarkMode = true
let currentFilter = 'All'

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

// Project filtering functionality
const filterProjects = (category) => {
  currentFilter = category
  const projectCards = document.querySelectorAll('.project-card')
  const filterButtons = document.querySelectorAll('.filter-btn')
  
  // Update active filter button
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category)
  })
  
  // Filter project cards with faster animation
  projectCards.forEach(card => {
    card.classList.add('filtering')
    const projectCategory = card.dataset.category || 'All'
    
    if (category === 'All' || projectCategory === category) {
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
  loading.classList.remove('hidden')
}

// Hide loading indicator
const hideLoading = () => {
  const loading = document.getElementById('loading-indicator')
  loading.classList.add('hidden')
}

// Theme toggle functionality
const toggleTheme = () => {
  isDarkMode = !isDarkMode
  document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  
  // Update the icon
  const themeIcon = document.querySelector('.theme-icon')
  if (themeIcon) {
    themeIcon.innerHTML = isDarkMode ? 
      '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/></svg>' : 
      '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/></svg>'
  }
}

// Header component with skip link and mobile-friendly footer
const renderHeader = () => {
  const lightIcon = '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/></svg>'
  const darkIcon = '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/></svg>'
  
  return `
    <a href="#main-content" class="skip-link">Skip to main content</a>
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

// Navigation handler with faster loading states
const handleNavigation = (view) => {
  if (view === currentView) return
  
  showLoading()
  
  setTimeout(() => {
    currentView = view
    renderApp()
    hideLoading()
    
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
  }, 100) // Faster loading transition
}

// Project interactions
const handleProjectClick = (projectId) => {
  const project = portfolioData.projects.find(p => p.id === parseInt(projectId))
  if (project) {
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

// Contact form validation
const validateContactForm = (data) => {
  const errors = []
  
  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }
  if (data.name && data.name.length > 100) {
    errors.push('Name must be less than 100 characters')
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Please enter a valid email address')
  }
  if (data.email && data.email.length > 254) {
    errors.push('Email address is too long')
  }
  
  // Subject validation
  if (!data.subject || data.subject.trim().length < 3) {
    errors.push('Subject must be at least 3 characters long')
  }
  if (data.subject && data.subject.length > 200) {
    errors.push('Subject must be less than 200 characters')
  }
  
  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long')
  }
  if (data.message && data.message.length > 2000) {
    errors.push('Message must be less than 2000 characters')
  }
  
  // Check for potential spam patterns
  const spamPatterns = [
    /(?:https?:\/\/|www\.)[^\s]+/gi, // URLs
    /\b(?:buy|sell|money|free|click|offer|deal|limited|urgent)\b/gi, // Spam keywords
    /(.)\1{4,}/gi, // Repeated characters (aaaaa)
  ]
  
  const allText = (data.name + ' ' + data.subject + ' ' + data.message).toLowerCase()
  spamPatterns.forEach(pattern => {
    if (pattern.test(allText)) {
      errors.push('Message appears to contain inappropriate content')
    }
  })
  
  return errors
}

// Backend API simulation (placeholder for future implementation)
const submitContactForm = async (data) => {
  // TODO: Replace with actual backend endpoint
  // This is a placeholder structure for when you add a real backend
  
  try {
    // Simulate API call
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject.trim(),
        message: data.message.trim(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    return { success: true, data: result }
    
  } catch (error) {
    // For now, log the submission data (in production, this would go to your backend)
    console.log('Contact Form Submission:', {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      timestamp: new Date().toISOString(),
      status: 'pending_backend_implementation'
    })
    
    // Simulate successful submission for demo purposes
    return { success: true, message: 'Form submitted successfully (demo mode)' }
  }
}

// Enhanced contact form handler
const handleContactForm = async (e) => {
  e.preventDefault()
  
  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)
  
  // Validate form data
  const validationErrors = validateContactForm(data)
  if (validationErrors.length > 0) {
    showFormErrors(validationErrors)
    return
  }
  
  const btn = e.target.querySelector('.btn')
  const originalText = btn.innerHTML
  
  // Show loading state
  btn.innerHTML = '<span>Sending...</span>'
  btn.disabled = true
  clearFormErrors()
  
  try {
    // Submit form data
    const result = await submitContactForm(data)
    
    if (result.success) {
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

// Make toggleTheme available globally
window.toggleTheme = toggleTheme

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
  
  // Project filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = e.target.dataset.category
      filterProjects(category)
    })
  })
  
  // Contact form
  const contactForm = document.getElementById('contact-form')
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm)
  }
  
  // Scroll to top button
  const scrollButton = document.getElementById('scroll-to-top')
  if (scrollButton) {
    scrollButton.addEventListener('click', scrollToTop)
  }
}

// Initialize the application with enhanced features
const init = () => {
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
  
  console.log('Jose Rodriguez Engineering Portfolio')
  console.log('System initialized successfully')
  if (!isMobile()) {
    console.log('Keyboard shortcuts available: Ctrl+1, Ctrl+2, Ctrl+3, Ctrl+\\')
  }
}

// Start the application
init()
