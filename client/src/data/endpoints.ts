export enum Endpoints {
  USERS = '/users',
  USERS_STUDENTS = `${Endpoints.USERS}/students`,
  USERS_TEACHERS = `${Endpoints.USERS}/teachers`,
  EVENTS = '/events',
  CLUBS = '/clubs',
  AUTH = '/login/auth',
  FILEUPLOAD = '/fileupload',
  SIGNUP = '/login/signup',
}

export const getApiEndpoint = (endpoint: Endpoints) => {
  return `${import.meta.env.VITE_API_PATH}${endpoint}`;
};
