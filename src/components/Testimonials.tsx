import React, { useRef } from "react";

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  gradient?: string;
  backgroundImage?: string;
  colorIndex?: number;
}

const testimonials: TestimonialProps[] = [{
  content: "Atlas transformed our production line, handling repetitive tasks while our team focuses on innovation. 30% increase in output within three months.",
  author: "Sarah Chen",
  role: "VP of Operations, Axion Manufacturing",
  colorIndex: 0,
  backgroundImage: "/background-section1.png"
}, {
  content: "Implementing Atlas in our fulfillment centers reduced workplace injuries by 40% while improving order accuracy. The learning capabilities are remarkable.",
  author: "Michael Rodriguez",
  role: "Director of Logistics, GlobalShip",
  colorIndex: 1,
  backgroundImage: "/background-section2.png"
}, {
  content: "Atlas adapted to our lab protocols faster than any system we've used. It's like having another researcher who never gets tired and maintains perfect precision.",
  author: "Dr. Amara Patel",
  role: "Lead Scientist, BioAdvance Research",
  colorIndex: 2,
  backgroundImage: "/background-section3.png"
}, {
  content: "As a mid-size business, we never thought advanced robotics would be accessible to us. Atlas changed that equation entirely with its versatility and ease of deployment.",
  author: "Jason Lee",
  role: "CEO, Innovative Solutions Inc.",
  colorIndex: 0,
  backgroundImage: "/background-section1.png"
}];

const TestimonialCard = ({
  content,
  author,
  role,
  backgroundImage = "/background-section1.png",
  colorIndex = 0
}: TestimonialProps) => {
  // Gradientes baseados na nova paleta de cores
  const gradients = [
    "bg-gradient-to-br from-pulse-500/90 to-pulse-700/90", // Azul claro
    "bg-gradient-to-br from-blurple-500/90 to-blurple-700/90", // Azul médio
    "bg-gradient-to-br from-indigo-500/90 to-indigo-700/90", // Roxo médio
    "bg-gradient-to-br from-violet-500/90 to-violet-700/90", // Roxo escuro
  ];

  const gradient = gradients[colorIndex % 4];

  return (
    <div 
      className={`rounded-lg p-8 h-full flex flex-col justify-between text-white transform transition-transform duration-300 hover:-translate-y-2 relative overflow-hidden ${gradient}`} 
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 backdrop-blur-sm rounded-bl-3xl z-10"></div>
      
      <div className="relative z-0">
        <p className="text-xl mb-8 font-medium leading-relaxed pr-20">{`"${content}"`}</p>
        <div>
          <h4 className="font-semibold text-xl">{author}</h4>
          <p className="text-white/80">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
        <section className="py-12 relative overflow-hidden" id="testimonials" ref={sectionRef}>
      {/* Glass background overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10" />
      
      <div className="section-container opacity-0 animate-on-scroll relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">04</span>
            <span>Testimonials</span>
          </div>
        </div>
        
        <h2 className="text-5xl font-display font-bold mb-12 text-left text-white">What others say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              content={testimonial.content} 
              author={testimonial.author} 
              role={testimonial.role} 
              colorIndex={testimonial.colorIndex} 
              backgroundImage={testimonial.backgroundImage} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
