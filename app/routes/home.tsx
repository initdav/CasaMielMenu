import type { Route } from "./+types/home";
import { MenuExplorer } from "../components/menu/menu-explorer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Casa Miel — Menú" },
    {
      name: "description",
      content: "Bebidas y sabores preparados para hacer especial cada pausa.",
    },
  ];
}

export default function Home() {
  return (
    <main>
      <section
        aria-labelledby="hero-title"
        className="relative isolate flex min-h-svh overflow-hidden bg-casa-honey bg-center bg-repeat"
        style={{
          backgroundImage: 'url("/hero-mosaic.jpg")',
          backgroundSize: "clamp(30rem, 60vw, 48rem)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-casa-espresso/55"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-casa-espresso/95 via-casa-espresso/75 to-casa-espresso/40 sm:via-casa-espresso/60 sm:to-casa-espresso/25"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <img
              src="/casa-miel-logo.svg"
              alt="Casa Miel"
              className="mb-6 h-auto w-[50vmin]"
            />
            <p className="mb-3 font-medium text-casa-cream">
              Café y experiencias
            </p>
            <h1
              id="hero-title"
              className="mb-7 text-[clamp(4.5rem,8vw,7rem)] leading-[0.76] tracking-[-0.045em] text-casa-oat"
            >
              Algo rico
              <br />
              te espera
            </h1>
            <p className="mb-7 max-w-lg text-casa-oat">
              Bebidas y sabores preparados para convertir una pausa en algo
              especial
            </p>
            <a
              href="#menu"
              className="group inline-flex items-center gap-3 rounded-full font-medium text-casa-oat focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-casa-cream"
            >
              <span>Explorar el menú</span>
              <span
                aria-hidden="true"
                className="grid size-[30px] place-items-center rounded-full bg-casa-honey text-casa-oat transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none"
              >
                <svg viewBox="0 0 16 16" className="size-4" fill="none">
                  <path
                    d="m4 6 4 4 4-4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>

      <section
        id="menu"
        aria-labelledby="menu-title"
        className="min-h-svh bg-casa-oat px-4 py-24 sm:px-8 lg:px-12"
      >
        <div className="mx-auto w-full max-w-7xl">
          <h2
            id="menu-title"
            className="text-5xl leading-none text-casa-espresso sm:text-6xl"
          >
            Nuestro menú
          </h2>
          <p className="mt-5 max-w-2xl text-casa-espresso/75">
            Elige una categoría o busca ese antojo que ya tienes en mente.
          </p>
          <MenuExplorer />
        </div>
      </section>
    </main>
  );
}
