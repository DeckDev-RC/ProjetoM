import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-950 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <img src="/logo.svg" alt="Mind AI Logo" className="h-8" />
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Mind AI. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
