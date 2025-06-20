import React from "react";
import { FloatingOrbs } from "./ui/orbs";

const ImageShowcaseSection = () => {
  return (
    <section className="w-full pt-0 pb-8 sm:pb-12 bg-white dark:bg-gray-950 relative overflow-hidden" id="showcase">
      {/* Orbes flutuantes */}
      <FloatingOrbs sectionId="showcase" />
      
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 animate-on-scroll">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 mb-4">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white mr-2">05</span>
            <span>Showcase</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white mb-3 sm:mb-4">
            Experience the Future Today
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Our cutting-edge humanoid robot is designed to transform how we interact 
            with technology in everyday environments.
          </p>
        </div>
        
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant dark:shadow-indigo-900/20 mx-auto max-w-4xl animate-on-scroll">
          <div className="w-full relative">
                          <div className="absolute inset-0 bg-gradient-to-tr from-pulse-500/20 via-blurple-500/10 via-indigo-500/10 to-violet-500/20 mix-blend-overlay"></div>
            <img 
              src="/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png" 
              alt="Advanced humanoid robot with orange and white design" 
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-display font-semibold mb-3 sm:mb-4 dark:text-white">
              Next Generation Robotics
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Built with precision engineering and sophisticated AI, our robots seamlessly 
              integrate into various environments, from homes to hospitals, providing 
              assistance and enriching human experiences.
            </p>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pulse-100 dark:bg-pulse-900/30 text-pulse-700 dark:text-pulse-300">
                Precision Engineering
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blurple-100 dark:bg-blurple-900/30 text-blurple-700 dark:text-blurple-300">
                Advanced AI
              </span>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                Human-Centered Design
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageShowcaseSection;
