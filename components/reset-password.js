"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PasswordReset() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Récupération du token depuis l'URL au chargement
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token");
      if (urlToken) {
        setToken(urlToken);
      } else {
        setError("Le jeton de réinitialisation est introuvable ou invalide.");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const data = new FormData(e.currentTarget);
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    if (!token) {
      setError("Jeton de réinitialisation manquant. Impossible de continuer.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://projet-back-end.vercel.app/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Votre mot de passe a bien été mis à jour ! Redirection...");
        setTimeout(() => {
          router.push("/connexion");
        }, 2000);
      } else {
        setError(result.message || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* --- ENTÊTE LOGO ET TITRE --- */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block">
          <span className="text-3xl font-extrabold tracking-tight text-gray-900">
            MAXI<span className="text-teal-500">DIGITAL</span>SCHOOLTECH
          </span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Nouveau mot de passe
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choisissez votre nouveau mot de passe ci-dessous.
        </p>
      </div>

      {/* --- FORMULAIRE DANS UNE CARTE BLANCHE --- */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Nouveau Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Nouveau mot de passe
              </label>
              <div className="mt-1.5">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 text-sm transition-all"
                />
              </div>
            </div>

            {/* Confirmation Nouveau Mot de passe */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700"
              >
                Confirmer le nouveau mot de passe
              </label>
              <div className="mt-1.5">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 text-sm transition-all"
                />
              </div>
            </div>

            {/* Alerts d'erreur et de succès */}
            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm font-medium text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium text-center">
                {message}
              </div>
            )}

            {/* Bouton de confirmation */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 rounded-full text-sm font-semibold text-white bg-purple-800 hover:bg-purple-900 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </button>
            </div>
          </form>

          {/* Lien de retour */}
          <div className="mt-8 border-t border-gray-100 pt-6 text-center">
            <Link
              href="/connexion"
              className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1.5"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}