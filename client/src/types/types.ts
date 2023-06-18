export type ApiResponseType<T> = {
  data: T;
  message: string;
  status: boolean;
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

type ClubUserApprovalStatusType = {
  clubJoinApprovalStatus: ApprovalStatusEnum;
  clubRole: ClubRoleEnum;
};

export type ClubType = ClubBaseType & {
  advisor: UserBaseType;
  user?: ClubUserApprovalStatusType;
  users: UserBaseType[];
  events: EventBaseType[];
  announcements: AnnouncementType[];
};

export type AnnouncementType = {
  announcementId: number;
  title: string;
  description: string;
  date: string;
};
