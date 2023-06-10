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
  role: RolesEnum;
};

export type DuyuruType = {
  id: number;
  title: string;
  description: string;
  date: string;
};

export enum RolesEnum {
  SKS = 'SKS',
  UYE = 'UYE',
  DANISMAN = 'DANISMAN',
  KULUP_BASKANI = 'KULUP_BASKANI',
}

export type ApiResponseType<T> = {
  data: T;
  message: string;
  status: boolean;
  token: string | null;
}


// Backend Types

export type UyeBackendType = {
  userId: number;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
};