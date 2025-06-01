/*
===========================================
    ANALYTICS CONFIGURATION
===========================================

This file configures analytics tracking for Jose's portfolio.
It helps track visitor engagement, popular projects, and 
performance metrics - perfect for college applications!

WHAT GETS TRACKED:
- Page views and navigation patterns
- Project popularity and engagement
- Contact form submissions (anonymized)
- Theme preferences and device usage
- Performance metrics and load times

PRIVACY-FIRST:
- No personal information stored
- Email domains only (not full emails)
- Anonymized user behavior data
- GDPR/CCPA compliant tracking
*/

// Analytics event definitions
export const ANALYTICS_EVENTS = {
  // Core navigation events
  PORTFOLIO_LOADED: 'Portfolio Loaded',
  PAGE_NAVIGATION: 'Page Navigation',
  
  // Project engagement events
  PROJECT_VIEWED: 'Project Viewed',
  PROJECT_FILTER_USED: 'Project Filter Used',
  PROJECT_MODAL_OPENED: 'Project Modal Opened',
  
  // User interaction events
  THEME_CHANGED: 'Theme Changed',
  CONTACT_FORM_SUBMITTED: 'Contact Form Submitted',
  LINKEDIN_CLICKED: 'LinkedIn Profile Clicked',
  
  // Performance events
  PAGE_LOAD_TIME: 'Page Load Time',
  SCROLL_DEPTH: 'Scroll Depth',
  TIME_ON_PAGE: 'Time on Page'
}

// Custom analytics helper functions
export const trackEngagement = (eventName, properties = {}) => {
  const baseProperties = {
    timestamp: new Date().toISOString(),
    device: window.innerWidth <= 768 ? 'mobile' : 'desktop',
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: navigator.userAgent.substring(0, 50),
    referrer: document.referrer || 'direct',
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  
  return {
    event: eventName,
    properties: { ...baseProperties, ...properties }
  }
}

// Performance tracking utilities
export const trackPerformance = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0]
    const paint = performance.getEntriesByType('paint')
    
    return {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      timeToInteractive: navigation.loadEventEnd
    }
  }
  return null
}

// Scroll depth tracking
export const initScrollTracking = () => {
  let maxScroll = 0
  let scrollMilestones = [25, 50, 75, 90, 100]
  let trackedMilestones = new Set()
  
  const trackScrollDepth = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    )
    
    maxScroll = Math.max(maxScroll, scrollPercent)
    
    // Track milestone achievements
    scrollMilestones.forEach(milestone => {
      if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
        trackedMilestones.add(milestone)
        
        // Track scroll milestone (you can import analytics in main.js and use this)
        if (window.track) {
          window.track('Scroll Milestone', {
            percentage: milestone,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
          })
        }
      }
    })
  }
  
  // Throttled scroll listener
  let scrollTimeout
  window.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(trackScrollDepth, 100)
  })
  
  return { getMaxScroll: () => maxScroll }
}

// Session tracking
export const initSessionTracking = () => {
  const sessionStart = Date.now()
  let pageViews = 1
  
  // Track session duration on page unload
  window.addEventListener('beforeunload', () => {
    const sessionDuration = Date.now() - sessionStart
    
    if (window.track) {
      window.track('Session Ended', {
        duration: sessionDuration,
        pageViews: pageViews,
        maxScrollDepth: window.scrollTracker?.getMaxScroll() || 0,
        timestamp: new Date().toISOString()
      })
    }
  })
  
  return {
    incrementPageViews: () => pageViews++,
    getSessionDuration: () => Date.now() - sessionStart
  }
}

// Goal tracking for college applications
export const CONVERSION_GOALS = {
  CONTACT_FORM_SUBMISSION: 'contact_form_completed',
  PROJECT_ENGAGEMENT: 'project_viewed_multiple',
  LINKEDIN_VISIT: 'linkedin_profile_visited',
  DEEP_ENGAGEMENT: 'spent_over_2_minutes',
  RETURN_VISITOR: 'return_visit_detected'
}

// Export analytics configuration
export const ANALYTICS_CONFIG = {
  // Enable/disable different tracking features
  trackPageViews: true,
  trackUserInteractions: true,
  trackPerformance: true,
  trackScrollDepth: true,
  trackSessionData: true,
  
  // Privacy settings
  respectDoNotTrack: true,
  anonymizeIPs: true,
  cookieConsent: false, // Set to true if you want cookie consent
  
  // Performance settings
  sampleRate: 1.0, // Track 100% of sessions (reduce for high traffic)
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  
  // Custom dimensions for college application tracking
  customDimensions: {
    portfolioVersion: '2.0',
    studentName: 'Jose Rodriguez',
    applicationYear: '2024',
    targetField: 'Mechanical Engineering'
  }
} 