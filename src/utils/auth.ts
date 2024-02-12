import type { User } from '../models/auth/auth.interface';

export function getCurrentUser(): User | undefined {
  if (localStorage?.getItem('currentUser')) {
    return JSON.parse(localStorage.getItem('currentUser') as string);
  } else {
    return undefined;
  }
}


