import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Nav = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const toggleColorScheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
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
        <div className="flex gap-12">
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
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </NavLink>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleColorScheme}
            className="p-2 rounded-full hover:bg-[#e9e0d4] dark:hover:bg-[#4a3f30] transition text-xl"
          >
            Boddy
          </button>

          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-[#e9e0d4] dark:hover:bg-[#4a3f30] transition text-xl">
              Language
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#3b2f2f] shadow-xl rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
              <p className="px-3 py-1 text-sm text-[#8a755c] dark:text-[#d5c4b0]">
                Til
              </p>
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-[#f5efe8] dark:hover:bg-[#4a3f30] transition ${
                    i18n.language === lang.code
                      ? "font-bold text-[#6b4f33]"
                      : "text-[#8a755c] dark:text-[#d5c4b0]"
                  }`}
                >
                  <span>{lang.flag}</span> {lang.label}
                </button>
              ))}
            </div>
          </div>

          <Link to="/profile">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#8e6f51] hover:bg-[#6b4f33] text-white rounded-xl transition">
              <span>Profil</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
