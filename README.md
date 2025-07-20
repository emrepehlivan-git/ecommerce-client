# 🛒 E-Commerce Client

A modern, full-featured e-commerce web application built with Next.js 15, featuring a dual-interface design with both customer-facing shop and admin panel.

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-5.0.0-beta.28-green)

## ✨ Features

### 🛍️ Customer Interface
- **Multi-language Support**: Turkish and English localization
- **Product Catalog**: Browse products by categories with advanced filtering
- **Shopping Cart**: Persistent cart with real-time updates
- **User Authentication**: Secure login with Keycloak integration
- **User Profile Management**: Address management and order history
- **Checkout Process**: Streamlined checkout with order confirmation
- **Responsive Design**: Mobile-first approach with modern UI

### 🔧 Admin Panel
- **Product Management**: CRUD operations for products with image upload
- **Category Management**: Organize products with hierarchical categories
- **Order Management**: View and manage customer orders
- **User Management**: Administer user accounts and roles
- **Stock Management**: Track and update product inventory
- **Role-based Access Control**: Secure admin access with role permissions
- **Settings Management**: Configure application settings

### 🛠️ Technical Features
- **API Integration**: Auto-generated TypeScript API client using Orval
- **Real-time Updates**: SignalR integration for live notifications
- **State Management**: Zustand for global state management
- **Form Handling**: React Hook Form with Zod validation
- **Data Tables**: Advanced data tables with sorting and filtering
- **Image Management**: Cloudinary integration for image storage
- **Theme Support**: Dark/light mode with next-themes
- **Performance**: Optimized with React Query for data fetching

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### State Management & Data
- **Zustand** - Lightweight state management
- **React Query (TanStack Query)** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Authentication & Security
- **NextAuth.js 5** - Authentication framework
- **Keycloak** - Identity and access management
- **JWT** - Token-based authentication

### Development Tools
- **Orval** - API client generation
- **ESLint** - Code linting
- **Bun** - Fast JavaScript runtime
- **Docker** - Containerization

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-client
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using bun (recommended)
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_AUTH_SERVER_URL=http://localhost:8080/
   NEXT_PUBLIC_CLIENT_ID=nextjs-client
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXTAUTH_SECRET=your-secret-key
   ```

4. **Generate API client**
   ```bash
   npm run generate:api
   # or
   bun run generate:api
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t ecommerce-client .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 ecommerce-client
   ```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   └── [locale]/          # Internationalization
│       ├── (shop)/        # Customer-facing routes
│       └── (admin)/       # Admin panel routes
├── components/            # Reusable UI components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   ├── cart/             # Shopping cart components
│   ├── product/          # Product-related components
│   └── ui/               # Base UI components
├── hooks/                # Custom React hooks
├── i18n/                 # Internationalization
├── lib/                  # Utility libraries
├── providers/            # React context providers
├── stores/               # Zustand stores
└── types/                # TypeScript type definitions
```

## 🌐 Internationalization

The application supports multiple languages:
- **Turkish (tr)** - Default language
- **English (en)** - Secondary language

Language switching is available throughout the application with persistent language preferences.

## 🔐 Authentication

The application uses Keycloak for authentication with the following features:
- **Single Sign-On (SSO)**
- **Role-based Access Control**
- **JWT Token Management**
- **Automatic Token Refresh**

### User Roles
- **Customer**: Access to shop features
- **Admin**: Full access to admin panel
- **Manager**: Limited admin access

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with Cloudinary
- **Caching**: React Query for intelligent data caching
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Lazy Loading**: Components and images loaded on demand

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

## 📦 Build & Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Build
```bash
docker build -t ecommerce-client .
docker run -p 3000:3000 ecommerce-client
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔗 Related Projects

- **E-Commerce API** - Backend API service
- **E-Commerce Admin** - Standalone admin application
- **E-Commerce Mobile** - React Native mobile app

---

Built with ❤️ using Next.js and modern web technologies.
