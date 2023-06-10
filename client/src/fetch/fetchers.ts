import axios from 'axios';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import { AuthResponse } from 'src/pages/auth';
import { ApiResponseType, UyeBackendType } from 'src/types/types';

export type UserPayloadType = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  image: string | null;
};

export const signUpFetcher = async (data: UserPayloadType) => {
  const { data: responseData } = await axios.post<
    ApiResponseType<UyeBackendType>
  >(getApiEndpoint(Endpoints.SIGNUP), data);

  return responseData;
};

export const getAllClubsFetcher = async () => {
  const { data } = await axios.get(getApiEndpoint(Endpoints.CLUB));

  return data;
};

type UploadFileResponseType = {
  filePath: string;
};

export const uploadFileFetcher = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axios.post<ApiResponseType<UploadFileResponseType>>(
    getApiEndpoint(Endpoints.FILEUPLOAD),
    formData
  );

  return data;
};

type AuthPayloadType = {
  codeVerifier: string;
  code: string;
};

export const authFetcher = async (payload: AuthPayloadType) => {
  const { data } = await axios.post<
    ApiResponseType<AuthResponse | UyeBackendType>
  >(getApiEndpoint(Endpoints.AUTH), payload);

  return data;
};
