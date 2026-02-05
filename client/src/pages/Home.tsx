import { Helmet } from "react-helmet-async";
import Hero from "@/components/home/Hero";
// import About from "@/components/home/About";
import Features from "@/components/home/Features";
import { NewArrivals } from "@/components/home/NewArrivals";
import { GlobalCategorySelection } from "@/components/home/GlobalCategorySelection";
// import { BrandSpheres } from "@/components/home/BrandSpheres";
import { BrandProductSection } from "@/components/home/BrandProductSection";
import { DirectProductSection } from "@/components/home/DirectProductSection";
import { PromoBanner } from "@/components/home";

// 1. APPLE CONFIGURATION (direct collection handles)
const appleTabs = [
  { id: "iphone", label: "iPhone", collectionHandle: "apple-iphone" },
  { id: "ipad", label: "iPad", collectionHandle: "apple-ipad" },
  { id: "macbook", label: "MacBook", collectionHandle: "apple-macbook" },
  { id: "imac", label: "iMac", collectionHandle: "apple-imac" },
  { id: "watch", label: "Apple Watch", collectionHandle: "apple-watch" },
  { id: "audio", label: "AirPods & Audio", collectionHandle: "apple-airpods" },
  { id: "home", label: "HomePod & TV", collectionHandle: "apple-homepod-tv" },
  {
    id: "accessories",
    label: "Magic Mouse & Keyboard",
    collectionHandle: "magic-mouse-keyboard",
  },
];

// 2. LAPTOP CONFIGURATION
const laptopTabs = [
  {
    id: "dell",
    label: "Dell",
    collectionHandle: "dell-laptops",
  },
  {
    id: "hp",
    label: "HP",
    collectionHandle: "hp-laptops",
  },
  {
    id: "apple",
    label: "MacBook",
    collectionHandle: "apple-macbook",
  },
  {
    id: "msi",
    label: "MSI",
    collectionHandle: "msi-gaming-laptops",
  },
  {
    id: "lenovo",
    label: "Lenovo",
    collectionHandle: "lenovo-laptops",
  },
  {
    id: "asus",
    label: "Asus",
    collectionHandle: "asus-laptops",
  },
  {
    id: "acer",
    label: "Acer",
    collectionHandle: "acer-laptops",
  },
  {
    id: "samsung",
    label: "Samsung",
    collectionHandle: "samsung-laptops",
  },
  {
    id: "surface",
    label: "Microsoft Surface",
    collectionHandle: "microsoft-surface",
  },
];

// 3. SAMSUNG CONFIGURATION (direct collection handles from Shopify)
const samsungTabs = [
  { id: "all", label: "All Samsung", collectionHandle: "samsung" },
  { id: "phones", label: "Phones", collectionHandle: "samsung-mobile-phones" },
  { id: "tablets", label: "Tablets", collectionHandle: "samsung-tablets" },
  { id: "watch", label: "Watch", collectionHandle: "samsung-watch" },
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
        {/* <BrandSpheres /> */}

        {/* 6. Apple Categories */}
        <BrandProductSection
          title="Apple Products"
          tabs={appleTabs}
          viewAllLink="/collections/apple"
          bgClassName="bg-white"
        />

        <PromoBanner
          imageSrc="/promo/Apple-Promo.webp"
          title="Discover the Apple Lineup"
          description="From iPhone to MacBook, explore our latest Apple collection with curated deals."
          buttonLabel="Shop Apple"
          buttonHref="/collections/apple"
          bgLight
        />

        {/* 7. Laptops Categories */}
        <BrandProductSection
          title="Laptops & Computers"
          tabs={laptopTabs}
          viewAllLink="/collections/laptops"
          bgClassName="bg-white"
        />

        {/* <PromoBanner
          imageSrc="/promo/Laptop-Promo.png"
          title="Power Your Next Build"
          buttonLabel="Shop Laptops & PCs"
          buttonHref="/shop?category=parent%3Apc+and+laptops"
        /> */}

        {/* 8. Samsung Categories */}
        <BrandProductSection
          title="Samsung Products"
          tabs={samsungTabs}
          viewAllLink="/collections/samsung"
          bgClassName="bg-white"
        />

        <PromoBanner
          imageSrc="/promo/Samsung-Promo.png"
          title="Samsung Essentials"
          description="Galaxy phones, tablets, audio, and wearables — all in one place."
          buttonLabel="Shop Samsung"
          buttonHref="/collections/samsung"
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
          viewAllLink="/shop?category=wearables"
          bgClassName="bg-white"
        />
        <PromoBanner
          imageSrc="/promo/Watch-Banner.avif"
          title="Smart Meets Style"
          buttonLabel="Shop Watches"
          buttonHref="/shop?category=wearables"
        />

        {/* 12. Dyson Products (Direct) */}
        <DirectProductSection
          title="Home Appliances"
          // FETCHING: Using exact Handle 'home-appliances-1'
          parentCategories={["home-appliances"]}
          viewAllLink="/shop?category=home-appliances"
          bgClassName="bg-white"
        />

        <PromoBanner
          imageSrc="/promo/Dyson-Promo.jpg"
          title="Dyson Home Innovations"
          description="Elevate your space with Dyson vacuums, air purifiers, and more premium home tech."
          buttonLabel="Shop Dyson"
          buttonHref="/shop?category=home-appliances"
        />

        {/* Features Grid */}
        {/* <Features /> */}
      </main>
    </>
  );
}
