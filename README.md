# Hacker Hinge

**The minimalist way to explore Hacker News jobs — YC startups, Who's Hiring and HN Jobs — with fast swipes and smart summaries.**

A mobile-first Tinder-like interface for browsing Hacker News job postings with AI-powered job enrichment, swipe gestures, and favorite management.

## 🚀 Features

### Core Functionality
- **📱 Mobile-First Design**: Optimized swipe interface for mobile devices with desktop keyboard support
- **🔄 Tinder-Style Swiping**: Intuitive left/right swipe gestures for job discovery
- **🤖 AI Job Enrichment**: Automatic job description enhancement using Perplexity AI
- **⭐ Favorites Management**: Save and manage favorite job listings
- **🎯 Real-time Job Fetching**: Live scraping of Hacker News job board
- **🌙 Dark Mode**: Built-in theme support with smooth transitions

### User Experience
- **⚡ Instant Loading**: Optimized performance with sequential job enrichment
- **📚 Job Stacking**: Visual card stacking with smooth animations
- **🔍 Smart Summaries**: AI-generated role titles, descriptions, and tags
- **🏢 Company Logos**: Automatic favicon fetching for visual identification
- **💫 Smooth Animations**: Framer Motion powered transitions and gestures

### Authentication & Data
- **🔐 Multi-Auth Support**: Google OAuth and email/password authentication
- **💾 Persistent Favorites**: MongoDB-backed user data storage
- **🔒 Session Management**: Secure JWT-based sessions with NextAuth.js
- **🛡️ Protected Routes**: Middleware-based route protection

## 🏗️ Technical Architecture

### Tech Stack
- **Framework**: Next.js 15.4.6 with App Router
- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Animation**: Framer Motion for gestures and transitions
- **Authentication**: NextAuth.js with Google & Credentials providers
- **Database**: MongoDB with Prisma ORM
- **AI Integration**: Perplexity API for job enrichment
- **Package Manager**: pnpm with Turbopack

### Project Structure
```
hacker-hinge/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── enrich/        # AI job enrichment
│   │   ├── favorites/     # Favorites CRUD
│   │   └── jobs/          # Job fetching
│   ├── dashboard/         # Protected favorites page
│   └── page.tsx           # Main swipe interface
├── components/            # React components
├── lib/                   # Utilities
│   ├── auth.ts            # NextAuth configuration
│   └── db.ts              # Prisma client
├── prisma/                # Database schema
└── types/                 # TypeScript definitions
```

### Database Schema (MongoDB)
```prisma
User {
  id            String
  name          String?
  email         String?
  emailVerified DateTime?
  image         String?
  passwordHash  String?
  accounts      Account[]
  sessions      Session[]
  favorites     FavoriteJob[]
}

FavoriteJob {
  id        String
  userId    String
  jobId     String
  title     String
  url       String?
  addedAt   DateTime
}
```

### API Endpoints
- `GET /api/jobs` - Fetch and parse Hacker News jobs
- `POST /api/enrich` - AI-enhance job descriptions
- `GET/POST/DELETE /api/favorites` - Manage user favorites
- `POST /api/auth/signup` - User registration
- `[...nextauth]` - Authentication flows

## 🤖 AI Integration

### Job Enrichment Pipeline
1. **Real-time Processing**: Jobs are enriched as users swipe
2. **Perplexity AI**: Generates structured job data including:
   - Clean role titles (e.g., "Senior Frontend Engineer")
   - 2-3 line job summaries
   - Tech stack and skill tags
   - Company information and location
   - Compensation details (when available)
3. **Caching**: Enriched data is cached to prevent duplicate API calls
4. **Fallback Handling**: Graceful degradation when AI service is unavailable

### Data Sources
- **Primary**: Hacker News job board scraping
- **Enhancement**: Meta description and content extraction
- **Logos**: Google Favicon API integration

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-First**: Optimized for touch interactions
- **Desktop Support**: Keyboard navigation (left/right arrows)
- **Adaptive Layout**: Responsive breakpoints for all screen sizes

### Visual Elements
- **Card Stacking**: 3D-style card stack with depth
- **Gesture Feedback**: Real-time visual feedback during swipes
- **Loading States**: Elegant loading animations and placeholders
- **Theme Support**: CSS custom properties for easy theming

### Accessibility
- **Keyboard Navigation**: Full keyboard support for desktop users
- **ARIA Labels**: Proper semantic markup
- **Focus Management**: Logical tab order and focus states

## 🔧 Setup & Development

### Prerequisites
- Node.js 18+
- pnpm
- MongoDB database
- Perplexity API key (optional)
- Google OAuth credentials (optional)

### Environment Variables
```env
# Database
DATABASE_URL=mongodb://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI Enrichment (optional)
PERPLEXITY_API_KEY=your-perplexity-key
```

### Installation
```bash
# Clone repository
git clone https://github.com/your-username/hacker-hinge.git
cd hacker-hinge

# Install dependencies
pnpm install

# Setup environment
cp env.example .env.local
# Edit .env.local with your values

# Generate Prisma client
pnpm prisma generate

# Start development server
pnpm dev
```

### Build & Deploy
```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🔒 Security Features

- **CSRF Protection**: Built-in NextAuth.js CSRF protection
- **Secure Sessions**: JWT tokens with configurable expiration
- **Input Validation**: Zod schema validation for API inputs
- **Rate Limiting**: Implicit rate limiting through caching
- **Password Hashing**: bcryptjs for secure password storage

## 📊 Performance Optimizations

- **Sequential Enrichment**: Only enriches current and next job to reduce API calls
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: 1-hour cache for job listings
- **Bundle Optimization**: Turbopack for faster development builds
- **Code Splitting**: Automatic route-based code splitting

## 🎯 User Flow

1. **Landing**: Users see animated card preview and sign-in option
2. **Authentication**: Quick Google OAuth or email signup
3. **Onboarding**: Brief introduction to swipe mechanics
4. **Job Discovery**: Swipe through AI-enhanced job cards
5. **Favorites**: Access saved jobs in dashboard
6. **Management**: Remove or revisit favorite opportunities

## 🚦 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features**: Requires JavaScript, supports touch and mouse interactions

## 📱 Mobile Features

- **Touch Gestures**: Native swipe detection with Framer Motion
- **Viewport Optimization**: 100dvh for proper mobile viewport handling
- **PWA Ready**: Can be installed as a web app
- **Offline Graceful**: Handles network failures elegantly

## 🔄 Data Flow

1. **Job Fetching**: Periodic scraping of Hacker News job board
2. **Content Enhancement**: Meta description extraction from job URLs
3. **AI Processing**: Perplexity API enrichment with structured output
4. **User Interaction**: Swipe gestures trigger favorite/skip actions
5. **Persistence**: User preferences stored in MongoDB

## 📈 Scalability Considerations

- **Stateless Design**: API routes are stateless for horizontal scaling
- **Database Indexing**: Optimized queries with proper indexes
- **Caching Strategy**: Multiple cache layers for performance
- **External API Limits**: Graceful handling of rate limits
- **Error Boundaries**: Comprehensive error handling throughout

---

**Built with ❤️ for the developer community**
