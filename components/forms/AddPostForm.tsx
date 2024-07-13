"use client"

import { api } from "@/server/apiClient";
import { Button } from "@/components/ui/button";
import { NextRouter, useRouter } from "next/router";
import { useUserContext } from "@/context/user/useUserContext";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "../ui/toast";

const FormSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.',
    }),
});

export function AddPostForm() {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: '',
        },
    });

    const { user } = useUserContext();
    const router = useRouter();
    const mutation = api.posts.addPost.useMutation();
    const utils = api.useUtils();

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (!user) return promptLogin(router);

        try {
            await mutation.mutateAsync(data);

            utils.posts.getAllPosts.reset()

            toast({ title: 'Post added successfully.' });

            router.push('/');
        }
        catch (error) {
            toast({ title: 'An issue occurred while adding the post.', variant: 'destructive' });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter title..." {...field} />
                            </FormControl>
                            <FormDescription>
                                {`Don't think long or too hard.`}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Add Post
                </Button>
            </form>
        </Form>
    );
}

function promptLogin(router?: NextRouter) {
    toast({
        title: "You must be logged in to create a post.",
        description: 'wejnfkwhbfhkwehkbfw',
        action: router ? (
            <ToastAction
                onClick={() => router.push('/login')}
                altText="Try again">
                Login
            </ToastAction>
        ) : undefined,
        variant: 'destructive'
    });
}