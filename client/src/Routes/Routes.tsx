import { Switch, Route, Redirect } from "wouter";
import { useScrollToTopOnRouteChange } from "@/hooks/use-scroll-to-top";

// Layout Components
import { Navigation } from "@/components/Navigation";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

// Pages
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import SearchPage from "@/pages/Search";
import Contact from "@/pages/Contact";
import Payment from "@/pages/Payment";
import NotFound from "@/pages/not-found";
import InfoPage from "@/pages/InfoPage";

/**
 * A Layout wrapper to keep the main Router file clean
 */
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  useScrollToTopOnRouteChange();

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navigation />
      <CartDrawer />
      <ScrollToTop />
      <main className="flex-1 pt-16 md:pt-28">{children}</main>
      <Footer />
    </div>
  );
};

export function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />

        <Route path="/shop" component={Shop} />

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
    </MainLayout>
  );
}
