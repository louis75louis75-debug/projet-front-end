"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Récupération des données du formulaire
    const data = new FormData(e.currentTarget);
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");

    // Validation de sécurité côté client
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas !");
      return;
    }

    setLoading(true);

    try {
      // Envoi des données au backend
      const response = await fetch("https://projet-back-end.vercel.app/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
          confirmPassword,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Compte créé avec succès ! Redirection en cours...");
        setTimeout(() => {
          router.push("/connexion");
        }, 1500);
      } else {
        const errorData = await response.json();
        setErrorMessage(
          errorData.message || "Impossible de créer le compte pour le moment."
        );
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setErrorMessage("Une erreur est survenue lors de la connexion au serveur.");
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
          Créer un compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Rejoignez la communauté d'étudiants et donnez votre avis
        </p>
      </div>

      {/* --- FORMULAIRE DANS UNE CARTE BLANCHE --- */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Champ Nom d'utilisateur */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700"
              >
                Nom ou Pseudo
              </label>
              <div className="mt-1.5">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Alex Dupont"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 text-sm transition-all"
                />
              </div>
            </div>

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
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Mot de passe
              </label>
              <div className="mt-1.5">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 text-sm transition-all"
                />
              </div>
            </div>

            {/* Champ Confirmation Mot de passe */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700"
              >
                Confirmer le mot de passe
              </label>
              <div className="mt-1.5">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 text-sm transition-all"
                />
              </div>
            </div>

            {/* Alerts d'erreur et de succès */}
            {errorMessage && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm font-medium text-center">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium text-center">
                {successMessage}
              </div>
            )}

            {/* Bouton d'Inscription */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 rounded-full text-sm font-semibold text-white bg-purple-800 hover:bg-purple-900 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? "Création du compte..." : "S'inscrire"}
              </button>
            </div>
          </form>

          {/* Lien vers la connexion */}
          <div className="mt-8 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/connexion"
                className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}