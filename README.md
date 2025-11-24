# ClipEdit - AI-Powered Video Editing Platform

Transform your long-form content into viral shorts with AI-powered editing, auto-captions, and intelligent thumbnail generation. ClipEdit is the ultimate toolkit for content creators who want to focus on creativity, not tedious editing.

## 🎯 What is ClipEdit?

ClipEdit is a modern web application that leverages artificial intelligence to:
- **Auto-Edit Videos** - Automatically cuts silences, removes filler words, adds smooth transitions, and syncs B-roll
- **Generate Captions** - 99% accurate AI transcription with auto-styling in 50+ languages
- **Create Thumbnails** - CTR-optimized thumbnail designs based on 10M+ data points
- **Optimize for Virality** - Real-time performance insights and analytics

Perfect for YouTube creators, TikTok streamers, podcast producers, and content agencies looking to scale their output without the editing headache.

## 🚀 Tech Stack

- **Frontend**: Next.js 16.0.3 with React 19.2.0
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS v3 with custom animations
- **UI Components**: Shadcn UI with Radix UI primitives
- **Icons**: lucide-react
- **Build Tool**: Next.js with Turbopack
- **Backend (Planned)**: Supabase (PostgreSQL, auth, storage)
- **AI Stack (Planned)**: OpenAI Whisper, GPT-4/Claude, FFmpeg

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** 18.17 or higher ([Download](https://nodejs.org/))
- **npm** 9.0 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

## 🛠️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/RishiJain905/ClipEdit.git
cd ClipEdit
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- Next.js 16 framework
- React 19 with React DOM
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn UI components (44+ pre-built components)
- All Radix UI dependencies
- lucide-react for icons
- Utility libraries (clsx, tailwind-merge, class-variance-authority)

### 3. Start the Development Server

```bash
npm run dev
```

The application will start at **http://localhost:3000**

Open your browser and navigate to the URL. You should see:
- Landing page with hero section, features, how it works, pricing, testimonials
- Navigation to `/login` and `/signup` pages
- Fully responsive design for mobile, tablet, and desktop

## 📁 Project Structure

```
ClipEdit/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Landing page (complete)
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── signup/
│   │   └── page.tsx         # Signup page
│   └── globals.css          # Global Tailwind styles
├── components/
│   ├── ui/                  # Shadcn UI components (44+ components)
│   ├── figma/
│   │   └── ImageWithFallback.tsx  # Image component with error handling
│   ├── LoginPage.tsx        # Login component
│   └── SignupPage.tsx       # Signup component
├── lib/
│   └── utils.ts             # Utility functions (cn for class merging)
├── public/                  # Static assets
├── tsconfig.json            # TypeScript configuration
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies and scripts
```

## 📦 Available npm Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint to check code quality
npm run lint
```

## 🎨 Pages

### Landing Page (`/`)
Complete landing page featuring:
- Responsive navigation with smooth scrolling
- Hero section with animated floating cards
- Feature showcase with bento grid layout
- "How It Works" 3-step process
- Pricing section with 3 tiers (Free, Creator, Pro)
- Social proof with 6 creator testimonials
- Call-to-action section
- Full footer with links and social media

### Login Page (`/login`)
- Email/password login form
- Link to signup page
- Navigation back to home

### Signup Page (`/signup`)
- Registration form
- Account creation fields
- Link to login page

## 🔧 Configuration

### TypeScript Path Aliases
The project uses path aliases for cleaner imports:
```typescript
// Instead of: import { Button } from '../../../components/ui/button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

### Tailwind CSS
- Version: 3.x (downgraded from v4 for PostCSS compatibility)
- Custom CSS variables in `app/globals.css`
- Supports dark mode (configured but not active by default)

## 🚧 Coming Soon

- Supabase integration (authentication & database)
- Video upload functionality
- AI video editing engine
- Auto-caption generation
- AI thumbnail creation
- Performance analytics dashboard
- API routes for backend processing
- User dashboard and project management

## 📝 Development Notes

- **Client Components**: Pages and interactive components use `"use client"` directive
- **Routing**: Uses Next.js App Router with dynamic routes
- **Styling**: Pure Tailwind CSS with custom utilities
- **Components**: All UI built with Shadcn/Radix for accessibility

## 🤝 Contributing

This project is actively being developed. For contributions, please:
1. Create a feature branch from `Dev_Rishi`
2. Make your changes
3. Submit a pull request

## 📄 License

This project is private and owned by Rishi Jain (RishiJain905).

## 🎯 Need Help?

If you encounter any issues:
1. Make sure Node.js 18+ is installed
2. Clear `node_modules` and reinstall: `rm -r node_modules && npm install`
3. Clear Next.js cache: `rm -r .next && npm run dev`
4. Check that port 3000 is not in use

---

**Built with ❤️ for creators who want to ship fast.**
