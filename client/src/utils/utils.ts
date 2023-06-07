import { StorageKeyEnum, getLocalStorageItem } from 'src/utils/storageUtils';

export const isUserLoggedIn = () => {
  return !!getLocalStorageItem(StorageKeyEnum.USER_STORAGE)?.name;
};
