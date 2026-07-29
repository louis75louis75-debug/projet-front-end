"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Connexion() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const data = new FormData(e.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    try {
      const response = await fetch("https://projet-back-end.vercel.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.jwt) {
          localStorage.setItem("token", result.jwt);
          localStorage.setItem("username", result.username);
        }

        router.push("/");
      } else {
        setErrorMessage("Mot de passe ou adresse email incorrect.");
        setTimeout(() => setErrorMessage(""), 4000);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setErrorMessage("Une erreur est survenue lors de la connexion au serveur.");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* --- BLOC TOAST D'ERREUR --- */}
      {errorMessage && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div
            className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl shadow-lg flex items-center gap-3 text-sm max-w-sm"
            role="alert"
          >
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="font-medium">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* --- ENTÊTE LOGO --- */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block">
          <span className="text-3xl font-extrabold tracking-tight text-gray-900">
            MAXI<span className="text-teal-500">DIGITAL</span>SCHOOLTECH
          </span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Espace membre
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connectez-vous pour donner votre avis sur l'école
        </p>
      </div>

      {/* --- FORMULAIRE DANS UNE CARTE BLANCHE --- */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Champ Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Adresse email
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="etudiant@mydigitalschool.com"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 text-sm transition-all"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Mot de passe
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-purple-700 hover:text-purple-800 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="mt-1.5">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 text-sm transition-all"
                />
              </div>
            </div>

            {/* Bouton de Soumission */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 rounded-full text-sm font-semibold text-white bg-purple-800 hover:bg-purple-900 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 active:scale-[0.99]"
              >
                Se connecter
              </button>
            </div>
          </form>

          {/* Lien vers l'inscription */}
          <div className="mt-8 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <Link
                href="/register"
                className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
              >
                Créer un compte étudiant
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}