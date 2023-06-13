import axios from 'axios';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import { ApiResponseType, EventType } from 'src/types/types';

export const getAllEventsFetcher = async () => {
  const { data } = await axios.get<ApiResponseType<EventType[]>>(
    getApiEndpoint(Endpoints.EVENTS)
  );

  return data;
};

export const getEventFromIdFetcher = async (id: string) => {
  const { data } = await axios.get<ApiResponseType<EventType>>(
    `${getApiEndpoint(Endpoints.EVENTS)}/${id}`
  );

  return data;
}
