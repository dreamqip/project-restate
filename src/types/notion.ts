export type Asset = {
  image: string;
  subtitle: string;
  title: string;
};

export type Offer = Asset & {
  nftId?: string;
  price?: string;
};

export type FullAsset = Omit<Asset, 'image'> & {
  images: string[];
  warranties: {
    certifier: string;
    date: string;
    description: string;
  }[];
};
