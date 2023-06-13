import { UserRoleEnum, UserType } from 'src/types/types';

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
