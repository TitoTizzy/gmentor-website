export type Project = {
  slug: string;
  title: string;
  country: string;
  city: string;
  year: number | null;
  type: 'Résidentiel multifamilial' | 'Résidence privée' | 'Bureaux et projets institutionnels' | 'Rénovation résidentielle' | 'Étude résidentielle';
  role: string | null;
  credits: string | null;
  cover: string;
  coverAlt: string;
  status: 'draft' | 'published';
  featured: boolean;
  placeholder: boolean;
};

export const projects: Project[] = [
  {
    slug: 'townhouse-waterbury',
    title: 'Townhouse',
    country: 'United States',
    city: 'Waterbury, Connecticut',
    year: null,
    type: 'Résidentiel multifamilial',
    role: null,
    credits: null,
    cover: '/images/usa/townhouse-waterbury-new-england.png',
    coverAlt: 'Traditional New England-style multifamily townhouse with Colonial Revival influence',
    status: 'published',
    featured: true,
    placeholder: false
  },
  {
    slug: 'water-view-east',
    title: 'Water View East',
    country: 'United States',
    city: 'Norwalk, Connecticut',
    year: null,
    type: 'Résidentiel multifamilial',
    role: null,
    credits: null,
    cover: '/images/concept-townhouses.webp',
    coverAlt: 'Temporary editorial concept image for a residential project',
    status: 'draft',
    featured: false,
    placeholder: true
  },
  {
    slug: 'forest-street',
    title: 'Residential Development — Forest Street',
    country: 'United States',
    city: 'Connecticut',
    year: null,
    type: 'Résidentiel multifamilial',
    role: null,
    credits: null,
    cover: '/images/concept-townhouses.webp',
    coverAlt: 'Temporary architectural concept image',
    status: 'draft',
    featured: false,
    placeholder: true
  },
  {
    slug: 'beach-house-pierre-payen',
    title: 'Beach House',
    country: 'Haïti',
    city: 'Pierre Payen, Montrouis',
    year: null,
    type: 'Résidence privée',
    role: null,
    credits: null,
    cover: '/images/concept-coastal-residence.webp',
    coverAlt: 'Visuel conceptuel temporaire d’une résidence côtière contemporaine',
    status: 'published',
    featured: true,
    placeholder: true
  },
  {
    slug: 'extension-uce',
    title: 'Extension of the Unité Centrale d’Exécution office',
    country: 'Haïti',
    city: '',
    year: null,
    type: 'Bureaux et projets institutionnels',
    role: null,
    credits: null,
    cover: '/images/studio-process.webp',
    coverAlt: 'Visuel conceptuel temporaire montrant un processus de conception architecturale',
    status: 'published',
    featured: false,
    placeholder: true
  },
  {
    slug: 'contemporary-residence-haiti',
    title: 'Contemporary Residence in Haiti',
    country: 'Haïti',
    city: '',
    year: null,
    type: 'Résidence privée',
    role: null,
    credits: null,
    cover: '/images/haiti/contemporary-residence-terrace-render.png',
    coverAlt: 'Visualisation 3D de la terrasse d’une résidence contemporaine en Haïti',
    status: 'published',
    featured: true,
    placeholder: false
  },
  {
    slug: 'two-level-residential-addition',
    title: 'Two-Level Residential Addition',
    country: 'United States',
    city: '',
    year: null,
    type: 'Rénovation résidentielle',
    role: null,
    credits: null,
    cover: '/images/usa/two-level-residential-addition-built.png',
    coverAlt: 'Completed two-level porch, stairs and exterior access addition',
    status: 'published',
    featured: false,
    placeholder: false
  },
  {
    slug: 'private-residential-planning-study',
    title: 'Private Residential Planning Study',
    country: 'United States',
    city: 'Location withheld',
    year: null,
    type: 'Étude résidentielle',
    role: null,
    credits: null,
    cover: '/images/usa/private-residence-anonymized-elevations.png',
    coverAlt: 'Anonymized architectural elevations for a private residence',
    status: 'published',
    featured: false,
    placeholder: false
  }
];

export const publishedProjects = projects.filter((project) => project.status === 'published');
