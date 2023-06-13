import axios from 'axios';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import { ApiResponseType, UserType } from 'src/types/types';

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
