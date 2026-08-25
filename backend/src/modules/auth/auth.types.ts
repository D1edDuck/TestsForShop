export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}
