'use client'

import { sendPasswordResetEmail } from "firebase/auth";
import { auth, firebaseErrorRecord, isFirebaseError } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRedirectToProfileIfUser } from "@/hooks/user/useRedirectToProfileIfUser";
import { useUserContext } from "@/context/user/useUserContext";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";

const FormSchema = z.object({
    email: z.string().min(1, {
        message: "Email is required.",
    }).email("Not a valid email."),
});

export function ForgotPasswordForm() {
    useRedirectToProfileIfUser();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
        },
    });

    const { user } = useUserContext();

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            await sendPasswordResetEmail(auth, data.email);

            form.reset();

            toast({ title: 'Password reset email sent.' });
        }
        catch (error) {
            let errorMessage = 'Unknown error occurred while sending password reset email.';

            if (isFirebaseError(error) && firebaseErrorRecord[error.code]) {
                errorMessage = firebaseErrorRecord[error.code];
            }

            toast({ title: errorMessage, variant: 'destructive' });
        }
    }

    if (user) return null;
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter email..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Submit
                </Button>
            </form>
        </Form>
    );
}