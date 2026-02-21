import { useState, lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { useScrollToTopOnRouteChange } from "@/hooks/use-scroll-to-top";

// Layout Components (These stay static because they are needed on every page)
import { Navigation } from "@/components/Navigation";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

// Pages (These are now lazy-loaded to slash the initial JS bundle size)
const Home = lazy(() => import("@/pages/Home"));
const Shop = lazy(() => import("@/pages/Shop"));
const Collection = lazy(() => import("@/pages/Collection"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const SearchPage = lazy(() => import("@/pages/Search"));
const Contact = lazy(() => import("@/pages/Contact"));
const Payment = lazy(() => import("@/pages/Payment"));
const NotFound = lazy(() => import("@/pages/not-found"));
const InfoPage = lazy(() => import("@/pages/InfoPage"));

/**
 * A Layout wrapper to keep the main Router file clean
 */
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useScrollToTopOnRouteChange();

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navigation onMobileMenuChange={setIsMobileMenuOpen} />
      <CartDrawer />
      <ScrollToTop mobileMenuOpen={isMobileMenuOpen} />
      <main className="flex-1 pt-32 md:pt-40">{children}</main>
      <Footer />
    </div>
  );
};

export function Router() {
  return (
    <MainLayout>
      {/* The Suspense boundary catches the lazy-loaded pages.
        While Vite downloads the new page, it shows this minimalist pulsing fallback.
      */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[50vh] animate-pulse text-gray-500 font-medium">
            Loading...
          </div>
        }
      >
        <Switch>
          <Route path="/" component={Home} />

          <Route path="/shop" component={Shop} />
          <Route path="/collections/:handle" component={Collection} />

          <Route path="/search" component={SearchPage} />
          <Route path="/contact" component={Contact} />
          <Route path="/payment" component={Payment} />
          <Route path="/product/:id" component={ProductDetails} />

          <Route
            path="/privacy-policy"
            component={() => <InfoPage pageKey="privacy-policy" />}
          />
          <Route
            path="/terms-of-service"
            component={() => <InfoPage pageKey="terms-of-service" />}
          />
          <Route
            path="/shipping-and-returns"
            component={() => <InfoPage pageKey="returns" />}
          />
          <Route
            path="/warranty"
            component={() => <InfoPage pageKey="warranty" />}
          />

          {/* Catch-all 404 */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </MainLayout>
  );
}
