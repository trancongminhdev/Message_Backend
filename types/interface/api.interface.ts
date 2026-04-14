export interface IToken {
    accessToken: string
    refreshToken?: string
}

export interface IBaseResponse {
    status: number,
    message: string,
}

export interface IPagination {
    page: number;
    pageSize: number;
    total: number;
    totalPage: number;
    nextPage: boolean;
    previousPage: boolean;
}

export interface IResponse<T> extends IBaseResponse {
    data: T | null
}

export interface IResponseListData<T> extends IBaseResponse {
    data: {
        items: T[] | null,
        pagination: IPagination
    } | null
}