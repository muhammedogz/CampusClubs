import { Dispatch, SetStateAction } from 'react';

export enum StorageKeyEnum {
  FORGOT_PASSWORD_STORAGE = 'ForgotPasswordStorage',
  ONBOARDING_STORAGE = 'OnboardingStorage',
  AUTH_TOKEN_STORAGE = 'AuthTokenStorage',
  REDIRECTION_STORAGE = 'RedirectionStorage',
  CODE_VERIFICATION_STORAGE = 'CodeVerificationStorage',
  CODE_VERIFICATION_IS_COMPLETED_STORAGE = 'CodeVerificationIsCompletedStorage',
  INVITATION_STORAGE = 'InvitationStorage',
}

type GENERIC_SET<T> = Dispatch<SetStateAction<T>>;
type GENERIC_REMOVE = () => void;

// AUTH_TOKEN_STORAGE

export type AuthTokenStorageType = {
  authToken?: string;
  xsrfToken?: string;
};
export type SetAuthTokenStorageType = GENERIC_SET<AuthTokenStorageType>;
export type RemoveAuthTokenStorageType = GENERIC_REMOVE;

// USER_STORAGE

export type UserStorageType = {
  user: string;
};

export type SetUserStorageType = GENERIC_SET<UserStorageType>;
export type RemoveUserStorageType = GENERIC_REMOVE;

// REDIRECTION_STORAGE

export type RedirectActionType = 'reload';

export type RedirectionStorageType = {
  redirectionUrl?: string;
  redirectionUrlParams?: any;
  invitedId?: string;
  redirectAction?: RedirectActionType;
};
export type SetRedirectionStorageType = GENERIC_SET<RedirectionStorageType>;
export type RemoveRedirectionStorageType = GENERIC_REMOVE;

// CODE_VERIFICATION_STORAGE

export type CodeVerificationStorageType = {
  remainingTime?: number;
  isCompleted?: boolean;
};
export type SetCodeVerificationStorageType =
  GENERIC_SET<CodeVerificationStorageType>;
export type RemoveCodeVerificationStorageType = GENERIC_REMOVE;

// INVITATION_STORAGE

export type InvitationStorageType = {
  invited_by?: string;
};
export type SetInvitationStorageType = GENERIC_SET<InvitationStorageType>;
export type RemoveInvitationStorageType = GENERIC_REMOVE;

// ----

export enum ForgotPasswordInputType {
  EMAIL = 'email',
  PHONE = 'phone',
}

type StorageKeyTypeMap = {
  [StorageKeyEnum.AUTH_TOKEN_STORAGE]: AuthTokenStorageType;
  [StorageKeyEnum.REDIRECTION_STORAGE]: RedirectionStorageType;
  [StorageKeyEnum.CODE_VERIFICATION_STORAGE]: CodeVerificationStorageType;
  [StorageKeyEnum.INVITATION_STORAGE]: InvitationStorageType;
  [StorageKeyEnum.FORGOT_PASSWORD_STORAGE]: any;
  [StorageKeyEnum.ONBOARDING_STORAGE]: any;
  [StorageKeyEnum.CODE_VERIFICATION_IS_COMPLETED_STORAGE]: any;
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
): StorageKeyTypeMap[K] => {
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
