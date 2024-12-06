export interface BaseResponseModel<T> {
    isSuccess: boolean | undefined;
    message: string | null | undefined;
    data: T | null | undefined;
}

