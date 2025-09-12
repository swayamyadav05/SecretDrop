# 🕵️ SecretDrop - Anonymous Message Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-8.18.0-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/NextAuth.js-4.24.11-purple?style=for-the-badge&logo=next.js" alt="NextAuth" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-cyan?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
</div>

**SecretDrop** is a modern, anonymous messaging platform built with Next.js 15 that allows users to receive honest feedback and messages without revealing the sender's identity. Perfect for creating a safe space for anonymous communication, feedback collection, and honest conversations.

## ✨ Features

### 🔐 **Authentication & Security**

- **Secure User Authentication** with NextAuth.js and JWT
- **Email Verification** system with OTP codes
- **Password Hashing** using bcryptjs
- **Username Uniqueness** validation
- **Session Management** with secure tokens

### 💬 **Anonymous Messaging**

- **Anonymous Message Sending** - Users can send messages without revealing identity
- **Message Management** - Mark messages as read/unread
- **Message Deletion** - Users can delete received messages
- **Real-time Message Status** - Track message delivery and read status

### 🤖 **AI-Powered Features**

- **AI Message Suggestions** using Google Gemini AI
- **Smart Conversation Starters** to encourage meaningful communication
- **Dynamic Content Generation** for better user engagement

### 👤 **User Experience**

- **Public Profile Pages** - Shareable links for receiving anonymous messages
- **Dashboard** with message overview and management
- **Message Acceptance Toggle** - Control when can receive messages
- **Responsive Design** - Works seamlessly on all devices

### 🎨 **Modern UI/UX**

- **Beautiful Minimal Animations** with custom CSS animations
- **Gradient Themes** and modern design patterns
- **Component-based UI** using Radix UI and shadcn/ui
- **Form Validation** with Zod schemas
- **Toast Notifications** for user feedback

## 🛠️ Tech Stack

### **Frontend**

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible component primitives

### **Backend**

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database with Mongoose ODM
- **NextAuth.js** - Authentication library
- **Zod** - Schema validation

### **AI & Communication**

- **Google Gemini AI** - AI-powered message suggestions
- **Resend** - Email delivery service
- **React Email** - Email template system

### **Developer Tools**

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Turbopack** - Fast bundler for development

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Email service account (Resend)
- Google AI API key (for suggestions feature)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/swayamyadav05/SecretDrop.git
cd SecretDrop
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/secretdrop
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/secretdrop

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key

# AI Service (Google Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
mystery-message/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/             # Main app routes
│   │   │   ├── dashboard/     # User dashboard
│   │   │   └── page.tsx       # Landing page
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── sign-in/       # Login page
│   │   │   ├── sign-up/       # Registration page
│   │   │   └── verify/        # Email verification
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth configuration
│   │   │   ├── send-message/  # Message sending
│   │   │   ├── get-messages/  # Message retrieval
│   │   │   ├── suggest-messages/ # AI suggestions
│   │   │   └── ...            # Other API endpoints
│   │   └── u/[username]/      # Public profile pages
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── MessageCard.tsx   # Message display component
│   │   ├── Navbar.tsx        # Navigation component
│   │   └── ...
│   ├── lib/                  # Utility libraries
│   │   ├── dbConnect.ts      # Database connection
│   │   ├── resend.ts         # Email service
│   │   └── utils.ts          # Helper functions
│   ├── model/                # Database models
│   │   └── User.ts           # User and Message schemas
│   ├── schemas/              # Zod validation schemas
│   ├── types/                # TypeScript type definitions
│   └── helpers/              # Helper functions
├── emails/                   # Email templates
└── public/                   # Static assets
```

## 🔧 Configuration

### Database Setup

1. **MongoDB Local**: Install MongoDB locally and use `mongodb://localhost:27017/secretdrop`
2. **MongoDB Atlas**: Create a cluster and use the connection string
3. **Models**: User model includes username, email, password, verification, and messages

### Email Configuration

1. Sign up for [Resend](https://resend.com)
2. Get your API key
3. Configure the sender domain
4. Add API key to environment variables

### AI Configuration

1. Get Google AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to environment variables
3. Configure in `src/app/api/suggest-messages/route.ts`

## 📖 API Documentation

### Authentication Endpoints

- `POST /api/sign-up` - User registration
- `POST /api/verify-code` - Email verification
- `POST /api/auth/signin` - User login
- `GET /api/check-username-unique` - Username availability

### Message Endpoints

- `POST /api/send-message` - Send anonymous message
- `GET /api/get-messages` - Retrieve user messages
- `DELETE /api/delete-message/[id]` - Delete message
- `PATCH /api/messages/[id]/read` - Mark message as read

### Feature Endpoints

- `POST /api/suggest-messages` - Get AI message suggestions
- `POST /api/accept-message` - Toggle message acceptance
- `GET /api/accept-message` - Get acceptance status

## 🎨 UI Components

### Core Components

- **MessageCard** - Display individual messages with actions
- **ShareLinkCard** - Share profile link component
- **Navbar** - Navigation with authentication state
- **Brand** - Logo and branding component

### Form Components

- **Input** - Styled input fields with validation
- **Textarea** - Multi-line text input
- **Button** - Various button styles and states
- **InputOTP** - One-time password input

## 🔐 Security Features

### Authentication

- JWT-based session management
- Secure password hashing with bcryptjs
- Email verification requirement
- Protected API routes

### Data Protection

- Input validation with Zod schemas
- SQL injection prevention with Mongoose
- XSS protection with proper sanitization
- CSRF protection with NextAuth

### Rate Limiting

- API endpoint protection (configurable)
- Message sending limits
- Account creation limits

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
RESEND_API_KEY=your-resend-api-key
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key
```

## 🧪 Testing

### Development Testing

```bash
# Run development server
npm run dev

# Lint code
npm run lint

# Type checking
npx tsc --noEmit
```

### API Testing

Use tools like Postman or Thunder Client to test API endpoints:

- Authentication flows
- Message operations
- AI suggestions
- User management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use Zod for all data validation
- Implement proper error handling
- Add comments for complex logic
- Maintain responsive design

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **shadcn** for the beautiful UI components
- **Vercel** for hosting and deployment
- **Resend** for email delivery service
- **Google** for AI capabilities

## 📞 Support

- **Documentation**: Check this README
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Email**: Contact the maintainer for support

---

<div align="center">
  <p>Built with ❤️ using Next.js and modern web technologies</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
