# Secure Vault Frontend

A professional React.js frontend for the Secure Credential Vault application, built with TypeScript and featuring a modern white and shiny black design theme.

## Features

- **Modern UI Design**: Clean white background with shiny black accents
- **Glassmorphism Effects**: Beautiful frosted glass elements with backdrop blur
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **TypeScript Support**: Full type safety and better development experience
- **Professional Animations**: Smooth transitions and hover effects
- **Form Validation**: Client-side validation for better UX
- **Password Management**: Show/hide passwords, copy to clipboard, generate secure passwords

## Design Theme

### Color Palette
- **Primary White**: #ffffff (main background)
- **Secondary White**: #f8f9fa (card backgrounds)
- **Primary Black**: #000000 (buttons, headers)
- **Secondary Black**: #1a1a1a (text, gradients)
- **Accent Gray**: #6c757d (secondary text)

### Key Design Elements
- **Glass Cards**: Translucent cards with backdrop blur effects
- **Shiny Black Buttons**: Gradient black buttons with subtle highlights
- **Smooth Animations**: CSS transitions and keyframe animations
- **Professional Typography**: Inter font family for clean readability

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd frontend-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
frontend-react/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Navigation header
│   │   ├── LoginForm.tsx        # User login form
│   │   ├── RegisterForm.tsx     # User registration form
│   │   ├── Dashboard.tsx        # Main dashboard view
│   │   ├── AddEntryForm.tsx     # Add new vault entry modal
│   │   └── VaultEntry.tsx       # Individual vault entry card
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Component-specific styles
│   ├── index.tsx                # React app entry point
│   └── index.css                # Global styles and design system
├── package.json
└── tsconfig.json
```

## Components Overview

### Authentication
- **LoginForm**: Professional login interface with validation
- **RegisterForm**: Account creation with password confirmation
- **Header**: Navigation with user info and logout functionality

### Vault Management
- **Dashboard**: Main interface showing all vault entries
- **AddEntryForm**: Modal for creating new vault entries
- **VaultEntry**: Individual entry cards with edit/delete/copy actions

## Features

### User Interface
- Clean, professional design with white and black theme
- Glassmorphism effects for modern appearance
- Responsive layout for all screen sizes
- Smooth animations and transitions

### Security Features
- Password visibility toggle
- Secure password generation
- Copy to clipboard functionality
- Form validation and error handling

### User Experience
- Loading states and feedback
- Intuitive navigation
- Search and filter capabilities
- Confirmation dialogs for destructive actions

## Customization

### Styling
All design tokens are defined as CSS custom properties in `src/index.css`:

```css
:root {
  --primary-white: #ffffff;
  --secondary-white: #f8f9fa;
  --primary-black: #000000;
  --secondary-black: #1a1a1a;
  /* ... more variables */
}
```

### Components
Each component is built with TypeScript interfaces for type safety and can be easily customized or extended.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Integration with Backend

The frontend is designed to integrate with the Python backend API. Update the API endpoints in the component files to connect with your backend server.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new components
3. Maintain the design system consistency
4. Test components thoroughly before submission

## License

This project is part of the Secure Credential Vault application suite.
