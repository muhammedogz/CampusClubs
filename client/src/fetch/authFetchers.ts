import axios from 'axios';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import { AuthResponse } from 'src/pages/auth';
import { ApiResponseType, UserBaseType } from 'src/types/types';

export type UserPayloadType = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  image: string | null;
  departmentId: number;
};

export type AuthExistingResponseType = {
  user: UserBaseType;
  token: string | null;
};

export const signUpFetcher = async (data: UserPayloadType) => {
  const { data: responseData } = await axios.post<
    ApiResponseType<AuthExistingResponseType>
  >(getApiEndpoint(Endpoints.SIGNUP), data);

  return responseData;
};

type AuthPayloadType = {
  codeVerifier: string;
  code: string;
};

export const authFetcher = async (payload: AuthPayloadType) => {
  const { data } = await axios.post<
    ApiResponseType<AuthResponse | AuthExistingResponseType>
  >(getApiEndpoint(Endpoints.AUTH), payload);

  return data;
};

