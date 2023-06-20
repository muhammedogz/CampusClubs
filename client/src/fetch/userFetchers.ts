import axios from 'axios';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import {
  ApiResponseType,
  ClubBaseType,
  EventBaseType,
  UserBaseType,
  UserType,
} from 'src/types/types';

export const getAllUsersFetcher = async () => {
  const { data } = await axios.get<ApiResponseType<UserType[]>>(
    getApiEndpoint(Endpoints.USERS)
  );

  return data;
};

export const getAllStudentsFetcher = async () => {
  const { data } = await axios.get<ApiResponseType<UserType[]>>(
    getApiEndpoint(Endpoints.USERS_STUDENTS)
  );

  return data;
};

export const getAllTeachersFetcher = async () => {
  const { data } = await axios.get<ApiResponseType<UserType[]>>(
    getApiEndpoint(Endpoints.USERS_TEACHERS)
  );

  return data;
};

export const getUserFromIdFetcher = async (id: string) => {
  const { data } = await axios.get<ApiResponseType<UserType>>(
    `${getApiEndpoint(Endpoints.USERS)}/${id}`
  );

  return data;
};

export type NotificationType = {
  eventJoinRequest: {
    event: EventBaseType;
    user: UserBaseType;
  }[];
  clubJoinRequest: {
    club: ClubBaseType;
    user: UserBaseType;
  }[];
  eventCreateRequest: {
    event: EventBaseType;
    club: ClubBaseType;
  }[];
};

export const getNotificationFetcher = async () => {
  const { data } = await axios.get<ApiResponseType<NotificationType>>(
    getApiEndpoint(Endpoints.NOTIFICATION)
  );

  return data;
};

export type UserUpdateDTO = {
  userName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  departmentId?: number;
  image?: string;
}

export const updateUserFetcher = async (userId: number, user: UserUpdateDTO) => {
  const { data } = await axios.put<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.USERS)}/${userId}`,
    user
  );

  return data;
}