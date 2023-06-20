import axios from 'axios';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import {
  ApiResponseType,
  ApprovalStatusEnum,
  ClubRoleEnum,
  ClubType,
} from 'src/types/types';

export const getAllClubsFetcher = async () => {
  const { data } = await axios.get<ApiResponseType<ClubType[]>>(
    getApiEndpoint(Endpoints.CLUBS)
  );

  return data;
};

export const getClubFromIdFetcher = async (id: string) => {
  const { data } = await axios.get<ApiResponseType<ClubType>>(
    `${getApiEndpoint(Endpoints.CLUBS)}/${id}`
  );

  return data;
};

type ApprovalJoinClubFuncType = {
  clubId: string;
  userId: string;
  approveStatus: ApprovalStatusEnum;
};

export const considerJoinClubFetcher = async ({
  clubId,
  userId,
  approveStatus,
}: ApprovalJoinClubFuncType) => {
  const { data } = await axios.patch<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.CLUBS)}/${clubId}/approval/${userId}`,
    {
      status: approveStatus,
    }
  );

  return data;
};

export const joinClubFetcher = async (clubId: string) => {
  const { data } = await axios.post<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.CLUBS)}/${clubId}/join`
  );

  return data;
};

export const leaveClubFetcher = async (clubId: string) => {
  const { data } = await axios.post<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.CLUBS)}/${clubId}/leave`
  );

  return data;
};

export interface CreateAnnouncementPayload {
  title?: string;
  description?: string;
  date: Date;
  clubId: number;
}

export const createAnnouncementFetcher = async (
  announcement: CreateAnnouncementPayload
) => {
  const { data } = await axios.post<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.ANNOUNCEMENT)}`,
    announcement
  );

  return data;
};

export type CreateClubPayload = {
  name?: string;
  description?: string;
  image?: string;
  tag?: string;
  advisorId: number;
};

export const createClubFetcher = async (club: CreateClubPayload) => {
  const { data } = await axios.post<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.CLUBS)}`,
    club
  );

  return data;
};

export type UpdateClubPayload = {
  name?: string;
  description?: string;
  image?: string;
  tag?: string;
};

export const updateClubFetcher = async (
  clubId: number,
  club: UpdateClubPayload
) => {
  const { data } = await axios.put<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.CLUBS)}/${clubId}`,
    club
  );

  return data;
};

export interface UserToAddPayload {
  userId: number;
  role: ClubRoleEnum;
}

export const addUserToClubFetcher = async (
  clubId: number,
  user: UserToAddPayload
) => {
  const { data } = await axios.post<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.CLUBS)}/${clubId}/users`,
    user
  );

  return data;
};

export const removeUserFromClubFetcher = async (
  clubId: number,
  userId: number
) => {
  const { data } = await axios.delete<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.CLUBS)}/${clubId}/users/${userId}`
  );

  return data;
};

export const removeClubFetcher = async (clubId: number) => {
  const { data } = await axios.delete<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.CLUBS)}/${clubId}`
  );

  return data;
};
