export type Asset = {
  image: string;
  subtitle: string;
  title: string;
};

export type Offer = Asset & {
  nftId: string;
  price: string;
};

export type FullAsset = Omit<Asset, 'image'> & {
  images: string[];
  warranties: {
    certifier: string;
    date: string;
    description: string;
    type: string;
  }[];
};

export type FullAssetWithPageId = {
  asset: FullAsset;
  pageId: string;
};

export type CreateAssetPayload = {
  artworkLicense: string;
  artworkLicenseCertifier: string;
  artworkLicenseDate: string;
  assetIdentity: string;
  assetIdentityCertifier: string;
  assetIdentityDate: string;
  carbonOffset: string;
  carbonOffsetCertifier: string;
  carbonOffsetDate: string;
  category: string;
  id: string;
  images: string;
  nftPairing: string;
  nftPairingCertifier: string;
  nftPairingDate: string;
  subtitle: string;
  title: string;
  vaultReport: string;
  vaultReportCertifier: string;
  vaultReportDate: string;
};
