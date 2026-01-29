import { motion } from "framer-motion";

export function StoreMap() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full h-full min-h-[400px] rounded-[2rem] overflow-hidden border border-white/20"
    >
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.9666674815862!2d35.551357582744394!3d33.89051228882662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f17ae6d332f8f%3A0x9ef665874556ba5c!2sMrGadgetz%20Lebanon!5e0!3m2!1sen!2sus!4v1768913550722!5m2!1sen!2sus"
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: "400px" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="MR.GADGET Store Location"
        data-testid="map-store-location"
      />
    </motion.div>
  );
}
