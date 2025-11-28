# CSI NMAMIT Website v2.0

A modern, feature-rich website for the Computer Society of India - NMAMIT Student Branch, built with React, Vite, and Tailwind CSS. This is a **production-ready, enterprise-level** web application that demonstrates modern React development practices, comprehensive feature sets, and professional-grade security implementations.

## 📋 **Complete Feature Overview**

## 🎨 **Modern Design Features**

### **Visual Effects**

- **Glassmorphism Effects**: Beautiful glass-like UI components with backdrop blur
- **Gradient Animations**: Smooth, eye-catching gradient transitions between colors
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Mobile-first approach optimized for all devices
- **Micro-interactions**: Subtle animations for enhanced user experience
- **Parallax Effects**: 3D card effects and scroll animations for depth

### **Design System**

- **Color Palette**:
  - Primary Blue: `#3b82f6`
  - Cyber Blue: `#00d4ff`
  - Cyber Purple: `#a855f7`
  - Cyber Pink: `#ec4899`
  - Smooth gradient transitions between colors

- **Typography**:
  - **Display Font**: Orbitron (futuristic headers)
  - **Body Font**: Inter (clean, readable)
  - **Mono Font**: JetBrains Mono (code blocks)

## 🎯 **Core Functionality Features**

### **1. Authentication System**

- **Google Sign-in Integration**: Firebase Auth with Google OAuth
- **Role-based Access Control**:
  - Regular Members
  - Core Members (enhanced permissions)
  - Admin users (full access)
- **Automatic Role Detection**: Based on email domains
- **Session Management**: Secure login/logout with state persistence

### **2. User Profile Management**

- **Complete Profile System**: Academic details, contact info, bio
- **Profile Completion Tracking**: Modal prompts for incomplete profiles
- **Profile Editing**: Real-time updates with validation
- **Membership Status**: Active/inactive status tracking
- **Core Member Profiles**: Enhanced profiles for core team members

### **3. Event Management System**

- **Event Browsing**: Comprehensive event listing with categories
- **Advanced Filtering**: Filter by year, type, category
- **Search Functionality**: Real-time search across events
- **Event Registration**: User registration for events
- **Admin Event Creation**: Full CRUD operations for events
- **Event Highlights**: Image gallery with lightbox functionality

### **4. Team Showcase**

- **Faculty Profiles**: Complete faculty information with photos
- **Student Team Display**: Core team members with roles and branches
- **Dynamic Team Data**: Real-time updates from Firestore
- **Member Modals**: Detailed member information popups
- **Profile Synchronization**: Auto-sync with user accounts

### **5. Membership System**

- **Online Registration**: Complete registration flow
- **Multiple Membership Plans**:
  - Annual Membership
  - Semester Membership
  - Core Member (special roles)
- **Payment Integration**: Razorpay gateway integration
- **Certificate Generation**: Downloadable membership certificates
- **Membership Status Tracking**: Active/inactive status management

### **6. Payment Gateway**

- **Razorpay Integration**: Secure payment processing
- **Multiple Payment Methods**: Cards, UPI, Net Banking
- **Payment Verification**: Backend verification system
- **Transaction Tracking**: Complete payment history
- **Rate Limiting**: Prevents payment abuse

## 🛠️ **Technical Stack**

### **Frontend Technologies**

- **React 18**: Latest React with hooks and modern patterns
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Advanced animations and transitions
- **React Parallax Tilt**: 3D card effects
- **Lucide React**: Modern icon library (replaced all emojis)

### **Backend & Services**

- **Firebase Firestore**: NoSQL database for real-time data
- **Firebase Auth**: Authentication and user management
- **Firebase Storage**: File upload and storage
- **Razorpay**: Payment gateway integration
- **EmailJS**: Email service integration

## 🛠️ **Installation & Setup**

### **Prerequisites**

- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase project setup
- Razorpay account

### **Environment Configuration**

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your-razorpay-key
VITE_RAZORPAY_KEY_SECRET=your-razorpay-secret

# API Configuration
VITE_API_URL=http://localhost:3000
```

### **Development Commands**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Setup Steps**

1. **Clone the repository**

```bash
git clone <repository-url>
cd betacsinmamit
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Firebase project**
   - Create a new Firebase project
   - Enable Authentication (Google provider)
   - Create Firestore database
   - Enable Storage

4. **Set up Razorpay account**
   - Create Razorpay account
   - Get API keys from dashboard

5. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase and Razorpay credentials

6. **Run the development server**

```bash
npm run dev
```

## 💳 **Razorpay Webhook Setup (Node.js Backend)**

To enable automatic membership updates after payment, you must configure a webhook in your Razorpay dashboard.

1. **Go to Razorpay Dashboard**: Navigate to **Settings** > **Webhooks**.
2. **Add New Webhook**: Click on "+ Add New Webhook".
3. **Webhook URL**: Enter your backend URL followed by `/webhook`.
    - *Development*: Use a tool like ngrok to expose your local server (e.g., `https://your-ngrok-url.ngrok-free.app/webhook`).
    - *Production*: `https://your-production-backend.com/webhook`
4. **Secret**: Enter the secret key defined in your `backend/.env` file as `WEBHOOK_SECRET`.
    - Example: `suckmydickbitch` (as seen in your env, but please use a secure random string in production!)
5. **Active Events**: Select **`payment.captured`**.
6. **Create Webhook**: Click "Create Webhook" to save.

> [!IMPORTANT]
> Ensure the `WEBHOOK_SECRET` in your `backend/.env` file matches exactly what you enter in the Razorpay dashboard. If they don't match, the backend will reject the webhook requests.

## 🔐 Payments Webhook (Optional Hardening)

We added a Firebase Cloud Function to validate Razorpay webhooks and enforce simple registration invariants. This is optional and does not affect existing frontend flows.

Deploy steps:

1. Install Firebase tools: `npm i -g firebase-tools`
2. Login and select your project: `firebase login` then `firebase use <your-project-id>`
3. Configure secret: `firebase functions:config:set razorpay.webhook_secret="YOUR_WEBHOOK_SECRET"`
4. Deploy functions: `cd functions && npm install && cd .. && firebase deploy --only functions`

Function endpoint: `razorpayWebhook` (use the HTTPS URL from Firebase console). Configure this URL and secret in the Razorpay dashboard.

## 📱 **Page Structure & Navigation**

### **Public Pages**

1. **Home Page** (`/`):
   - Hero section with animated typing effect
   - About section with 3D card effects
   - Features showcase grid
   - Event highlights gallery
   - Testimonials carousel
   - Call-to-action section

2. **Events Page** (`/events`):
   - Event listing with advanced filters
   - Search functionality
   - Category-based filtering
   - Event registration system

3. **Team Page** (`/team`):
   - Faculty and student team showcase
   - Modal views for detailed member info
   - Dynamic team data from database

4. **Recruit Page** (`/recruit`):
   - Membership registration form
   - Payment integration
   - Benefits section
   - Membership plans comparison

### **Protected Pages**

1. **Profile Page** (`/profile`):
   - User dashboard
   - Profile editing
   - Membership details
   - Quick actions

2. **Core Profile Page** (`/core-profile`):
   - Enhanced profile for core members
   - Special permissions and features

### **Admin Pages**

1. **Admin Dashboard** (`/admin`):
   - Django-style admin interface
   - Statistics and analytics
   - Quick access to all admin functions

2. **User Management** (`/admin/users`):
   - View, edit, delete users
   - Role management
   - User analytics

3. **Event Management** (`/admin/events`):
   - Create, edit, publish events
   - Event analytics
   - Registration management

4. **Member Management** (`/admin/members`):
   - Core member management
   - Role assignments
   - Member analytics

5. **Payment Tracking** (`/admin/payments`):
   - Payment analytics
   - Transaction history
   - Revenue tracking

## 🔧 **Key Components Architecture**

### **Layout Components**

- **Navbar**: Modern navigation with glassmorphism effects
- **Footer**: Comprehensive footer with newsletter signup
- **ScrollToTop**: Smooth scroll to top functionality
- **ParticlesBackground**: Interactive particle animation

### **Home Components**

- **Hero**: Animated hero with typing effects
- **About**: 3D card effects with tilt animations
- **Features**: Technology showcase grid
- **Highlights**: Image gallery with lightbox
- **Testimonials**: Carousel with smooth animations
- **CTA**: Call-to-action with gradient background

### **UI Components**

- **Glass Cards**: Backdrop blur effects
- **Animated Buttons**: Hover states and transitions
- **Custom Input Fields**: Icons and validation
- **Loading States**: Skeletons for better UX
- **Toast Notifications**: User feedback system

## 🔐 **Security Features**

### **Authentication Security**

- **Firebase Authentication**: Secure Google OAuth integration
- **Protected Routes**: Role-based access control
- **Session Management**: Automatic logout and session handling
- **Admin Authentication**: Separate admin context for security

### **Data Security**

- **Input Validation**: Comprehensive form validation
- **Data Sanitization**: XSS and injection prevention
- **Rate Limiting**: Payment attempt limiting
- **Environment Variables**: Sensitive data protection
- **Firestore Security Rules**: Database-level protection

### **Production Security**

- **Console Cleanup**: 271 console statements commented out
- **Security Headers**: Middleware for security headers
- **Content Protection**: Text selection prevention on sensitive pages
- **Watermarking**: Copyright protection for copied content

## 🚀 **Performance Optimizations**

### **Build & Development**

- **Vite**: Fast development server and optimized builds
- **Code Splitting**: Better load times with lazy loading
- **Lazy Loading**: Images and components loaded on demand
- **Optimized Animations**: Framer Motion for smooth performance
- **Responsive Images**: Proper sizing and optimization

### **User Experience**

- **Loading Skeletons**: Better perceived performance
- **Smooth Transitions**: Framer Motion animations
- **Error Handling**: Comprehensive error states
- **Offline Support**: Fallback data when offline

## 📈 **Future Enhancement Roadmap**

### **Planned Features**

- [ ] **PWA Support**: Offline access and app-like experience
- [ ] **Push Notifications**: Event reminders and updates
- [ ] **Advanced Search**: Enhanced search with filters
- [ ] **Social Media Integration**: Share events and achievements
- [ ] **Blog/News Section**: Content management system
- [ ] **Forum**: Discussion platform for members
- [ ] **Project Showcase**: Portfolio gallery
- [ ] **Alumni Network**: Alumni connection platform
- [ ] **Job Board**: Career opportunities
- [ ] **Resource Library**: Learning materials and resources

## 📊 **Project Statistics**

### **Code Quality**

- **36 files** modified for production cleanup
- **271 console statements** commented out
- **Multiple contexts** for state management
- **Comprehensive error handling**
- **TypeScript support** with proper configuration

### **Feature Coverage**

- **Complete authentication system**
- **Full CRUD operations** for all entities
- **Payment integration** with verification
- **Admin dashboard** with Django-style interface
- **Responsive design** for all devices
- **Modern UI/UX** with animations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔄 **How It Works**

### **Application Flow**

1. **User Authentication**: Users sign in with Google OAuth through Firebase Auth
2. **Role Detection**: System automatically detects user role based on email domain
3. **Profile Management**: Users complete their profiles with academic details
4. **Event Participation**: Users can browse and register for events
5. **Membership Registration**: Users can register for CSI membership with payment
6. **Admin Management**: Admins can manage users, events, and payments through dashboard

### **Data Flow**

- **Real-time Updates**: Firestore provides real-time data synchronization
- **State Management**: React Context manages global application state
- **Payment Processing**: Razorpay handles secure payment transactions
- **File Storage**: Firebase Storage manages user uploads and assets

### **Security Flow**

- **Authentication**: Firebase Auth handles user authentication
- **Authorization**: Role-based access control for different user types
- **Data Validation**: Input sanitization and validation on all forms
- **Payment Security**: Razorpay's secure payment processing

## 👥 **Credits**

Developed by the **CSI NMAMIT Tech Team** with ❤️

### **Team Members**

- **Frontend Development**: React, Vite, Tailwind CSS
- **Backend Integration**: Firebase, Razorpay
- **UI/UX Design**: Modern glassmorphism and animations
- **Security Implementation**: Comprehensive security measures

---

**Note**: This is version 2.0 of the CSI NMAMIT website, featuring a complete redesign with modern technologies, enhanced user experience, and enterprise-level security implementations. The application is production-ready and designed to handle real-world usage with proper error handling, loading states, and performance optimizations.

## 🔧 Console Statement Cleanup

All console statements have been commented out for production. The following files were modified:

### Modified Files (36 total)

#### Hooks (5 files)

- `src/hooks/useEvents.js`
- `src/hooks/useRecruit.js`
- `src/hooks/useProfileFirestore.js`
- `src/hooks/useProfile.js`
- `src/hooks/useSecureRecruit.js`

#### Contexts (2 files)

- `src/contexts/AuthContext.jsx`
- `src/contexts/AdminAuthContext.jsx`

#### Config (5 files)

- `src/config/emailjs.js`
- `src/config/coreMembers.js`
- `src/config/cloudinary.js`
- `src/config/firebase.js`
- `src/config/firebase-secure.js`

#### Services (3 files)

- `src/services/paymentService.js`
- `src/services/eventService.js`
- `src/services/emailService.js`

#### Pages - Admin (10 files)

- `src/pages/NotFound.jsx`
- `src/pages/Admin/Payments/AdminPayments.jsx`
- `src/pages/Admin/Payments/services/paymentDataService.js`
- `src/pages/Admin/Payments/components/OTPModal.jsx`
- `src/pages/Admin/Members/utils/helpers.js`
- `src/pages/Admin/Members/AdminEMembers.jsx`
- `src/pages/Admin/AdminUsers-clean.jsx`
- `src/pages/Admin/AdminLogin.jsx`
- `src/pages/Admin/AdminEvents.jsx`
- `src/pages/Admin/AdminDashboard.jsx`
- `src/pages/Admin/AdminEMembers-clean.jsx`

#### Components (5 files)

- `src/components/Layout/Navbar.jsx`
- `src/components/Events/EventCard.jsx`
- `src/components/Admin/EventForm.jsx`
- `src/components/Profile/QuickActions.jsx`
- `src/components/Profile/ProfileCompletionModal.jsx`

#### Utils (4 files)

- `src/utils/emailDiagnostics.js`
- `src/utils/secureCoreMembersUtils.js`
- `src/utils/securityUtils.js`
- `src/utils/testCoreMembers.js`

#### Main (1 file)

- `src/main.jsx`

**Total console statements commented**: 271 statements across 36 files

To re-enable console statements for development, uncomment the relevant lines in the files listed above.
