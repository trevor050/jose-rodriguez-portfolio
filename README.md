# Jose Rodriguez - Portfolio Website

A modern, responsive portfolio website showcasing the engineering projects and skills of Jose Rodriguez, an aspiring mechanical engineer.

## 🚀 Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Interactive Projects**: Clickable project cards with detailed modal views
- **Multi-Section Navigation**: Projects, About Me, and Contact sections
- **Contact Form**: Functional contact form with validation and feedback
- **Fast Loading**: Built with Vite for optimal performance
- **SEO Optimized**: Proper meta tags and semantic HTML

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Build Tool**: Vite
- **Styling**: CSS Custom Properties, Flexbox, Grid
- **Typography**: Inter font family
- **Icons**: Custom SVG favicon

## 📂 Project Structure

```
jose-rodriguez-portfolio/
├── public/
│   ├── images/               # Project images
│   │   └── placeholder.txt   # Placeholder for future images
│   └── favicon.svg          # Custom gear favicon
├── src/
│   ├── main.js             # Main application logic
│   └── style.css           # Modern CSS styles
├── index.html              # Entry point
├── package.json            # Project configuration
└── README.md              # This file
```

## 🎨 Design Features

### Visual Design
- **Color Scheme**: Professional blue palette with good contrast
- **Typography**: Inter font for excellent readability
- **Shadows**: Subtle layered shadows for depth
- **Gradients**: Smooth background and placeholder gradients
- **Animations**: Smooth hover effects and page transitions

### Interactive Elements
- **Project Cards**: Hover animations with lift effect
- **Modal Windows**: Detailed project information with smooth overlay
- **Form Feedback**: Real-time validation and submission states
- **Navigation**: Active state indicators and smooth transitions

### Responsive Design
- **Mobile-First**: Optimized for small screens first
- **Flexible Grid**: CSS Grid with auto-fit for project cards
- **Adaptive Navigation**: Stacked navigation on mobile
- **Scalable Typography**: Responsive font sizes

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jose-rodriguez-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
# Build the project
npm run build

# Preview production build locally
npm run preview
```

## 📱 Features Overview

### Projects Section
- **Grid Layout**: Responsive 2x2 grid of project cards
- **Project Cards**: Each card includes:
  - High-quality project image (with elegant placeholders)
  - Project title and description
  - Click-to-expand functionality
- **Modal Details**: Detailed project information including:
  - Larger project images
  - Comprehensive project descriptions
  - Tools and technologies used
  - Project timeline
  - Key learnings and insights

### Featured Projects
1. **Cardboard 4-Cylinder Engine** - Functional engine model demonstrating mechanical principles
2. **Rubber Band Crossbow** - Precision projectile device showcasing physics application
3. **Cardboard Armor** - Wearable armor demonstrating structural engineering
4. **Jeans Sewing Project** - Custom-tailored garment showing precision manufacturing

### About Me Section
- Personal background and engineering journey
- Technical interests and specializations
- Career goals and aspirations
- Fun facts and personality insights

### Contact Section
- **Contact Form**: Fully functional with validation
- **Form Fields**: Name, email, subject, and message
- **Submission Feedback**: Visual confirmation of message sending
- **Direct Links**: Email, LinkedIn, and GitHub contact options

## 🎯 Deployment

### Vercel Deployment
The site is optimized for deployment on Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Production deployment
vercel --prod
```

### Other Platforms
The built files in the `dist/` folder can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront

## 🖼️ Adding Project Images

To add actual project images:

1. Add image files to `public/images/`:
   - `cardboard-engine.jpg`
   - `crossbow.jpg`
   - `cardboard-armor.jpg`
   - `jeans-project.jpg`

2. Images should be:
   - High resolution (at least 800x600)
   - Optimized for web (compressed)
   - Consistent aspect ratio preferred

## 🎨 Customization

### Colors
Update CSS custom properties in `src/style.css`:
```css
:root {
  --primary-color: #2563eb;    /* Main brand color */
  --secondary-color: #64748b;  /* Secondary elements */
  --accent-color: #10b981;     /* Success/accent color */
  /* ... other variables */
}
```

### Content
Modify the `portfolioData` object in `src/main.js` to update:
- Project information
- Personal details
- Contact information

### Styling
The CSS is modular and uses:
- CSS Custom Properties for theming
- CSS Grid and Flexbox for layouts
- Modern CSS features (clamp, min, max)

## 📊 Performance

- **Lighthouse Score**: Optimized for 90+ in all categories
- **Bundle Size**: Minimal JavaScript footprint
- **Loading Speed**: Vite's fast HMR for development
- **Image Optimization**: Responsive images with fallbacks

## 🔧 Development

### Code Organization
- **Component-based**: Modular render functions
- **State Management**: Simple state with re-rendering
- **Event Handling**: Centralized event listener management
- **Styling**: CSS-first approach with minimal JavaScript

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## 📝 License

MIT License - feel free to use this code for your own portfolio projects.

## 🤝 Contributing

This is a personal portfolio project, but suggestions and improvements are welcome!

## 📧 Contact

**Jose Rodriguez**
- Email: jose.rodriguez@email.com
- LinkedIn: [linkedin.com/in/joserodriguez](https://linkedin.com/in/joserodriguez)
- GitHub: [github.com/joserodriguez](https://github.com/joserodriguez)

---

*Built with passion and cardboard* 📦 