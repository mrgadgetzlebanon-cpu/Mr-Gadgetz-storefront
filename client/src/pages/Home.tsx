import { Helmet } from "react-helmet-async";
import Hero from "@/components/home/Hero";
// import About from "@/components/home/About";
import Features from "@/components/home/Features";
import { NewArrivals } from "@/components/home/NewArrivals";
import { GlobalCategorySelection } from "@/components/home/GlobalCategorySelection";
import { BrandSpheres } from "@/components/home/BrandSpheres";
import { BrandProductSection } from "@/components/home/BrandProductSection";
import { DirectProductSection } from "@/components/home/DirectProductSection";

// 1. APPLE CONFIGURATION (direct collection handles)
const appleTabs = [
  { id: "iphone", label: "iPhone", collectionHandle: "iphones" },
  { id: "ipad", label: "iPad", collectionHandle: "ipad" },
  { id: "macbook", label: "MacBook", collectionHandle: "macbook" },
  { id: "imac", label: "iMac", collectionHandle: "imac" },
  { id: "watch", label: "Apple Watch", collectionHandle: "apple-watch" },
  {
    id: "accessories",
    label: "Accessories",
    collectionHandle:
      "apple-apple-accessories-apple-cables-apple-apple-apple-accessories",
  },
];

// 2. LAPTOP CONFIGURATION (single handle)
const laptopTabs = [
  { id: "all", label: "All Laptops", collectionHandle: "pc-and-laptops" },
];

// 3. SAMSUNG CONFIGURATION (direct collection handles)
const samsungTabs = [
  { id: "phones", label: "Phones", collectionHandle: "samsung-mobiles" },
  { id: "tablets", label: "Tablets", collectionHandle: "samsung-tablets" },
  { id: "watches", label: "Watches", collectionHandle: "samsung-watch" },
  { id: "audio", label: "Audio", collectionHandle: "samsung-audio" },
  {
    id: "accessories",
    label: "Accessories",
    collectionHandle: "samsung-accessories",
  },
];

// 4. AUDIO CONFIGURATION (direct collection handles)
const audioTabs = [
  { id: "headphones", label: "Headphones", collectionHandle: "headphones" },
  { id: "speakers", label: "Speakers", collectionHandle: "speakers" },
  { id: "earbuds", label: "Earbuds", collectionHandle: "earbuds" },
  { id: "microphones", label: "Microphones", collectionHandle: "microphones" },
];

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Mr. Gadgetz | Premium Electronics Store</title>
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
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. New Arrivals */}
        <NewArrivals />

        {/* 3. Categories Intro (Optional) */}
        {/* <About /> */}

        {/* 4. Global Category Selection */}
        <GlobalCategorySelection />

        {/* 5. Brand Balls Stack */}
        <BrandSpheres />

        {/* 6. Apple Categories */}
        <BrandProductSection
          title="Apple Products"
          tabs={appleTabs}
          viewAllLink="/shop?search=apple"
          bgClassName="bg-white"
        />

        {/* 7. Laptops Categories */}
        <BrandProductSection
          title="Laptops & Computers"
          tabs={laptopTabs}
          viewAllLink="/shop?category=pc-and-laptops"
          bgClassName="bg-white"
        />

        {/* 8. Samsung Categories */}
        <BrandProductSection
          title="Samsung Products"
          tabs={samsungTabs}
          viewAllLink="/shop?search=samsung"
          bgClassName="bg-white"
        />

        {/* 9. Premium Audio */}
        <BrandProductSection
          title="Premium Audio"
          tabs={audioTabs}
          viewAllLink="/shop?category=audio"
          bgClassName="bg-white"
        />

        {/* 10. Cameras - skipped */}

        {/* 11. Watches (Direct) */}
        <DirectProductSection
          title="Smartwatches & Wearables"
          parentCategories={["wearables"]}
          viewAllLink="/shop?category=Wearables"
          bgClassName="bg-white"
        />

        {/* 12. Dyson Products (Direct) */}
        <DirectProductSection
          title="Dyson Products"
          // FETCHING: Using exact Handle 'dyson-1'
          parentCategories={["dyson-1"]}
          viewAllLink="/shop?category=dyson-1"
          bgClassName="bg-white"
        />

        {/* Features Grid */}
        <Features />
      </main>
    </>
  );
}
