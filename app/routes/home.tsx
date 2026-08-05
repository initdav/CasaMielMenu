import type { Route } from "./+types/home";
import { MenuExplorer } from "../components/menu/menu-explorer";
import { BackToTop } from "../components/back-to-top";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Casa Miel — Menú" },
    {
      name: "description",
      content: "Bebidas y sabores preparados para hacer especial cada pausa.",
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Casa Miel" },
    { property: "og:locale", content: "es_CO" },
    { property: "og:title", content: "Casa Miel — Menú" },
    {
      property: "og:description",
      content: "Bebidas y sabores preparados para hacer especial cada pausa.",
    },
    { property: "og:image", content: "/hero-mosaic.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export default function Home() {
  return (
    <>
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
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-casa-espresso/60 via-casa-espresso/20 to-transparent"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <img
              src="/casa-miel-logo.svg"
              alt="Casa Miel"
              className="mb-6 h-auto w-[50vmin]"
            />
            <h1
              id="hero-title"
              className="mb-7 font-bold text-[clamp(4.5rem,8vw,7rem)] leading-[0.83] tracking-[-0.065em] text-casa-oat"
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
              className="group inline-flex items-center gap-3 rounded-full bg-casa-honey px-6 py-3 font-medium text-casa-espresso transition-colors hover:bg-casa-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-casa-cream motion-reduce:transition-none"
            >
              <span>Explorar el menú</span>
              <span
                aria-hidden="true"
                className="grid size-[30px] place-items-center rounded-full bg-casa-espresso/15 text-casa-espresso transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none"
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
            className="text-4xl leading-none text-casa-espresso sm:text-5xl"
          >
            Nuestro menú
          </h2>
          <p className="mt-5 max-w-2xl text-casa-espresso/75">
            Elige una categoría para explorar el menú.
          </p>
          <MenuExplorer />
        </div>
      </section>
    </main>

    <footer className="bg-casa-olive px-6 py-24 text-center text-casa-oat">
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 237 264"
        className="mx-auto h-auto w-[3.4rem]"
      >
        <use href="/house-mark.svg#house-mark" />
      </svg>
      <p className="mt-4 font-heading text-[clamp(2.2rem,5vw,4rem)] font-semibold tracking-[-0.04em]">
        Qué bueno tenerte en casa
      </p>
    </footer>
    <BackToTop />
    </>
  );
}
