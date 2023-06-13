import axios from 'axios';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import { ApiResponseType } from 'src/types/types';

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
