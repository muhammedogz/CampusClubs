export enum Endpoints {
  USERS = '/users',
  USERS_STUDENTS = `${Endpoints.USERS}/students`,
  USERS_TEACHERS = `${Endpoints.USERS}/teachers`,
  EVENTS = '/events',
  CLUBS = '/clubs',
  AUTH = '/auth/auth',
  SIGNUP = '/auth/register',
  FILEUPLOAD = '/fileupload',
  DEPARTMENT = '/department',
}

export const getApiEndpoint = (endpoint: Endpoints) => {
  return `${import.meta.env.VITE_API_PATH}${endpoint}`;
};
