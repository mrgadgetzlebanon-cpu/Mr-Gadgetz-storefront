import { useMemo } from "react";
import { Link } from "wouter";
import { useDynamicCategories } from "@/hooks/use-dynamic-categories";

export function Footer() {
  const { categoryStructure } = useDynamicCategories();
  const navItems = useMemo(
    () =>
      categoryStructure.grouped.map((group) => ({
        label: group.parent,
        href: `/shop?category=parent:${encodeURIComponent(group.parent)}`,
      })),
    [categoryStructure],
  );
  const midpoint = Math.ceil(navItems.length / 2);
  const primaryLinks = navItems.slice(0, midpoint);
  const secondaryLinks = navItems.slice(midpoint);

  return (
    <footer className="bg-[#f5f5f5] text-gray-900 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <img
                src="/assets/MR-Gadgetz-Logo-horizental_1768048140632.png"
                alt="MR.GADGET"
                className="h-16 object-contain"
              />
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your everyday destination for smart gadgets, cool tech, and
              innovation.
            </p>
          </div>

          {/* Shop Categories - Split into 2 columns */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-gray-900">Shop</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {primaryLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href || "#"}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm text-gray-900">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {secondaryLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href || "#"}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-gray-900">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Order Status
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-gray-900 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/payment"
                  className="hover:text-gray-900 transition-colors"
                >
                  Payment Methods
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-gray-900">Legal</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Warranty
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; 2026 MR GADGET. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Made for the World</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
