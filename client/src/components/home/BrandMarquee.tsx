import { motion } from "framer-motion";
import { SiApple, SiSamsung, SiSony, SiLenovo, SiAsus, SiDell, SiHp, SiXiaomi, SiHuawei, SiLg, SiLogitech, SiRazer } from "react-icons/si";

interface Brand {
  name: string;
  icon: React.ElementType;
  color: string;
}

const brands: Brand[] = [
  { name: "Apple", icon: SiApple, color: "#A2AAAD" },
  { name: "Samsung", icon: SiSamsung, color: "#1428A0" },
  { name: "Sony", icon: SiSony, color: "#000000" },
  { name: "Lenovo", icon: SiLenovo, color: "#E2231A" },
  { name: "Asus", icon: SiAsus, color: "#00539B" },
  { name: "Dell", icon: SiDell, color: "#007DB8" },
  { name: "HP", icon: SiHp, color: "#0096D6" },
  { name: "Xiaomi", icon: SiXiaomi, color: "#FF6900" },
  { name: "Huawei", icon: SiHuawei, color: "#FF0000" },
  { name: "LG", icon: SiLg, color: "#A50034" },
  { name: "Logitech", icon: SiLogitech, color: "#00B8FC" },
  { name: "Razer", icon: SiRazer, color: "#44D62C" },
];

const doubledBrands = [...brands, ...brands];

export function BrandMarquee() {
  return (
    <section className="py-20 overflow-hidden bg-[#020617]" data-testid="section-brand-marquee">
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Trusted Brands
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            We partner with the world's leading technology brands to bring you the best products
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020617] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#020617] to-transparent z-10" />
        
        <motion.div
          className="flex gap-12 items-center"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {doubledBrands.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex-shrink-0 group"
              data-testid={`brand-${brand.name.toLowerCase()}`}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-white/10 group-hover:border-[#48bfef]/50 group-hover:shadow-[0_0_30px_rgba(72,191,239,0.3)]">
                <brand.icon 
                  className="w-10 h-10 md:w-14 md:h-14 text-white/70 group-hover:text-white transition-colors"
                />
              </div>
              <p className="text-center text-white/50 text-sm mt-3 group-hover:text-white/80 transition-colors">
                {brand.name}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default BrandMarquee;
