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
              <p className="text-white/70">support@mrgadgetz.net</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-brand-cyan/20 rounded-2xl flex items-center justify-center text-brand-cyan shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Call Us</h3>
              <p className="text-white/70">+961 3 797 772</p>
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
