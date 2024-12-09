export interface BaseModel<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}