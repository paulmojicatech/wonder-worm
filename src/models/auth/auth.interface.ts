import type { Child } from './auth.types';

export interface User {
  userName: string;
  lastLoggedIn: string;
  email: string;
  token: string;
  children: Child[];
}
 