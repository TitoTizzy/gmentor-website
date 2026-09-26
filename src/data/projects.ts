export type Project = {
  slug: string;
  title: string;
  country: string;
  city: string;
  year: number | null;
  type: 'Résidentiel multifamilial' | 'Résidence privée' | 'Bureaux et projets institutionnels';
  markets: Array<'us' | 'ht'>;
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
    markets: ['us'],
    role: null,
    credits: null,
    cover: '/images/concept-townhouses.webp',
    coverAlt: 'Temporary editorial concept image of contemporary townhouses',
    status: 'published',
    featured: true,
    placeholder: true
  },
  {
    slug: 'water-view-east',
    title: 'Water View East',
    country: 'United States',
    city: 'Norwalk, Connecticut',
    year: null,
    type: 'Résidentiel multifamilial',
    markets: ['us'],
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
    markets: ['us'],
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
    markets: ['ht'],
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
    markets: ['ht'],
    role: null,
    credits: null,
    cover: '/images/studio-process.webp',
    coverAlt: 'Visuel conceptuel temporaire montrant un processus de conception architecturale',
    status: 'published',
    featured: false,
    placeholder: true
  }
];

export const publishedProjects = projects.filter((project) => project.status === 'published');
