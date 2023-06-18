import axios from 'axios';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import {
  ApiResponseType,
  ApprovalStatusEnum,
  EventType,
} from 'src/types/types';

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

type ApprovalCreateEventType = {
  eventId: string;
  approveStatus: ApprovalStatusEnum;
};

export const considerCreateEventFetcher = async ({
  eventId,
  approveStatus,
}: ApprovalCreateEventType) => {
  const { data } = await axios.patch<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.EVENTS)}/approval/${eventId}`,
    {
      status: approveStatus,
    }
  );

  return data;
};

export const eventJoinFetcher = async (eventId: string) => {
  const { data } = await axios.post<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.EVENTS)}/${eventId}/join`
  );

  return data;
};

export const eventLeaveFetcher = async (eventId: string) => {
  const { data } = await axios.post<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.EVENTS)}/${eventId}/leave`
  );

  return data;
};

export type EventCreatePayload = {
  name: string;
  description: string;
  image?: string;
  location: string;
  type: string;
  eventDate: Date;
  clubId: number;
};

export const createEventFetcher = async (event: EventCreatePayload) => {
  const { data } = await axios.post<ApiResponseType<null>>(
    `${getApiEndpoint(Endpoints.EVENTS)}`,
    event
  );

  return data;
};
