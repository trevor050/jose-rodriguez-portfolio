import { renderProjectCard } from './ProjectCard.js'

// Render projects section
export const renderProjects = (portfolioData) => {
  return `
    <div class="container">
      <div class="projects-grid fade-in">
        ${portfolioData.projects.map(renderProjectCard).join('')}
      </div>
    </div>
  `
}

// Render about section - professional and college-appropriate
export const renderAbout = (portfolioData) => {
  return `
    <div class="container">
      <div class="section fade-in">
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
        
        <h3>Technical Skills</h3>
        <div class="skill-grid">
          <div class="skill-card">
            <strong>Design & Analysis</strong>
            <span>CAD Software, Engineering Drawings, Stress Analysis, Design Optimization</span>
          </div>
          <div class="skill-card">
            <strong>Manufacturing</strong>
            <span>Precision Assembly, Material Selection, Quality Control, Process Optimization</span>
          </div>
          <div class="skill-card">
            <strong>Problem Solving</strong>
            <span>Systems Thinking, Root Cause Analysis, Innovation, Project Management</span>
          </div>
        </div>
        
        <h3>Academic & Career Goals</h3>
        <p>I am actively preparing for undergraduate mechanical engineering programs where I can expand my technical knowledge and hands-on experience. My goal is to specialize in product development and design engineering, creating solutions that bridge theoretical principles with practical applications.</p>
        
        <p>I am particularly interested in engineering programs that emphasize:</p>
        <ul>
          <li>Hands-on design and prototyping laboratories</li>
          <li>Advanced materials science and engineering</li>
          <li>Manufacturing engineering and process optimization</li>
          <li>Product development and innovation methodologies</li>
          <li>Sustainable engineering practices and design</li>
          <li>Interdisciplinary collaboration and systems engineering</li>
        </ul>
        
        <h3>Project Portfolio Metrics</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-number">${portfolioData.stats.projectsCompleted}+</span>
            <div class="stat-label">Projects Completed</div>
          </div>
          <div class="stat-card">
            <span class="stat-number">${portfolioData.stats.hoursEngineering}+</span>
            <div class="stat-label">Engineering Hours</div>
          </div>
          <div class="stat-card">
            <span class="stat-number">${portfolioData.stats.materialsUsed}+</span>
            <div class="stat-label">Materials Mastered</div>
          </div>
          <div class="stat-card">
            <span class="stat-number">${portfolioData.stats.problemsSolved}+</span>
            <div class="stat-label">Problems Solved</div>
          </div>
        </div>
      </div>
    </div>
  `
}

// Render contact section - professional
export const renderContact = () => {
  return `
    <div class="container">
      <div class="section fade-in">
        <h2>Contact Information</h2>
        <p>I welcome opportunities to discuss engineering projects, collaboration possibilities, and academic opportunities. Please feel free to reach out regarding my work or potential connections.</p>
        
        <form class="contact-form" id="contact-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required placeholder="Your full name">
          </div>
          
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" required placeholder="your.email@domain.com">
          </div>
          
          <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject" required placeholder="Purpose of your message">
          </div>
          
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" required placeholder="Please share details about your inquiry, project ideas, collaboration opportunities, or any questions you may have. I look forward to hearing from you."></textarea>
          </div>
          
          <div class="form-submit">
            <button type="submit" class="btn">
              <span>Send Message</span>
            </button>
          </div>
        </form>
        
        <div class="contact-footer">
          <p>Connect with me on LinkedIn:</p>
          <a href="https://linkedin.com/in/jose-rodriguez-engineer" class="linkedin-link" target="_blank">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>Jose Rodriguez</span>
          </a>
        </div>
      </div>
    </div>
  `
} 