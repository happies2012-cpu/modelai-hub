# Design System Documentation

## Overview
This document outlines the design system, visual assets, and UI/UX guidelines for the platform.

## Design Principles

### Human, Premium, Brand-Grade
- **Human**: Interfaces feel natural and intuitive, not robotic
- **Premium**: High-quality visuals, smooth animations, attention to detail
- **Brand-Grade**: Consistent, professional, polished experience

### Visual Hierarchy
- Clear information architecture
- Generous whitespace
- Consistent typography scale
- Logical content flow

## Color System

### Primary Colors
- **Primary**: Brand primary color (configurable via theme)
- **Accent**: Highlight color for CTAs and important elements
- **Background**: Main background color
- **Foreground**: Primary text color

### Semantic Colors
- **Success**: Green tones for positive actions
- **Destructive**: Red tones for errors/destructive actions
- **Warning**: Yellow/amber tones for warnings
- **Muted**: Subtle colors for secondary content

## Typography

### Font Families
- **Display**: Bold, attention-grabbing headlines
- **Body**: Readable, comfortable body text
- **Mono**: Code and technical content

### Scale
- **H1**: 4xl (2.25rem) - Page titles
- **H2**: 3xl (1.875rem) - Section titles
- **H3**: 2xl (1.5rem) - Subsection titles
- **H4**: xl (1.25rem) - Card titles
- **Body**: base (1rem) - Default text
- **Small**: sm (0.875rem) - Secondary text
- **Tiny**: xs (0.75rem) - Labels, captions

## Components

### Buttons
- **Primary**: Main actions, high contrast
- **Secondary**: Secondary actions
- **Outline**: Tertiary actions, borders
- **Ghost**: Subtle actions, no background
- **Sizes**: sm, default, lg, xl

### Cards
- Rounded corners (lg: 0.5rem)
- Subtle borders
- Hover effects (shadow elevation)
- Consistent padding

### Forms
- Clear labels
- Helpful placeholder text
- Error states with messages
- Success feedback
- Accessible inputs

## Visual Assets

### Icons
- **Library**: Lucide React
- **Style**: Outline, consistent stroke width
- **Usage**: Semantic meaning, not decorative
- **Size**: Standardized (4, 5, 6, 8, 12, 16, 20, 24px)

### Illustrations
- SVG format only
- Vector-based for scalability
- Semantic meaning
- Consistent style

### Images
- Optimized formats (WebP preferred)
- Lazy loading
- Responsive sizing
- Alt text for accessibility

## Motion & Animation

### Principles
- **Purposeful**: Every animation has a reason
- **Subtle**: Enhance, don't distract
- **Fast**: Quick transitions (200-300ms)
- **Smooth**: Easing functions (ease-in-out)

### Micro-interactions
- Button hover states
- Card hover elevation
- Input focus states
- Loading states
- Success/error feedback

### Page Transitions
- Fade in/out
- Slide transitions
- Staggered content reveals
- Smooth route changes

### Loading States
- Skeleton loaders (not spinners)
- Progressive content loading
- Animated empty states
- Premium loading animations

## Layout

### Grid System
- 12-column grid (responsive)
- Consistent gutters
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Spacing
- Consistent spacing scale (4px base)
- Generous whitespace
- Visual breathing room

### Responsive Design
- Mobile-first approach
- Flexible layouts
- Touch-friendly targets (min 44x44px)
- Readable text sizes

## Dark Mode

### Implementation
- System preference detection
- Manual toggle available
- Consistent color schemes
- Proper contrast ratios

### Color Adjustments
- Backgrounds: Darker tones
- Text: Lighter tones
- Borders: Subtle, visible
- Accents: Adjusted for visibility

## Accessibility

### Standards
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Focus indicators
- Color contrast ratios

### Practices
- Semantic HTML
- ARIA labels where needed
- Alt text for images
- Form error announcements

## Component Patterns

### Login/Signup
- Left panel: Auth forms
- Right panel: Rotating promotions
- Clear visual separation
- Smooth tab switching

### Dashboard
- Card-based layout
- Quick actions
- Status indicators
- Navigation sidebar

### Forms
- Clear labels
- Inline validation
- Error messages
- Success feedback
- Loading states

## Best Practices

### Do's
- ✅ Use consistent spacing
- ✅ Maintain visual hierarchy
- ✅ Provide feedback for actions
- ✅ Use semantic colors
- ✅ Ensure accessibility
- ✅ Test on multiple devices

### Don'ts
- ❌ Inconsistent spacing
- ❌ Overwhelming animations
- ❌ Poor contrast
- ❌ Missing loading states
- ❌ Ignoring accessibility
- ❌ Breaking responsive design

## Implementation

### Technologies
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React

### File Structure
```
src/
  components/
    ui/          # Base UI components
    admin/       # Admin-specific components
    forms/       # Form components
  pages/         # Page components
  lib/           # Utilities
```

## Maintenance

### Updates
- Design system evolves with platform
- Breaking changes documented
- Migration guides provided
- Version control for components

### Guidelines
- Follow established patterns
- Document new components
- Maintain consistency
- Regular design reviews

