export const getLocalImage = (image: string) => {
  const publicPath = import.meta.env.VITE_PUBLIC_PATH;

  return `${publicPath}${image}`;
};

export const getRemoteImage = (image: string) => {
  return `${import.meta.env.VITE_PUBLIC_IMAGE_PATH}${image}`;
};
