import { api } from "@/server/apiClient";
import { FormEvent, ReactElement, useState } from "react";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import SEO from "@/components/SEO";
import RootLayout from "@/layouts/RootLayout";
import { useRouter } from "next/router";
import { useUserContext } from "@/context/user/useUserContext";

export default function AddPostPage() {

    const { user } = useUserContext();

    const router = useRouter();

    const mutation = api.posts.addPost.useMutation();

    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleUploadPost(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!user) {
            toast('Must be logged in to make a post.', { type: 'warning' });
            return;
        }

        try {
            setIsSubmitting(true);

            await mutation.mutateAsync({
                title: post.title,
            });

            setIsSubmitting(false);

            toast('Post added successfully.', { type: 'success' });

            router.push('/');
        }
        catch (error) {
            console.log(error);

            toast('There was an issue adding the post', { type: 'error' });

            setIsSubmitting(false);
        }
    }

    const [post, setPost] = useState({
        title: '',
    });

    function handleTextInputChange(e: FormEvent<HTMLInputElement>) {
        const { name, value } = e.currentTarget;
        setPost({
            ...post,
            [name]: value,
        });
    }

    return (
        <>
            <SEO
                title="Add Post"
                description="Add Post"
            />
            <>
                <h1 className="my-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">
                    Add Post
                </h1>
                <form
                    onSubmit={handleUploadPost}
                    className="mb-8"
                >
                    <div className="block mb-4">
                        <label
                            htmlFor="title"
                            className="inline-block mb-2 text-sm font-medium text-gray-900"
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="title"
                            className="block w-full max-w-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                            placeholder="Enter title..."
                            required
                            value={post.title}
                            onChange={handleTextInputChange}
                        />
                    </div>
                    <Button
                        label="Add Post"
                        type="submit"
                        disabled={isSubmitting}
                        className={isSubmitting ? 'opacity-50' : ''}
                    />
                </form>
            </>
        </>
    );
}

AddPostPage.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}