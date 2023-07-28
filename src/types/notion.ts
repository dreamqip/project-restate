export type Asset = {
  image: string;
  subtitle: string;
  title: string;
};

export type Offer = Asset & {
  nftId?: string;
  price?: string;
}

// TODO: Add other required properties
export type FullOffer = Omit<Offer, 'image'> & {
  images: string[];
};