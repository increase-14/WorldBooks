import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../store/useAppStore";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

const RegisPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    address: "",
    instagram: "",
    facebook: "",
    telegram: "",
    can_rent_books: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.password || !form.address) {
      notifications.show({
        title: "Diqqat",
        message: "Barcha maydonlarni to'ldiring!",
        color: "red",
        icon: <IconX />,
      });
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/v1/auth/register-library/", {
        user: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          password: form.password.trim(),
        },
        library: {
          address: form.address.trim(),
          can_rent_books: form.can_rent_books,
          social_media: {
            instagram: form.instagram || null,
            facebook: form.facebook || null,
            telegram: form.telegram || null,
          },
          latitude: null,
          longitude: null,
        },
      });

      notifications.show({
        title: "Tabriklaymiz!",
        message: "Kutubxona ro'yxatdan o'tdi! Tez orada admin tasdiqlaydi.",
        color: "green",
        icon: <IconCheck />,
        autoClose: 8000,
      });

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const msg =
        err.response?.data?.phone?.[0] ||
        err.response?.data?.user?.[0] ||
        err.response?.data?.library?.[0] ||
        "Ro'yxatdan o'tishda xatolik";
      notifications.show({
        title: "Xatolik",
        message: msg,
        color: "red",
        icon: <IconX />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#8e6f51] to-[#6b4f33] p-12 text-center text-white">
            <h1 className="text-4xl font-extrabold">Kutubxona ro'yxati</h1>
            <p className="text-lg mt-2 opacity-90">Yangi kutubxona oching</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-7">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Sizning ismingiz"
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#8e6f51]/30 text-lg"
              required
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              type="text"
              placeholder="Telefon raqamingiz +998"
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#8e6f51]/30 text-lg"
              required
            />

            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="Parol"
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#8e6f51]/30 text-lg"
              required
            />

            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              type="text"
              placeholder="Manzilingiz"
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#8e6f51]/30 text-lg"
              required
            />

            <input
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              type="text"
              placeholder="Instagram username"
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#8e6f51]/30 text-lg"
            />
            <input
              name="facebook"
              value={form.facebook}
              onChange={handleChange}
              type="text"
              placeholder="Facebook username"
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#8e6f51]/30 text-lg"
            />
            <input
              name="telegram"
              value={form.telegram}
              onChange={handleChange}
              type="text"
              placeholder="Telegram username"
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#8e6f51]/30 text-lg"
            />

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="can_rent_books"
                checked={form.can_rent_books}
                onChange={handleChange}
                className="w-5 h-5"
              />
              Kitob ijarasi
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8e6f51] to-[#6b4f33] hover:from-[#6b4f33] hover:to-[#5a3f22] text-white font-bold py-6 rounded-2xl text-2xl transition shadow-2xl disabled:opacity-70"
            >
              {loading ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
            </button>
          </form>

          <p className="text-center pb-10 text-gray-600 text-lg">
            Allaqachon hisobingiz bormi?{" "}
            <Link
              to="/login"
              className="text-[#8e6f51] font-bold hover:underline text-xl"
            >
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisPage;
