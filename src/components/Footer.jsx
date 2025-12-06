import React from "react";

const Footer = () => {
  return (
    <footer className=" border-t border-[#d6c4b4] py-10">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-[#6b5238]">
            Kitoblar Katalogi
          </h2>

          <nav className="flex gap-6 text-[#6b5238] font-medium">
            <a href="#" className="hover:text-[#4a3827] transition">
              Bosh sahifa
            </a>
            <a href="#" className="hover:text-[#4a3827] transition">
              Kitoblar
            </a>
            <a href="#" className="hover:text-[#4a3827] transition">
              Kutubxonalar
            </a>
          </nav>
        </div>

        <div className="border-t border-[#d6c4b4] my-6"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[#8b715a] text-sm">
          <p>© 2025. Barcha huquqlar himoyalangan.</p>

          <p className="mt-2 sm:mt-0 hover:text-[#6b5238] transition">
            Kitobsevarlar uchun yaratilgan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
