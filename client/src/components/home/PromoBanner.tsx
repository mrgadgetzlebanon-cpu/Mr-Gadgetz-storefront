import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-[#020617] text-white h-[500px] flex items-center">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1464869372688-a93d806be852?w=1600&q=80"
              alt="Workspace"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/70 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl px-8 md:px-16 space-y-6">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Workspace of the Future
            </h2>
            <p className="text-xl text-zinc-300">
              Upgrade your setup with our premium accessories collection. Mechanical keyboards,
              ultra-wide monitors, and more.
            </p>
            <Button
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
              Explore Accessories <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
