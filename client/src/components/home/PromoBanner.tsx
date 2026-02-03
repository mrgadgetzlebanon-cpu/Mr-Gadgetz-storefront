import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PromoBannerProps = {
  imageSrc?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  bgLight?: boolean;
};

export function PromoBanner({
  imageSrc,
  title,
  description,
  buttonLabel = "Discover More",
  buttonHref = "/shop",
  bgLight = false,
}: PromoBannerProps) {
  return (
    <section className="py-12 hidden md:block">
      <div className="container px-4 mx-auto">
        <div className="relative rounded-[1rem] overflow-hidden text-white h-[500px] flex items-center">
          <div className="absolute inset-0">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/70 to-transparent" /> */}
          </div>

          <div className="relative z-10 max-w-2xl px-8 md:px-16 space-y-6">
            <h2
              className={`text-4xl md:text-5xl font-display font-bold ${bgLight ? "text-zinc-900" : "text-white"}`}
            >
              {title}
            </h2>
            {description && (
              <p
                className={`text-xl ${bgLight ? "text-zinc-700" : "text-zinc-300"}`}
              >
                {description}
              </p>
            )}
            {buttonHref && (
              <Button
                asChild
                size="lg"
                className="
                  relative overflow-hidden z-10 rounded-full bg-[#0c57ef] text-white border-[#0c57ef] mt-4 transition-all duration-500 ease-in-out
                  shadow-[0_0_30px_rgba(72,191,239,0.3)]
                  hover:shadow-[0_0_40px_rgba(72,191,239,0.5)]
                  hover:text-[#0c57ef]
                  before:content-[''] before:absolute before:z-[-1] before:block
                  before:w-[160%] before:h-0 before:rounded-[50%]
                  before:left-1/2 before:top-[100%]
                  before:translate-x-[-50%] before:translate-y-[-50%]
                  before:bg-white before:transition-all before:duration-500
                  hover:before:h-[500%] hover:before:top-1/2
                "
                data-testid="button-explore-accessories"
              >
                <a href={buttonHref} className="inline-flex items-center">
                  {buttonLabel} <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
