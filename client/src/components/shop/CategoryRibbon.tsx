import { useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Tablet, 
  Laptop, 
  Gamepad2, 
  Headphones, 
  Watch, 
  Tv, 
  Camera,
  Home
} from "lucide-react";

interface CategoryItem {
  id: string;
  label: string;
  icon: React.ElementType;
  link: string;
}

const categories: CategoryItem[] = [
  { id: "phones", label: "Phones", icon: Smartphone, link: "/shop?category=parent:Phones" },
  { id: "tablets", label: "Tablets", icon: Tablet, link: "/shop?category=parent:Tablets" },
  { id: "laptops", label: "Laptops", icon: Laptop, link: "/shop?category=parent:PC+and+Laptops" },
  { id: "gaming", label: "Gaming", icon: Gamepad2, link: "/shop?category=parent:Gaming" },
  { id: "audio", label: "Audio", icon: Headphones, link: "/shop?category=parent:Audio" },
  { id: "watches", label: "Watches", icon: Watch, link: "/shop?category=parent:Watches" },
  { id: "tv", label: "TV & Display", icon: Tv, link: "/shop?category=parent:TV" },
  { id: "cameras", label: "Cameras", icon: Camera, link: "/shop?category=parent:Cameras" },
  { id: "smart-home", label: "Smart Home", icon: Home, link: "/shop?category=parent:Smart+Home" },
];

export function CategoryRibbon() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative py-8">
      <div className="flex justify-center">
        <div
          ref={scrollRef}
          className="inline-flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-4 md:px-0 pb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
        {categories.map((category, index) => (
          <Link key={category.id} href={category.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center gap-3 min-w-[80px] snap-start cursor-pointer group"
              data-testid={`category-${category.id}`}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#0c57ef] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-[0_8px_25px_rgba(72,191,239,0.4)] transition-all duration-300">
                <category.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <span className="text-xs md:text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                {category.label}
              </span>
            </motion.div>
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
}
