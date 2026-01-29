import { useRef, useState, useEffect, useCallback } from "react";

interface UseDraggableOptions {
  speed?: number;
}

interface UseDraggableReturn {
  ref: React.RefObject<HTMLDivElement>;
  isScrollable: boolean;
  isDragging: boolean;
  cursorClass: string;
}

export function useDraggable(options: UseDraggableOptions = {}): UseDraggableReturn {
  const { speed = 1 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const checkScrollable = useCallback(() => {
    if (ref.current) {
      const { scrollWidth, clientWidth } = ref.current;
      setIsScrollable(scrollWidth > clientWidth);
    }
  }, []);

  useEffect(() => {
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [checkScrollable]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new MutationObserver(checkScrollable);
    observer.observe(el, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, [checkScrollable]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isScrollable) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      startX.current = e.pageX - el.offsetLeft;
      scrollLeft.current = el.scrollLeft;
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX.current) * speed;
      el.scrollLeft = scrollLeft.current - walk;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      el.style.cursor = isScrollable ? "grab" : "default";
      el.style.userSelect = "";
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
      if (!isDragging && isScrollable) {
        el.style.cursor = "grab";
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setIsDragging(false);
      el.style.cursor = "default";
      el.style.userSelect = "";
    };

    el.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isScrollable, isDragging, speed]);

  const cursorClass = !isScrollable 
    ? "cursor-default" 
    : isDragging 
      ? "cursor-grabbing" 
      : isHovering 
        ? "cursor-grab" 
        : "cursor-default";

  return { ref, isScrollable, isDragging, cursorClass };
}
