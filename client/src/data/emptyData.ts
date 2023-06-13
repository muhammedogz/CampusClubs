import {
  ApprovalStatusEnum,
  ClubType,
  EventType,
  UserRoleEnum,
  UserType,
} from 'src/types/types';

export const emptyUserData: UserType = {
  userId: 0,
  userName: '',
  firstName: '',
  lastName: '',
  email: '',
  department: {
    departmentId: 0,
    name: '',
  },
  image: '',
  clubs: [],
  events: [],
  userRole: UserRoleEnum.STUDENT,
};

export const emptyClubData: ClubType = {
  clubId: 0,
  name: '',
  description: '',
  image: '',
  tag: '',
  advisor: emptyUserData,
  users: [],
  events: [],
  announcements: [],
};

export const emptyEventData: EventType = {
  eventId: 0,
  name: '',
  description: '',
  image: '',
  location: '',
  type: '',
  approvalStatus: 0,
  eventDate: '',
  club: emptyClubData,
  userApprovalStatus: ApprovalStatusEnum.PENDING,
  users: [],
};
