import type { RegisterHttpPostRequest, User } from '../models/auth/auth.interface';
export function getCurrentUser(): User | undefined {
  if (localStorage?.getItem('currentUser')) {
    return JSON.parse(localStorage.getItem('currentUser') as string);
  } else {
    return undefined;
  }
}

export async function registerUser(user: RegisterHttpPostRequest): Promise<{isSuccess: boolean, message: string}> {
  const url = 'https://localhost:5001/auth/register';  
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
    return Promise.resolve({isSuccess: false, message: 'Error registering user'});
  }
  
}

