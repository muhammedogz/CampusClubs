import { AuthResponse } from 'src/pages/auth';
import { UyeType } from 'src/types/types';

export enum StorageKeyEnum {
  AUTH_TOKEN_STORAGE = 'AuthTokenStorage',
  USER_STORAGE = 'UserStorage',
  AUTHORIZE_STORAGE = 'AuthorizeStorage',
  SignupStorage = 'SignupStorage',
}

type AuthTokenStorageType = {
  authToken?: string;
  xsrfToken?: string;
};

type AuthorizeStorageType = {
  code_verifier?: string;
  code_challenge?: string;
  state?: string;
};

type SignupStorageType = {
  auth: AuthResponse;
};

type UserStorageType = UyeType;

type StorageKeyTypeMap = {
  [StorageKeyEnum.AUTH_TOKEN_STORAGE]: AuthTokenStorageType;
  [StorageKeyEnum.USER_STORAGE]: UserStorageType;
  [StorageKeyEnum.AUTHORIZE_STORAGE]: AuthorizeStorageType;
  [StorageKeyEnum.SignupStorage]: SignupStorageType;
};

export const updateLocalStorageItem = <K extends StorageKeyEnum>(
  storageKey: K,
  newData: StorageKeyTypeMap[K]
): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const existingData = getLocalStorageItem(storageKey) ?? {};

  const updatedData = {
    ...existingData,
    ...newData,
  };

  window.localStorage.setItem(storageKey, JSON.stringify(updatedData));
};

export const getLocalStorageItem = <K extends StorageKeyEnum>(
  storageKey: K
): StorageKeyTypeMap[K] | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storageValueString = window.localStorage.getItem(storageKey);
  if (storageValueString) {
    try {
      const storageValue: StorageKeyTypeMap[K] = JSON.parse(storageValueString);
      return storageValue;
    } catch (error) {
      console.error(
        `Error parsing local storage value for key "${storageKey}":`,
        error
      );
    }
  }

  return null;
};

export const removeLocalStorageItem = (storageKey: StorageKeyEnum): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(storageKey);
};
