"use client"

import { api } from "@/server/apiClient";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/user/useUserContext";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useRedirectToProfileIfUser } from "@/hooks/user/useRedirectToProfileIfUser";
import { signInWithCustomToken } from "@firebase/auth";
import { showTrpcError } from "@/lib/trpc";
import { auth } from "@/lib/firebase";

const FormSchema = z.object({
    email: z.string(),
    password: z.string().min(6, {
        message: 'Password must be at least 6 character.',
    }),
    username: z.string().min(1, {
        message: 'Username must be at least 1 character.',
    }).max(30, {
        message: 'Username can only be 30 characters.',
    }),
});

export function SignUpForm() {
    useRedirectToProfileIfUser();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
            password: '',
            username: '',
        },
    });

    const mutation = api.auth.signUp.useMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useUserContext();

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            setIsSubmitting(true);

            const { message, token } = await mutation.mutateAsync(data);

            toast({ title: message });

            await signInWithCustomToken(auth, token);
        }
        catch (error) {
            showTrpcError(error);
        }

        setIsSubmitting(false);
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
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter password..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter username..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Sign Up
                </Button>
            </form>
        </Form>
    );
}