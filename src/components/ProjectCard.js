// Professional Project Card Component
export const renderProjectCard = (project) => {
  return `
    <div class="project-card" data-project-id="${project.id}">
      <img src="${project.image}" alt="${project.title}" class="project-image" onerror="this.style.background='linear-gradient(135deg, #1f2937 0%, #374151 100%)'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.color='#9ca3af'; this.style.fontSize='1.5rem'; this.innerHTML='Project Image'" />
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-meta">
          <span>${project.category}</span>
          <span>${project.status}</span>
        </div>
      </div>
    </div>
  `
}

// Professional Project Modal Component
export const renderProjectModal = (project) => {
  return `
    <div class="modal-overlay" id="project-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>${project.title}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <img src="${project.image}" alt="${project.title}" class="modal-image" onerror="this.style.background='linear-gradient(135deg, #1f2937 0%, #374151 100%)'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.color='#9ca3af'; this.style.fontSize='2rem'; this.innerHTML='Project Image'" />
          <div class="modal-details">
            <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.7; margin-bottom: 2rem;">${project.details}</p>
            
            <div class="project-meta-modal">
              <div class="meta-item">
                <strong>Engineering Tools & Technologies</strong>
                <span>${project.tools.join(' • ')}</span>
              </div>
              <div class="meta-item">
                <strong>Development Timeline</strong>
                <span>${project.timeline}</span>
              </div>
              <div class="meta-item">
                <strong>Engineering Category</strong>
                <span>${project.category}</span>
              </div>
              <div class="meta-item">
                <strong>Project Complexity</strong>
                <span>${project.difficulty}</span>
              </div>
              <div class="meta-item">
                <strong>Key Learning Outcomes</strong>
                <span>${project.learnings}</span>
              </div>
              <div class="meta-item">
                <strong>Current Status</strong>
                <span>${project.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
} 