
export type User = {
  id: string;
  email: string;
  userName?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};
export interface LoginPayload {
  email: string;
  password: string;
}