import axios from 'axios';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import { ApiResponseType, ApprovalStatusEnum, ClubType } from 'src/types/types';

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
