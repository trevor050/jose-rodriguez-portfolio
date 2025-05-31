import './style.css'

// Portfolio data with personality and engineering focus
const portfolioData = {
  projects: [
    {
      id: 1,
      title: "Cardboard 4-Cylinder Engine",
      description: "A fully functional 4-cylinder engine replica built entirely from cardboard. Demonstrates deep understanding of internal combustion mechanics, precision assembly, and innovative material application.",
      image: "/assets/images/cardboard-engine.jpg",
      details: "This project pushed the boundaries of what's possible with unconventional materials. Built over 3 intense weeks, this engine model features working pistons, accurate cylinder timing, and demonstrates my passion for mechanical systems. Every component was hand-crafted and precisely measured to ensure authentic engine operation principles.",
      tools: ["X-Acto Knife", "Precision Ruler", "High-Grade Cardboard", "Engineering CAD Software", "Mathematical Calculations"],
      timeline: "3 weeks of focused engineering",
      learnings: "Advanced spatial reasoning, mechanical system integration, and the importance of precision in engineering tolerances",
      category: "Mechanical Systems",
      difficulty: "Advanced",
      status: "🔥 Showcase Ready"
    },
    {
      id: 2,
      title: "Rubber Band Crossbow",
      description: "A precision-engineered projectile system utilizing elastic potential energy and mechanical advantage principles. Features adjustable tension mechanics and aerodynamic considerations.",
      image: "/assets/images/crossbow.jpg",
      details: "This isn't just a toy - it's a study in physics and engineering. Designed with focus on accuracy, power efficiency, and safety. Features include adjustable draw weight, precision sighting system, and optimized launch mechanics. Applied real engineering principles including force analysis and projectile motion calculations.",
      tools: ["Hardwood Components", "High-Tension Rubber Bands", "Precision Tools", "Physics Simulation Software"],
      timeline: "2 weeks of iterative design",
      learnings: "Applied physics in real-world applications, understanding of elastic energy storage, and mechanical advantage systems",
      category: "Physics Application",
      difficulty: "Intermediate",
      status: "⚡ Performance Tested"
    },
    {
      id: 3,
      title: "Tactical Cardboard Armor",
      description: "A wearable protection system showcasing structural engineering principles, ergonomic design, and advanced material stress distribution across complex geometric forms.",
      image: "/assets/images/cardboard-armor.jpg",
      details: "This full-body armor system represents a complete engineering design process from concept to wearable prototype. Considered weight distribution, joint mobility, protection coverage, and manufacturing constraints. Each piece is engineered for maximum protection while maintaining wearer comfort and mobility.",
      tools: ["Structural Cardboard", "CAD Design Software", "Ergonomic Analysis Tools", "Stress Testing Equipment"],
      timeline: "4 weeks of design iteration",
      learnings: "Human-centered design, structural load distribution, manufacturing process optimization, and wearable technology integration",
      category: "Structural Engineering",
      difficulty: "Expert",
      status: "🛡️ Battle Tested"
    },
    {
      id: 4,
      title: "Precision Denim Engineering",
      description: "Custom-tailored jeans demonstrating textile engineering principles, precision manufacturing techniques, and understanding of material stress points in wearable design.",
      image: "/assets/images/jeans-project.jpg",
      details: "This project explores the intersection of engineering and fashion. Hand-sewn with reinforced stress points, custom fit algorithms, and durability testing. Every seam is engineered for maximum longevity while maintaining comfort and style. Demonstrates understanding of textile mechanics and manufacturing processes.",
      tools: ["Industrial Sewing Machine", "High-Quality Denim", "Pattern Design Software", "Stress Analysis"],
      timeline: "1 week of intensive production",
      learnings: "Textile engineering principles, manufacturing efficiency, quality control processes, and material science applications",
      category: "Materials Engineering",
      difficulty: "Intermediate",
      status: "👔 Production Ready"
    }
  ],
  stats: {
    projectsCompleted: 12,
    hoursEngineering: 247,
    materialsUsed: 8,
    problemsSolved: 34
  }
}

// Application state
let currentView = 'projects'

// Engineering status system
const engineeringStatus = [
  { text: "System Online", indicator: "online" },
  { text: "Currently Building", indicator: "building" },
  { text: "Designing Next Project", indicator: "designing" }
]

// DOM manipulation utilities
const createElement = (tag, className = '', content = '') => {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (content) element.innerHTML = content
  return element
}

// Render status bar
const renderStatusBar = () => {
  return `
    <div class="status-bar">
      ${engineeringStatus.map(status => `
        <div class="status-item">
          <div class="status-indicator ${status.indicator}"></div>
          <span>${status.text}</span>
        </div>
      `).join('')}
    </div>
  `
}

// Render header section with engineering personality
const renderHeader = () => {
  return `
    <header class="header">
      <div class="container">
        <h1>Jose Rodriguez</h1>
        <p class="subtitle">Future Mechanical Engineer</p>
        <p class="tagline">Transforming cardboard dreams into engineering reality. Building the impossible, one project at a time.</p>
        ${renderStatusBar()}
        <nav class="nav">
          <a href="#" class="nav-item ${currentView === 'projects' ? 'active' : ''}" data-view="projects">⚙️ Projects</a>
          <a href="#" class="nav-item ${currentView === 'about' ? 'active' : ''}" data-view="about">🔬 About</a>
          <a href="#" class="nav-item ${currentView === 'contact' ? 'active' : ''}" data-view="contact">📡 Contact</a>
        </nav>
      </div>
    </header>
  `
}

// Render project card with engineering flair
const renderProjectCard = (project) => {
  return `
    <div class="project-card" data-project-id="${project.id}">
      <img src="${project.image}" alt="${project.title}" class="project-image" onerror="this.style.background='linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.color='white'; this.style.fontSize='2rem'; this.innerHTML='⚙️'" />
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; color: var(--secondary);">
          <span>${project.category}</span>
          <span>${project.status}</span>
        </div>
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

// Render about section with college-appropriate personality
const renderAbout = () => {
  return `
    <div class="container">
      <div class="section fade-in">
        <h2>Mission Statement</h2>
        <p>I'm Jose Rodriguez, a passionate high school junior with an unrelenting drive to solve complex problems through mechanical engineering. My journey isn't just about building things—it's about pushing the boundaries of what's possible with creativity, determination, and a deep understanding of engineering principles.</p>
        
        <p>What sets me apart isn't just my technical skills, but my ability to see engineering potential in everyday materials. When most people see cardboard, I see structural possibilities. When others see constraints, I see design challenges waiting to be conquered.</p>
        
        <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--secondary);">🎯 Engineering Philosophy</h3>
        <p>Great engineering starts with curiosity and is refined through relentless iteration. I believe in:</p>
        <ul style="color: var(--gray-light); margin-left: 2rem; margin-top: 1rem;">
          <li><strong>Innovation through Constraints:</strong> Limited resources spark unlimited creativity</li>
          <li><strong>Precision in Execution:</strong> Every measurement matters, every detail counts</li>
          <li><strong>Real-World Application:</strong> Theory means nothing without practical implementation</li>
          <li><strong>Continuous Learning:</strong> Every project teaches something new</li>
        </ul>
        
        <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--secondary);">🔬 Technical Arsenal</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="padding: 1rem; background: rgba(42, 42, 42, 0.5); border-radius: 12px; border-left: 4px solid var(--accent);">
            <strong style="color: var(--light);">CAD & Design</strong><br>
            <span style="color: var(--gray-light);">SolidWorks, Fusion 360, Engineering Drawings</span>
          </div>
          <div style="padding: 1rem; background: rgba(42, 42, 42, 0.5); border-radius: 12px; border-left: 4px solid var(--primary);">
            <strong style="color: var(--light);">Manufacturing</strong><br>
            <span style="color: var(--gray-light);">Precision Assembly, Material Analysis, Quality Control</span>
          </div>
          <div style="padding: 1rem; background: rgba(42, 42, 42, 0.5); border-radius: 12px; border-left: 4px solid var(--secondary);">
            <strong style="color: var(--light);">Problem Solving</strong><br>
            <span style="color: var(--gray-light);">Systems Thinking, Root Cause Analysis, Innovation</span>
          </div>
        </div>
        
        <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--secondary);">🚀 College & Career Vision</h3>
        <p>I'm actively preparing for mechanical engineering programs where I can expand my hands-on experience with advanced materials, precision manufacturing, and complex system design. My goal is to specialize in product development and innovation, creating solutions that bridge theoretical engineering with real-world impact.</p>
        
        <p>I'm particularly interested in programs that emphasize:</p>
        <ul style="color: var(--gray-light); margin-left: 2rem;">
          <li>Design and prototyping laboratories</li>
          <li>Advanced materials science</li>
          <li>Manufacturing engineering</li>
          <li>Product development and innovation</li>
          <li>Sustainable engineering practices</li>
        </ul>
        
        <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--secondary);">📊 Engineering Stats</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="text-align: center; padding: 1rem; background: rgba(255, 107, 53, 0.1); border-radius: 12px;">
            <div style="font-size: 2rem; font-weight: bold; color: var(--primary);">${portfolioData.stats.projectsCompleted}+</div>
            <div style="color: var(--gray-light);">Projects Completed</div>
          </div>
          <div style="text-align: center; padding: 1rem; background: rgba(0, 212, 255, 0.1); border-radius: 12px;">
            <div style="font-size: 2rem; font-weight: bold; color: var(--secondary);">${portfolioData.stats.hoursEngineering}+</div>
            <div style="color: var(--gray-light);">Engineering Hours</div>
          </div>
          <div style="text-align: center; padding: 1rem; background: rgba(57, 255, 20, 0.1); border-radius: 12px;">
            <div style="font-size: 2rem; font-weight: bold; color: var(--accent);">${portfolioData.stats.materialsUsed}+</div>
            <div style="color: var(--gray-light);">Materials Mastered</div>
          </div>
          <div style="text-align: center; padding: 1rem; background: rgba(255, 255, 0, 0.1); border-radius: 12px;">
            <div style="font-size: 2rem; font-weight: bold; color: var(--yellow);">${portfolioData.stats.problemsSolved}+</div>
            <div style="color: var(--gray-light);">Problems Solved</div>
          </div>
        </div>
      </div>
    </div>
  `
}

// Render contact section
const renderContact = () => {
  return `
    <div class="container">
      <div class="section fade-in">
        <h2>Engineering Communications</h2>
        <p>Ready to discuss engineering challenges, collaboration opportunities, or just connect with a fellow problem-solver? I'm always excited to talk about innovative projects and future possibilities.</p>
        
        <form class="contact-form" id="contact-form">
          <div class="form-group">
            <label for="name">Identification</label>
            <input type="text" id="name" name="name" required placeholder="Your name">
          </div>
          
          <div class="form-group">
            <label for="email">Communication Channel</label>
            <input type="email" id="email" name="email" required placeholder="your.email@domain.com">
          </div>
          
          <div class="form-group">
            <label for="subject">Mission Objective</label>
            <input type="text" id="subject" name="subject" required placeholder="What's this about?">
          </div>
          
          <div class="form-group">
            <label for="message">Detailed Specifications</label>
            <textarea id="message" name="message" required placeholder="Tell me about your project ideas, engineering challenges, collaboration opportunities, or just say hello! I'm always excited to discuss innovative solutions and creative problem-solving."></textarea>
          </div>
          
          <button type="submit" class="btn">
            <span>Transmit Message</span>
            <span>🚀</span>
          </button>
        </form>
        
        <div style="margin-top: 3rem; text-align: center; color: var(--gray-light);">
          <p style="margin-bottom: 1.5rem;">Or connect through these channels:</p>
          <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
            <a href="mailto:jose.rodriguez.engineer@gmail.com" style="color: var(--primary); text-decoration: none; padding: 0.8rem 1.5rem; background: rgba(255, 107, 53, 0.1); border-radius: 8px; border: 1px solid var(--primary);">📧 Email</a>
            <a href="https://linkedin.com/in/jose-rodriguez-engineer" style="color: var(--secondary); text-decoration: none; padding: 0.8rem 1.5rem; background: rgba(0, 212, 255, 0.1); border-radius: 8px; border: 1px solid var(--secondary);">💼 LinkedIn</a>
            <a href="https://github.com/jose-engineer" style="color: var(--accent); text-decoration: none; padding: 0.8rem 1.5rem; background: rgba(57, 255, 20, 0.1); border-radius: 8px; border: 1px solid var(--accent);">⚡ GitHub</a>
          </div>
        </div>
      </div>
    </div>
  `
}

// Render project modal with enhanced details
const renderProjectModal = (project) => {
  return `
    <div class="modal-overlay" id="project-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>${project.title}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <img src="${project.image}" alt="${project.title}" class="modal-image" onerror="this.style.background='linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.color='white'; this.style.fontSize='3rem'; this.innerHTML='⚙️'" />
          <div class="modal-details">
            <p style="color: var(--gray-light); font-size: 1.1rem; line-height: 1.7; margin-bottom: 2rem;">${project.details}</p>
            
            <div class="project-meta">
              <div class="meta-item">
                <strong>🛠️ Engineering Tools</strong>
                <span>${project.tools.join(' • ')}</span>
              </div>
              <div class="meta-item">
                <strong>⏱️ Development Timeline</strong>
                <span>${project.timeline}</span>
              </div>
              <div class="meta-item">
                <strong>🎯 Engineering Category</strong>
                <span>${project.category}</span>
              </div>
              <div class="meta-item">
                <strong>📈 Difficulty Level</strong>
                <span>${project.difficulty}</span>
              </div>
              <div class="meta-item">
                <strong>🧠 Key Engineering Insights</strong>
                <span>${project.learnings}</span>
              </div>
              <div class="meta-item">
                <strong>📊 Project Status</strong>
                <span>${project.status}</span>
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
  // Styles are now in CSS file
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

// Contact form handler with personality
const handleContactForm = (e) => {
  e.preventDefault()
  
  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)
  
  // Simulate form submission with engineering flair
  const btn = e.target.querySelector('.btn')
  const originalText = btn.innerHTML
  
  btn.innerHTML = '<span>Transmitting...</span> <span>📡</span>'
  btn.disabled = true
  
  setTimeout(() => {
    btn.innerHTML = '<span>Message Deployed!</span> <span>✅</span>'
    btn.style.background = 'linear-gradient(135deg, var(--accent), #2dd428)'
    
    setTimeout(() => {
      btn.innerHTML = originalText
      btn.disabled = false
      btn.style.background = 'linear-gradient(135deg, var(--primary), #ff8c42)'
      e.target.reset()
    }, 2500)
  }, 1200)
  
  console.log('Engineering communication received:', data)
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
        <p>SYSTEM STATUS: OPERATIONAL | Jose Rodriguez Engineering Portfolio v2.1 | Built with passion, precision, and a lot of cardboard 📦⚙️</p>
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
  
  // Add some engineering easter eggs
  console.log('🔧 ENGINEERING SYSTEM INITIALIZED')
  console.log('👨‍💻 Jose Rodriguez Portfolio v2.1')
  console.log('⚙️ All systems operational')
  console.log('🚀 Ready for college applications!')
}

// Start the application
init()
