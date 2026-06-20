export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
  features: string[];
  category: "portrait" | "landscape" | "pet" | "custom";
}

export const products: Product[] = [
  {
    id: "1",
    slug: "classic-portrait",
    name: "Classic Portrait Print",
    tagline: "Your favorite photo in stunning 3D",
    description:
      "Transform your most cherished portrait into a stunning 3D printed masterpiece. Our advanced printing technology captures every detail, creating a tactile memory you can hold in your hands. Perfect for family photos, graduation portraits, or any special moment.",
    price: 49.99,
    image: "/products/portrait.jpg",
    features: [
      "High-resolution 3D scanning",
      "Premium PLA material",
      "Multiple size options",
      "Hand-finished details",
    ],
    category: "portrait",
  },
  {
    id: "2",
    slug: "landscape-panorama",
    name: "Landscape Panorama",
    tagline: "Bring your travel memories to life",
    description:
      "Turn your breathtaking landscape photos into immersive 3D relief prints. Mountains, beaches, cityscapes - watch as your adventures transform into textured art pieces that add depth and dimension to any wall.",
    price: 79.99,
    image: "/products/landscape.jpg",
    features: [
      "Panoramic depth mapping",
      "UV-resistant coating",
      "Wall-mount ready",
      "Up to 24 inch width",
    ],
    category: "landscape",
  },
  {
    id: "3",
    slug: "pet-sculpture",
    name: "Pet Portrait Sculpture",
    tagline: "Immortalize your furry friend",
    description:
      "Celebrate your beloved pet with a custom 3D printed sculpture. Using AI-enhanced photo processing, we create lifelike reproductions that capture your pet's unique personality and features.",
    price: 89.99,
    image: "/products/pet.jpg",
    features: [
      "AI-enhanced detail reconstruction",
      "Fur texture rendering",
      "Tabletop or wall-mount",
      "Memorial keepsake option",
    ],
    category: "pet",
  },
  {
    id: "4",
    slug: "custom-lithophane",
    name: "Custom Lithophane",
    tagline: "Magic when backlit",
    description:
      "Experience the wonder of lithophane printing - your photo transforms into a magical glowing artwork when placed in front of light. A unique gift that reveals its beauty in illumination.",
    price: 34.99,
    image: "/products/lithophane.jpg",
    features: [
      "Translucent PLA material",
      "LED stand included",
      "Multiple frame styles",
      "Night light option",
    ],
    category: "custom",
  },
  {
    id: "5",
    slug: "family-diorama",
    name: "Family Photo Diorama",
    tagline: "Group photos with depth",
    description:
      "Transform group and family photos into multi-layered 3D dioramas. Each person and element is separated into distinct layers, creating a shadow-box effect that brings your memories to life.",
    price: 129.99,
    image: "/products/diorama.jpg",
    features: [
      "Multi-layer separation",
      "Glass display case",
      "Up to 8 layers of depth",
      "Premium wood frame",
    ],
    category: "portrait",
  },
  {
    id: "6",
    slug: "wedding-keepsake",
    name: "Wedding Day Keepsake",
    tagline: "Preserve your special day",
    description:
      "Commemorate your wedding with a stunning 3D printed keepsake. Perfect for capturing your first dance, the ceremony, or your favorite candid moment from the celebration.",
    price: 149.99,
    image: "/products/wedding.jpg",
    features: [
      "Premium metallic finish",
      "Engraved base with date",
      "Velvet presentation box",
      "Anniversary edition option",
    ],
    category: "custom",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(
  currentSlug: string,
  limit = 3
): Product[] {
  const current = getProductBySlug(currentSlug);
  if (!current) return products.slice(0, limit);

  return products
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      // Prioritize same category
      const aMatch = a.category === current.category ? 1 : 0;
      const bMatch = b.category === current.category ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, limit);
}
