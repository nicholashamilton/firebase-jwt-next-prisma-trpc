import { TRPCClientError } from "@trpc/client";
import { toast } from "react-toastify";

export function showTrpcError(error: unknown, fallbackMessage: string = '') {
    let message = fallbackMessage;
    if (error instanceof TRPCClientError) {
        message = error.message;
    }
    toast(message, { type: 'error' });
}
