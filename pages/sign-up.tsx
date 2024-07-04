import Button from "@/components/Button";
import { auth } from "@/lib/firebase";
import { api } from "@/server/apiClient";
import { signInWithCustomToken } from "firebase/auth";
import { FormEvent, ReactElement, useState } from "react";
import { toast } from 'react-toastify';
import { useUserContext } from "@/context/user/useUserContext";
import { useRedirectToProfileIfUser } from "@/hooks/user/useRedirectToProfileIfUser";
import SEO from "@/components/SEO";
import RootLayout from "@/layouts/RootLayout";
import { showTrpcError } from "@/lib/trpc";

export default function SignUp() {

    const { user } = useUserContext();

    useRedirectToProfileIfUser();

    const mutation = api.auth.signUp.useMutation();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formUser, setFormUser] = useState({
        email: '',
        password: '',
        username: '',
    });

    function handleUserInputChange(e: React.FormEvent<HTMLInputElement>) {
        const input = e.currentTarget;
        const { name, value } = input;
        setFormUser({
            ...formUser,
            [name]: value,
        });
    }

    async function handleSignUp(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSubmitting(true);

            const { message, token } = await mutation.mutateAsync(formUser);

            toast(message, { type: 'success' });

            await signInWithCustomToken(auth, token);
        }
        catch (error) {
            showTrpcError(error);
        }

        setIsSubmitting(false);
    }

    if (user) return null;

    return (
        <>
            <SEO
                title="Sign Up"
                description="Sign Up"
            />
            <h1 className="my-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">
                Sign Up
            </h1>
            <form onSubmit={handleSignUp}>
                <div className="block mb-4">
                    <label
                        htmlFor="email"
                        className="inline-block mb-2 text-sm font-medium text-gray-900"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="block w-full max-w-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="Enter email..."
                        required
                        value={formUser.email}
                        onChange={handleUserInputChange}
                    />
                </div>
                <div className="block mb-4">
                    <label
                        htmlFor="password"
                        className="inline-block mb-2 text-sm font-medium text-gray-900"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="block w-full max-w-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="Enter password..."
                        required
                        value={formUser.password}
                        onChange={handleUserInputChange}
                    />
                </div>
                <div className="block mb-4">
                    <label
                        htmlFor="username"
                        className="inline-block mb-2 text-sm font-medium text-gray-900"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        className="block w-full max-w-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="Enter username..."
                        value={formUser.username}
                        onChange={handleUserInputChange}
                    />
                </div>
                <Button
                    label="Sign Up"
                    type="submit"
                    disabled={isSubmitting}
                />
            </form>
        </>
    );
}

SignUp.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}