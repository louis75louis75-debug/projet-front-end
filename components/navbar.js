'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt") || localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token) {
      setIsConnected(true);
      setUsername(storedUsername || "Utilisateur");
    } else {
      setIsConnected(false);
      setUsername("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    
    setIsConnected(false);
    setUsername("");
    window.location.reload();
  };

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4 sm:px-8">
      {/* Conteneur Capsule Flottante */}
      <nav 
        aria-label="Global" 
        className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3 rounded-full bg-white/80 backdrop-blur-md border border-gray-200/80 shadow-lg shadow-gray-200/50 transition-all"
      >
        
        {/* LOGO */}
        <div className="flex lg:flex-1 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:opacity-90 transition-opacity">
              MAXI<span className="text-teal-500">DIGITAL</span>SCHOOLTECH
            </span>
          </Link>
        </div>

        {/* LIENS CENTRÉS (Desktop) */}
        <div className="hidden lg:flex lg:gap-x-6 items-center bg-gray-100/70 px-5 py-1.5 rounded-full border border-gray-200/50">
          <Link 
            href="/formations" 
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-purple-800 transition-colors"
          >
            <AcademicCapIcon className="w-4 h-4 text-gray-500" />
            Formations
          </Link>
          
          <span className="text-gray-300">|</span>
          
          <Link 
            href="/avis" 
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-purple-800 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-500" />
            Avis
          </Link>

          <span className="text-gray-300">|</span>

          <Link 
            href="/a-propos" 
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-purple-800 transition-colors"
          >
            <InformationCircleIcon className="w-4 h-4 text-gray-500" />
            À propos
          </Link>

          <span className="text-gray-300">|</span>

          <Link 
            href="/contact" 
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-purple-800 transition-colors"
          >
            <EnvelopeIcon className="w-4 h-4 text-gray-500" />
            Contact
          </Link>
        </div>

        {/* PROFIL / ACTIONS (Desktop) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center">
          {isConnected ? (
            /* Menu Utilisateur Déroulant */
            <Popover className="relative">
              <PopoverButton className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-purple-50 hover:bg-purple-100/80 border border-purple-200/60 transition-all outline-none focus:ring-2 focus:ring-purple-600/30">
                <div className="w-8 h-8 rounded-full bg-purple-800 text-white font-bold flex items-center justify-center text-xs shadow-sm uppercase">
                  {username.charAt(0)}
                </div>
                <span className="text-sm font-semibold text-purple-950">
                  {username}
                </span>
              </PopoverButton>

              <PopoverPanel className="absolute right-0 mt-3 w-48 rounded-2xl bg-white p-2 shadow-xl border border-gray-100 ring-1 ring-black/5 animate-fade-in">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-400">Connecté en tant que</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{username}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors text-left"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Se déconnecter
                </button>
              </PopoverPanel>
            </Popover>
          ) : (
            <div className="flex items-center gap-x-3">
              <Link 
                href="/connexion" 
                className="text-sm font-semibold text-gray-700 hover:text-purple-800 px-3 py-2 transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-purple-800 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-purple-900 transition-all active:scale-[0.98]"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>

        {/* BOUTON MOBILE */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="sr-only">Ouvrir le menu</span>
            <Bars3Icon aria-hidden="true" className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* MENU MOBILE (MODAL SLIDE-OVER) */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-xs overflow-y-auto bg-white p-6 shadow-2xl transition-all">
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-lg font-extrabold text-gray-900">
                MY<span className="text-teal-500">DIGITAL</span>AVIS
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-y-2">
            <Link
              href="/formations"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-800 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <AcademicCapIcon className="w-5 h-5 text-gray-500" />
              Formations
            </Link>
            <Link
              href="/avis"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-800 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-500" />
              Avis
            </Link>
            <Link
              href="/a-propos"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-800 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <InformationCircleIcon className="w-5 h-5 text-gray-500" />
              À propos
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-800 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <EnvelopeIcon className="w-5 h-5 text-gray-500" />
              Contact
            </Link>

            <div className="pt-6 border-t border-gray-100 space-y-3">
              {isConnected ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
                    <UserCircleIcon className="w-6 h-6 text-purple-800" />
                    <span className="font-semibold text-gray-900 text-sm truncate">{username}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/connexion"
                    className="block w-full text-center py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center py-2.5 rounded-full bg-purple-800 text-sm font-semibold text-white hover:bg-purple-900 shadow-md transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}