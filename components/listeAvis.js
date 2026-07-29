"use client";

import Navbar from "@/components/navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// On nettoie l'URL de base pour éviter qu'il y ait un "/" final qui provoque une redirection Vercel
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://projet-back-end.vercel.app";
const API_BASE_URL = rawApiUrl.replace(/\/$/, "");

export default function ListeAvisComponent() {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userIdConnecte, setUserIdConnecte] = useState(null);
  const [username, setUsername] = useState("");

  // Formulaire de création d'un avis
  const [guestName, setGuestName] = useState(""); 
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState("");
  
  // CHAMP HONEYPOT (Anti-Spam)
  const [honeypot, setHoneypot] = useState("");

  // ÉTATS POUR LA MODIFICATION
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt") || localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token) {
      setIsConnected(true);
      setUsername(storedUsername || "Utilisateur");
      try {
        const decoded = jwtDecode(token);
        setUserIdConnecte(decoded.id);
      } catch (err) {
        console.error("Erreur lors du décodage du token", err);
        setUserIdConnecte(null);
      }
    } else {
      setIsConnected(false);
      setUsername("");
      setUserIdConnecte(null);
    }

    const fetchAvis = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/avis`);
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
    localStorage.removeItem("jwt");
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    setIsConnected(false);
    setUsername("");
    setUserIdConnecte(null);

    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (honeypot.trim() !== "") {
      console.warn("Spam détecté via le honeypot !");
      setShowForm(false);
      setDescription("");
      return;
    }

    const token = localStorage.getItem("jwt") || localStorage.getItem("token");
    const authorName = isConnected
      ? username
      : guestName.trim() || "Visiteur anonyme";

    try {
      const response = await fetch(`${API_BASE_URL}/add/avis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: authorName,
          rating: Number(rating),
          description,
          date: new Date(),
          website: honeypot,
        }),
      });

      if (response.ok) {
        setDescription("");
        setGuestName("");
        setShowForm(false);
        const res = await fetch(`${API_BASE_URL}/avis`);
        if (res.ok) {
          const data = await res.json();
          setAvis(data);
        }
      } else {
        const errorData = await response.json();
        console.error("Détail de l'erreur backend :", errorData.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'avis :", error);
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id || item._id);
    setEditRating(item.rating);
    setEditDescription(item.description);
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("jwt") || localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/avis/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: Number(editRating),
          description: editDescription,
        }),
      });

      if (response.ok) {
        setAvis(
          avis.map((item) =>
            (item.id || item._id) === id
              ? { ...item, rating: Number(editRating), description: editDescription }
              : item
          )
        );
        setEditingId(null);
      } else {
        alert("Erreur lors de la modification");
      }
    } catch (error) {
      console.error("Erreur PUT frontend :", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("jwt") || localStorage.getItem("token");
    if (!window.confirm("Voulez-vous vraiment supprimer cet avis ?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/avis/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAvis(avis.filter((item) => (item.id || item._id) !== id));
      }
    } catch (error) {
      console.error("Erreur DELETE frontend :", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar isConnected={isConnected} username={username} handleLogout={handleLogout} />

      <main className="max-w-6xl w-full mx-auto pt-28 px-4 pb-16">
        {/* --- EN-TÊTE DE LA PAGE --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-8 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-gray-900">
              Avis des étudiants
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Découvrez les retours et expériences partagés par la communauté.
            </p>
          </div>

          <div className="mt-6 sm:mt-0">
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-purple-800 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-purple-900 transition-all active:scale-[0.99]"
            >
              {showForm ? "Fermer le formulaire" : "Laisser un avis"}
            </button>
          </div>
        </div>

        {/* --- FORMULAIRE D'AVIS --- */}
        {showForm && (
          <div className="mb-12 bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-xl shadow-gray-200/50 max-w-2xl mx-auto transition-all">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              Votre expérience compte
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Ne pas remplir ce champ :</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Auteur
                </label>
                {isConnected ? (
                  <input
                    type="text"
                    required
                    disabled
                    value={username}
                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3.5 py-2 text-gray-600 text-sm cursor-not-allowed outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Entrez votre prénom ou pseudo"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-gray-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-sm outline-none transition-all"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Note globale
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-gray-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-sm outline-none transition-all"
                >
                  <option value={5}>★★★★★ (5/5)</option>
                  <option value={4}>★★★★☆ (4/5)</option>
                  <option value={3}>★★★☆☆ (3/5)</option>
                  <option value={2}>★★☆☆☆ (2/5)</option>
                  <option value={1}>★☆☆☆☆ (1/5)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Votre commentaire
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  placeholder="Racontez votre expérience au sein de l'école..."
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-gray-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-sm outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-purple-800 py-2.5 px-4 text-sm font-semibold text-white shadow-md hover:bg-purple-900 transition-all active:scale-[0.99]"
              >
                Publier mon avis
              </button>
            </form>
          </div>
        )}

        {/* --- GRILLE DES AVIS EXISTANTS --- */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium animate-pulse">
              Chargement des avis...
            </p>
          </div>
        ) : avis.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 italic">
              Aucun avis n'a encore été publié. Soyez le premier !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {avis.map((item) => {
              const currentId = item.id || item._id;
              const isEditing = editingId === currentId;

              return (
                <div
                  key={currentId}
                  className="rounded-2xl bg-white p-6 shadow-md shadow-gray-200/50 border border-gray-100 flex flex-col justify-between hover:shadow-xl hover:border-gray-200 transition-all duration-200"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <span className="font-semibold text-purple-800 text-sm block">
                        Modifier votre avis
                      </span>
                      <select
                        value={editRating}
                        onChange={(e) => setEditRating(Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-gray-900 text-sm outline-none focus:border-purple-600"
                      >
                        <option value={5}>5/5</option>
                        <option value={4}>4/5</option>
                        <option value={3}>3/5</option>
                        <option value={2}>2/5</option>
                        <option value={1}>1/5</option>
                      </select>
                      <textarea
                        rows={3}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-gray-900 text-sm outline-none focus:border-purple-600"
                      />
                      <div className="flex space-x-2 pt-1">
                        <button
                          onClick={() => handleUpdate(currentId)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="font-bold text-gray-900 text-base block line-clamp-1">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-amber-400 tracking-wider text-sm flex-shrink-0 mt-0.5">
                          {"★".repeat(item.rating || 5)}
                          <span className="text-gray-200">
                            {"★".repeat(5 - (item.rating || 5))}
                          </span>
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 italic">
                        "{item.description}"
                      </p>
                    </div>
                  )}

                  {/* --- BOUTONS MODIFIER / SUPPRIMER --- */}
                  {!isEditing &&
                    userIdConnecte &&
                    userIdConnecte !== "null" &&
                    userIdConnecte !== "undefined" &&
                    String(userIdConnecte) === String(item.userId) && (
                      <div className="mt-4 pt-3 flex justify-end space-x-2 border-t border-gray-100">
                        <button
                          onClick={() => startEditing(item)}
                          className="text-xs font-semibold bg-purple-50 text-purple-800 px-3 py-1 rounded-full hover:bg-purple-100 transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(currentId)}
                          className="text-xs font-semibold bg-red-50 text-red-700 px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">
                      {item.date
                        ? new Date(item.date).toLocaleDateString("fr-FR")
                        : "Date inconnue"}
                    </span>
                    <Link
                      href={`/avis/${currentId}`}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1"
                    >
                      Voir le détail →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}