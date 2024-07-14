import { toast } from "@/components/ui/use-toast";
import { TRPCClientError } from "@trpc/client";

export function showTrpcError(error: unknown, fallbackMessage: string = '') {
    let message = fallbackMessage;
    if (error instanceof TRPCClientError) {
        message = error.message;
    }
    toast({ title: message });
}
