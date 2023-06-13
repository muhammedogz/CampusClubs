import moment from 'moment';
import { StorageKeyEnum, getLocalStorageItem } from 'src/utils/storageUtils';

export const isUserLoggedIn = () => {
  return !!getLocalStorageItem(StorageKeyEnum.USER_STORAGE)?.user;
};

export const formatDate = (date: string) => {
  return moment(date).format('DD/MM/YYYY');
}