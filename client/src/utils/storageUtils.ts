export enum StorageKeyEnum {
  AUTH_TOKEN_STORAGE = 'AuthTokenStorage',
}

export type AuthTokenStorageType = {
  authToken?: string;
  xsrfToken?: string;
};

type StorageKeyTypeMap = {
  [StorageKeyEnum.AUTH_TOKEN_STORAGE]: AuthTokenStorageType;
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
