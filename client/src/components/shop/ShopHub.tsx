import { useMemo } from "react";
import { ShopHeroSlider } from "./ShopHeroSlider";
import { CategoryRibbon } from "./CategoryRibbon";
import { ProductRow } from "./ProductRow";
import { usePaginatedProducts, useGroupedCollections } from "@/hooks/use-products";

export function ShopHub() {
  const { data: categoryStructure } = useGroupedCollections();
  
  const gamingHandles = useMemo(() => {
    const gaming = categoryStructure?.grouped.find(g => g.parent === "Gaming");
    return gaming?.parentHandles || [];
  }, [categoryStructure]);
  
  const smartHomeHandles = useMemo(() => {
    const smartHome = categoryStructure?.grouped.find(g => g.parent === "Smart Home");
    return smartHome?.parentHandles || [];
  }, [categoryStructure]);
  
  const audioHandles = useMemo(() => {
    const audio = categoryStructure?.grouped.find(g => g.parent === "Audio");
    return audio?.parentHandles || [];
  }, [categoryStructure]);
  
  const phonesHandles = useMemo(() => {
    const phones = categoryStructure?.grouped.find(g => g.parent === "Phones");
    return phones?.parentHandles || [];
  }, [categoryStructure]);
  
  const { data: newArrivalsResult, isLoading: newArrivalsLoading } = usePaginatedProducts({
    handles: [],
    sortKey: "newest",
    first: 15,
  });
  const newArrivals = newArrivalsResult?.products || [];
  
  const { data: bestSellersResult, isLoading: bestSellersLoading } = usePaginatedProducts({
    handles: [],
    sortKey: "best_selling",
    first: 15,
  });
  const bestSellers = bestSellersResult?.products || [];
  
  const gamingEnabled = gamingHandles.length > 0;
  const { data: gamingResult, isLoading: gamingLoading } = usePaginatedProducts(
    gamingEnabled ? {
      handles: gamingHandles,
      sortKey: "best_selling",
      first: 15,
    } : { handles: [], first: 0 }
  );
  const gamingProducts = gamingEnabled ? (gamingResult?.products || []) : [];
  
  const smartHomeEnabled = smartHomeHandles.length > 0;
  const { data: smartHomeResult, isLoading: smartHomeLoading } = usePaginatedProducts(
    smartHomeEnabled ? {
      handles: smartHomeHandles,
      sortKey: "best_selling",
      first: 15,
    } : { handles: [], first: 0 }
  );
  const smartHomeProducts = smartHomeEnabled ? (smartHomeResult?.products || []) : [];
  
  const audioEnabled = audioHandles.length > 0;
  const { data: audioResult, isLoading: audioLoading } = usePaginatedProducts(
    audioEnabled ? {
      handles: audioHandles,
      sortKey: "best_selling",
      first: 15,
    } : { handles: [], first: 0 }
  );
  const audioProducts = audioEnabled ? (audioResult?.products || []) : [];
  
  const phonesEnabled = phonesHandles.length > 0;
  const { data: phonesResult, isLoading: phonesLoading } = usePaginatedProducts(
    phonesEnabled ? {
      handles: phonesHandles,
      sortKey: "best_selling",
      first: 15,
    } : { handles: [], first: 0 }
  );
  const allPhones = phonesEnabled ? (phonesResult?.products || []) : [];
  const appleProducts = allPhones
    .filter(p => 
      p.brand?.toLowerCase() === "apple" || 
      p.name.toLowerCase().includes("iphone") || 
      p.name.toLowerCase().includes("apple")
    )
    .sort((a, b) => {
      const aIsPhone = a.name.toLowerCase().includes("iphone") || 
                       (a.name.toLowerCase().includes("apple") && !a.name.toLowerCase().includes("protector") && !a.name.toLowerCase().includes("case") && !a.name.toLowerCase().includes("charger") && !a.name.toLowerCase().includes("cable"));
      const bIsPhone = b.name.toLowerCase().includes("iphone") || 
                       (b.name.toLowerCase().includes("apple") && !b.name.toLowerCase().includes("protector") && !b.name.toLowerCase().includes("case") && !b.name.toLowerCase().includes("charger") && !b.name.toLowerCase().includes("cable"));
      if (aIsPhone && !bIsPhone) return -1;
      if (!aIsPhone && bIsPhone) return 1;
      return 0;
    });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 pt-24">
        <ShopHeroSlider />
        
        <CategoryRibbon />
        
        <div className="space-y-4">
          <ProductRow 
            title="New Arrivals" 
            products={newArrivals} 
            isLoading={newArrivalsLoading}
            viewAllLink="/shop?sort=newest"
            showNewTag={true}
          />
          
          {appleProducts.length > 0 && (
            <ProductRow 
              title="Apple Products" 
              products={appleProducts} 
              isLoading={phonesLoading}
              viewAllLink="/shop?category=parent:Phones"
            />
          )}
          
          {gamingProducts.length > 0 && (
            <ProductRow 
              title="Gaming Gear" 
              products={gamingProducts} 
              isLoading={gamingLoading}
              viewAllLink="/shop?category=parent:Gaming"
            />
          )}
          
          <ProductRow 
            title="Best Sellers" 
            products={bestSellers} 
            isLoading={bestSellersLoading}
            viewAllLink="/shop?sort=best_selling"
          />
          
          {audioProducts.length > 0 && (
            <ProductRow 
              title="Premium Audio" 
              products={audioProducts} 
              isLoading={audioLoading}
              viewAllLink="/shop?category=parent:Audio"
            />
          )}
          
          {smartHomeProducts.length > 0 && (
            <ProductRow 
              title="Smart Home" 
              products={smartHomeProducts} 
              isLoading={smartHomeLoading}
              viewAllLink="/shop?category=parent:Smart+Home"
            />
          )}
        </div>
      </div>
    </div>
  );
}
