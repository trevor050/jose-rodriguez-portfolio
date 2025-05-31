/*
===========================================
    JOSE'S ABOUT PAGE CONTENT
===========================================

Hi Jose! This file contains all the text and information for your About page.
You can easily edit any of these sections to update your portfolio.

HOW TO EDIT:
1. Keep the quotation marks around text
2. For longer text, you can break it into multiple lines
3. Use \n if you want to force a line break in the text
4. Keep the structure but change the content to match your experience

SKILLS SYSTEM:
- Each skill has a name, level, and progress percentage
- Levels: "Beginner", "Intermediate", "Advanced", "Expert"  
- Progress: Number from 0 to 100 (how confident you are in this skill)
*/

export const aboutData = {
  // Main introduction paragraphs
  intro: {
    paragraph1: "I am Jose Rodriguez, a dedicated high school junior with a passion for mechanical engineering and a demonstrated commitment to innovative problem-solving. My work focuses on applying fundamental engineering principles to create functional solutions using both conventional and unconventional materials.",
    
    paragraph2: "My approach to engineering emphasizes precision, creativity, and practical application. I believe that understanding core principles enables innovative solutions, and I consistently challenge myself to push beyond traditional boundaries while maintaining engineering integrity and safety standards."
  },

  // Engineering philosophy section
  philosophy: {
    title: "Engineering Philosophy",
    description: "My engineering philosophy centers on several key principles:",
    principles: [
      {
        title: "Innovation through Constraint",
        description: "Limited resources often lead to the most creative solutions"
      },
      {
        title: "Precision in Execution", 
        description: "Accurate measurements and careful attention to detail are fundamental"
      },
      {
        title: "Practical Application",
        description: "Theoretical knowledge must translate into real-world functionality"
      },
      {
        title: "Continuous Learning",
        description: "Every project provides opportunities for skill development and knowledge expansion"
      },
      {
        title: "Safety First",
        description: "All designs prioritize user safety and responsible engineering practices"
      }
    ]
  },

  // Technical skills with progress bars
  skills: [
    { name: 'CAD Design & 3D Modeling', level: 'Advanced', progress: 85 },
    { name: 'Mechanical Assembly', level: 'Expert', progress: 92 },
    { name: 'Problem Solving', level: 'Expert', progress: 95 },
    { name: 'Materials Science', level: 'Intermediate', progress: 75 },
    { name: 'Electronics Integration', level: 'Intermediate', progress: 70 },
    { name: 'Manufacturing Processes', level: 'Advanced', progress: 80 },
    { name: 'Technical Documentation', level: 'Advanced', progress: 88 },
    { name: 'Project Management', level: 'Intermediate', progress: 78 }
  ],

  // Areas of expertise cards
  expertiseAreas: [
    {
      title: "Design & Analysis",
      description: "CAD Software, Engineering Drawings, Stress Analysis, Design Optimization, Parametric Modeling"
    },
    {
      title: "Manufacturing & Assembly", 
      description: "Precision Assembly, Material Selection, Quality Control, Process Optimization, Tolerance Analysis"
    },
    {
      title: "Systems Integration",
      description: "Mechanical Systems, Electronics Integration, Control Systems, Sensor Integration, Automation"
    },
    {
      title: "Project Leadership",
      description: "Project Planning, Resource Management, Timeline Coordination, Documentation, Testing Protocols"
    }
  ],

  // Academic and career goals
  academicGoals: {
    title: "Academic & Career Objectives",
    description: "I am actively preparing for undergraduate mechanical engineering programs where I can expand my technical knowledge and hands-on experience. My goal is to specialize in product development and design engineering, creating solutions that bridge theoretical principles with practical applications.",
    
    interests: [
      {
        title: "Hands-on Design",
        description: "Prototyping laboratories and maker spaces for practical application"
      },
      {
        title: "Advanced Materials",
        description: "Exploring innovative materials and their engineering applications"
      },
      {
        title: "Manufacturing Innovation", 
        description: "Modern manufacturing processes and automation technologies"
      },
      {
        title: "Product Development",
        description: "Complete design cycles from concept to market-ready products"
      },
      {
        title: "Sustainable Engineering",
        description: "Environmentally conscious design and renewable energy systems"
      },
      {
        title: "Interdisciplinary Collaboration",
        description: "Working across engineering disciplines to solve complex problems"
      }
    ]
  },

  // Recognition and awards
  recognition: {
    academic: {
      title: "Academic Excellence",
      achievements: "Dean's List, Honor Roll, STEM Achievement Awards, Mathematics Competition Recognition"
    },
    competitions: {
      title: "Engineering Competitions", 
      achievements: "Regional Science Fair, Engineering Design Challenge, Innovation Showcase, Robotics Competition"
    }
  }
}

/*
===========================================
    EASY EDITING TIPS
===========================================

TO ADD A NEW SKILL:
1. Go to the 'skills' section above
2. Copy one of the existing skill lines
3. Paste it at the end (before the closing bracket)
4. Change the name, level, and progress number
5. Don't forget the comma after each skill!

TO ADD A NEW EXPERTISE AREA:
1. Find the 'expertiseAreas' section
2. Copy an existing area (the whole {...} block)
3. Paste it at the end
4. Update the title and description

TO CHANGE YOUR INTRO:
1. Find the 'intro' section
2. Edit paragraph1 and paragraph2 with your own words
3. Keep the quotation marks around your text

REMEMBER: 
- Don't delete commas between items
- Keep quotation marks around text
- Test your changes by saving and refreshing your website
*/ 