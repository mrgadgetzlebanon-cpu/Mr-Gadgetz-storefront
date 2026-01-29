import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const clipContainerRef = useRef<HTMLDivElement>(null);
  const maskImageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const clipContainer = clipContainerRef.current;
    const maskImage = maskImageRef.current;
    if (!clipContainer || !maskImage) return;

    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: clipContainer,
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(maskImage, {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div
      id="about"
      data-testid="about-section"
      className="min-h-screen w-screen"
    >
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Welcome to MR.GADGET
        </p>

        <AnimatedTitle
          title="Disc<b>o</b>ver the latest <br /> tech inn<b>o</b>vations"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext">
          <p>Your destination for premium electronics and gadgets</p>
          <p className="text-gray-500">
            MR.GADGET brings together the finest technology from leading brands,
            delivering cutting-edge devices right to your doorstep
          </p>
        </div>
      </div>

      <div ref={clipContainerRef} className="h-dvh w-screen">
        <div ref={maskImageRef} className="mask-clip-path about-image">
          <img
            src="/assets/about_1768557310888.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
