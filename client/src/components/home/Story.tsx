import Spline from "@splinetool/react-spline";
import { useState, useEffect } from "react";

import ZentryButton from "./ZentryButton";
import AnimatedTitle from "./AnimatedTitle";

const Story = () => {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      id="story"
      data-testid="story-section"
      className="min-h-dvh w-screen bg-zinc-100 text-zinc-900"
    >
      <div className="flex size-full flex-col items-center py-10 pb-24">
        <p className="font-general text-sm uppercase md:text-[10px] text-zinc-600">
          Experience Technology
        </p>

        <div className="relative size-full">
          <AnimatedTitle
            title="H<b>A</b>NDS-ON <br /> INNOV<b>A</b>TION"
            containerClass="mt-5 pointer-events-none relative z-10 story-title"
          />

          <div className="story-img-container w-full">
            <div>
              <div className="story-img-content relative">
                {isMobile ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src="https://prod.spline.design/vlduBbqP4ObjALyM/scene.png"
                      alt="VR Headset 3D Model"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <>
                    {!splineLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-200/50">
                        <div className="three-body">
                          <div className="three-body__dot"></div>
                          <div className="three-body__dot"></div>
                          <div className="three-body__dot"></div>
                        </div>
                      </div>
                    )}
                    <div
                      className="w-full h-full"
                      style={{ pointerEvents: "none" }}
                    >
                      <Spline
                        scene="https://prod.spline.design/vlduBbqP4ObjALyM/scene.splinecode"
                        onLoad={() => setSplineLoaded(true)}
                        className="w-full h-full pointer-events-none"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="-mt-80 flex w-full justify-center md:-mt-64 md:me-44 md:justify-end">
          <div className="flex h-full w-fit flex-col items-center md:items-start">
            <p className="mt-3 max-w-sm text-center font-circular-web text-zinc-600 md:text-start">
              Experience our products up close. Interact with cutting-edge
              technology before you buy. Feel the innovation in your hands.
            </p>

            <ZentryButton
              id="explore-btn"
              title="explore our store"
              containerClass="mt-5"
              href="/shop"
              variant="dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
