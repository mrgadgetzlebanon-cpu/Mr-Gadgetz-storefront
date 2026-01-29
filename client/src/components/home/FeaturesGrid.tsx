import { Star } from "lucide-react";

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-display font-bold mb-4">Why Choose Mr Gadgetz</h2>
          <p className="text-muted-foreground">
            We don't just sell electronics. We curate experiences that enhance your digital life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-background rounded-3xl p-8 shadow-sm border border-border/50">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every product is hand-picked and tested by our experts to ensure the highest standards
              of quality and performance.
            </p>
          </div>

          <div className="bg-background rounded-3xl p-8 shadow-sm border border-border/50">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Fast Shipping</h3>
            <p className="text-muted-foreground leading-relaxed">
              Free express shipping on all orders over $50. Get your new gear delivered to your
              doorstep in no time.
            </p>
          </div>

          <div className="bg-background rounded-3xl p-8 shadow-sm border border-border/50">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">2-Year Warranty</h3>
            <p className="text-muted-foreground leading-relaxed">
              We stand behind our products. All electronics come with a comprehensive 2-year
              warranty for peace of mind.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
