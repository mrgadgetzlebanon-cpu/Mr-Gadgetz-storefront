import { useMemo } from "react";
import { Link } from "wouter";
import {
  Instagram,
  Facebook,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import megaMenu from "@/lib/mega-menu.json";

export function Footer() {
  const shopLinks = useMemo(() => {
    const seen = new Set<string>();
    return (megaMenu as Array<{ label: string; href: string }>).filter(
      (item) => {
        const key = item.label.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      },
    );
  }, []);

  return (
    <footer className="bg-[#fff] text-gray-900 pt-20 pb-12 shadow-[0_-10px_20px_rgba(0,0,0,0.12)] sm:shadow-none border-t border-gray-200 sm:border-0">
      <div className="container mx-auto px-4 pb-24">
        <div className="flex flex-col gap-6 sm:grid sm:grid-cols-3 md:grid-cols-4 sm:gap-12 mb-14">
          {/* Logo & Description (hidden on mobile) */}
          <div className="col-span-1 hidden sm:block">
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

          {/* Shop + Legal wrapper for mobile side-by-side */}
          <div className="grid grid-cols-2 gap-8 w-full md:contents">
            {/* Shop Categories - Split into 2 columns */}
            <div>
              <h4 className="font-semibold mb-4 text-sm text-gray-900">Shop</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                {shopLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href || "#"}
                      className="transition-colors hover:text-[#0c57ef]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="block md:hidden">
              <h4 className="font-semibold mb-4 text-sm text-gray-900">
                Legal
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="transition-colors hover:text-[#0c57ef]"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="transition-colors hover:text-[#0c57ef]"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/warranty"
                    className="transition-colors hover:text-[#0c57ef]"
                  >
                    Warranty
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-[#0c57ef]"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-[#0c57ef]"
                  >
                    Order Status
                  </a>
                </li>
                <li>
                  <Link
                    href="/shipping-and-returns"
                    className="transition-colors hover:text-[#0c57ef]"
                  >
                    Returns
                  </Link>
                </li>
                <li>
                  <Link
                    href="/payment"
                    className="transition-colors hover:text-[#0c57ef]"
                  >
                    Payment Methods
                  </Link>
                </li>
                <li className="md:hidden">
                  <Link
                    href="/contact"
                    className="transition-colors hover:text-[#0c57ef]"
                    data-testid="footer-contact"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal for desktop (only) */}
          <div className="hidden md:block">
            <h4 className="font-semibold mb-4 text-sm text-gray-900">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link
                  href="/privacy-policy"
                  className="transition-colors hover:text-[#0c57ef]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="transition-colors hover:text-[#0c57ef]"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/warranty"
                  className="transition-colors hover:text-[#0c57ef]"
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-and-returns"
                  className="transition-colors hover:text-[#0c57ef]"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/payment"
                  className="transition-colors hover:text-[#0c57ef]"
                >
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-[#0c57ef]"
                  data-testid="footer-contact-desktop"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col gap-4 items-start">
            <h4 className="font-semibold text-sm text-gray-900">
              Customer Service
            </h4>
            <a
              href="https://maps.google.com/?q=MR+GADGETZ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-sm text-gray-700 transition-colors hover:text-[#0c57ef]"
            >
              <MapPin className="w-4 h-4 mt-0.5" />
              <span>
                El, Main Road, Baouchriyeh 1004
                <br />
                Beirut, Lebanon
              </span>
            </a>
            <div className="space-y-4 text-sm text-gray-700">
              <a
                href="mailto:info@mrgadgetz.net"
                className="flex items-center gap-2 transition-colors hover:text-[#0c57ef]"
              >
                <Mail className="w-4 h-4" /> info@mrgadgetz.net
              </a>
              <a
                href="tel:+9613797772"
                className="flex items-center gap-2 transition-colors hover:text-[#0c57ef]"
              >
                <Phone className="w-4 h-4" /> +961 3 797 772
              </a>
              <a
                href="https://wa.me/96178880120"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-[#0c57ef]"
              >
                <MessageCircle className="w-4 h-4" /> +961 78 880 120
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/mrgadgetz.lb/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-900 hover:text-[#0c57ef] active:text-[#0a45c4] transition-colors duration-200 transition-transform hover:-translate-y-0.5"
                aria-label="Visit our Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/people/Mrgadgetz-Lebanon/61567872119588/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-900 hover:text-[#0c57ef] active:text-[#0a45c4] transition-colors duration-200 transition-transform hover:-translate-y-0.5"
                aria-label="Visit our Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500">
          <p>&copy; 2026 Mr.Gadgetz. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <img
              src="/footer/visa.svg"
              alt="Visa"
              className="h-6 w-auto opacity-80"
              loading="lazy"
            />
            <img
              src="/footer/mastercard.svg"
              alt="Mastercard"
              className="h-6 w-auto opacity-80"
              loading="lazy"
            />
            <img
              src="/footer/cash-on-delivery.svg"
              alt="Cash on Delivery"
              className="h-6 w-auto opacity-80"
              loading="lazy"
            />
            <img
              src="/footer/whish-logo.svg"
              alt="Whish"
              className="h-6 w-auto opacity-80"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
