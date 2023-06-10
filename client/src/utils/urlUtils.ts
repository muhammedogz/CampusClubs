import { Routes } from "src/data/routes";

export const generateRoute = (route: Routes) : string => {
  const basePath = import.meta.env.VITE_BASE_PATH;

  return `/${basePath}${route}`;
}