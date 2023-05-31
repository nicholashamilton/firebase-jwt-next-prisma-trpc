import axios from 'axios';

const apiClientV1 = axios.create({
    baseURL: `/api/v1`,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

interface ErrorResponseDataWithMessage {
    message: string;
}

function isMessageInErrorResponseData(data: unknown): data is ErrorResponseDataWithMessage {
    return typeof (data as ErrorResponseDataWithMessage).message === 'string';
}

function getAxiosErrorMessage(error: unknown, defaultErrorMessage: string = '') {
    let errorMessage = defaultErrorMessage;

    if (axios.isAxiosError(error) && error.response && isMessageInErrorResponseData(error.response.data)) {
        errorMessage = error.response.data.message;
    }

    return errorMessage;
}

export {
    apiClientV1,
    getAxiosErrorMessage,
};

export interface AxiosOptionalConfig {
    signal?: AbortSignal | undefined;
}