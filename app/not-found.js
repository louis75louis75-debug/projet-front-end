import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center font-sans">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
        
        {/* Badge 404 */}
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-extrabold tracking-wide uppercase mb-6">
          Erreur 404
        </span>

        {/* Image du Risitas en chantier */}
        <div className="relative w-40 h-32 mb-6 flex items-center justify-center">
          <img
            src="/risitas-ouvrier.png"
            alt="Site en construction"
            className="w-auto h-full object-contain drop-shadow-md"
          />
        </div>

        {/* Titre & Message */}
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
          Site en construction !
        </h1>
        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
          Cette page n'est pas encore disponible. Nos équipes travaillent d'arrache-pied dessus !
        </p>

        {/* Bouton de retour */}
        <Link
          href="/"
          className="w-full sm:w-auto rounded-full bg-purple-600 hover:bg-purple-700 px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98]"
        >
          Retourner à l'accueil
        </Link>
      </div>
    </div>
  );
}