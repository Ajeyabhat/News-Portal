# Project Structure Documentation

## Overview
This document outlines the improved code organization for the News Portal project. The structure follows best practices for scalability, maintainability, and clarity.

---

## Client-Side Structure (`client/src/`)

The frontend follows a component-based architecture with service layer for API calls.

**Project Status:** Clean and organized - only active folders included.

### **Services** (`client/src/services/`)
Centralized API communication layer - all HTTP requests go here.

**Files:**
- **`articleService.js`** - Article CRUD operations
  - `fetchArticles()` - Get all articles with filters
  - `fetchArticleById()` - Get single article
  - `createArticle()` - Create new article
  - `updateArticle()` - Update existing article
  - `deleteArticle()` - Delete article
  - `searchArticles()` - Search functionality

- **`authService.js`** - Authentication operations
  - `registerUser()` - User registration
  - `loginUser()` - User login
  - `verifyOtp()` - OTP verification
  - `requestPasswordReset()` - Password reset request
  - `resetPassword()` - Reset password with token
  - `getAuthUser()` - Get current user

- **`bookmarkService.js`** - Bookmark operations
  - `getBookmarks()` - Get all bookmarks
  - `addBookmark()` - Add to bookmarks
  - `removeBookmark()` - Remove from bookmarks
  - `toggleBookmark()` - Toggle bookmark status

**Usage in Components:**
```javascript
import { fetchArticles } from '../services/articleService';

const articles = await fetchArticles('en', 'ExamAlert', 1, 30);
```

---

### **Constants** (`client/src/constants/`)
Centralized configuration and constants used throughout the app.

**Files:**
- **`apiEndpoints.js`** - API endpoint definitions
  - `API_ENDPOINTS` object - All endpoint URLs
  - `API_CONFIG` - API configuration (timeout, retry, etc.)
  - Helper functions for dynamic endpoint construction

- **`messages.js`** - UI messages and labels
  - `MESSAGES` - Success, error, and info messages
  - `BUTTON_LABELS` - Button text labels
  - `PLACEHOLDER_TEXT` - Input placeholder text

- **`roles.js`** - Role-based access control
  - `ROLES` - Role definitions (admin, publisher, user, guest)
  - `PERMISSIONS` - Permission mappings
  - Helper functions: `hasPermission()`, `isAdmin()`, `canPublish()`

- **`languages.js`** - Language configurations
  - `LANGUAGES` - Supported languages
  - `LANGUAGE_NAMES` - Display names
  - `LANGUAGE_OPTIONS` - Language dropdown options
  - Helper functions: `getLanguageName()`, `isValidLanguage()`

**Usage in Components:**
```javascript
import { MESSAGES } from '../constants/messages';
import { ROLES } from '../constants/roles';

toast.success(MESSAGES.SUCCESS_BOOKMARK);
if (hasPermission(user.role, 'CREATE_ARTICLE')) { ... }
```

---

## Server-Side Structure (`server/`)

The backend follows a layered architecture with clear separation of concerns.

**Project Status:** Clean - only essential folders with active code included.

### **Utilities** (`server/utils/`)
Reusable utility functions for common operations.

**Files:**
- **`helpers.js`** - General helper functions
  - `validateEmail()` - Email validation
  - `validatePassword()` - Password strength validation
  - `generateOTP()` - Generate 6-digit OTP
  - `getOTPExpiration()` - Calculate OTP expiration
  - `isOTPExpired()` - Check if OTP expired
  - `sanitizeInput()` - Input sanitization
  - `formatDate()` - Date formatting
  - `calculateReadingTime()` - Reading time calculation
  - `isValidMongoId()` - MongoDB ID validation
  - `generateUniqueFilename()` - Unique filename generation

- **`languageHelpers.js`** - Existing language helper functions

**Usage in Controllers:**
```javascript
import { validateEmail, generateOTP } from '../utils/helpers';

if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email' });
const otp = generateOTP();
```

---

### **Constants** (`server/constants/`)
Server-side configuration and constants.

**Files:**
- **`config.js`** - Global configuration
  - `OTP_CONFIG` - OTP settings (length, expiration, max attempts)
  - `JWT_CONFIG` - JWT settings (secret, expiration)
  - `RATE_LIMIT_CONFIG` - Rate limiting settings
  - `UPLOAD_CONFIG` - File upload settings (max size, formats, compression)
  - `PAGINATION_CONFIG` - Pagination defaults
  - `EMAIL_CONFIG` - Email configuration
  - `ARTICLE_CATEGORIES` - Predefined article categories
  - `USER_ROLES` - User role definitions
  - `HTTP_STATUS` - HTTP status code references
  - `ERROR_MESSAGES` - Standard error messages

**Usage in Controllers:**
```javascript
import { OTP_CONFIG, UPLOAD_CONFIG, HTTP_STATUS } from '../constants/config';

if (attempts >= OTP_CONFIG.MAX_ATTEMPTS) { ... }
if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) { ... }
res.status(HTTP_STATUS.CREATED).json({ ... });
```

---

## Existing Directories (Not Changed)

### **Client**
- `components/` - React components (UI components, admin components)
- `pages/` - Page components (routes)
- `context/` - Context API (Auth, Language, Theme)
- `hooks/` - Custom React hooks (for future expansion)
- `public/` - Static files
- `utils/` - Existing utility functions (helpers.js, etc.)
- `App.js`, `index.js` - Entry points

### **Server**
- `routes/` - API route definitions (articleRoutes, userRoutes, etc.)
- `controllers/` - Route handlers (business logic)
- `models/` - MongoDB schemas
- `middleware/` - Express middleware (auth, upload, etc.)
- `config/` - Configuration files (environment variables, settings)
- `uploads/` - Uploaded files directory
- `index.js` - Entry point
- `package.json` - Dependencies

---

## Migration Guide

### For Components Using API Calls:
**Before:**
```javascript
const res = await axios.get('/api/articles?language=en&page=1&limit=30');
```

**After:**
```javascript
import { fetchArticles } from '../services/articleService';

const res = await fetchArticles('en', null, 1, 30);
```

### For Using Messages:
**Before:**
```javascript
toast.success('Article bookmarked successfully!');
```

**After:**
```javascript
import { MESSAGES } from '../constants/messages';

toast.success(MESSAGES.SUCCESS_BOOKMARK);
```

### For Server Utilities:
**Before:**
```javascript
const otp = Math.floor(100000 + Math.random() * 900000).toString();
```

**After:**
```javascript
import { generateOTP } from '../utils/helpers';

const otp = generateOTP();
```

---

## Best Practices

### ✅ DO:
- Import services in pages and components for API calls
- Use constants for all static values (messages, endpoints, configs)
- Place helper functions in utils
- Use rolePermissions for access control
- Centralize API configuration in apiEndpoints.js

### ❌ DON'T:
- Make direct axios calls in components (use services)
- Hard-code API endpoints in components
- Hard-code messages or labels in components
- Create duplicate utility functions (check utils/ first)
- Scatter configuration across files

---

## Benefits

1. **Maintainability** - Easy to find and update code
2. **Scalability** - Simple to add new features
3. **Reusability** - Services and utilities can be used anywhere
4. **Consistency** - Centralized configuration and messaging
5. **Testability** - Easy to mock and test services
6. **Performance** - Cleaner imports and reduced bundle size
7. **Security** - Centralized validation and error handling

---

## Future Improvements

- Add `client/src/hooks/` for custom React hooks
- Add `server/services/` for complex business logic extraction
- Add `client/src/api/` for axios instance configuration
- Add request/response interceptors
- Add comprehensive error boundary components
- Add logging service for both client and server

---

*Last Updated: December 9, 2025*
