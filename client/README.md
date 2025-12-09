# News Portal - Frontend

A modern, feature-rich news portal built with React, Vite, and Tailwind CSS. This application provides a seamless experience for reading, bookmarking, and managing news articles with institution support and admin capabilities.

## Features

- 📰 **Article Management** - Browse, search, and read articles
- 🔖 **Bookmarks** - Save articles for later reading
- 🏢 **Institution Support** - Dedicated dashboard for institutions to submit articles
- 👤 **User Authentication** - Secure login with OTP email verification
- 🎨 **Dark Mode** - Toggle between light and dark themes
- 🌍 **Multi-language** - Support for multiple languages
- 🖼️ **Image Uploads** - Optimized image compression with Sharp
- ⚡ **Rich Text Editor** - Create and edit articles with formatting
- 🔐 **Admin Dashboard** - Manage users, content, and submissions
- 📱 **Responsive Design** - Works seamlessly on all devices

## Tech Stack

- **Frontend Framework:** React 18 + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Rich Text Editor:** React Quill
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=http://localhost:5000
```

3. **Start development server:**
```bash
npm run dev
```

The app will run at `http://localhost:3001` (or next available port)

## Available Scripts

### `npm run dev`
Runs the app in development mode with hot module replacement.

### `npm run build`
Builds the app for production to the `dist` folder.
- Minifies and optimizes code
- Creates optimized asset bundles
- Ready for deployment

### `npm run preview`
Preview the production build locally before deployment.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin dashboard components
│   └── ...
├── pages/              # Page components (routes)
│   ├── admin/          # Admin pages
│   └── ...
├── context/            # React context (Auth, Theme, Language)
├── services/           # API service functions
├── utils/              # Utility functions
├── App.js              # Main app component
├── App.css             # Global styles
└── index.js            # Entry point
```

## Key Pages

- `/` - Home page with featured articles
- `/login` - User login
- `/register` - User registration
- `/register-institution` - Institution registration
- `/article/:id` - Article detail view
- `/bookmarks` - Saved articles
- `/search` - Article search
- `/admin` - Admin dashboard
- `/about` - About page
- `/contact` - Contact page

## Authentication

The app uses JWT-based authentication with OTP email verification:
- 6-digit OTP sent to email during registration
- 5-minute expiration time
- 7-day JWT token validity

## Image Optimization

Images are automatically:
- Compressed using Sharp (80% compression)
- Converted to WebP format
- Resized for optimal performance
- Limited to 10MB max file size

## Building for Production

1. **Build the project:**
```bash
npm run build
```

2. **Deploy the `dist` folder** to your hosting provider (Netlify, Vercel, AWS, etc.)

3. **Configure environment variables** on your hosting platform with the correct API base URL

## Performance

- Production build: **659.22 kB** (gzipped: 179.47 kB)
- Optimized bundle splitting
- Lazy-loaded routes
- Image optimization

## Development

### Code Style
- ES6+ JavaScript
- Functional components with React Hooks
- Tailwind CSS for styling
- Mobile-first responsive design

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

When contributing to this project:
1. Follow the existing code style
2. Use descriptive commit messages
3. Test changes thoroughly before submitting
4. Update documentation as needed

## Deployment

### Netlify
```bash
npm run build
# Deploy the dist folder to Netlify
```

### Vercel
```bash
npm run build
# Deploy using Vercel CLI
```

### Traditional Server
```bash
npm run build
# Copy dist folder to your web server
# Configure to serve index.html for all routes (SPA)
```

## Support

For issues or questions, please check:
- Project documentation in `STRUCTURE.md`
- Backend API documentation
- Component Storybook (if available)

## License

This project is proprietary and confidential.

