import { FormEvent, ReactElement, useState } from "react";
import { useRedirectToProfileIfUser } from "@/hooks/user/useRedirectToProfileIfUser";
import { useUserContext } from "@/context/user/useUserContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, firebaseErrorRecord, isFirebaseError } from "@/lib/firebase";
import { toast } from "react-toastify";
import SEO from "@/components/SEO";
import Button from "@/components/Button";
import RootLayout from "@/layouts/RootLayout";

export default function ForgotPassword() {

    const { user } = useUserContext();

    useRedirectToProfileIfUser();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formUser, setFormUser] = useState({
        email: '',
    });

    function handleUserInputChange(e: React.FormEvent<HTMLInputElement>) {
        const input = e.currentTarget;
        const { name, value } = input;
        setFormUser({
            ...formUser,
            [name]: value,
        });
    }

    async function handleForgotPassword(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSubmitting(true);

            await sendPasswordResetEmail(auth, formUser.email);

            setFormUser({ email: '' });

            toast('Password Reset Email Sent.', {
                type: 'success',
            });
        }
        catch (error) {
            let errorMessage = 'Unknown error occurred while sending password reset email.';

            if (isFirebaseError(error) && firebaseErrorRecord[error.code]) {
                errorMessage = firebaseErrorRecord[error.code];
            }

            toast(errorMessage, {
                type: 'error',
            });
        }

        setIsSubmitting(false);
    }

    if (user) return null;

    return (
        <div className="block relative">
            <SEO
                title="Forgot Password"
                description="Forgot Password"
            />
            <h1 className="my-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">
                Forgot Password
            </h1>
            <form
                onSubmit={handleForgotPassword}
                className="block mt-10"
            >
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
                <Button
                    label="Submit"
                    type="submit"
                    disabled={isSubmitting}
                    className={isSubmitting ? 'opacity-50' : ''}
                />
            </form>
        </div>
    );
}

ForgotPassword.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}
