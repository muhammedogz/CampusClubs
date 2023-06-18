import axios from 'axios';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import { ApiResponseType, ApprovalStatusEnum, EventType } from 'src/types/types';

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
};

type ApprovalJoinEventType = {
  eventId: string;
  userId: string;
  approveStatus: ApprovalStatusEnum;
};

export const considerJoinEventFetcher = async ({
  eventId,
  userId,
  approveStatus,
}: ApprovalJoinEventType) => {
  const { data } = await axios.patch<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.EVENTS)}/approval/${eventId}/user/${userId}`,
    {
      status: approveStatus,
    }
  );

  return data;
};
