'use client'

import { useUserContext } from "@/context/user/useUserContext";
import { api } from "@/server/apiClient";
import { User, signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { UserAccount } from "@prisma/client";
import { showTrpcError } from "@/lib/trpc";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

const FormSchema = z.object({
    email: z.string(),
    username: z.string().min(1, {
        message: 'Username must be at least 1 character.',
    }).max(30, {
        message: 'Username can only be 30 characters.',
    }),
});

export default function EditUserAccountForm(props: {
    user: User;
    userAccount: UserAccount;
}) {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: props.userAccount?.email ?? '',
            username: props.userAccount?.username ?? '',
        },
    });

    const mutation = api.auth.updateProfile.useMutation();
    const utils = api.useUtils();
    const { setUser } = useUserContext();

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const { message, userAccount, token } = await mutation.mutateAsync(data);

            toast({ title: message });

            utils.auth.getCurrentUserAccount.setData(undefined, { userAccount });

            setUser({
                ...props.user,
                email: userAccount.email,
                displayName: userAccount.username,
            });

            await signInWithCustomToken(auth, token);
        }
        catch (error) {
            showTrpcError(error);
        }
    }

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
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Profile
                </Button>
            </form>
        </Form>
    );
}