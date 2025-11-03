"use client";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Colonne 1 - Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">Blog-Info</h3>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-4">
              Plateforme de blog professionnelle permettant aux créateurs de contenu,
              aux startups et aux professionnels de partager leurs expertises, expériences
              et services avec une communauté engagée.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors duration-300"
                aria-label="GitHub"
              >
                <FaGithub size={24} />
              </a>
            </div>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Liens rapides</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  S'inscrire
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 - Informations */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Informations</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  Conditions d'utilisation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-neutral-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm text-center md:text-left">
              © {currentYear} Pascal Yao. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

