# StyleHub - E-Commerce Clothing Platform

A modern e-commerce clothing platform built with Next.js, featuring user authentication and comprehensive product management. This application demonstrates full-stack development with secure user authentication, CRUD operations, and a responsive UI.

## 🚀 Features

### Authentication
- ✅ User registration with email and password
- ✅ Secure login/logout with NextAuth.js
- ✅ Session management and protected routes
- ✅ Password hashing with bcrypt

### Product Management (CRUD)
- ✅ **Create**: Add new products (authenticated users only)
- ✅ **Read**: View all products (public) and individual product details
- ✅ **Update**: Edit products (product owner only)
- ✅ **Delete**: Remove products (product owner only)
- ✅ Image upload support with Cloudinary integration
- ✅ Product categorization and stock management

### User Interface
- ✅ Responsive design with Tailwind CSS
- ✅ Product catalog with search and pagination
- ✅ Detailed product view with ownership information
- ✅ Authentication forms with validation
- ✅ Navigation with authentication status
- ✅ Loading states and error handling
- ✅ Modern UI components and animations

### API Features
- ✅ RESTful API endpoints
- ✅ Authentication middleware
- ✅ Database integration with Prisma ORM
- ✅ Input validation and error handling

## 🛠 Tech Stack

- **Frontend & Backend**: Next.js 15 with App Router
- **Authentication**: NextAuth.js with JWT strategy
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **UI Components**: Custom components with Radix UI
- **Image Upload**: Cloudinary (optional)
- **Deployment**: Vercel, Railway, or Render

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Products
- `GET /api/products` - List all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (authenticated)
- `PUT /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)

## 🚦 Getting Started

### Prerequisites
- Node.js 18 or later
- PostgreSQL database (local or cloud)
- Git

### Quick Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Setup**
Create `.env.local` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"
NEXT_PUBLIC_BACKEND_URL="http://localhost:3000/api"
```

3. **Database Setup**
```bash
npm run db:push    # Create tables
npm run db:seed    # Add sample data
```

4. **Start Development**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Sample Users (from seed data)
- Email: `john@example.com`, Password: `password123`
- Email: `jane@example.com`, Password: `password123`

## 🔒 Security Features

- **Authentication Required**: Only logged-in users can create products
- **Ownership Validation**: Users can only edit/delete their own products
- **Input Validation**: All form inputs are validated on both client and server
- **Password Security**: Passwords are hashed using bcrypt
- **Session Management**: Secure session handling with NextAuth.js
- **CSRF Protection**: Built-in CSRF protection
- **SQL Injection Prevention**: Prisma ORM provides protection against SQL injection

## 📱 User Experience

### For Unauthenticated Users
- Browse all products
- View product details
- See product owner information
- Access to sign up and sign in pages

### For Authenticated Users
- All unauthenticated features plus:
- Create new products
- Edit their own products
- Delete their own products
- See ownership indicators
- Access to protected routes

## 🗄 Database Schema

### Users Table
- `id` (String, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `name` (String, Optional)
- `createdAt`, `updatedAt` (DateTime)

### Products Table
- `id` (String, Primary Key)
- `name` (String, Required)
- `description` (String, Required)
- `price` (Float, Required)
- `image` (String, Optional)
- `category` (String, Optional)
- `stock` (Integer, Default: 0)
- `userId` (String, Foreign Key)
- `createdAt`, `updatedAt` (DateTime)

## 🧪 Testing Guide

1. **User Registration & Authentication**
   - Navigate to `/auth/signup` to create an account
   - Navigate to `/auth/signin` to login
   - Verify authentication state in navigation

2. **Product Management**
   - Create products via `/products/new` (requires login)
   - View all products on homepage
   - Click on products to view details
   - Edit/delete only your own products

3. **Security Testing**
   - Try accessing `/products/new` without authentication (should redirect)
   - Try editing other users' products (should show authorization message)
   - Verify API endpoints require proper authentication

## 🚀 Deployment

### Database Setup Options

1. **Supabase (Recommended)**
   - Free PostgreSQL database
   - Built-in authentication (optional)
   - Easy setup and management

2. **Railway**
   - One-click PostgreSQL deployment
   - Automatic connection string generation

3. **Render**
   - Free tier PostgreSQL available
   - Simple deployment process

### Platform Deployment

#### Vercel (Recommended for Next.js)
1. Connect your GitHub repository
2. Add environment variables in dashboard
3. Deploy automatically on push

#### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy with PostgreSQL addon

## 📁 Project Structure

```
app/
├── api/                 # API routes
│   ├── auth/           # Authentication endpoints
│   └── products/       # Product CRUD endpoints
├── auth/               # Authentication pages
├── components/         # Reusable UI components
├── products/           # Product pages
├── services/           # API services
└── utils/              # Utility functions
prisma/
├── schema.prisma       # Database schema
└── seed.ts            # Sample data seeding
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is built for educational purposes as part of an e-commerce web development assignment.

## 🆘 Support

For setup issues or questions, please refer to the [SETUP.md](./SETUP.md) file or check the troubleshooting section in the setup guide.
