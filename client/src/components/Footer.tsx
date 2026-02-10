import { useMemo } from "react";
import { Link } from "wouter";
import {
  Instagram,
  Facebook,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { DistortionBackground } from "./ui/DistortionBackground";

export function Footer() {
  const shopLinks = useMemo(
    () => [
      { label: "Apple", href: "/collections/apple" },
      { label: "Samsung", href: "/collections/samsung" },
      { label: "Laptops", href: "/collections/laptops" },
      { label: "Mobiles", href: "/collections/mobile-phones" },
      { label: "Tablets", href: "/collections/tablets" },
      { label: "Audio", href: "/collections/audio" },
      { label: "Accessories", href: "/collections/accessories" },
      { label: "Home Appliances", href: "/collections/home-appliances" },
    ],
    [],
  );

  const legalLinks = useMemo(
    () => [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Warranty", href: "/warranty" },
      { label: "Returns", href: "/shipping-and-returns" },
      { label: "Contact Us", href: "/contact" },
    ],
    [],
  );

  return (
    <footer className="relative w-full min-h-[800px] flex flex-col justify-between overflow-hidden bg-transparent text-neutral-900">
      {/* 1. The Distortion Layer (Light Mode) */}
      <div className="absolute inset-0 z-0">
        <DistortionBackground />
      </div>

      {/* 2. Content Layer */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 pb-8 flex flex-col h-full pt-24 pointer-events-none">
        {/* TOP SECTION: Links & Contact - LIGHT GLASSY CONTAINER */}
        <div className="pointer-events-auto bg-white border border-white/50 rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-12 mb-auto shadow-2xl">
          {/* Column 1: Brand & Address */}
          <div className="md:col-span-4 space-y-6 hidden md:block">
            <div className="hidden md:block space-y-4 text-sm text-neutral-700">
              <img
                src="/assets/MR-Gadgetz-Logo-horizental_1768048140632.png"
                alt="MR.GADGET"
                className="h-12 object-contain"
              />
              <p className="max-w-xs leading-relaxed">
                Your everyday destination for smart gadgets, cool tech, and
                innovation.
              </p>

              <a
                href="https://maps.google.com"
                target="_blank"
                className="flex items-start gap-3 hover:text-blue-600 transition-colors"
              >
                <MapPin className="w-4 h-4 mt-1 text-blue-600" />
                <span>
                  El, Main Road, Baouchriyeh 1004
                  <br />
                  Beirut, Lebanon
                </span>
              </a>

              <div className="flex flex-col gap-2">
                <a
                  href="mailto:info@mrgadgetz.net"
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  <Mail className="w-4 h-4 text-blue-600" /> info@mrgadgetz.net
                </a>
                <a
                  href="tel:+9613797772"
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-600" /> +961 3 797 772
                </a>
                <a
                  href="https://wa.me/96178880120"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-blue-600" /> +961 78
                  880 120
                </a>
              </div>
            </div>
          </div>

          {/* Columns 2 & 3: Shop + Support (paired on one row for mobile) */}
          <div className="col-span-full md:col-span-4 md:col-start-7 grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-neutral-900 mb-6 uppercase tracking-widest text-xs">
                Shop
              </h4>
              <ul className="space-y-3 text-sm text-neutral-700 font-medium">
                {shopLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 mb-6 uppercase tracking-widest text-xs">
                Support
              </h4>
              <ul className="space-y-3 text-sm text-neutral-700 font-medium">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Socials */}
          <div className="col-span-full md:col-span-2 md:col-start-11">
            <h4 className="font-bold text-neutral-900 mb-6 uppercase tracking-widest text-xs">
              <span className="md:hidden">Customer Service</span>
              <span className="hidden md:inline">Follow Us</span>
            </h4>
            {/* Mobile-only contact details */}
            <div className="md:hidden space-y-3 text-sm text-neutral-700 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-blue-600" />
                <span>
                  El, Main Road, Baouchriyeh 1004
                  <br />
                  Beirut, Lebanon
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-600" />
                <a
                  href="mailto:info@mrgadgetz.net"
                  className="hover:text-blue-600 transition-colors"
                >
                  info@mrgadgetz.net
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-600" />
                <a
                  href="tel:+9613797772"
                  className="hover:text-blue-600 transition-colors"
                >
                  +961 3 797 772
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <a
                  href="https://wa.me/96178880120"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  +961 78 880 120
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <SocialLink
                href="https://www.instagram.com/mrgadgetz.lb/"
                icon={<Instagram size={20} />}
              />
              <SocialLink
                href="https://www.facebook.com/people/Mrgadgetz-Lebanon/61567872119588/"
                icon={<Facebook size={20} />}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: Copyright & Payments - LIGHT GLASSY CONTAINER */}
        <div className="pointer-events-auto bg-white border border-white/50 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg mt-8">
          <p className="text-xs text-neutral-600 uppercase tracking-widest">
            © {new Date().getFullYear()} Mr. Gadgetz. All rights reserved.
          </p>

          <div className="flex items-center gap-4 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
            <img src="/footer/visa.svg" alt="Visa" className="h-6 w-auto" />
            <img
              src="/footer/mastercard.svg"
              alt="Mastercard"
              className="h-6 w-auto"
            />
            <img
              src="/footer/cash-on-delivery.svg"
              alt="COD"
              className="h-6 w-auto"
            />
            <img
              src="/footer/whish-logo.svg"
              alt="Whish"
              className="h-5 w-auto"
            />
          </div>
        </div>

        {/* mix-blend-multiply makes it look like ink stamped on paper */}
        <div className="flex-1 flex items-center justify-center py-10 pointer-events-none select-none">
          <h1 className="text-[13vw] md:text-[15vw] leading-none font-black tracking-tighter text-neutral-900/10 mix-blend-multiply">
            MR.GADGETZ
          </h1>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white transition-all duration-300"
    >
      {icon}
    </a>
  );
}
