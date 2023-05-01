export type KulupType = {
  id: number;
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  image: string;
  uye: UyeType[];
  uyeCount?: number;
  faaliyetAlanlari?: string[];
  etkinlik: EtkinlikType[];
  danisman?: DanismanType;
};

export type DanismanType = {
  id: number;
  slug: string;
  name: string;
  image: string;
  depertman: string;
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

export type UyeType = {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string;
  kulup: KulupType;
  bolum: string;
};

export type DuyuruType = {
  id: number;
  title: string;
  description: string;
  date: string;
};
