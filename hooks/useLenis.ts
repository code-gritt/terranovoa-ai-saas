"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

const useLenis = () => {
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2, // The scroll speed
      easing: (t) => t * (2 - t), // Scroll easing function
      smoothWheel: true, // Enable smooth wheel scrolling
      wheelMultiplier: 1, // Adjust wheel multiplier instead of smoothTouch
    });

    // Animation loop for the smooth scroll effect
    const animate = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, []);
};
export default useLenis;
