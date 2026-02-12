import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import * as THREE from "three";
import { SEO } from "@/components/SEO";
import { buildCanonicalUrl } from "@/lib/seo";

function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities: THREE.Vector3[] = [];

    const brandCyan = new THREE.Color(0x48bfef);
    const brandBlue = new THREE.Color(0x0c57ef);
    const brandAzure = new THREE.Color(0x2f91f0);
    const colorPalette = [brandCyan, brandBlue, brandAzure];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const color =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 2 + 0.5;

      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
        ),
      );
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mousePos: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = length(mvPosition.xyz);
          vAlpha = smoothstep(80.0, 20.0, dist);
          gl_PointSize = size * (50.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, dist) * vAlpha * 0.8;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / width) * 2 - 1;
      mouseRef.current.y = -(e.clientY / height) * 2 + 1;
    };

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const positionAttr = geometry.attributes
        .position as THREE.BufferAttribute;
      const posArray = positionAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities[i].x;
        posArray[i * 3 + 1] += velocities[i].y;
        posArray[i * 3 + 2] += velocities[i].z;

        if (Math.abs(posArray[i * 3]) > 50) velocities[i].x *= -1;
        if (Math.abs(posArray[i * 3 + 1]) > 50) velocities[i].y *= -1;
        if (Math.abs(posArray[i * 3 + 2]) > 50) velocities[i].z *= -1;

        const dx = mouseRef.current.x * 30 - posArray[i * 3];
        const dy = mouseRef.current.y * 30 - posArray[i * 3 + 1];
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 15) {
          velocities[i].x -= dx * 0.001;
          velocities[i].y -= dy * 0.001;
        }
      }

      positionAttr.needsUpdate = true;

      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;

      material.uniforms.time.value += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" />
  );
}

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you are looking for could not be found. Browse Mr. Gadgetz for premium electronics, phones, laptops, and accessories."
        url={buildCanonicalUrl("/404")}
      />

      <div className="relative min-h-screen overflow-hidden bg-[#020617]">
        <ParticleBackground />

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pb-24 md:pb-32">
          <div className="text-center max-w-lg mx-auto">
            <h1
              className="text-[12rem] md:text-[16rem] font-display font-bold leading-none mb-4 select-none"
              style={{
                color: "black",
                textShadow: `
                0 0 1px #48bfef,
                0 0 2px #48bfef,
                0 0 10px rgba(72, 191, 239, 0.5),
                0 0 20px rgba(72, 191, 239, 0.3),
                0 0 40px rgba(72, 191, 239, 0.2)
              `,
                WebkitTextStroke: "2px #48bfef",
              }}
              data-testid="text-404"
            >
              404
            </h1>

            <p
              className="text-xl md:text-2xl font-medium tracking-[0.3em] mb-12 select-none"
              style={{
                color: "transparent",
                textShadow: `
                0 0 1px rgba(255, 255, 255, 0.8),
                0 0 5px rgba(255, 255, 255, 0.4),
                0 0 10px rgba(72, 191, 239, 0.3)
              `,
                WebkitTextStroke: "1px rgba(255, 255, 255, 0.7)",
              }}
              data-testid="text-error-message"
            >
              SIGNAL LOST
            </p>

            <Link href="/shop">
              <button
                className="
                relative overflow-hidden z-10 inline-flex items-center justify-center 
                rounded-full px-8 py-3 font-semibold transition-all duration-500 ease-in-out
                bg-[#0c57ef] text-white border-[#0c57ef]
                shadow-[0_4px_15px_rgba(12,87,239,0.3)]
                hover:shadow-[0_4px_20px_rgba(72,191,239,0.4)]
                hover:text-[#0c57ef]

                before:content-[''] before:absolute before:z-[-1] before:block
                before:w-[150%] before:h-0 before:rounded-[50%]
                before:left-1/2 before:top-[100%] 
                before:translate-x-[-50%] before:translate-y-[-50%]
                before:bg-white before:transition-all before:duration-500

                hover:before:h-[300%] hover:before:top-1/2
              "
                data-testid="button-back-to-shop"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Shop
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
