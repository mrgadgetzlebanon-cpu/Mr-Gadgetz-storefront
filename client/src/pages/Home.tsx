import { Helmet } from "react-helmet-async";
import Hero from "@/components/home/Hero";
// import About from "@/components/home/About";
import Features from "@/components/home/Features";
import { NewArrivals } from "@/components/home/NewArrivals";
import { GlobalCategorySelection } from "@/components/home/GlobalCategorySelection";
import { BrandSpheres } from "@/components/home/BrandSpheres";
import { BrandProductSection } from "@/components/home/BrandProductSection";
import { DirectProductSection } from "@/components/home/DirectProductSection";

const appleSubcategories = [
  { id: "iphone", label: "iPhone", keywords: ["iphone"] },
  { id: "ipad", label: "iPad", keywords: ["ipad", "tablet"] },
  { id: "macbook", label: "MacBook", keywords: ["macbook", "mac book"] },
  { id: "imac", label: "iMac", keywords: ["imac"] },
  { id: "watch", label: "Apple Watch", keywords: ["apple watch", "watch"] },
  {
    id: "accessories",
    label: "Accessories",
    keywords: ["airpods", "cable", "charger", "case", "magsafe"],
  },
];

const laptopSubcategories = [
  { id: "dell", label: "Dell", keywords: ["dell"] },
  { id: "hp", label: "HP", keywords: ["hp", "hewlett"] },
  { id: "apple", label: "Apple", keywords: ["macbook", "apple"] },
  { id: "msi", label: "MSI", keywords: ["msi"] },
  { id: "lenovo", label: "Lenovo", keywords: ["lenovo", "thinkpad"] },
  { id: "asus", label: "Asus", keywords: ["asus", "rog", "zenbook"] },
  { id: "acer", label: "Acer", keywords: ["acer", "predator", "aspire"] },
];

const samsungSubcategories = [
  {
    id: "phones",
    label: "Phones",
    keywords: ["galaxy s", "galaxy z", "galaxy a", "samsung phone"],
  },
  { id: "tablets", label: "Tablets", keywords: ["galaxy tab", "samsung tab"] },
  {
    id: "watches",
    label: "Watches",
    keywords: ["galaxy watch", "samsung watch"],
  },
  {
    id: "audio",
    label: "Audio",
    keywords: ["galaxy buds", "samsung audio", "samsung speaker"],
  },
  {
    id: "accessories",
    label: "Accessories",
    keywords: ["samsung case", "samsung charger", "samsung cable"],
  },
];

const audioSubcategories = [
  {
    id: "headphones",
    label: "Headphones",
    keywords: ["headphone", "over-ear", "on-ear"],
  },
  {
    id: "speakers",
    label: "Speakers",
    keywords: ["speaker", "soundbar", "subwoofer"],
  },
  {
    id: "earbuds",
    label: "Earbuds",
    keywords: ["earbud", "airpods", "buds", "wireless earphone"],
  },
  {
    id: "earphones",
    label: "Earphones",
    keywords: ["earphone", "in-ear", "wired"],
  },
  {
    id: "microphones",
    label: "Microphones",
    keywords: ["microphone", "mic", "recording"],
  },
];

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Mr. Gadgetz | Premium Electronics</title>
        <meta
          name="description"
          content="Discover the latest tech gadgets and premium electronics at Mr. Gadgetz. Shop smartphones, laptops, audio, gaming gear, and more with fast shipping."
        />
        <meta property="og:title" content="Mr. Gadgetz | Premium Electronics" />
        <meta
          property="og:description"
          content="Discover the latest tech gadgets and premium electronics at Mr. Gadgetz. Shop smartphones, laptops, audio, gaming gear, and more."
        />
      </Helmet>
      <main className="relative min-h-screen min-w-screen overflow-hidden">
        {/* 1. Hero Section (Zentry) */}
        <Hero />

        {/* 2. New Arrivals (ShopHub Slider) */}
        <NewArrivals />

        {/* 3. Categories Intro (Zentry) - About section */}
        {/* <About /> */}

        {/* 4. Global Category Selection (ShopHub Ribbon with subsections) */}
        <GlobalCategorySelection />

        {/* 5. Brand Balls Stack (Moncy - Infinite Marquee) */}
        <BrandSpheres />

        {/* 6. Apple Categories (ShopHub with subsections) */}
        <BrandProductSection
          title="Apple Products"
          brandName="Apple"
          subcategories={appleSubcategories}
          parentCategories={[
            "Phones",
            "Tablets",
            "PC and Laptops",
            "Watches",
            "Audio",
            "Accessories",
          ]}
          viewAllLink="/shop?search=apple"
          bgClassName="bg-white"
        />

        {/* 7. Laptops Categories (ShopHub with subsections) */}
        <BrandProductSection
          title="Laptops & Computers"
          brandName=""
          subcategories={laptopSubcategories}
          parentCategories={["PC and Laptops"]}
          viewAllLink="/shop?category=parent:PC+and+Laptops"
          bgClassName="bg-white"
        />

        {/* 8. Samsung Categories (ShopHub with subsections) */}
        <BrandProductSection
          title="Samsung Products"
          brandName="Samsung"
          subcategories={samsungSubcategories}
          parentCategories={[
            "Phones",
            "Tablets",
            "Watches",
            "Audio",
            "Accessories",
          ]}
          viewAllLink="/shop?search=samsung"
          bgClassName="bg-white"
        />

        {/* 9. Audio Categories (ShopHub with subsections) */}
        <BrandProductSection
          title="Premium Audio"
          brandName=""
          subcategories={audioSubcategories}
          parentCategories={["Audio"]}
          viewAllLink="/shop?category=parent:Audio"
          bgClassName="bg-white"
        />

        {/* 10. Cameras - skipped since no Cameras category exists in Shopify collections */}

        {/* 11. Watches (Direct - no subsections) */}
        <DirectProductSection
          title="Smartwatches & Wearables"
          parentCategory="Watches"
          viewAllLink="/shop?category=parent:Watches"
          bgClassName="bg-white"
        />

        {/* 12. Dyson Products - searches across multiple categories */}
        <DirectProductSection
          title="Dyson Products"
          parentCategories={["Smart Home", "Audio", "Accessories"]}
          brandFilter="Dyson"
          viewAllLink="/shop?search=dyson"
          bgClassName="bg-white"
        />
        {/* Zentry Features Grid */}
        <Features />
      </main>
    </>
  );
}
