import { Class, Employee, Invite, RelationWorkedAt } from "../../../../server/src/database/models";

export interface BaseResponse {
  code: string;
  message: string;
}

export interface ErrorResponse
extends BaseResponse {}

export interface LoginResponse
extends BaseResponse {
  data: {
    token: string;
    employee: Employee;
  };
}

export interface RegisterResponse
extends BaseResponse {}

export interface ClearSessionsResponse
extends BaseResponse {}

export interface MeResponse
extends BaseResponse {
  data: {
    employee: Employee;
  };
}

export interface UpdateUserResponse
extends BaseResponse {
  data: {
    user: Employee;
  }
}


export interface InviteEmployeeResponse
extends BaseResponse {
  data: {
    invite: Invite;
  };
}

export interface AllEmployeesResponse
extends BaseResponse {
  data: {
    employees: Employee[];
  };
}

export interface SingleEmployeeResponse
extends BaseResponse {
  data: {
    employee: Employee;
    unpaid_work?: RelationWorkedAt[];
    classes?: Class[];
  };
}

export interface RemoveEmployeeResponse
extends BaseResponse {}

export interface UpdateEmployeeResponse
extends BaseResponse {
  data: {
    employee: Employee;
  };
}