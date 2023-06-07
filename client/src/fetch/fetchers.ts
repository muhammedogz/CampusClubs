import axios from 'axios';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
export const getAllClubsFetcher = async () => {
  const response = await axios.get(getApiEndpoint(Endpoints.CLUB));

  return response.data;
};
