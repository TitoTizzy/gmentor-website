(function () {
  "use strict";

  window.MGM_DATA = {
    services: [
      { en: "Architectural design", fr: "Conception architecturale", kr: "Konsepsyon achitekti" },
      { en: "Interior design", fr: "Design intérieur", kr: "Konsepsyon enteryè" },
      { en: "Renovation", fr: "Rénovation", kr: "Renovasyon" },
      { en: "3D visualization", fr: "Rendus et modélisation 3D", kr: "Rann ak modelizasyon 3D" },
      { en: "Feasibility studies", fr: "Étude de faisabilité", kr: "Etid posibilite" },
      { en: "Project coordination", fr: "Coordination de projet", kr: "Kowòdinasyon pwojè" }
    ],
    profiles: {
      us: {
        eyebrow: "Architectural Designer",
        title: "Residential design informed by local knowledge and international practice.",
        portrait: "usa/townhouse-waterbury-side.webp",
        portraitAlt: "Townhouse project in Waterbury, Connecticut",
        lead: "Marie Gaëlle Mentor leads Marie Gaëlle Mentor Architectural Designer LLC, with a practice focused on residential environments that balance comfort, function and cultural context.",
        body: "Her experience spans architectural design, project coordination and construction oversight. In the United States, her portfolio includes multifamily housing and residential developments in Connecticut.",
        timeline: [
          { title: "Practice", text: "Marie Gaëlle Mentor Architectural Designer LLC, residential design and project coordination." },
          { title: "Experience", text: "Architectural Designer at New England Outdoor Product since 2019, following earlier architectural and management roles." },
          { title: "Education", text: "Bachelor's degree in Architecture, GOC University, Port-au-Prince." },
          { title: "Approach", text: "Clear planning, careful code coordination and practical design carried from concept through implementation." }
        ]
      },
      ht: {
        eyebrow: "Architecte licenciée en Haïti",
        title: "Une pratique ancrée dans le contexte haïtien et la résilience constructive.",
        portrait: "haiti/grand-sud-house-green.webp",
        portraitAlt: "Maison réalisée dans le Grand Sud d’Haïti",
        lead: "Marie Gaëlle Mentor dirige MGM, une entreprise haïtienne de conception, de supervision et d’exécution de travaux de bâtiment.",
        body: "La pratique met l’accent sur des espaces adaptés aux usages, au climat et aux contraintes du site, avec une attention particulière portée aux principes parasismiques et paracycloniques.",
        timeline: [
          { title: "MGM", text: "Entreprise individuelle fondée en 2020 et active dans la conception, la supervision et la construction en Haïti." },
          { title: "Expérience", text: "Parcours en architecture, direction de projet, supervision de chantier et gestion d’équipes techniques." },
          { title: "Formation", text: "Baccalauréat en architecture, Université GOC, Port-au-Prince." },
          { title: "Méthode", text: "Coordination étroite des architectes, ingénieurs, entrepreneurs et corps de métier du début à la livraison." }
        ]
      }
    },
    projects: [
      {
        slug: "townhouse-waterbury", title: "Townhouse", country: "United States", city: "Waterbury, Connecticut", year: "", type: "Multifamily residential",
        role: "Architectural design", markets: ["us"], cover: "usa/townhouse-waterbury-cover.webp",
        alt: "Completed blue-grey multifamily townhouse in Waterbury, Connecticut",
        description: "A modern multi-story residential building organized for efficient use of space, daylight and ventilation. Horizontal siding, a clear vertical rhythm and a gable roof give the project a durable and restrained residential character.",
        gallery: [
          { src: "usa/townhouse-waterbury-side.webp", alt: "Side view of the Waterbury townhouse", label: "Built work" },
          { src: "usa/townhouse-waterbury-rear.webp", alt: "Rear facade and garages of the Waterbury townhouse", label: "Built work" },
          { src: "usa/townhouse-waterbury-end.webp", alt: "End facade of the Waterbury townhouse", label: "Built work" },
          { src: "usa/townhouse-waterbury-first-floor.webp", alt: "First floor plan for the Waterbury townhouse", label: "First floor plan" },
          { src: "usa/townhouse-waterbury-front-elevation.webp", alt: "Front elevation for the Waterbury townhouse", label: "Front elevation" }
        ], published: true, featured: true
      },
      {
        slug: "water-view-east", title: "Water View East", country: "United States", city: "Norwalk, Connecticut", year: "", type: "Multifamily residential",
        role: "Architectural design in collaboration with AWA Design Group", markets: ["us"], cover: "usa/water-view-east-cover.webp",
        alt: "Symmetrical multifamily residence at Water View East in Norwalk",
        description: "A multifamily residential project balancing classic proportions with contemporary living. Bay windows, balconies and a brick base give depth to the facade, while open interiors connect warm materials with generous natural light.",
        gallery: [
          { src: "usa/water-view-east-exterior.webp", alt: "Exterior view of Water View East", label: "Built work" },
          { src: "usa/water-view-east-walkway.webp", alt: "Landscaped walkway at Water View East", label: "Landscape" },
          { src: "usa/water-view-east-kitchen.webp", alt: "Open kitchen at Water View East", label: "Interior" },
          { src: "usa/water-view-east-living.webp", alt: "Living space at Water View East", label: "Interior" },
          { src: "usa/water-view-east-basement.webp", alt: "Basement plan for Water View East", label: "Basement plan" },
          { src: "usa/water-view-east-front-elevation.webp", alt: "Front elevation for Water View East", label: "Front elevation" }
        ], published: true, featured: true
      },
      {
        slug: "forest-street", title: "Residential Development, Forest Street", country: "United States", city: "Connecticut", year: "", type: "Residential development",
        role: "Architectural design in collaboration with AWA Design Group", markets: ["us"], cover: "usa/forest-street-cover.webp",
        alt: "Townhouse development on Forest Street, Connecticut",
        description: "A residential enclave shaped by symmetrical townhouses, gabled roofs and carefully aligned entries. The project combines detailed construction drawings with warm, open interiors and a coherent relationship between buildings and landscape.",
        gallery: [
          { src: "usa/forest-street-entry.webp", alt: "Entry facade on Forest Street", label: "Built work" },
          { src: "usa/forest-street-living.webp", alt: "Living room in the Forest Street development", label: "Interior" },
          { src: "usa/forest-street-stair.webp", alt: "Stair detail in the Forest Street development", label: "Interior" },
          { src: "usa/forest-street-plans.webp", alt: "Floor plans for the Forest Street development", label: "Floor plans" },
          { src: "usa/forest-street-elevations.webp", alt: "Elevations for the Forest Street development", label: "Elevations" }
        ], published: true, featured: false
      },
      {
        slug: "beach-house-pierre-payen", title: "Beach House", country: "Haïti", city: "Pierre Payen, Montrouis", year: "", type: "Résidence côtière",
        role: "Conception architecturale et coordination", markets: ["ht"], cover: "haiti/beach-house-cover.webp",
        alt: "Beach House construite à Pierre Payen, Montrouis, Haïti",
        description: "Construite en bord de mer à Pierre Payen, cette résidence associe une organisation ouverte, de larges baies et des prolongements extérieurs tournés vers le paysage. Le projet a été livré dans un contexte logistique exigeant, avec une attention constante portée à la cohérence entre conception et réalisation.",
        gallery: [
          { src: "haiti/beach-house-render.webp", alt: "Vue 3D de la Beach House", label: "Étude 3D" },
          { src: "haiti/beach-house-render-angle.webp", alt: "Vue 3D latérale de la Beach House", label: "Étude 3D" },
          { src: "haiti/beach-house-construction.webp", alt: "Beach House en cours de construction", label: "Chantier" },
          { src: "haiti/beach-house-patio.webp", alt: "Patio couvert de la Beach House", label: "Réalisation" },
          { src: "haiti/beach-house-sea-view.webp", alt: "Vue sur la mer depuis la Beach House", label: "Vue" },
          { src: "haiti/beach-house-window-view.webp", alt: "Baie ouverte sur la mer", label: "Vue intérieure" },
          { src: "haiti/beach-house-floor-plan.webp", alt: "Plan de la Beach House", label: "Plan" },
          { src: "haiti/beach-house-sections.webp", alt: "Coupes de la Beach House", label: "Coupes" }
        ], published: true, featured: true
      },
      {
        slug: "extension-uce", title: "Extension des bureaux de l’UCE", country: "Haïti", city: "", year: "2018", type: "Bureaux et projet institutionnel",
        role: "Conception et suivi de construction", markets: ["ht"], cover: "haiti/uce-cover.webp",
        alt: "Extension légère des bureaux de l’Unité Centrale d’Exécution en Haïti",
        description: "Une structure légère conçue au-dessus d’une piscine existante, avec la possibilité d’être démontée si le site devait être restauré. Le projet préserve les arbres et arbustes voisins tout en répondant aux contraintes d’accès et d’implantation.",
        gallery: [
          { src: "haiti/uce-framing-interior.webp", alt: "Ossature bois intérieure de l’extension UCE", label: "Chantier" },
          { src: "haiti/uce-framing-exterior.webp", alt: "Ossature bois extérieure de l’extension UCE", label: "Chantier" },
          { src: "haiti/uce-construction.webp", alt: "Pose du revêtement extérieur de l’extension UCE", label: "Chantier" },
          { src: "haiti/uce-completed.webp", alt: "Extension UCE achevée", label: "Réalisation" },
          { src: "haiti/uce-interior.webp", alt: "Couloir intérieur de l’extension UCE", label: "Intérieur" },
          { src: "haiti/uce-office-plan.webp", alt: "Plan des bureaux de l’extension UCE", label: "Plan" },
          { src: "haiti/uce-foundation-plan.webp", alt: "Plan de fondation de l’extension UCE", label: "Fondations" }
        ], published: true, featured: false
      },
      {
        slug: "maisons-grand-sud", title: "Maisons parasismiques du Grand Sud", country: "Haïti", city: "Grand Sud", year: "2021", type: "Habitat résilient",
        role: "Conception, supervision et construction", markets: ["ht"], cover: "haiti/grand-sud-cover.webp",
        alt: "Maison avec galerie réalisée dans le Grand Sud d’Haïti",
        description: "Une proposition de maisons de deux à quatre chambres pensée pour les zones exposées aux séismes et aux cyclones. Les modèles associent organisation compacte, galerie, matériaux adaptés et principes de maçonnerie chaînée.",
        gallery: [
          { src: "haiti/grand-sud-house-green.webp", alt: "Maison verte réalisée dans le Grand Sud", label: "Réalisation" },
          { src: "haiti/grand-sud-construction.webp", alt: "Maison du Grand Sud en cours de construction", label: "Chantier" },
          { src: "haiti/grand-sud-house-veranda.webp", alt: "Maison avec véranda réalisée dans le Grand Sud", label: "Réalisation" },
          { src: "haiti/grand-sud-two-bedroom-render.webp", alt: "Étude 3D d’une maison de deux chambres", label: "Étude 3D" },
          { src: "haiti/grand-sud-two-bedroom-plan.webp", alt: "Plan d’une maison de deux chambres", label: "Plan 2 chambres" },
          { src: "haiti/grand-sud-three-bedroom-plan.webp", alt: "Plan d’une maison de trois chambres", label: "Plan 3 chambres" }
        ], published: true, featured: true
      }
    ]
  };
}());
