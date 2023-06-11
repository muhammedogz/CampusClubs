export enum Endpoints {
  AUTH = '/login/auth',
  CLUB = '/club',
  FILEUPLOAD = '/fileupload',
  SIGNUP = '/login/signup',
  USER = '/user',
}

export const getApiEndpoint = (endpoint: Endpoints) => {
  return `${import.meta.env.VITE_API_PATH}${endpoint}`;
}
