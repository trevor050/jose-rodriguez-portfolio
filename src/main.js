import './style.css'

// Portfolio data
const portfolioData = {
  projects: [
    {
      id: 1,
      title: "Cardboard 4-Cylinder Engine",
      description: "A functional 4-cylinder engine model built entirely from cardboard, demonstrating understanding of internal combustion principles and mechanical design.",
      image: "/images/cardboard-engine.jpg",
      details: "This project showcases precision cutting, assembly techniques, and mechanical engineering concepts. Built over 3 weeks using only cardboard, glue, and creativity.",
      tools: ["X-Acto Knife", "Ruler", "Cardboard", "Engineering Drawings"],
      timeline: "3 weeks",
      learnings: "Improved spatial reasoning and understanding of engine mechanics"
    },
    {
      id: 2,
      title: "Rubber Band Crossbow",
      description: "A precision-engineered crossbow using rubber band propulsion, showcasing mechanical advantage and projectile physics.",
      image: "/images/crossbow.jpg",
      details: "Designed with focus on accuracy and power efficiency. Features adjustable tension and precise aiming mechanism.",
      tools: ["Wood", "Rubber Bands", "Basic Tools", "Physics Calculations"],
      timeline: "2 weeks",
      learnings: "Applied physics principles and improved woodworking skills"
    },
    {
      id: 3,
      title: "Cardboard Armor",
      description: "Wearable armor set constructed from cardboard, demonstrating structural engineering and ergonomic design principles.",
      image: "/images/cardboard-armor.jpg",
      details: "Full-body armor design considering weight distribution, flexibility, and protection. Includes helmet, chest piece, and limb guards.",
      tools: ["Cardboard", "Design Software", "Measuring Tools"],
      timeline: "4 weeks",
      learnings: "Understanding of human ergonomics and structural design"
    },
    {
      id: 4,
      title: "Jeans Sewing Project",
      description: "Custom-tailored jeans showcasing precision in textile engineering and understanding of garment construction.",
      image: "/images/jeans-project.jpg",
      details: "Hand-sewn denim jeans with custom fit and reinforced stress points. Demonstrates attention to detail and craftsmanship.",
      tools: ["Sewing Machine", "Denim", "Pattern Making", "Measuring"],
      timeline: "1 week",
      learnings: "Textile engineering and precision manufacturing techniques"
    }
  ]
}

// Application state
let currentView = 'projects'

// DOM manipulation utilities
const createElement = (tag, className = '', content = '') => {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (content) element.innerHTML = content
  return element
}

// Render header section
const renderHeader = () => {
  return `
    <header class="header">
      <div class="container">
        <h1>Jose Rodriguez</h1>
        <p class="subtitle">Aspiring Mechanical Engineer</p>
        <p class="tagline">Building real-world mechanisms from cardboard, code, and curiosity</p>
        <nav class="nav">
          <a href="#" class="nav-item ${currentView === 'projects' ? 'active' : ''}" data-view="projects">Projects</a>
          <a href="#" class="nav-item ${currentView === 'about' ? 'active' : ''}" data-view="about">About Me</a>
          <a href="#" class="nav-item ${currentView === 'contact' ? 'active' : ''}" data-view="contact">Contact</a>
        </nav>
      </div>
    </header>
  `
}

// Render project card
const renderProjectCard = (project) => {
  return `
    <div class="project-card" data-project-id="${project.id}">
      <img src="${project.image}" alt="${project.title}" class="project-image" onerror="this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.color='white'; this.style.fontSize='0.9rem'; this.innerHTML='📷 ${project.title}'" />
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
      </div>
    </div>
  `
}

// Render projects section
const renderProjects = () => {
  return `
    <div class="container">
      <div class="projects-grid fade-in">
        ${portfolioData.projects.map(renderProjectCard).join('')}
      </div>
    </div>
  `
}

// Render about section
const renderAbout = () => {
  return `
    <div class="container">
      <div class="section fade-in">
        <h2>About Me</h2>
        <p>Hi! I'm Jose Rodriguez, an aspiring mechanical engineer with a passion for bringing ideas to life through creative engineering and hands-on building.</p>
        
        <p>My journey started with simple curiosity about how things work, which evolved into a love for creating functional mechanisms from unconventional materials. Whether it's cardboard, wood, or fabric, I believe that great engineering begins with understanding fundamental principles and applying them creatively.</p>
        
        <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--text-primary);">What Drives Me</h3>
        <p>I'm fascinated by the intersection of theoretical engineering knowledge and practical problem-solving. Each project I undertake teaches me something new about materials, mechanics, and the creative process.</p>
        
        <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--text-primary);">Career Goals</h3>
        <p>I'm working towards a degree in Mechanical Engineering with the goal of specializing in product design and development. I want to create solutions that are both innovative and accessible, whether that's improving everyday objects or developing new technologies.</p>
        
        <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--text-primary);">Fun Facts</h3>
        <ul style="color: var(--text-secondary); margin-left: 1.5rem;">
          <li>I can build a functional engine model in under a week</li>
          <li>My workspace is 70% cardboard scraps and 30% actual tools</li>
          <li>I believe duct tape is the ultimate engineering solution</li>
          <li>I've never met a mechanical problem I couldn't solve with cardboard first</li>
        </ul>
      </div>
    </div>
  `
}

// Render contact section
const renderContact = () => {
  return `
    <div class="container">
      <div class="section fade-in">
        <h2>Get In Touch</h2>
        <p>I'd love to hear from you! Whether you have questions about my projects, want to collaborate, or just want to chat about engineering, feel free to reach out.</p>
        
        <form class="contact-form" id="contact-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject" required>
          </div>
          
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" required placeholder="Tell me about your project ideas, questions, or just say hello!"></textarea>
          </div>
          
          <button type="submit" class="btn">
            <span>Send Message</span>
            <span>📧</span>
          </button>
        </form>
        
        <div style="margin-top: 2rem; text-align: center; color: var(--text-secondary);">
          <p>Or connect with me directly:</p>
          <div style="margin-top: 1rem;">
            <a href="mailto:jose.rodriguez@email.com" style="color: var(--primary-color); text-decoration: none; margin: 0 1rem;">📧 Email</a>
            <a href="https://linkedin.com/in/joserodriguez" style="color: var(--primary-color); text-decoration: none; margin: 0 1rem;">💼 LinkedIn</a>
            <a href="https://github.com/joserodriguez" style="color: var(--primary-color); text-decoration: none; margin: 0 1rem;">🐙 GitHub</a>
          </div>
        </div>
      </div>
    </div>
  `
}

// Render project modal
const renderProjectModal = (project) => {
  return `
    <div class="modal-overlay" id="project-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>${project.title}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <img src="${project.image}" alt="${project.title}" class="modal-image" onerror="this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.color='white'; this.innerHTML='📷 ${project.title}'" />
          <div class="modal-details">
            <p class="project-description">${project.details}</p>
            
            <div class="project-meta">
              <div class="meta-item">
                <strong>Tools Used:</strong>
                <span>${project.tools.join(', ')}</span>
              </div>
              <div class="meta-item">
                <strong>Timeline:</strong>
                <span>${project.timeline}</span>
              </div>
              <div class="meta-item">
                <strong>Key Learnings:</strong>
                <span>${project.learnings}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// Modal styles (add to CSS dynamically)
const addModalStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    
    .modal-content {
      background: var(--background);
      border-radius: var(--radius-lg);
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    
    .modal-header h2 {
      margin: 0;
      color: var(--text-primary);
    }
    
    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: var(--radius);
      transition: all 0.2s ease;
    }
    
    .modal-close:hover {
      background: var(--border);
      color: var(--text-primary);
    }
    
    .modal-body {
      padding: 1.5rem;
    }
    
    .modal-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: var(--radius);
      margin-bottom: 1.5rem;
      background: #f8fafc;
    }
    
    .project-meta {
      margin-top: 1.5rem;
    }
    
    .meta-item {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }
    
    .meta-item:last-child {
      border-bottom: none;
    }
    
    .meta-item strong {
      display: block;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    
    .meta-item span {
      color: var(--text-secondary);
    }
  `
  document.head.appendChild(style)
}

// Navigation handler
const handleNavigation = (view) => {
  currentView = view
  renderApp()
}

// Project card click handler
const handleProjectClick = (projectId) => {
  const project = portfolioData.projects.find(p => p.id === parseInt(projectId))
  if (project) {
    showProjectModal(project)
  }
}

// Show project modal
const showProjectModal = (project) => {
  const modalHTML = renderProjectModal(project)
  document.body.insertAdjacentHTML('beforeend', modalHTML)
  
  // Add event listeners
  const modal = document.getElementById('project-modal')
  const closeBtn = modal.querySelector('.modal-close')
  
  closeBtn.addEventListener('click', closeProjectModal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProjectModal()
  })
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden'
}

// Close project modal
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
  
  // Simulate form submission
  const btn = e.target.querySelector('.btn')
  const originalText = btn.innerHTML
  
  btn.innerHTML = '<span>Sending...</span> <span>⏳</span>'
  btn.disabled = true
  
  setTimeout(() => {
    btn.innerHTML = '<span>Message Sent!</span> <span>✅</span>'
    btn.style.background = 'var(--accent-color)'
    
    setTimeout(() => {
      btn.innerHTML = originalText
      btn.disabled = false
      btn.style.background = 'var(--primary-color)'
      e.target.reset()
    }, 2000)
  }, 1000)
  
  console.log('Contact form submitted:', data)
}

// Main render function
const renderApp = () => {
  const app = document.querySelector('#app')
  
  let content = ''
  switch (currentView) {
    case 'projects':
      content = renderProjects()
      break
    case 'about':
      content = renderAbout()
      break
    case 'contact':
      content = renderContact()
      break
  }
  
  app.innerHTML = renderHeader() + content + `
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 Jose Rodriguez. Built with passion and cardboard. 📦</p>
      </div>
    </footer>
  `
  
  // Add event listeners
  addEventListeners()
}

// Add event listeners
const addEventListeners = () => {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      const view = e.target.dataset.view
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
  addModalStyles()
  renderApp()
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal()
    }
  })
}

// Start the application
init()
