export default function Home() {
  const images = [
    "/images/pexels-cottonbro-4489773.jpg",
    "/images/pexels-creationhill-1681010.jpg",
    "/images/pexels-hypedh-2866073.jpg",
    "/images/pexels-jyron-barclay-2151526792-33916694.jpg",
    "/images/pexels-kindelmedia-6869060.jpg",
    "/images/pexels-shkrabaanthony-5214995.jpg",
    // vérifie le nom si nécessaire
    "/images/pexels-ron-lach-7776137.jpg",
  ];

  // Réglages pour l'arc 3D (modifie ces valeurs pour changer l'angle / profondeur)
  const rotates = [-25, -24, -10, 0, 10, 24, 25];
  const translateZ = [-120, -70, 35, 80, -30, -70, -120];
  const translateY = [20, 12, 6, 0, 6, 12, 20];

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12">
      {/* GALERIE EN ARC 3D */}
      <section className="w-full max-w-7xl mt-12 border border-red-500">
        {/* perspective sur le conteneur parent */}
        <div className="relative overflow-hidden">
          <div
            className="mx-auto flex items-end justify-center gap-8 py-2"
            style={{ perspective: 370 }} /* changement du perspective pour renforcer l'effet 3D */
          >
            {images.map((src, i) => (
              <div
                key={i}
                className="w-44 md:w-56 lg:w-64 h-64 md:h-80 lg:h-96 flex-shrink-0 overflow-hidden shadow-2xl"
                style={{
                  transform: `rotateY(${rotates[i]}deg) translateZ(${translateZ[i]}px) translateY(${translateY[i]}px)`,
                  transition: "transform 400ms ease",
                }}
              >
                <img
                  src={src}
                  alt={`portrait ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TROIS CARTES EXPLICATIVES */}
      {/* <section className="w-full max-w-4xl mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-t border-neutral-200 pt-8">
        <div className="px-4">
          <h3 className="text-lg font-semibold text-neutral-800">Real-Time Collaboration</h3>
          <p className="text-sm text-neutral-500 mt-2">Communicate seamlessly and keep everyone in sync with built-in messaging, file sharing and live updates.</p>
        </div>

        <div className="px-4 border-l border-r border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">Task & Project Tracking</h3>
          <p className="text-sm text-neutral-500 mt-2">Assign tasks, set deadlines, and visualize progress with boards and timelines.</p>
        </div>

        <div className="px-4">
          <h3 className="text-lg font-semibold text-neutral-800">Performance Insights</h3>
          <p className="text-sm text-neutral-500 mt-2">Make smarter decisions with analytics that highlight trends, bottlenecks and workload balance.</p>
        </div>
      </section> */}
    </main>
  );
}