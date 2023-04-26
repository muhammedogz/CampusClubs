export const getLocalImage = (image: string) => {
  const publicPath = import.meta.env.VITE_PUBLIC_PATH;
  
  return `${publicPath}${image}`;
}