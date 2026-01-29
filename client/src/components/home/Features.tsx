import { useState, useRef, ReactNode } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useLocation } from "wouter";

interface BentoTiltProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

export const BentoTilt = ({
  children,
  className = "",
  href,
}: BentoTiltProps) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  const handleClick = () => {
    if (href) {
      setLocation(href);
    }
  };

  return (
    <div
      ref={itemRef}
      className={`${className} ${href ? "cursor-pointer" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

interface BentoCardProps {
  src: string;
  title: ReactNode;
  description?: string;
  isImage?: boolean;
}

export const BentoCard = ({
  src,
  title,
  description,
  isImage,
}: BentoCardProps) => {
  return (
    <div className="relative size-full">
      {isImage ? (
        <img
          src={src}
          alt=""
          className="absolute left-0 top-0 size-full object-cover object-center"
        />
      ) : (
        <video
          src={src}
          loop
          muted
          autoPlay
          playsInline
          className="absolute left-0 top-0 size-full object-cover object-center"
        />
      )}
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Features = () => (
  <section data-testid="features-section" className="bg-black pb-52">
    <div className="container mx-auto px-3 md:px-10">
      <div className="px-5 py-32">
        <p className="font-circular-web text-lg text-blue-50">
          Explore Our Categories
        </p>
        <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
          Immerse yourself in a world of premium technology. From smartphones to
          smart home devices, discover products that elevate your digital
          lifestyle.
        </p>
      </div>

      <BentoTilt
        className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]"
        href="/shop?category=parent:Phones"
      >
        <BentoCard
          src="videos/smartphones.mp4"
          title={
            <>
              sm<b>a</b>rtphones
            </>
          }
          description="Discover the latest flagship smartphones from Apple, Samsung, and more. Experience cutting-edge mobile technology."
        />
      </BentoTilt>

      <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
        <BentoTilt
          className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2"
          href="/shop?category=parent:PC+and+Laptops"
        >
          <BentoCard
            src="videos/laptops.mp4"
            title={
              <>
                l<b>a</b>ptops
              </>
            }
            description="Powerful laptops for work, gaming, and creativity. Find your perfect portable powerhouse."
          />
        </BentoTilt>

        <BentoTilt
          className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0"
          href="/shop?category=parent:Audio"
        >
          <BentoCard
            src="/img/audio.png"
            title={
              <>
                a<b>u</b>dio
              </>
            }
            description="Premium headphones, earbuds, and speakers. Immerse yourself in crystal-clear sound quality."
            isImage
          />
        </BentoTilt>

        <BentoTilt
          className="bento-tilt_1 me-14 md:col-span-1 md:me-0"
          href="/shop?category=parent:Tablets"
        >
          <BentoCard
            src="/img/tablets.png"
            title={
              <>
                t<b>a</b>blets
              </>
            }
            description="Powerful tablets for entertainment, creativity, and productivity on the go."
            isImage
          />
        </BentoTilt>

        <BentoTilt
          className="bento-tilt_2"
          href="/shop?category=parent:Accessories"
        >
          <BentoCard
            src="/assets/accessories_1768557915766.png"
            title={
              <>
                <b>a</b>ccessories
              </>
            }
            description="Essential accessories to complement your tech lifestyle."
            isImage
          />
        </BentoTilt>

        <BentoTilt
          className="bento-tilt_2"
          href="/shop?category=parent:ALL_PRODUCTS"
        >
          <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
            <h1 className="bento-title special-font max-w-64 text-black">
              M<b>o</b>re pr<b>o</b>ducts c<b>o</b>ming
            </h1>

            <TiLocationArrow className="m-5 scale-[5] self-end" />
          </div>
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;
