import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-8"
    >
      <div className="bg-white/5 backdrop-blur-sm p-8 rounded-[2rem] border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-brand-cyan/20 rounded-2xl flex items-center justify-center text-brand-cyan shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Email Us</h3>
              <a
                href="mailto:info@mrgadgetz.net"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Email info@mrgadgetz.net"
              >
                info@mrgadgetz.net
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-brand-cyan/20 rounded-2xl flex items-center justify-center text-brand-cyan shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Call Us</h3>
              <div className="flex flex-wrap items-center gap-3 text-white/70">
                <a
                  href="https://wa.me/9613797772"
                  className="hover:text-white transition-colors"
                  aria-label="Chat on WhatsApp +961 3 797 772"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +961 3 797 772
                </a>
                <span className="text-white/40">•</span>
                <a
                  href="https://wa.me/96178880120"
                  className="hover:text-white transition-colors"
                  aria-label="Chat on WhatsApp +961 78 880 120"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +961 78 880 120
                </a>
              </div>
              <p className="text-white/70">Mon-Sat: 9am - 6pm</p>
              <p className="text-white/70">Sat: 9am - 4pm</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-brand-cyan/20 rounded-2xl flex items-center justify-center text-brand-cyan shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Visit Our Store</h3>
              <p className="text-white/70">
                El, Main Road, Baouchriyeh 1004
                <br />
                Beirut, Lebanon
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
