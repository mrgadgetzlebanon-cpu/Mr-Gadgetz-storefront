import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type ScrollToTopProps = {
  mobileMenuOpen?: boolean;
};

export function ScrollToTop({ mobileMenuOpen }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const whatsappNumber = "96178880120";
  const whatsappMessage = encodeURIComponent(
    "Hey, I would like to ask about a product",
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const shouldHide = isMobile && mobileMenuOpen;

  if (shouldHide) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 items-center">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              size="icon"
              onClick={scrollToTop}
              className="
                relative overflow-hidden z-10 w-12 h-12 rounded-full 
                bg-[#0c57ef] backdrop-blur-xl 
                border border-[#48bfef]/30 
                shadow-[0_0_20px_rgba(72,191,239,0.3)]
                text-white transition-all duration-500 ease-in-out group

                hover:shadow-[0_0_30px_rgba(72,191,239,0.5)]
                hover:text-[#0c57ef]
                before:content-[''] before:absolute before:z-[-1] before:block
                before:w-[160%] before:h-0 before:rounded-[50%]
                before:left-1/2 before:top-[100%] 
                before:translate-x-[-50%] before:translate-y-[-50%]
                before:bg-white before:transition-all before:duration-500

                hover:before:h-[350%] hover:before:top-1/2
              "
              aria-label="Scroll to top"
              data-testid="button-scroll-to-top"
            >
              <ChevronUp className="w-6 h-6 z-20 transition-transform" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="
              relative overflow-hidden z-10 w-12 h-12 rounded-full 
              bg-[#25D366] backdrop-blur-xl 
              border border-[#25D366]/30 
              shadow-[0_0_20px_rgba(37,211,102,0.3)]
              text-white transition-all duration-500 ease-in-out group
              flex items-center justify-center

              hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]
              hover:text-[#25D366]
              before:content-[''] before:absolute before:z-[-1] before:block
              before:w-[160%] before:h-0 before:rounded-[50%]
              before:left-1/2 before:top-[100%] 
              before:translate-x-[-50%] before:translate-y-[-50%]
              before:bg-white before:transition-all before:duration-500

              hover:before:h-[350%] hover:before:top-1/2
            "
            aria-label="Chat on WhatsApp"
            data-testid="button-whatsapp-chat"
          >
            <SiWhatsapp className="w-6 h-6 z-20 transition-transform" />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
