"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Header from "@/components/Header";

export default function Home() {
  const [animations, setAnimations] = useState({
    title1: true, // Démarrer visible pour éviter le flash
    title2: false,
    title3: false,
    title4: false,
  });

  const title2Ref = useRef<HTMLHeadingElement>(null);
  const title3Ref = useRef<HTMLHeadingElement>(null);
  const title4Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-title-id');
            if (id) {
              setAnimations(prev => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    // Observe each title ref
    if (title2Ref.current) observer.observe(title2Ref.current);
    if (title3Ref.current) observer.observe(title3Ref.current);
    if (title4Ref.current) observer.observe(title4Ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white overflow-x-visible">
        {/* Section 1 - Hero avec cartes stylisées */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 mt-8 overflow-x-visible">
          <div className="text-center overflow-x-visible">
            {/* Titre principal */}
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-3 md:mb-4 leading-tight transition-all duration-700 ease-out"
              style={{
                opacity: animations.title1 ? 1 : 0,
                transform: animations.title1 ? 'translateY(0)' : 'translateY(20px)',
                willChange: 'opacity, transform'
              }}
            >
              Partagez vos idées,{" "}
              <br />
              construisez votre succès.
            </h1>

            {/* Conteneur des cartes */}
            <div className="relative my-2 md:my-3 flex justify-center overflow-visible">
              {/* Cartes en éventail horizontal */}
              <div className="relative flex justify-center items-center h-[240px] md:h-[320px] lg:h-[400px] overflow-visible w-full max-w-full">
                {[
                  { image: "pexels-cottonbro-4489773.jpg", translateX: -320, rotation: -10, zIndex: 0, scale: 0.65 },
                  { image: "pexels-creationhill-1681010.jpg", translateX: -240, rotation: -7, zIndex: 1, scale: 0.72 },
                  { image: "pexels-hypedh-2866073.jpg", translateX: -160, rotation: -4, zIndex: 2, scale: 0.78 },
                  { image: "pexels-jyron-barclay-2151526792-33916694.jpg", translateX: -75, rotation: -2, zIndex: 3, scale: 0.85 },
                  { image: "pexels-kindelmedia-6869060.jpg", translateX: 0, rotation: 0, zIndex: 4, scale: 1 },
                  { image: "pexels-jyron-barclay-2151526792-33916694.jpg", translateX: 75, rotation: 2, zIndex: 3, scale: 0.85 },
                  { image: "pexels-hypedh-2866073.jpg", translateX: 160, rotation: 4, zIndex: 2, scale: 0.78 },
                  { image: "pexels-creationhill-1681010.jpg", translateX: 240, rotation: 7, zIndex: 1, scale: 0.72 },
                  { image: "pexels-cottonbro-4489773.jpg", translateX: 320, rotation: 10, zIndex: 0, scale: 0.65 },
                ].map((card, index) => (
                  <div
                    key={index}
                    className="absolute w-28 md:w-40 lg:w-48 xl:w-56 h-40 md:h-56 lg:h-68 xl:h-80 rounded-xl overflow-hidden shadow-lg"
                    style={{
                      transform: `translateX(calc(-50% + ${card.translateX}px)) rotate(${card.rotation}deg) scale(${card.scale})`,
                      left: "50%",
                      zIndex: card.zIndex,
                      transformOrigin: "center center",
                      willChange: 'transform'
                    }}
                  >
                    <Image
                      src={`/images/${card.image}`}
                      alt={`Article ${index + 1}`}
                      width={224}
                      height={320}
                      className="w-full h-full object-cover"
                      loading={index < 5 ? "eager" : "lazy"}
                      priority={index < 3}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Section Vision du site */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Texte de la vision à gauche */}
            <div className="flex-1 space-y-6">
              <h2 
                ref={title2Ref}
                data-title-id="title2"
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight transition-all duration-700 ease-out"
                style={{
                  opacity: animations.title2 ? 1 : 0,
                  transform: animations.title2 ? 'translateY(0)' : 'translateY(20px)',
                  willChange: 'opacity, transform'
                }}
              >
                Notre Vision
              </h2>
              <div className="space-y-4 text-base md:text-lg text-neutral-700 leading-relaxed">
                <p>
                  Cette plateforme de blog offre aux professionnels et aux startups une opportunité unique de s'exprimer librement et de partager leur expertise avec une communauté engagée.
                </p>
                <p>
                  Que vous souhaitiez mettre en avant vos services, partager vos expériences professionnelles ou démontrer votre expertise dans votre domaine, notre plateforme vous donne les outils nécessaires pour construire votre présence en ligne et établir votre crédibilité.
                </p>
              </div>
        </div>

            {/* Image stylisée à droite */}
            <div className="flex-1 flex justify-end" style={{ perspective: "1000px" }}>
              <Image
                src="/images/blog-img.png"
                alt="Vision de la plateforme"
                width={800}
                height={600}
                className="w-full max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl h-auto object-cover rounded-xl shadow-2xl border-4 border-neutral-200"
                style={{
                  maskImage: "radial-gradient(circle, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
                  WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
                  transform: "rotateX(50deg) rotateZ(45deg)",
                  transformStyle: "preserve-3d",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 4px rgba(255, 255, 255, 0.1)",
                  willChange: 'transform'
                }}
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section avec 3 cartes */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <h2 
            ref={title3Ref}
            data-title-id="title3"
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-12 md:mb-16 text-center transition-all duration-700 ease-out"
            style={{
              opacity: animations.title3 ? 1 : 0,
              transform: animations.title3 ? 'translateY(0)' : 'translateY(20px)',
              willChange: 'opacity, transform'
            }}
          >
            Nos Avantages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Carte 1 */}
            <div className="group bg-white border-2 border-neutral-900 p-6 md:p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:bg-neutral-900 hover:border-neutral-900 cursor-pointer">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4 transition-colors duration-300 ease-in-out group-hover:text-white">
                Partagez Votre Expertise
              </h3>
              <p className="text-neutral-900 text-base md:text-lg leading-relaxed transition-colors duration-300 ease-in-out group-hover:text-white">
                Montrez vos compétences et votre savoir-faire à travers des articles détaillés qui démontrent votre expertise dans votre domaine d'activité.
              </p>
            </div>

            {/* Carte 2 */}
            <div className="group bg-white border-2 border-neutral-900 p-6 md:p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:bg-neutral-900 hover:border-neutral-900 cursor-pointer">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4 transition-colors duration-300 ease-in-out group-hover:text-white">
                Présentez Vos Services
              </h3>
              <p className="text-neutral-900 text-base md:text-lg leading-relaxed transition-colors duration-300 ease-in-out group-hover:text-white">
                Mettez en avant vos produits et services de manière créative et engageante pour attirer de nouveaux clients et partenaires professionnels.
              </p>
            </div>

            {/* Carte 3 */}
            <div className="group bg-white border-2 border-neutral-900 p-6 md:p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:bg-neutral-900 hover:border-neutral-900 cursor-pointer">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4 transition-colors duration-300 ease-in-out group-hover:text-white">
                Construisez Votre Réputation
              </h3>
              <p className="text-neutral-900 text-base md:text-lg leading-relaxed transition-colors duration-300 ease-in-out group-hover:text-white">
                Développez votre présence en ligne et établissez votre crédibilité en partageant vos expériences et vos réussites professionnelles.
              </p>
            </div>
          </div>
        </section>

        {/* Section finale - CTA */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Image à gauche */}
            <div className="flex-1 flex justify-start">
              <Image
                src="/images/blog-img-2.png"
                alt="Inscrivez-vous"
                width={600}
                height={400}
                className="w-full max-w-md md:max-w-lg lg:max-w-xl h-64 md:h-80 lg:h-96 object-cover rounded-xl"
                style={{
                  maskImage: "radial-gradient(circle at 30% center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
                  WebkitMaskImage: "radial-gradient(circle at 30% center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
                }}
                loading="lazy"
              />
            </div>

            {/* Titre à droite */}
            <div className="flex-1 flex flex-col justify-center">
              <h2 
                ref={title4Ref}
                data-title-id="title4"
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight text-right transition-all duration-700 ease-out"
                style={{
                  opacity: animations.title4 ? 1 : 0,
                  transform: animations.title4 ? 'translateY(0)' : 'translateY(20px)',
                  willChange: 'opacity, transform'
                }}
              >
                Inscrivez-vous maintenant et publiez un blog
              </h2>
            </div>
          </div>
        </section>
    </div>
    </>
  );
}
