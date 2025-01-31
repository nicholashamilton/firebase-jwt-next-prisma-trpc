'use client'

import { signInWithEmailAndPassword } from "firebase/auth";
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
    email: z.string(),
    password: z.string(),
});

export function LoginForm() {
    useRedirectToProfileIfUser();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { user } = useUserContext();

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
        }
        catch (error) {
            let errorMessage = 'Unknown error occurred while signing in.';

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
                                <Input required placeholder="Enter email..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input required placeholder="Enter password..." {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Login
                </Button>
            </form>
        </Form>
    );
}