export type Warranty = {
  certifier: string;
  date: string;
  description: string;
  type: number;
};

export type Asset = {
  category: string;
  images: string[];
  name: string;
  tagline: string;
  warranties: Warranty[];
};

export type Product = Asset & {
  price: string;
};

export const MARKUP_PRODUCT: Product = {
  category: 'Watches',
  images: [
    '/rolex-2.png',
    '/rolex-1.png',
    '/rolex-3.png',
    '/rolex-4.png',
    '/rolex-5.png',
    '/rolex-6.png',
  ],
  name: 'Rolex 1908',
  price: '5013 XRP',
  tagline:
    'A Timeless Masterpiece Crafted in 18 ct Gold, Blending Elegance with Sustainable Luxury.',
  warranties: [
    {
      certifier: 'Certify Corp.',
      date: '20/07/2023',
      description: `The Rolex 1908 Watch embodies timeless elegance and superior performance. Crafted in 18 ct gold with a self-winding mechanical movement (Calibre 7140), it showcases precision and innovation. The transparent sapphire case back reveals intricate movement finishes, and with water resistance of 50 meters, the 1908 proves its reliability. Its classic design features faceted 18 ct gold hour markers, creating a harmonious and elegant timepiece.

  Beyond exceptional design and performance, the Rolex 1908 Watch showcases dedication to environmental responsibility. Crafted with recycled materials, it minimizes its footprint. The manufacturing process includes a closed-loop water system and proper recycling. The 1908 Watch demonstrates a commitment to sustainability.

  Backed by Rolex's legacy of excellence, the 1908 Watch represents the perfect harmony between classic style and innovation. Rolex's commitment to responsible material sourcing ensures a pinnacle of watchmaking achievement, aligned with environmental consciousness. The Rolex 1908 Watch is a testament to the coexistence of craftsmanship and consciousness in luxury watches.`,
      type: 1,
    },
  ],
};
