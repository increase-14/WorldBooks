import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";

const Nav = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const [openLang, setOpenLang] = useState(false);

  const toggleColorScheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setOpenLang(false);
  };

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/kitoblar", label: t("nav.books") },
    { to: "/kutubxonalar", label: t("nav.libraries") },
  ];

  const languageOptions = [
    { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "en", label: "English", flag: "🇬🇧" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-[#3b2f2f]/80 border-b border-[#d5c4b0] dark:border-[#4a3f30] shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#e9e0d4] dark:hover:bg-[#4a3f30] transition"
            onClick={() => setOpenMenu(!openMenu)}
          >
            {openMenu ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="hidden md:flex gap-12">
            {links.map((link) => {
              const active = location.pathname === link.to;
              return (
                <NavLink key={link.to} to={link.to} className="relative group">
                  <span
                    className={`text-lg tracking-wide transition ${
                      active
                        ? "text-[#8e6f51]"
                        : "text-[#8a755c] dark:text-[#d5c4b0]"
                    }`}
                  >
                    {link.label}
                  </span>
                  <span
                    className={`absolute left-0 right-0 mx-auto bottom-[-6px] h-[3px] rounded-full transition-transform duration-300 bg-[#6b4f33] ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </NavLink>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-[#e9e0d4] dark:hover:bg-[#4a3f30] transition text-sm md:text-base"
              onClick={() => setOpenLang(!openLang)}
            >
              {i18n.language.toUpperCase()}
            </button>

            {openLang && (
              <div className="absolute  right-0 mt-2 w-40 bg-white dark:bg-[#3b2f2f] shadow-xl rounded-xl p-2">
                <p className="px-3 py-1 text-sm text-[#8a755c] dark:text-[#d5c4b0]">
                  Til
                </p>
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full  text-left px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-[#f5efe8] dark:hover:bg-[#4a3f30] transition ${
                      i18n.language === lang.code
                        ? "font-bold text-[#6b4f33]"
                        : "text-[#d5c4b0] dark:text-[#d5c4b0]"
                    }`}
                  >
                    <span>{lang.flag}</span> {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/profile">
            <button className="px-3 md:px-4 py-2 cursor-pointer">
              <img
                className="w-12"
                src="https://ezma-client.vercel.app/assets/user-D__q57DX.png"
              />
            </button>
          </Link>
        </div>
      </div>
      {openMenu && (
        <div className="md:hidden bg-white dark:bg-[#3b2f2f] border-t border-[#d5c4b0] dark:border-[#4a3f30] p-4 space-y-3 transition">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`block px-2 py-2 rounded-lg text-base ${
                  active
                    ? "text-[#6b4f33] font-bold"
                    : "text-[#8a755c] dark:text-[#d5c4b0]"
                }`}
                onClick={() => setOpenMenu(false)}
              >
                {link.label}
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Nav;
