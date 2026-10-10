export type BannerStatus = "active" | "inactive";

export type BannerImage = {
  url: string;
  publicId: string | null;
};

// Mirrors the backend Banner document.
export type Banner = {
  _id: string;
  title: string;
  description: string | null;
  image: BannerImage;
  buttonText: string | null;
  link: string;
  status: BannerStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type BannerFields = {
  title: string;
  link: string;
  status: BannerStatus;
  sortOrder: number;
};

export type CreateBannerArgs = BannerFields & { image: File };

export type UpdateBannerArgs = {
  banner: Banner;
  changes: Partial<Omit<BannerFields, "sortOrder">> & { image?: File };
};
