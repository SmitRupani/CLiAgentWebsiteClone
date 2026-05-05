# Scaler Academy Website Clone - Reference Guide

This guide helps the AI agent generate an accurate clone of the Scaler Academy website.

## Website Structure

### 1. HEADER/NAVBAR
- **Position**: Fixed or sticky at top
- **Background**: Usually dark blue or near-black (#1a1a1a, #0f0f0f, or #003366)
- **Height**: ~70-80px
- **Content Layout**:
  - Logo on left
  - Navigation links in center (Home, Courses, About, Blog, Contact)
  - CTA button on right (Sign Up, Get Started)
- **Nav Link Colors**: Usually white (#ffffff) or light gray
- **Button Style**: Contrasting color (orange #ff6b35, blue #0066ff, or similar) with padding ~10-15px

### 2. HERO SECTION
- **Background**: Can be:
  - Solid color (dark blue #003366 or #1a1a1a)
  - Gradient (e.g., blue to darker blue)
  - Image background with overlay
- **Layout**: Centered or two-column (image on right)
- **Heading**: 
  - Font size: 48-64px
  - Font weight: bold (700)
  - Color: white or light (#ffffff)
  - Example text: "Learn from Industry Experts"
- **Subheading**:
  - Font size: 18-24px
  - Color: light gray or white
  - Example text: "Master in-demand skills with live classes"
- **CTA Button**:
  - Background: Bright color (orange #ff6b35, green #28a745)
  - Text: white
  - Padding: 15-20px 30-40px
  - Text: "Get Started", "Explore Courses", "Start Learning"
- **Padding**: 80-120px top/bottom, 40-60px left/right

### 3. FOOTER
- **Background**: Dark color (matching header or darker)
- **Layout**: 4-5 column grid
  - Column 1: Company info (logo, description, contact)
  - Column 2: Quick Links (Home, About, Blog, Terms)
  - Column 3: Courses (categories or popular courses)
  - Column 4: Follow Us (social media icons)
  - Column 5: Newsletter/Contact
- **Text Color**: Light gray (#cccccc) or white
- **Bottom Bar**: Copyright text, centered
- **Padding**: 60px top/bottom, 40px left/right

## Color Palette (Typical Scaler Colors)

Extract these from the screenshot:
- **Primary Blue**: #0066ff or #0052cc
- **Dark Background**: #0f0f0f or #1a1a1a
- **Accent Orange**: #ff6b35 or #ff5722
- **Text White**: #ffffff
- **Text Light Gray**: #cccccc or #e0e0e0
- **Section Divider**: #333333 or #404040

## Typography

- **Headings**: Bold sans-serif (Poppins, Inter, or Open Sans)
- **Body Text**: Regular sans-serif (Poppins, Inter, or Roboto)
- **Font Sizes**:
  - H1 (main heading): 48-64px
  - H2 (section heading): 36-48px
  - H3 (subsection): 24-32px
  - Body text: 14-16px
  - Small text (footer): 12-14px

## Spacing Guidelines

- **Header height**: 70-80px
- **Hero section padding**: 80-120px vertical
- **Section padding**: 60-80px vertical, 40px horizontal
- **Button padding**: 15-20px vertical, 30-40px horizontal
- **Footer padding**: 60px vertical, 40px horizontal
- **Gap between sections**: 20-40px

## Common Elements to Include

1. **Navigation Links**: Home, Courses, About, Blog, Contact, Dashboard
2. **CTA Buttons**: Sign Up, Get Started, Explore, Learn More (recurring)
3. **Hero Features**: Badges like "1000+ Students", "Industry Leaders", "100% Success Rate"
4. **Social Icons**: LinkedIn, GitHub, Twitter, Instagram
5. **Footer Links**: Privacy Policy, Terms of Service, Contact Us, Blog

## CSS Must-Haves

- Universal reset: `* { margin: 0; padding: 0; box-sizing: border-box; }`
- CSS variables for all colors in `:root`
- Flexbox for header layout
- Grid or flex for footer columns
- Hover effects on buttons and links
- Smooth transitions (0.3s recommended)
- Responsive design (mobile-first approach)
- Box shadows on buttons and cards

## HTML Structure Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scaler Academy - Learn from Industry Experts</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Header/Navbar -->
  <header class="navbar">
    <div class="container">
      <div class="logo">Scaler</div>
      <nav class="nav-links">
        <a href="#">Home</a>
        <a href="#">Courses</a>
        <a href="#">About</a>
        <a href="#">Blog</a>
        <a href="#">Contact</a>
      </nav>
      <button class="btn-cta">Sign Up</button>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-content">
      <h1>Learn from Industry Experts</h1>
      <p>Master in-demand skills with live classes and mentorship</p>
      <button class="btn-primary">Get Started</button>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-columns">
        <div class="footer-col">
          <h4>About Scaler</h4>
          <p>Learn, grow, and build your career with Scaler Academy.</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Courses</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Follow Us</h4>
          <div class="social-icons">
            <a href="#"><i class="fab fa-linkedin"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-github"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Scaler Academy. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

## Key CSS Properties to Match

When comparing generated output with original:
1. **Header**: Background color, text color, button color, padding, height
2. **Hero**: Background color/gradient, text colors, heading size, button style, section padding
3. **Footer**: Background color, text color, column layout, spacing
4. **Buttons**: All button colors, sizes, hover effects, border-radius
5. **Typography**: Font sizes, weights, colors, line-height
6. **Spacing**: All margins and paddings between sections

## Iteration Strategy

When output doesn't match:
1. Take screenshot of both original and generated
2. Compare header colors - if off, update CSS variables
3. Compare hero section colors and spacing - fix padding/margins
4. Compare button styles - update colors, sizes, hover
5. Compare footer layout - fix grid/flex layout if needed
6. Take new screenshot and repeat until match

## Testing Checklist

- [ ] Header fixed/sticky at top
- [ ] All nav links visible and correct color
- [ ] CTA button in header visible and styled correctly
- [ ] Hero section has proper background color/gradient
- [ ] Hero heading is large and white
- [ ] Hero CTA button is styled and positioned correctly
- [ ] Footer is dark and multi-column
- [ ] All text colors match original
- [ ] No layout shifts or misalignments
- [ ] Hover effects work on buttons
