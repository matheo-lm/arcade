export interface BadgeDefinition {
  id: string;
  title: { en: string; es: string };
  description: { en: string; es: string };
  hint: { en: string; es: string };
  iconSvg: string;
}

export const badgeDefinitions: BadgeDefinition[] = [
  {
    id: "first-steps",
    title: {
      en: "Explorer",
      es: "Explorador"
    },
    description: {
      en: "Welcome to Berries Arcade! You took your first steps.",
      es: "¡Bienvenido a Berries Arcade! Diste tus primeros pasos."
    },
    hint: {
      en: "Set up a player profile to start exploring.",
      es: "Crea un perfil de jugador para comenzar a explorar."
    },
    iconSvg: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" stroke="currentColor" fill="hsla(180, 70%, 50%, 0.2)" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="hsl(180, 80%, 45%)" stroke="currentColor" />
    </svg>`
  },
  {
    id: "fruit-stacker-master",
    title: {
      en: "Fruit Stacker Master",
      es: "Maestro Apilador"
    },
    description: {
      en: "Super stacker status! Earned 3 stars in Fruit Stacker.",
      es: "¡Estado súper apilador! Ganaste 3 estrellas en Apila Frutas."
    },
    hint: {
      en: "Earn 3 stars in Fruit Stacker.",
      es: "Gana 3 estrellas en Apila Frutas."
    },
    iconSvg: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9z" stroke="currentColor" fill="hsla(25, 95%, 55%, 0.2)" />
      <path d="M12 6a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 0 0-4-4z" fill="hsl(25, 95%, 55%)" />
      <circle cx="12" cy="10" r="1.5" fill="#fff" />
    </svg>`
  },
  {
    id: "number-garden-master",
    title: {
      en: "Number Expert",
      es: "Experto en Números"
    },
    description: {
      en: "Flower counting genius! Earned 3 stars in Number Garden.",
      es: "¡Genio contando flores! Ganaste 3 estrellas en Jardín de Números."
    },
    hint: {
      en: "Earn 3 stars in Number Garden.",
      es: "Gana 3 estrellas en Jardín de Números."
    },
    iconSvg: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" stroke="currentColor" fill="hsla(140, 70%, 50%, 0.2)" />
      <path d="M12 8v8M9 10h6M9 14h6" stroke="currentColor" stroke-width="2.5" />
      <circle cx="9" cy="8" r="1.5" fill="hsl(140, 80%, 45%)" />
      <circle cx="15" cy="16" r="1.5" fill="hsl(140, 80%, 45%)" />
    </svg>`
  },
  {
    id: "star-collector",
    title: {
      en: "Star Collector",
      es: "Coleccionista de Estrellas"
    },
    description: {
      en: "Amazing! You collected 3 or more stars across arcade games.",
      es: "¡Increíble! Coleccionaste 3 o más estrellas en los juegos del arcade."
    },
    hint: {
      en: "Collect 3 or more stars total across all playable games.",
      es: "Colecciona 3 o más estrellas en total entre todos los juegos."
    },
    iconSvg: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="hsl(48, 100%, 55%)" stroke="currentColor" />
    </svg>`
  },
  {
    id: "night-owl",
    title: {
      en: "Night Owl",
      es: "Búho Nocturno"
    },
    description: {
      en: "Super cozy browsing. You tried the arcade's Dark Mode!",
      es: "Navegación súper acogedora. ¡Probaste el Modo Oscuro del arcade!"
    },
    hint: {
      en: "Switch the arcade theme to Dark Mode.",
      es: "Cambia el tema del arcade al Modo Oscuro."
    },
    iconSvg: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="hsl(260, 80%, 65%)" stroke="currentColor" />
    </svg>`
  },
  {
    id: "bilingual-buddy",
    title: {
      en: "Bilingual Buddy",
      es: "Compañero Bilingüe"
    },
    description: {
      en: "Fantastic! You explored the arcade in both English and Spanish.",
      es: "¡Fantástico! Exploraste el arcade tanto en inglés como en español."
    },
    hint: {
      en: "Switch languages to learn and play in another language.",
      es: "Cambia de idioma para aprender y jugar en otra lengua."
    },
    iconSvg: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="hsla(330, 85%, 60%, 0.2)" stroke="currentColor" />
      <path d="M8 9h8M8 13h5" stroke="currentColor" stroke-linecap="round" />
    </svg>`
  }
];
