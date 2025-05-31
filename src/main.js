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

// Header component
const renderHeader = () => {
  const lightIcon = '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/></svg>'
  const darkIcon = '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/></svg>'
  
  return `
    <header class="header">
      <div class="container">
        <div class="header-top">
          <h1>Jose Rodriguez</h1>
          <button class="theme-toggle" onclick="toggleTheme()" title="Toggle theme">
            <span class="theme-icon">${isDarkMode ? lightIcon : darkIcon}</span>
          </button>
        </div>
        <p class="subtitle">Aspiring Mechanical Engineer</p>
        <p class="tagline">Dedicated to solving complex engineering challenges through innovative design, precise execution, and creative problem-solving.</p>
        <nav class="nav">
          <a href="#" class="nav-item ${currentView === 'projects' ? 'active' : ''}" data-view="projects">
            <span>Projects</span>
          </a>
          <a href="#" class="nav-item ${currentView === 'about' ? 'active' : ''}" data-view="about">
            <span>About</span>
          </a>
          <a href="#" class="nav-item ${currentView === 'contact' ? 'active' : ''}" data-view="contact">
            <span>Contact</span>
          </a>
        </nav>
      </div>
    </header>
  `
}

// Navigation handler
const handleNavigation = (view) => {
  currentView = view
  renderApp()
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

// Contact form handler
const handleContactForm = (e) => {
  e.preventDefault()
  
  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)
  
  const btn = e.target.querySelector('.btn')
  const originalText = btn.innerHTML
  
  btn.innerHTML = '<span>Sending...</span>'
  btn.disabled = true
  
  setTimeout(() => {
    btn.innerHTML = '<span>Message Sent Successfully</span>'
    btn.style.background = 'var(--accent)'
    
    setTimeout(() => {
      btn.innerHTML = originalText
      btn.disabled = false
      btn.style.background = 'var(--primary)'
      e.target.reset()
    }, 2500)
  }, 1200)
  
  console.log('Contact form submission:', data)
}

// Make toggleTheme available globally
window.toggleTheme = toggleTheme

// Main render function
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
  
  app.innerHTML = renderHeader() + content + `
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 Jose Rodriguez Engineering Portfolio | Built with precision and passion for mechanical engineering</p>
      </div>
    </footer>
  `
  
  addEventListeners()
}

// Event listeners
const addEventListeners = () => {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      const view = e.target.closest('.nav-item').dataset.view
      handleNavigation(view)
    })
  })
  
  // Project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const projectId = e.currentTarget.dataset.projectId
      handleProjectClick(projectId)
    })
  })
  
  // Contact form
  const contactForm = document.getElementById('contact-form')
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm)
  }
}

// Initialize the application
const init = () => {
  // Set initial theme from localStorage
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode = savedTheme === 'dark'
  }
  document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  
  renderApp()
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal()
    }
  })
  
  console.log('Jose Rodriguez Engineering Portfolio')
  console.log('System initialized successfully')
}

// Start the application
init()
