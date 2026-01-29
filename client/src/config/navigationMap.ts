export type SidebarLinkMode = "STRUCTURE" | "FILTER" | "VENDOR" | "TAG";

export interface SidebarLink {
  label: string;
  mode: SidebarLinkMode;
  target?: string;
  collection?: string;
  type?: string;
  query?: string;
  tag?: string;
  subLinks?: SidebarLink[];
}

export interface SidebarGroup {
  title: string;
  links: SidebarLink[];
}

export const SIDEBAR_CONFIG: SidebarGroup[] = [
  {
    title: "Phones",
    links: [
      { label: "Mobile Phones", mode: "STRUCTURE", target: "Mobile Phones" },
      {
        label: "Mobile Accessories",
        mode: "STRUCTURE",
        target: "Mobile Accessories",
      },
    ],
  },
  {
    title: "Tablets",
    links: [
      { label: "Tablets", mode: "STRUCTURE", target: "Tablets" },
      {
        label: "Tablet Accessories",
        mode: "STRUCTURE",
        target: "Tablet Accessories",
      },
    ],
  },
  {
    title: "Laptops & PCs",
    links: [
      {
        label: "Laptops",
        mode: "FILTER",
        collection: "Computers",
        type: "Laptop",
      },
      {
        label: "Desktops",
        mode: "FILTER",
        collection: "Computers",
        type: "Desktop Computers",
      },
      {
        label: "Computer Accessories",
        mode: "STRUCTURE",
        target: "Computer Accessories",
      },
      // FIXED: "Keyboards" -> "Keyboard" (Singular in CSV)
      {
        label: "Keyboards",
        mode: "FILTER",
        collection: "Computer Accessories",
        type: "Keyboard",
      },
      // REMOVED: "Mice" and "Webcams" (Do not exist in CSV Types)
      // If you add them to CSV later, you can uncomment these:
      // { label: "Mice", mode: "FILTER", collection: "Computer Accessories", type: "Mouse" },
      {
        label: "Brands",
        mode: "STRUCTURE",
        subLinks: [
          { label: "HP", mode: "VENDOR", query: "HP" },
          { label: "Dell", mode: "VENDOR", query: "Dell" },
          // REMOVED: "Alienware" (It is listed under Dell in your CSV)
          { label: "Apple", mode: "VENDOR", query: "Apple" },
          { label: "Lenovo", mode: "VENDOR", query: "Lenovo" },
          { label: "Asus", mode: "VENDOR", query: "Asus" },
          { label: "Acer", mode: "VENDOR", query: "Acer" },
        ],
      },
    ],
  },
  {
    title: "Accessories",
    links: [
      { label: "Watches", mode: "STRUCTURE", target: "Wearables" },
      {
        label: "Mobile Accessories",
        mode: "STRUCTURE",
        target: "Mobile Accessories",
      },
      {
        label: "Mobile Phone Case",
        mode: "FILTER",
        collection: "Mobile Accessories",
        type: "Mobile Phone Case",
      },
      {
        label: "Mobile Phone Stands",
        mode: "FILTER",
        collection: "Mobile Accessories",
        type: "Mobile Phone Stands",
      },
      {
        label: "Screen Protector",
        mode: "FILTER",
        collection: "Mobile Accessories",
        type: "Screen Protector",
      },
      {
        label: "Screen Protectors",
        mode: "FILTER",
        collection: "Mobile Accessories",
        type: "Screen Protectors",
      },
      {
        label: "Power Bank",
        mode: "FILTER",
        collection: "Power & Connectivity",
        type: "Power Bank",
      },
      {
        label: "Stylus",
        mode: "FILTER",
        collection: "Mobile Accessories",
        type: "Stylus",
      },
      {
        label: "Stylus Pens",
        mode: "FILTER",
        collection: "Mobile Accessories",
        type: "Stylus Pens",
      },
      {
        label: "Stylus Pen Nibs & Refills",
        mode: "FILTER",
        collection: "Mobile Accessories",
        type: "Stylus Pen Nibs & Refills",
      },
      {
        label: "Laptop Accessories",
        mode: "FILTER",
        collection: "Computer Accessories",
        type: "Laptop Accessories",
      },
      {
        label: "Computer Accessories",
        mode: "FILTER",
        collection: "Computer Accessories",
        type: "Computer Accessories",
      },
      {
        label: "Battery",
        mode: "FILTER",
        collection: "Computer Accessories",
        type: "Battery",
      },
      {
        label: "Storage",
        mode: "FILTER",
        collection: "Computer Accessories",
        type: "Storage",
      },
      {
        label: "Privacy Filters",
        mode: "FILTER",
        collection: "Computer Accessories",
        type: "Privacy Filters",
      },
      // REMOVED: Webcams (Not in CSV)
      {
        label: "Adapter",
        mode: "FILTER",
        collection: "Power & Connectivity",
        type: "Adapter",
      },
      {
        label: "Cable",
        mode: "FILTER",
        collection: "Power & Connectivity",
        type: "Cable",
      },
      {
        label: "Charger",
        mode: "FILTER",
        collection: "Power & Connectivity",
        type: "Charger",
      },
      {
        label: "Vehicle Air Fresheners",
        mode: "FILTER",
        collection: "Vehicle Accessories",
        type: "Vehicle Air Fresheners",
      },
      {
        label: "GPS Tracking Devices",
        mode: "FILTER",
        collection: "Vehicle Accessories",
        type: "GPS Tracking Devices",
      },
      {
        label: "GPS Cases",
        mode: "FILTER",
        collection: "Vehicle Accessories",
        type: "GPS Cases",
      },
      {
        label: "Tablet Accessories",
        mode: "FILTER",
        collection: "Tablet Accessories",
        type: "Tablet Accessories",
      },
      {
        label: "Vaporizers & Electronic Cigarettes",
        mode: "FILTER",
        collection: "Lifestyle Devices",
        type: "Vaporizers & Electronic Cigarettes",
      },
      {
        label: "Projectors",
        mode: "FILTER",
        collection: "Camera Accessories",
        type: "Projector",
      },
    ],
  },
  {
    title: "Audio",
    links: [
      {
        label: "Headphones",
        mode: "FILTER",
        collection: "Personal Audio",
        type: "Headphones",
      },
      {
        label: "Headphone Carrying Cases",
        mode: "FILTER",
        collection: "Personal Audio",
        type: "Headphone Carrying Cases",
      },
      {
        label: "Earphones",
        mode: "FILTER",
        collection: "Personal Audio",
        type: "Earphones",
      },
      {
        label: "Speakers",
        mode: "FILTER",
        collection: "Audio Equipment",
        type: "Speakers",
      },
      {
        label: "Microphones",
        mode: "FILTER",
        collection: "Audio Equipment",
        type: "Microphones",
      },
      {
        label: "Audio Players & Recorders",
        mode: "FILTER",
        collection: "Audio Equipment",
        type: "Audio Players & Recorders",
      },
      {
        label: "Sound Machines",
        mode: "FILTER",
        collection: "Audio Equipment",
        type: "Sound Machines",
      },
      {
        label: "Home Theater Systems",
        mode: "FILTER",
        collection: "Audio Equipment",
        type: "Home Theater Systems",
      },
    ],
  },
  {
    title: "Gaming",
    links: [
      // FIXED: "Gaming Console" is a TAG in your CSV, not a Type.
      {
        label: "Gaming Consoles",
        mode: "TAG",
        collection: "Gaming",
        tag: "Gaming Console",
      },
      // FIXED: Typo "Laptpop" -> "Laptop"
      {
        label: "Gaming Laptops",
        mode: "TAG",
        collection: "Computers",
        tag: "Gaming Laptop",
      },
      {
        label: "Gaming Accessories",
        mode: "STRUCTURE",
        target: "Gaming Accessories",
      },
      // FIXED: "VR" is a TYPE "Vr Headset" in your CSV, not a tag.
      {
        label: "VR Headsets",
        mode: "FILTER",
        collection: "Gaming Accessories",
        type: "Vr Headset",
      },
      {
        label: "Portable Game Console Cases",
        mode: "FILTER",
        collection: "Gaming Accessories",
        type: "Portable Game Console Cases",
      },
    ],
  },
  {
    title: "Cameras",
    links: [
      { label: "Cameras", mode: "STRUCTURE", target: "Cameras" },
      {
        label: "Camera Accessories",
        mode: "STRUCTURE",
        target: "Camera Accessories",
      },
      {
        label: "Camera Focus Devices",
        mode: "FILTER",
        collection: "Camera Accessories",
        type: "Camera Focus Devices",
      },
      {
        label: "Camera Stabilizers & Supports",
        mode: "FILTER",
        collection: "Camera Accessories",
        type: "Camera Stabilizers & Supports",
      },
    ],
  },
  {
    title: "Smart Home",
    links: [
      { label: "Dyson", mode: "VENDOR", query: "Dyson" },
      {
        label: "Air Purifiers",
        mode: "FILTER",
        collection: "Home Appliances",
        type: "Air Purifiers",
      },
      {
        label: "Portable Evaporative Coolers",
        mode: "FILTER",
        collection: "Home Appliances",
        type: "Portable Evaporative Coolers",
      },
      {
        label: "Upright Vacuums",
        mode: "FILTER",
        collection: "Home Appliances",
        type: "Upright Vacuums",
      },
      {
        label: "Vacuums",
        mode: "FILTER",
        collection: "Home Appliances",
        type: "Vacuums",
      },
      {
        label: "Power Control Units",
        mode: "FILTER",
        collection: "Home Appliances",
        type: "Power Control Units",
      },
      {
        label: "Streaming & Home Media Players",
        mode: "FILTER",
        collection: "Home Appliances",
        type: "Streaming & Home Media Players",
      },
      {
        label: "Hair Dryers",
        mode: "FILTER",
        collection: "Personal Care Appliances",
        type: "Hair Dryers",
      },
      {
        label: "Hair Dryer Accessories",
        mode: "FILTER",
        collection: "Personal Care Appliances",
        type: "Hair Dryer Accessories",
      },
      {
        label: "Hair Straighteners",
        mode: "FILTER",
        collection: "Personal Care Appliances",
        type: "Hair Straighteners",
      },
      {
        label: "Hair Styling Tools",
        mode: "FILTER",
        collection: "Personal Care Appliances",
        type: "Hair Styling Tools",
      },
      {
        label: "Hair Styling Tool Sets",
        mode: "FILTER",
        collection: "Personal Care Appliances",
        type: "Hair Styling Tool Sets",
      },
      {
        label: "Hairbrushes & Combs",
        mode: "FILTER",
        collection: "Personal Care Appliances",
        type: "Hairbrushes & Combs",
      },
      {
        label: "Round Hairbrushes",
        mode: "FILTER",
        collection: "Personal Care Appliances",
        type: "Round Hairbrushes",
      },
    ],
  },
  {
    title: "Networking",
    links: [
      {
        label: "Networking Devices",
        mode: "STRUCTURE",
        target: "Networking Devices",
      },
    ],
  },
];
