import type { Child } from './auth.types';

export interface User {
  userName: string;
  lastLoggedIn: string;
  email: string;
  token: string;
  children: Child[];
}

export interface RegisterHttpPostRequest {
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
}

export interface LoginHttpPostRequest {
  email: string;
  password: string;
}
 