import { FormEvent, ReactElement, useState } from "react";
import { useUserContext } from "@/context/user/useUserContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firebaseErrorRecord, isFirebaseError } from "@/lib/firebase";
import Button from "@/components/Button";
import { useRedirectToProfileIfUser } from "@/hooks/user/useRedirectToProfileIfUser";
import SEO from "@/components/SEO";
import RootLayout from "@/layouts/RootLayout";
import { toast } from "@/components/ui/use-toast";

export default function Login() {

    const { user } = useUserContext();

    useRedirectToProfileIfUser();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formUser, setFormUser] = useState({
        email: '',
        password: '',
    });

    function handleUserInputChange(e: React.FormEvent<HTMLInputElement>) {
        const input = e.currentTarget;
        const { name, value } = input;
        setFormUser({
            ...formUser,
            [name]: value,
        });
    }

    async function handleLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSubmitting(true);

            await signInWithEmailAndPassword(auth, formUser.email, formUser.password);
        }
        catch (error) {
            let errorMessage = 'Unknown error occurred while creating user';

            if (isFirebaseError(error) && firebaseErrorRecord[error.code]) {
                errorMessage = firebaseErrorRecord[error.code];
            }

            toast({ title: errorMessage, variant: 'destructive' });
        }

        setIsSubmitting(false);
    }

    if (user) return null;

    return (
        <>
            <SEO
                title="Login - Skate Seeker"
                description="Login - Skate Seeker"
            />
            <h1 className="my-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">
                Login
            </h1>
            <form onSubmit={handleLogin}>
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
                <Button
                    label="Login"
                    type="submit"
                    disabled={isSubmitting}
                />
            </form>
        </>
    );
}

Login.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}