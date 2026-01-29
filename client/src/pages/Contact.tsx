import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ContactInfo, StoreMap } from "@/components/contact";
import { SplashCursor } from "@/components/SplashCursor";

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact | Mr. Gadgetz</title>
        <meta name="description" content="Get in touch with Mr. Gadgetz. Visit our store, call us, or send us a message. We're here to help with all your electronics needs." />
        <meta property="og:title" content="Contact | Mr. Gadgetz" />
        <meta property="og:description" content="Get in touch with Mr. Gadgetz. Visit our store or contact us for support." />
      </Helmet>
      <div className="min-h-screen text-white relative">
      <div className="fixed inset-0 bg-[#020617]" style={{ zIndex: -200 }} />
      <SplashCursor />
      
      <div className="relative z-10 py-24">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Contact Us</h1>
            <p className="text-white/70 text-lg">
              Have a question or need assistance? Our team is here to help you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            <ContactInfo />
            <StoreMap />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
