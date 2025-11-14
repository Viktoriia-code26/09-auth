

export interface User {
  email: string;
  username: string;
  avatar: string | null;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}



export interface LoginPayload {
  email: string;
  password: string;
}



export interface RegisterPayload {
  email: string;
  password: string;
}


export interface UpdateUserPayload {
  username?: string;
  avatar?: File | string | null;
}
