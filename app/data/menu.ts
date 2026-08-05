export type MenuCategoryId =
  | "desayunos"
  | "dulces"
  | "calientes-cafe"
  | "frias-cafe"
  | "filtrados"
  | "calientes-sin-cafe"
  | "frias-sin-cafe"
  | "sodas";

export type MenuItem = {
  slug: string;
  title: string;
  description?: string;
  price: number;
  category: MenuCategoryId;
  image?: string;
  longDescription?: string;
};

export type MenuCategory = {
  id: MenuCategoryId;
  name: string;
  items: MenuItem[];
};

export const menuCategories: MenuCategory[] = [
  {
    id: "desayunos",
    name: "Desayunos y antojos salados",
    items: [
      { slug: "desayuno-casa-miel", title: "Desayuno Casa Miel", description: "Pan de masa madre, huevo, queso y tocineta.", price: 20000, category: "desayunos" },
      { slug: "empanada-de-pollo", title: "Empanada de pollo", price: 10500, category: "desayunos" },
      { slug: "empanada-caprese", title: "Empanada caprese", price: 10500, category: "desayunos" },
      { slug: "muffin-de-chocolo", title: "Muffin de chocolo", price: 10500, category: "desayunos" },
      { slug: "croissant-de-mantequilla", title: "Croissant de mantequilla", price: 8000, category: "desayunos" },
      { slug: "palito-de-queso", title: "Palito de queso", price: 9000, category: "desayunos" },
    ],
  },
  {
    id: "dulces",
    name: "Antojos dulces",
    items: [
      { slug: "croissant-de-almendras", title: "Croissant de almendras", price: 13000, category: "dulces" },
      { slug: "porcion-de-torta", title: "Porción de torta", price: 12500, category: "dulces" },
    ],
  },
  {
    id: "calientes-cafe",
    name: "Bebidas calientes con café",
    items: [
      { slug: "espresso-doppio", title: "Espresso doppio", price: 7500, category: "calientes-cafe" },
      { slug: "cappuccino", title: "Cappuccino", price: 10000, category: "calientes-cafe" },
      { slug: "mocaccino", title: "Mocaccino", price: 10000, category: "calientes-cafe" },
      { slug: "americano", title: "Americano", price: 8000, category: "calientes-cafe" },
      { slug: "macchiato", title: "Macchiato", price: 8000, category: "calientes-cafe" },
      { slug: "flat-white", title: "Flat white", price: 10000, category: "calientes-cafe" },
      { slug: "latte", title: "Latte", price: 10000, category: "calientes-cafe" },
    ],
  },
  {
    id: "frias-cafe",
    name: "Bebidas frías con café",
    items: [
      { slug: "cold-brew", title: "Cold brew", price: 12000, category: "frias-cafe" },
      { slug: "cold-brew-frutos-rojos", title: "Cold brew", description: "Frutos rojos", price: 13000, category: "frias-cafe" },
      { slug: "cold-brew-naranja", title: "Cold brew", description: "Naranja", price: 13000, category: "frias-cafe" },
      { slug: "aerocano", title: "Aerocano", price: 8000, category: "frias-cafe" },
      { slug: "latte-frio", title: "Latte frío", price: 10000, category: "frias-cafe" },
      { slug: "latte-de-frutos-rojos", title: "Latte de frutos rojos", price: 12000, category: "frias-cafe" },
      { slug: "frappe-de-cafe", title: "Frappé de café", price: 12000, category: "frias-cafe" },
      { slug: "affogato", title: "Affogato", price: 8000, category: "frias-cafe" },
    ],
  },
  {
    id: "filtrados",
    name: "Café filtrado",
    items: [
      { slug: "filtrado-blend-antioquia-2-tazas", title: "Filtrado blend Antioquia", description: "2 tazas", price: 13000, category: "filtrados" },
      { slug: "filtrado-chiroso-2-tazas", title: "Filtrado chiroso", description: "2 tazas", price: 15000, category: "filtrados" },
    ],
  },
  {
    id: "calientes-sin-cafe",
    name: "Bebidas calientes sin café",
    items: [
      { slug: "chai-latte-pink-chai", title: "Chai latte", description: "Pink chai", price: 12000, category: "calientes-sin-cafe" },
      { slug: "chai-latte-blue-chai", title: "Chai latte", description: "Blue chai", price: 12000, category: "calientes-sin-cafe" },
      { slug: "chai-latte-tradicional", title: "Chai latte", description: "Tradicional", price: 12000, category: "calientes-sin-cafe" },
      { slug: "infusion-very-berry", title: "Infusión Very Berry", price: 6500, category: "calientes-sin-cafe" },
      { slug: "infusion-de-frutos-amarillos", title: "Infusión de frutos amarillos", price: 6500, category: "calientes-sin-cafe" },
      { slug: "milo-caliente", title: "Milo caliente", price: 10000, category: "calientes-sin-cafe" },
    ],
  },
  {
    id: "frias-sin-cafe",
    name: "Bebidas frías sin café",
    items: [
      { slug: "frappe-chai-pink", title: "Frappé chai", description: "Pink", price: 13000, category: "frias-sin-cafe" },
      { slug: "frappe-chai-blue", title: "Frappé chai", description: "Blue", price: 13000, category: "frias-sin-cafe" },
      { slug: "frappe-chai-black", title: "Frappé chai", description: "Black", price: 13000, category: "frias-sin-cafe" },
      { slug: "frappe-chai-tradicional", title: "Frappé chai", description: "Tradicional", price: 13000, category: "frias-sin-cafe" },
      { slug: "milo-frio", title: "Milo frío", price: 12000, category: "frias-sin-cafe" },
    ],
  },
  {
    id: "sodas",
    name: "Sodas",
    items: [
      { slug: "soda-de-frutos-rojos", title: "Soda de frutos rojos", price: 12000, category: "sodas" },
      { slug: "soda-de-frutos-amarillos", title: "Soda de frutos amarillos", price: 12000, category: "sodas" },
      { slug: "michelada", title: "Michelada", price: 10000, category: "sodas" },
      { slug: "soda-chai-blue", title: "Soda chai", description: "Blue", price: 12000, category: "sodas" },
      { slug: "soda-chai-pink", title: "Soda chai", description: "Pink", price: 12000, category: "sodas" },
      { slug: "soda-chai-black", title: "Soda chai", description: "Black", price: 12000, category: "sodas" },
    ],
  },
];

export const menuItems = menuCategories.flatMap((category) => category.items);
