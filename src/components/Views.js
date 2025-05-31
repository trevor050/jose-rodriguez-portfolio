import { renderProjectCard } from './ProjectCard.js'

// Get unique categories from projects
const getProjectCategories = (projects) => {
  const categories = projects.map(project => project.category)
  return ['All', ...new Set(categories)]
}

// Render projects section with filtering
export const renderProjects = (portfolioData) => {
  const categories = getProjectCategories(portfolioData.projects)
  
  return `
    <div class="container">
      <div class="project-filters fade-in-up">
        ${categories.map(category => 
          `<button class="filter-btn ${category === 'All' ? 'active' : ''}" data-category="${category}">
            ${category}
          </button>`
        ).join('')}
      </div>
      <div class="projects-grid fade-in-up">
        ${portfolioData.projects.map(renderProjectCard).join('')}
      </div>
    </div>
  `
}

// Enhanced about section with skills visualization
export const renderAbout = (portfolioData) => {
  const skills = [
    { name: 'CAD Design & 3D Modeling', level: 'Advanced', progress: 85 },
    { name: 'Mechanical Assembly', level: 'Expert', progress: 92 },
    { name: 'Problem Solving', level: 'Expert', progress: 95 },
    { name: 'Materials Science', level: 'Intermediate', progress: 75 },
    { name: 'Electronics Integration', level: 'Intermediate', progress: 70 },
    { name: 'Manufacturing Processes', level: 'Advanced', progress: 80 },
    { name: 'Technical Documentation', level: 'Advanced', progress: 88 },
    { name: 'Project Management', level: 'Intermediate', progress: 78 }
  ]

  return `
    <div class="container">
      <div class="section fade-in-up">
        <h2>Engineering Portfolio</h2>
        <p>I am Jose Rodriguez, a dedicated high school junior with a passion for mechanical engineering and a demonstrated commitment to innovative problem-solving. My work focuses on applying fundamental engineering principles to create functional solutions using both conventional and unconventional materials.</p>
        
        <p>My approach to engineering emphasizes precision, creativity, and practical application. I believe that understanding core principles enables innovative solutions, and I consistently challenge myself to push beyond traditional boundaries while maintaining engineering integrity and safety standards.</p>
        
        <h3>Engineering Philosophy</h3>
        <p>My engineering philosophy centers on several key principles:</p>
        <ul>
          <li><strong>Innovation through Constraint:</strong> Limited resources often lead to the most creative solutions</li>
          <li><strong>Precision in Execution:</strong> Accurate measurements and careful attention to detail are fundamental</li>
          <li><strong>Practical Application:</strong> Theoretical knowledge must translate into real-world functionality</li>
          <li><strong>Continuous Learning:</strong> Every project provides opportunities for skill development and knowledge expansion</li>
          <li><strong>Safety First:</strong> All designs prioritize user safety and responsible engineering practices</li>
        </ul>
        
        <h3>Technical Skills & Competencies</h3>
        <div class="skills-section">
          ${skills.map(skill => `
            <div class="skill-item fade-in-left">
              <div class="skill-header">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-level">${skill.level}</span>
              </div>
              <div class="skill-bar">
                <div class="skill-progress" data-progress="${skill.progress}" style="width: 0%"></div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <h3>Areas of Expertise</h3>
        <div class="skill-grid">
          <div class="skill-card fade-in-right">
            <strong>Design & Analysis</strong>
            <span>CAD Software, Engineering Drawings, Stress Analysis, Design Optimization, Parametric Modeling</span>
          </div>
          <div class="skill-card fade-in-right">
            <strong>Manufacturing & Assembly</strong>
            <span>Precision Assembly, Material Selection, Quality Control, Process Optimization, Tolerance Analysis</span>
          </div>
          <div class="skill-card fade-in-right">
            <strong>Systems Integration</strong>
            <span>Mechanical Systems, Electronics Integration, Control Systems, Sensor Integration, Automation</span>
          </div>
          <div class="skill-card fade-in-right">
            <strong>Project Leadership</strong>
            <span>Project Planning, Resource Management, Timeline Coordination, Documentation, Testing Protocols</span>
          </div>
        </div>
        
        <h3>Academic & Career Objectives</h3>
        <p>I am actively preparing for undergraduate mechanical engineering programs where I can expand my technical knowledge and hands-on experience. My goal is to specialize in product development and design engineering, creating solutions that bridge theoretical principles with practical applications.</p>
        
        <p>I am particularly interested in engineering programs that emphasize:</p>
        <ul>
          <li><strong>Hands-on Design:</strong> Prototyping laboratories and maker spaces for practical application</li>
          <li><strong>Advanced Materials:</strong> Exploring innovative materials and their engineering applications</li>
          <li><strong>Manufacturing Innovation:</strong> Modern manufacturing processes and automation technologies</li>
          <li><strong>Product Development:</strong> Complete design cycles from concept to market-ready products</li>
          <li><strong>Sustainable Engineering:</strong> Environmentally conscious design and renewable energy systems</li>
          <li><strong>Interdisciplinary Collaboration:</strong> Working across engineering disciplines to solve complex problems</li>
        </ul>
        
        <h3>Engineering Achievements</h3>
        <div class="stats-grid fade-in-up">
          <div class="stat-card">
            <span class="stat-number" data-count="${portfolioData.stats.projectsCompleted}">0</span>
            <div class="stat-label">Projects Completed</div>
          </div>
          <div class="stat-card">
            <span class="stat-number" data-count="${portfolioData.stats.hoursEngineering}">0</span>
            <div class="stat-label">Engineering Hours</div>
          </div>
          <div class="stat-card">
            <span class="stat-number" data-count="${portfolioData.stats.materialsUsed}">0</span>
            <div class="stat-label">Materials Mastered</div>
          </div>
          <div class="stat-card">
            <span class="stat-number" data-count="${portfolioData.stats.problemsSolved}">0</span>
            <div class="stat-label">Problems Solved</div>
          </div>
        </div>
        
        <h3>Recognition & Awards</h3>
        <div class="skill-grid">
          <div class="skill-card fade-in-left">
            <strong>Academic Excellence</strong>
            <span>Dean's List, Honor Roll, STEM Achievement Awards, Mathematics Competition Recognition</span>
          </div>
          <div class="skill-card fade-in-right">
            <strong>Engineering Competitions</strong>
            <span>Regional Science Fair, Engineering Design Challenge, Innovation Showcase, Robotics Competition</span>
          </div>
        </div>
      </div>
    </div>
  `
}

// Enhanced contact section
export const renderContact = () => {
  return `
    <div class="container">
      <div class="section fade-in-up">
        <h2>Contact Information</h2>
        <p>I welcome opportunities to discuss engineering projects, collaboration possibilities, and academic opportunities. Please feel free to reach out regarding my work or potential connections in the mechanical engineering field.</p>
        
        <form class="contact-form" id="contact-form">
          <div class="form-group fade-in-left">
            <label for="name">Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              minlength="2"
              maxlength="100"
              pattern="^[a-zA-Z\s\-\.\']+$"
              title="Please enter a valid name (letters, spaces, hyphens, apostrophes only)"
              placeholder="Your full name"
              autocomplete="name"
              aria-describedby="name-help"
            >
            <small id="name-help" class="sr-only">Enter your full name for professional correspondence</small>
          </div>
          
          <div class="form-group fade-in-right">
            <label for="email">Email Address *</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              maxlength="254"
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              title="Please enter a valid email address"
              placeholder="your.email@domain.com"
              autocomplete="email"
              aria-describedby="email-help"
            >
            <small id="email-help" class="sr-only">Your email will be used for professional correspondence only</small>
          </div>
          
          <div class="form-group fade-in-left">
            <label for="subject">Subject *</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              required 
              minlength="3"
              maxlength="200"
              placeholder="Purpose of your message"
              autocomplete="off"
              aria-describedby="subject-help"
            >
            <small id="subject-help" class="sr-only">Brief description of your inquiry or message topic</small>
          </div>
          
          <div class="form-group fade-in-right">
            <label for="message">Message *</label>
            <textarea 
              id="message" 
              name="message" 
              required 
              minlength="10"
              maxlength="2000"
              rows="6"
              placeholder="Please share details about your inquiry, project ideas, collaboration opportunities, or any questions you may have. I look forward to hearing from you."
              aria-describedby="message-help"
            ></textarea>
            <small id="message-help" class="sr-only">Detailed message with your questions or collaboration ideas</small>
          </div>
          
          <div class="form-submit fade-in-up">
            <button type="submit" class="btn" aria-describedby="submit-help">
              <span>Send Message</span>
            </button>
            <small id="submit-help" class="sr-only">Submit your message for professional review and response</small>
          </div>
        </form>
        
        <div class="contact-footer fade-in-up">
          <p>Connect with me professionally on LinkedIn:</p>
          <a href="https://linkedin.com/in/jose-rodriguez-engineer" class="linkedin-link" target="_blank" rel="noopener noreferrer" aria-label="Connect with Jose Rodriguez on LinkedIn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>Jose Rodriguez - Aspiring Engineer</span>
          </a>
          
          <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border);">
            <h4 style="color: var(--text-primary); margin-bottom: 1rem;">Response Time</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">I typically respond to professional inquiries within 24-48 hours. For urgent matters or time-sensitive opportunities, please mention this in your subject line.</p>
          </div>
        </div>
      </div>
    </div>
  `
}

// Screen reader only text utility
const srOnlyStyles = `
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`

// Add styles to document if not already added
if (!document.querySelector('#sr-only-styles')) {
  const styleSheet = document.createElement('style')
  styleSheet.id = 'sr-only-styles'
  styleSheet.textContent = srOnlyStyles
  document.head.appendChild(styleSheet)
} 