export type KulupType = {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string;
  uye: UyeType[];
  etkinlik: EtkinlikType[];
  danisman: DanismanType;
};

export type DanismanType = {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type EtkinlikType = {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string;
  location: string;
  type: string;
  date: string;
  kulup: KulupType;
};

export type EtkinlikWithoutKulupType = Omit<EtkinlikType, "kulup">;

export type UyeType = {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string;
  kulup: KulupType;
};

export type UyeWithoutKulupType = Omit<UyeType, "kulup">;
