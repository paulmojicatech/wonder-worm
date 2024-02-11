import type { User } from './auth.interface';

export type Child = Omit<User, 'email'> & { age: number };