"use client";

import Navbar from "@/components/navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

// Nettoyage de l'URL pour éviter les problèmes de slash final avec Vercel
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://projet-back-end.vercel.app";
const API_BASE_URL = rawApiUrl.replace(/\/$/, "");

export default function Home() {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    const storedUsername = localStorage.getItem("username");

    if (token) {
      setIsConnected(true);
      setUsername(storedUsername || "Utilisateur");
    } else {
      setIsConnected(false);
      setUsername("");
    }

    const fetchAvis = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/avis`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          setAvis(data);
        }
      } catch (error) {
        console.error("Impossible de charger les avis :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvis();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");

    setIsConnected(false);
    setUsername("");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <Navbar isConnected={isConnected} username={username} handleLogout={handleLogout} />

      <main className="pt-28 pb-16 px-4">
        
        {/* --- SECTION HERO DEUX COLONNES --- */}
        <section className="max-w-7xl mx-auto py-8 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Colonne Gauche : Contenu textuel */}
          <div className="text-center lg:text-left space-y-6">
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Découvrez la vie étudiante en toute <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-teal-500">transparence</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Rejoignez la communauté <span className="font-bold text-gray-900">MAXI<span className="text-teal-500">DIGITAL</span>SCHOOLTECH</span>. Retrouvez des retours d'expérience concrets, échangez sur les formations et réussissez votre parcours.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              {isConnected ? (
                <Link
                  href="/avis"
                  className="rounded-full bg-purple-800 px-7 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-purple-900 transition-all active:scale-[0.99]"
                >
                  Laisser un avis
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="rounded-full bg-purple-800 px-7 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-purple-900 transition-all active:scale-[0.99]"
                  >
                    Rejoindre la communauté
                  </Link>
                  <Link
                    href="/connexion"
                    className="rounded-full bg-white border border-gray-300 px-7 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    Se connecter
                  </Link>
                </>
              )}
            </div>

            {/* Présentation MaxiDigital SchoolTech */}
            <div className="pt-6 border-t border-gray-200/60 text-center lg:text-left">
              <p className="text-xs font-bold text-purple-800 uppercase tracking-widest mb-1">
                À propos de MaxiDigital SchoolTech
              </p>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                « L'écosystème d'excellence agile axé sur la synergie disruptive entre innovation numérique, apprentissage par projets et soft skills stratégiques pour façonner les talents du digital de demain. »
              </p>
            </div>
          </div>

          {/* Colonne Droite : Composition d'images modernes */}
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-xl border-4 border-white group">
                <img
                  src="/img01.jpg"
                  alt="Étudiants en travail d'équipe"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="relative h-44 sm:h-52 rounded-3xl overflow-hidden shadow-xl border-4 border-white group">
                <img
                  src="/img03.jpg"
                  alt="Étudiant souriant sur ordinateur"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="relative h-44 sm:h-52 rounded-3xl overflow-hidden shadow-xl border-4 border-white group">
                <img
                  src="/img02.jpeg"
                  alt="Étudiant travaillant attentivement"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-xl border-4 border-white group">
                <img
                  src="/img04.avif"
                  alt="Étudiant studieux dans la bibliothèque"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

        </section>

        {/* --- SECTION 1 : NOS FORMATIONS FICTIVES (Placées en premier) --- */}
        <section className="mt-16 max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 text-xs font-bold tracking-wide uppercase">
              Catalogue 2026-2027
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
              Nos Formations High-Tech
            </h2>
            <p className="mt-2 text-base text-gray-500">
              Des cursus conçus pour anticiper les mutations technologiques et répondre aux exigences du marché mondial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Formation 1 */}
            <div className="bg-white rounded-3xl p-7 border border-gray-200/80 shadow-md shadow-gray-200/40 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                    Bac +3 / Bac +5
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">Alternance / Initial</span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                  Bachelor Fullstack & Cloud Native
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Maîtrisez le développement d'applications hautement scalables, l'architecture microservices et les infrastructures DevOps modernes.
                </p>
              </div>
              <div>
                <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-2 mb-6">
                  <p><span className="font-semibold text-gray-700">Débouchés :</span> Développeur Fullstack, Architecte Cloud</p>
                  <p><span className="font-semibold text-gray-700">Durée :</span> 3 ans (post-bac)</p>
                </div>
                <Link
                  href="/formations/fullstack"
                  className="block w-full text-center rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold py-3 text-sm transition-colors"
                >
                  Découvrir le programme
                </Link>
              </div>
            </div>

            {/* Formation 2 */}
            <div className="bg-white rounded-3xl p-7 border border-gray-200/80 shadow-md shadow-gray-200/40 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                    Master Spécialisé
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">Alternance 100%</span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                  Mastère IA & Data Engineering
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Spécialisez-vous dans l'entraînement de modèles génératifs, le traitement Big Data et le déploiement de solutions d'intelligence artificielle éthiques.
                </p>
              </div>
              <div>
                <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-2 mb-6">
                  <p><span className="font-semibold text-gray-700">Débouchés :</span> Data Scientist, Prompt Engineer, MLOps</p>
                  <p><span className="font-semibold text-gray-700">Durée :</span> 2 ans (post-bac +3)</p>
                </div>
                <Link
                  href="/formations/ia-data"
                  className="block w-full text-center rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold py-3 text-sm transition-colors"
                >
                  Découvrir le programme
                </Link>
              </div>
            </div>

            {/* Formation 3 */}
            <div className="bg-white rounded-3xl p-7 border border-gray-200/80 shadow-md shadow-gray-200/40 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    Executive MBA
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">Hybride</span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                  MBA Digital Product Management
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Pilotez des stratégies produit ambitieuses. Apprenez le Growth Hacking, le design UX/UI centré utilisateur et le leadership agile.
                </p>
              </div>
              <div>
                <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-2 mb-6">
                  <p><span className="font-semibold text-gray-700">Débouchés :</span> Product Owner, Lead PM, Head of Digital</p>
                  <p><span className="font-semibold text-gray-700">Durée :</span> 1 à 2 ans</p>
                </div>
                <Link
                  href="/formations/product-management"
                  className="block w-full text-center rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold py-3 text-sm transition-colors"
                >
                  Découvrir le programme
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 2 : CE QUE DISENT NOS ÉTUDIANTS (Avis Dynamiques en second) --- */}
        <section className="mt-24 max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 pb-6 mb-8">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                Ils racontent leur expérience
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Étudiants et diplômés dévoilent leur parcours et ce que la formation leur a apporté.
              </p>
            </div>
            <Link
              href="/avis"
              className="mt-4 sm:mt-0 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1"
            >
              Voir tous les retours →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium animate-pulse">
                Chargement des témoignages...
              </p>
            </div>
          ) : avis.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-200/80 shadow-sm">
              <p className="text-gray-500 italic">Aucun avis publié pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {avis.map((item) => (
                <div
                  key={item.id || item._id}
                  className="rounded-3xl bg-white p-6 shadow-md shadow-gray-200/50 border border-gray-100 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-sm shadow-sm uppercase">
                          {item.name ? item.name.charAt(0) : "U"}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base leading-tight">
                            {item.name}
                          </h3>
                          <span className="text-xs text-gray-400">Étudiant vérifié</span>
                        </div>
                      </div>
                      
                      <span className="text-amber-400 tracking-wider text-sm">
                        {"★".repeat(item.rating || 5)}
                        <span className="text-gray-200">
                          {"★".repeat(5 - (item.rating || 5))}
                        </span>
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm italic leading-relaxed line-clamp-4 mt-2">
                      "{item.description}"
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">
                      {item.date
                        ? new Date(item.date).toLocaleDateString("fr-FR")
                        : "Récemment"}
                    </span>
                    <Link
                      href={`/avis/${item.id || item._id}`}
                      className="text-xs font-semibold text-purple-800 hover:text-purple-900 transition-colors"
                    >
                      Lire la suite →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}