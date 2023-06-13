import axios from 'axios';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import { ApiResponseType, ClubType } from 'src/types/types';

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
