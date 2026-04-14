import { IResponse } from 'types/interface/api.interface';

enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
}

const HTTP_MESSAGES = {
  [HttpStatus.OK]: 'Thành công',
  [HttpStatus.CREATED]: 'Tạo dữ liệu thành công',
  [HttpStatus.ACCEPTED]: 'Yêu cầu đã được chấp nhận',
  [HttpStatus.BAD_REQUEST]: 'Dữ liệu gửi lên không hợp lệ',
  [HttpStatus.UNAUTHORIZED]: 'Chưa đăng nhập hoặc không có quyền truy cập',
  [HttpStatus.PAYMENT_REQUIRED]: 'Yêu cầu thanh toán',
  [HttpStatus.FORBIDDEN]: 'Bạn không có quyền truy cập',
  [HttpStatus.NOT_FOUND]: 'Không tìm thấy dữ liệu',
  [HttpStatus.CONFLICT]: 'Dữ liệu đã tồn tại',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Lỗi hệ thống',
  [HttpStatus.BAD_GATEWAY]: 'Lỗi gateway từ server khác',
};

export const HTTP_RESPONSE = {
  OK: (data?: any, error?: string): IResponse<null> => ({
    status: HttpStatus.OK,
    message: error ? error : HTTP_MESSAGES[HttpStatus.OK],
    data: data ?? null,
  }),

  CREATED: (data?: any, error?: string): IResponse<null> => ({
    status: HttpStatus.CREATED,
    message: error ? error : HTTP_MESSAGES[HttpStatus.CREATED],
    data: data || null,
  }),

  ACCEPTED: (data?: any, error?: string): IResponse<null> => ({
    status: HttpStatus.ACCEPTED,
    message: error ? error : HTTP_MESSAGES[HttpStatus.ACCEPTED],
    data: data ?? null,
  }),

  BAD_REQUEST: (error?: string) => ({
    status: HttpStatus.BAD_REQUEST,
    message: error ? error : HTTP_MESSAGES[HttpStatus.BAD_REQUEST],
    data: null,
  }),

  UNAUTHORIZED: (error?: string): IResponse<null> => ({
    status: HttpStatus.UNAUTHORIZED,
    message: error ? error : HTTP_MESSAGES[HttpStatus.UNAUTHORIZED],
    data: null,
  }),

  FORBIDDEN: (error?: string): IResponse<null> => ({
    status: HttpStatus.FORBIDDEN,
    message: error ? error : HTTP_MESSAGES[HttpStatus.FORBIDDEN],
    data: null,
  }),

  NOT_FOUND: (error?: string): IResponse<null> => ({
    status: HttpStatus.NOT_FOUND,
    message: error ? error : HTTP_MESSAGES[HttpStatus.NOT_FOUND],
    data: null,
  }),

  CONFLICT: (error?: string): IResponse<null> => ({
    status: HttpStatus.CONFLICT,
    message: error ? error : HTTP_MESSAGES[HttpStatus.CONFLICT],
    data: null,
  }),

  INTERNAL_SERVER_ERROR: (error?: string): IResponse<null> => ({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: error ? error : HTTP_MESSAGES[HttpStatus.INTERNAL_SERVER_ERROR],
    data: null,
  }),

  BAD_GATEWAY: (error?: string): IResponse<null> => ({
    status: HttpStatus.BAD_GATEWAY,
    message: error ? error : HTTP_MESSAGES[HttpStatus.BAD_GATEWAY],
    data: null,
  }),
};
