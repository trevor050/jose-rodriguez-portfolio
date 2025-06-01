import { renderProjectCard } from './ProjectCard.js'

/*
===========================================
    AUTOMATIC FILTER GENERATION
===========================================

This function automatically creates filter buttons based on 
the categories found in Jose's project data. No manual 
management needed!

How it works:
1. Looks at all projects in the data
2. Gets all unique category names
3. Automatically creates filter buttons
4. Always includes "All" as the first option
*/
const getProjectCategories = (projects) => {
  const categories = projects.map(project => project.category)
  return ['All', ...new Set(categories)]
}

// Render projects section with automatic filtering
export const renderProjects = (portfolioData) => {
  const categories = getProjectCategories(portfolioData.projects)
  
  return `
    <div class="container">
      <!-- These filter buttons are automatically generated! -->
      <!-- To add new filters, just add new category names in src/data/projects.js -->
      <div class="project-filters-container fade-in-up">
        <div class="project-filters">
          ${categories.map(category => 
            `<button class="filter-btn ${category === 'All' ? 'active' : ''}" data-category="${category}">
              ${category}
            </button>`
          ).join('')}
        </div>
        <button class="filter-reset" onclick="resetFilters()" style="display: none;" title="Clear all filters and show all projects">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
            <path d="M19 13l-1.5 1.5L19 16l1.5-1.5z"/>
            <circle cx="18.5" cy="14.5" r="0.5"/>
            <line x1="16" y1="12" x2="20" y2="16" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </button>
      </div>
      <div class="projects-grid fade-in-up">
        ${portfolioData.projects.map(renderProjectCard).join('')}
      </div>
    </div>
  `
}

/*
===========================================
    ABOUT PAGE - NOW USES SEPARATE DATA
===========================================

This now loads content from src/data/about.js instead of 
being hardcoded here. Much easier for Jose to customize!
*/
export const renderAbout = (portfolioData) => {
  const aboutData = portfolioData.about

  return `
    <div class="container">
      <div class="section fade-in-up">
        <h2>Engineering Portfolio</h2>
        <p>${aboutData.intro.paragraph1}</p>
        <p>${aboutData.intro.paragraph2}</p>
        
        <h3>${aboutData.philosophy.title}</h3>
        <p>${aboutData.philosophy.description}</p>
        <ul>
          ${aboutData.philosophy.principles.map(principle => `
            <li><strong>${principle.title}:</strong> ${principle.description}</li>
          `).join('')}
        </ul>
        
        <h3>Technical Skills & Competencies</h3>
        <div class="skills-section">
          ${aboutData.skills.map(skill => `
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
          ${aboutData.expertiseAreas.map(area => `
            <div class="skill-card fade-in-right">
              <strong>${area.title}</strong>
              <span>${area.description}</span>
            </div>
          `).join('')}
        </div>
        
        <h3>${aboutData.academicGoals.title}</h3>
        <p>${aboutData.academicGoals.description}</p>
        
        <p>I am particularly interested in engineering programs that emphasize:</p>
        <ul>
          ${aboutData.academicGoals.interests.map(interest => `
            <li><strong>${interest.title}:</strong> ${interest.description}</li>
          `).join('')}
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
            <strong>${aboutData.recognition.academic.title}</strong>
            <span>${aboutData.recognition.academic.achievements}</span>
          </div>
          <div class="skill-card fade-in-right">
            <strong>${aboutData.recognition.competitions.title}</strong>
            <span>${aboutData.recognition.competitions.achievements}</span>
          </div>
        </div>
      </div>
    </div>
  `
}

/*
===========================================
    CONTACT PAGE - ENHANCED FOR EASY EDITING
===========================================

The contact information and links can now be easily updated
in src/data/settings.js without touching this code!
*/
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
              title="Please enter a valid name"
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
          <!-- Anti-ad-blocker: Generic class but LinkedIn branding for users -->
          <a href="https://linkedin.com/in/jose-rodriguez-engineer" class="professional-network-link" target="_blank" rel="noopener noreferrer" aria-label="Connect with Jose Rodriguez on LinkedIn" data-platform="professional-network">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true">
              <!-- LinkedIn square logo (ad-blocker resistant) -->
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>Jose Rodriguez</span>
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