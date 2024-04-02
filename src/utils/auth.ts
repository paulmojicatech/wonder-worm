import type { LoginHttpPostRequest, RegisterHttpPostRequest, User } from '../models/auth/auth.interface';


export function getCurrentUser(): User | undefined {
  if (localStorage?.getItem('currentUser')) {
    return JSON.parse(localStorage.getItem('currentUser') as string);
  } else {
    return undefined;
  }
}

export async function registerUser(user: RegisterHttpPostRequest): Promise<{isSuccess: boolean, message: string}> {
  const url = 'https://tv5zym6bmx3cdif7z33tnztzdm0kjmyd.lambda-url.us-east-1.on.aws/auth/register';
  try {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'},      
      body: JSON.stringify(user),
    }
    const response = await fetch(url, options);
    const isSuccess = response.ok;
    const message = !isSuccess ? await response.json() : '';
    return Promise.resolve({isSuccess, message});
  } catch (error) { 
    console.error('Error registering user', error);   
    return Promise.resolve({isSuccess: false, message: 'Error registering user'});
  }
}

export async function login(request: LoginHttpPostRequest): Promise<User & {isSuccess: boolean} | { isSuccess: boolean }> {
  const url = 'https://tv5zym6bmx3cdif7z33tnztzdm0kjmyd.lambda-url.us-east-1.on.aws/auth/login';
  try {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'},
      body: JSON.stringify(request),
    }
    const response = await fetch(url, options);
    const isSuccess = response.ok;
    if (!isSuccess) {
      console.error('Error logging in', await response.json());
      return Promise.resolve({isSuccess: false});
    }
    const data = await response.json();
    const user: User = {
      userName: data.name,
      lastLoggedIn: new Date().toISOString(),
      email: request.email,
      token: data.token,
      children: data.children ?? [],
    };
    return Promise.resolve({...user, isSuccess: isSuccess});
  } catch (error) {
    console.error('Error logging in', error);
    return Promise.resolve({isSuccess: false});
  }
}

export function setCurrentUser(user: User): void {
  if (document.cookie?.includes('user=')) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}

