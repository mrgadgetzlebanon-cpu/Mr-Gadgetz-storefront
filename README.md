# MR.GADGET - E-commerce Tech Store

## Overview

MR.GADGET is a modern e-commerce web application for consumer electronics and tech gadgets. It features a React frontend with a sleek Apple-inspired design, an Express backend, and PostgreSQL database. The application currently uses mock data on the frontend but has backend API routes ready for future database integration.

The store includes product browsing, category filtering, search functionality, product details pages, and a shopping cart with local storage persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: 
  - TanStack React Query for server state and data fetching
  - React Context for cart state (with localStorage persistence)
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for transitions and micro-interactions
- **Build Tool**: Vite

### Modular Component Standard (Adopted)
The project follows a strict modular component structure:

```
client/src/
├── components/
│   ├── ui/           # Reusable shadcn/ui components
│   ├── shop/         # Shop feature (ShopSidebar, ProductGrid, ShopPagination, ShopHeader)
│   ├── home/         # Home feature (FeaturedProducts, BestSellersByCategory, PromoBanner, FeaturesGrid)
│   ├── contact/      # Contact feature (ContactInfo, ContactForm)
│   ├── payment/      # Payment feature (OrderSummary, PaymentForm)
│   └── [shared]/     # Shared components (ProductCard, Navigation, Footer, etc.)
├── hooks/            # Business logic, API calls, complex state (use-products.ts, use-cart.tsx, use-debounce.ts)
├── pages/            # Thin route wrappers only - no god files
└── types/            # Shared TypeScript interfaces
```

**Rules:**
1. No "god files" - page components are thin orchestrators only
2. Feature-specific components go into `src/components/[feature-name]/`
3. All business logic, API calls, and complex state live in `src/hooks/`
4. Types & interfaces defined in separate types.ts files or at top of component files

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (compiled with tsx for development, esbuild for production)
- **API Pattern**: REST endpoints defined in `server/routes.ts`
- **Shared Code**: The `shared/` directory contains schema definitions and route contracts used by both frontend and backend

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` defines the products table
- **Migrations**: Managed via `drizzle-kit push` command
- **Current State**: Frontend uses mock data (`client/src/lib/products.ts`) while backend routes exist as placeholders

### Brand Color Scheme (Adopted January 2026)

The shop uses a vibrant brand color palette to create a lively, modern aesthetic:

| Name        | Hex Code  | HSL             | Best Use Case                                    |
|-------------|-----------|-----------------|--------------------------------------------------|
| Brand Blue  | #0c57ef   | 219 91% 49%     | Primary buttons, active icons, footer background |
| Brand Cyan  | #48bfef   | 197 83% 61%     | Prices, hover glows, neon borders, highlights    |
| Brand Azure | #2f91f0   | 209 86% 56%     | Secondary buttons, gradients, text links         |
| Deep Dark   | #020617   | 222 87% 4%      | Replaces pure black in dark mode                 |

**CSS Variables** (defined in `index.css`):
- `--brand-blue`, `--brand-cyan`, `--brand-azure`, `--brand-dark`
- Utility classes: `.text-brand-blue`, `.text-brand-cyan`, `.text-brand-azure`, `.bg-brand-gradient`, `.border-brand-glow`, `.hover-brand-glow`

**Color Application**:
- Prices displayed in Brand Blue (light mode) / Brand Cyan (dark mode)
- Primary buttons use Brand Blue with cyan glow shadows
- Footer has Brand Blue background
- Hover effects use Brand Cyan glow
- Dark backgrounds use Deep Dark instead of pure black

### Key Design Decisions

1. **Mock Data Strategy**: The frontend fetches from local mock data with simulated delays rather than hitting the backend API. This allows rapid UI development while the database structure is finalized.

2. **Shared Schema**: Using `drizzle-zod` to generate Zod schemas from database tables ensures type safety across the full stack.

3. **Component Library**: shadcn/ui provides accessible, customizable components that follow Radix UI primitives. Components are copied into the project rather than imported from npm.

4. **Cart Persistence**: Shopping cart uses localStorage for persistence, making it work without user authentication.

5. **URL-Based State Management**: Shop page state (category, sort, page, cursor) is encoded in the URL for shareable links. The URL format is `/shop?category=parent:CategoryName&sort=newest&page=2&cursor=xyz`.

6. **Pagination Strategy**: 
   - **Server-side pagination** (All Products view): Uses Shopify's cursor-based pagination with cursors stored in URL. Supports forward/backward navigation within a session.
   - **Client-side pagination** (Category views): Products fetched in bulk and paginated locally. Full page navigation support.
   - **Known limitation**: When loading a shared URL for page > 1, the "Previous" button may return to page 1 if cursor history isn't available (inherent limitation of cursor-based pagination).

## External Dependencies

### Frontend Libraries
- **@tanstack/react-query**: Data fetching and caching
- **framer-motion**: Animation library
- **lucide-react**: Icon library
- **wouter**: Client-side routing
- **embla-carousel-react**: Carousel/slider functionality

### UI Components (shadcn/ui)
- Full shadcn/ui component library installed in `client/src/components/ui/`
- Uses Radix UI primitives under the hood
- Styled with Tailwind CSS and class-variance-authority

### Build Tools
- **Vite**: Frontend bundler with HMR
- **esbuild**: Production server bundling
- **tsx**: TypeScript execution for development