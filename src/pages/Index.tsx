import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DetailsSection from "@/components/DetailsSection";
import ImageShowcaseSection from "@/components/ImageShowcaseSection";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ProcessOptimizationSection from "@/components/ProcessOptimizationSection";
import PartnersSection from "@/components/PartnersSection";
import CookieBanner from "@/components/CookieBanner";
import WhatsAppButton from "@/components/WhatsAppButton";
import { FloatingOrbs } from "@/components/ui/orbs";

const Index = () => {
  // Otimizar smooth scrolling com throttling
  useEffect(() => {
    let ticking = false;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        if (ticking) return;
        
        const targetId = this.getAttribute('href')?.substring(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        ticking = true;
        
        requestAnimationFrame(() => {
          const offset = window.innerWidth < 768 ? 100 : 80;
          
          window.scrollTo({
            top: targetElement.offsetTop - offset,
            behavior: 'smooth'
          });
          
          setTimeout(() => { ticking = false; }, 100);
        });
      });
    });
  }, []);

  return (
    <div className="min-h-screen relative bg-black">
      {/* 3 Orbs flutuantes no fundo de toda a página */}
      <FloatingOrbs 
        orbCount={16} 
        sectionId="main-page" 
        enableMouseFollow={true}
      />
      
      <Navbar />
      <main className="relative">
        <Hero />
        <div className="space-y-4 sm:space-y-8">
          <DetailsSection />
          <ImageShowcaseSection />
          <ProcessOptimizationSection />
          <Features />
          <PartnersSection />
          <FAQ />
          <Contact />
        </div>
      </main>
      <Footer />
      <CookieBanner />
      
      {/* Botão flutuante do WhatsApp */}
      <WhatsAppButton 
        phoneNumber="5562993140780" 
        message="Olá! Gostaria de saber mais sobre as soluções de IA da Mind AI Tecnologia."
      />
    </div>
  );
};

export default Index;
