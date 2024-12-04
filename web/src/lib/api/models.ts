import { Employee } from "../../../../server/src/database/models";

export interface BaseResponse {
  code: string;
  message: string;
  data?: any;
}

export interface LoginResponse extends BaseResponse {
  data: {
    token: string;
    employee: Employee;
  };
}

export interface MeResponse extends BaseResponse {
  data: {
    employee: Employee;
  };
}