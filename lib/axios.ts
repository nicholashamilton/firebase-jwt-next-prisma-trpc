import axios from 'axios';

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

async function getAxiosBlobErrorMessage(error: unknown, defaultErrorMessage: string = '') {
    let errorMessage = defaultErrorMessage;

    if (axios.isAxiosError(error)) {
        const isJsonBlob = (data: unknown) => data instanceof Blob && data.type === 'application/json';
        const responseData = isJsonBlob(error.response?.data) ? await (error.response?.data)?.text() : error.response?.data || {};
        const responseJson = (typeof responseData === 'string') ? JSON.parse(responseData) : responseData;
        if (isMessageInErrorResponseData(responseJson)) {
            errorMessage = responseJson.message;
        }
    }

    return errorMessage;
}

export {
    getAxiosErrorMessage,
    getAxiosBlobErrorMessage,
};

export interface AxiosOptionalConfig {
    signal?: AbortSignal | undefined;
}