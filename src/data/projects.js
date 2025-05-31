/*
===========================================
    JOSE'S PROJECT PORTFOLIO DATA
===========================================

Hi Jose! This file contains all your project information.
You can easily edit this to add new projects, change descriptions,
update images, or modify any details about your work.

HOW TO EDIT:
1. Each project is inside the curly braces { }
2. Don't delete the commas between projects
3. Keep the quotation marks around text
4. To add a new project, copy an existing one and paste it at the end
5. Make sure to add a comma after each project (except the last one)

WHAT EACH FIELD MEANS:
- id: A unique number for each project (just count up: 1, 2, 3, etc.)
- title: The name of your project
- description: Short summary that appears on the project card
- image: Path to your project photo (put photos in /public/images/ folder)
- details: Longer explanation for when someone clicks on the project
- tools: List of tools/materials you used (in square brackets [ ])
- timeline: How long the project took
- learnings: What you learned from doing this project
- category: What type of engineering this project represents (see categories below)
- difficulty: Beginner, Intermediate, Advanced, or Expert
- status: Usually "Completed" but could be "In Progress"

AVAILABLE CATEGORIES (these create the filter buttons):
- "Mechanical Systems"
- "Physics Application" 
- "Structural Engineering"
- "Materials Engineering"
- "Mechanical Design"
- "Renewable Energy"
- "Fluid Mechanics"
- "Precision Instruments"

Feel free to create new categories! The filter buttons are automatically 
created based on whatever categories you use in your projects.
*/

export const projectsData = [
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
]

/*
===========================================
    PROJECT STATISTICS
===========================================

These numbers appear in the "About" section.
Update these as you complete more projects!
*/

export const portfolioStats = {
  projectsCompleted: 18,    // Total number of projects you've finished
  hoursEngineering: 312,    // Total hours spent on engineering work
  materialsUsed: 12,        // Different types of materials you've worked with
  problemsSolved: 47        // Engineering problems you've solved
} 