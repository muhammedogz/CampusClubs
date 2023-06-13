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
};

// Backend Types

export type UyeBackendType = {
  userName: string;
  userId: number;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  clubsRegistered: KulupType[];
};

export enum UserRoleEnum {
  ADMIN,
  TEACHER,
  STUDENT,
}

export enum ClubRoleEnum {
  ADVISOR,
  ADMIN,
  MEMBER,
}

export enum ApprovalStatusEnum {
  PENDING,
  APPROVED,
  DECLINED,
}

export type DepartmentType = {
  departmentId: number;
  name: string;
};

export type UserBaseType = {
  userId: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  department: DepartmentType;
  image: string;
  userRole: UserRoleEnum;
  clubRole?: ClubRoleEnum;
  eventJoinApprovalStatus?: ApprovalStatusEnum;
};

export type UserType = UserBaseType & {
  clubs: ClubBaseType[];
  events: EventBaseType[];
};

export type EventBaseType = {
  eventId: number;
  name: string;
  description: string;
  image: string;
  location: string;
  type: string;
  approvalStatus: ApprovalStatusEnum;
  eventDate: string;
  club: ClubBaseType;
  userApprovalStatus: ApprovalStatusEnum;
};

export type EventType = EventBaseType & {
  users: UserBaseType[];
};

export type ClubBaseType = {
  clubId: number;
  name: string;
  description: string;
  image: string;
  tag: string;
};


