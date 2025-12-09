import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();

  return (
    <footer className=" border-t border-[#d6c4b4] py-10">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-[#6b5238]">
            {t("footer.t1")}
          </h2>

          <nav className="flex gap-6 text-[#6b5238] font-medium">
            <a href="#" className="hover:text-[#4a3827] transition">
              {t("footer.home")}
            </a>
            <a href="#" className="hover:text-[#4a3827] transition">
              {t("footer.books")}
            </a>
            <a href="#" className="hover:text-[#4a3827] transition">
              {t("footer.libraries")}
            </a>
          </nav>
        </div>

        <div className="border-t border-[#d6c4b4] my-6"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[#8b715a] text-sm">
          <p> {t("footer.t2")}</p>

          <p className="mt-2 sm:mt-0 hover:text-[#6b5238] transition">
          {t("footer.t3")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
