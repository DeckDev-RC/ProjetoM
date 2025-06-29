import React, { useEffect, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DetailsSection from "@/components/DetailsSection";
import ImageShowcaseSection from "@/components/ImageShowcaseSection";
import CookieBanner from "@/components/CookieBanner";
import { FloatingOrbs } from "@/components/ui/orbs";

// Lazy loading para componentes não críticos
const Features = lazy(() => import("@/components/Features"));
const FAQ = lazy(() => import("@/components/FAQ"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));
const ProcessOptimizationSection = lazy(() => import("@/components/ProcessOptimizationSection"));
const PartnersSection = lazy(() => import("@/components/PartnersSection"));

const Index = () => {
  // Initialize intersection observer to detect when elements enter viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    // This helps ensure smooth scrolling for the anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href')?.substring(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        // Increased offset to account for mobile nav
        const offset = window.innerWidth < 768 ? 100 : 80;
        
        window.scrollTo({
          top: targetElement.offsetTop - offset,
          behavior: 'smooth'
        });
      });
    });
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background Orbs - Reduzido de 24 para 8 */}
      <FloatingOrbs orbCount={8} sectionId="global-background" enableMouseFollow={true} />
      
      {/* Frosted Glass Overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none frosted-glass-overlay" />
      
      <Navbar />
      <main className="relative z-10">
        <Hero />
        
        <div className="space-y-4 sm:space-y-8">
          <DetailsSection />
          <ImageShowcaseSection />
          
          {/* Componentes com lazy loading e suspense */}
          <Suspense fallback={<div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
          <ProcessOptimizationSection />
          </Suspense>
          
          <Suspense fallback={<div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
          <Features />
          </Suspense>
          
          <Suspense fallback={<div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
          <PartnersSection />
          </Suspense>
          
          <Suspense fallback={<div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
          <FAQ />
          </Suspense>
          
          <Suspense fallback={<div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
          <Contact />
          </Suspense>
        </div>
      </main>
      
      <div className="relative z-10">
        <Suspense fallback={<div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
        <Footer />
        </Suspense>
      </div>
      
      {/* Cookie Banner */}
      <CookieBanner />
      
      {/* Newsletter */}
    </div>
  );
};

export default Index;
