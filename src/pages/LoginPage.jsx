import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { api } from "../api/API";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (body) => {
      const res = await api.post("/api/v1/auth/login/", body);
      return res.data;
    },

    onSuccess: (data) => {
      toast.success("Muvaffaqiyatli tizimga kirdingiz!");
      localStorage.setItem("token", data.access);
      navigate("/profile");
    },

    onError: () => {
      toast.error("Telefon yoki parol xato");
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({
      phone: phone,
      password: password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4efe9] px-4">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-2xl overflow-hidden max-w-4xl w-full">
        <div className="md:w-1/2">
          <img
            src="https://ezma-client.vercel.app/assets/login-img-DdFMbwye.svg"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 bg-[#fdf8f2] p-8 md:p-12 flex flex-col justify-center gap-4">
          <Link to="/" className="text-sm text-[#8e6f51] hover:underline mb-2">
            ← Orqaga
          </Link>

          <h1 className="text-2xl font-bold text-[#6b4f33] mb-6">
            Tizimga kirish
          </h1>

          <label className="text-[#6b4f33] font-medium">Telefon raqam</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="text"
            placeholder="+998(99)-012-7331"
            className="border border-[#d5c4b0] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8e6f51]"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <label className="text-[#6b4f33] font-medium mt-4">Parol</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="*****"
            className="border border-[#d5c4b0] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8e6f51]"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <button
            onClick={handleLogin}
            disabled={loginMutation.isPending}
            className="mt-6 w-full bg-[#8e6f51] hover:bg-[#6b4f33] text-white font-semibold py-2 rounded-lg transition"
          >
            {loginMutation.isPending ? "Kirilmoqda..." : "Kirish"}
          </button>

          <p className="text-sm text-[#6b4f33] mt-4">
            Hisobingiz yo’q?{" "}
            <Link to="/register" className="text-[#8e6f51] hover:underline">
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
