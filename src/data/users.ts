export type UserCredentials = {
  username: string;
  password: string;
};

export function validUser(): UserCredentials {
  return {
    username: 'standard_user',
    password: 'secret_sauce',
  };
}

export function lockedUser(): UserCredentials {
  return {
    username: 'locked_out_user',
    password: 'secret_sauce',
  };
}

export const LoginErrors = {
  lockedUser: 'locked out',
  emptyUsername: 'Username is required',
};
