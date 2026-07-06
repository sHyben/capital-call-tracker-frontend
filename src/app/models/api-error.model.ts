export interface ApiError {
  status: number;
  message: string;
  fieldErrors?: { [field: string]: string };
  timestamp: string;
}
