"use client"

import { api } from "@/server/apiClient";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NextRouter, useRouter } from "next/router";
import { useUserContext } from "@/context/user/useUserContext";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast as shadtoast } from "@/components/ui/use-toast";
import { ToastAction } from "../ui/toast";

const FormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
});

export function AddPostForm() {
    const { user } = useUserContext();
    const router = useRouter();
    const mutation = api.posts.addPost.useMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const utils = api.useUtils();

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (!user) return promptLogin(router);

        try {
            setIsSubmitting(true);

            await mutation.mutateAsync(data);

            utils.posts.getAllPosts.reset()

            shadtoast({ title: 'Post added successfully.' });

            router.push('/');
        }
        catch (error) {
            shadtoast({ title: 'An issue occurred while adding the post.', variant: 'destructive' });
        }
        finally {
            setIsSubmitting(false);
        }
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: '',
        },
    });

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
                                Don't think too long or hard.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Add Post
                </Button>
            </form>
        </Form>
    );
}

function promptLogin(router?: NextRouter) {
    shadtoast({
        title: "You must be logged in to create a post.",
        action: router ? (
            <ToastAction
                onClick={() => router.push('/login')}
                altText="Try again">
                Login
            </ToastAction>
        ) : undefined,
    });
}