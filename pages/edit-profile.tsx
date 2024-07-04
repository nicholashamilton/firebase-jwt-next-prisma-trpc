import Button from "@/components/Button";
import SEO from "@/components/SEO";
import { useUserContext } from "@/context/user/useUserContext";
import { useRedirectToLoginIfNoUser } from "@/hooks/user/useRedirectToLoginIfNoUser";
import { FormEvent, ReactElement, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/server/apiClient";
import RootLayout from "@/layouts/RootLayout";
import { User, sendEmailVerification, signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { UserAccount } from "@prisma/client";
import { showTrpcError } from "@/lib/trpc";

export default function EditProfilePage() {

    const { userAccount, user } = useUserContext();

    useRedirectToLoginIfNoUser();

    if (!user || !userAccount) return null;

    return (
        <>
            <SEO
                title="Edit Profile"
                description="Edit Profile"
            />
            <h1 className="my-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">
                Edit Profile
            </h1>
            <EditUserAccountForm
                user={user}
                userAccount={userAccount}
            />
        </>
    );
}

EditProfilePage.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}

function EditUserAccountForm(props: {
    user: User;
    userAccount: UserAccount;
}) {

    const { setUser } = useUserContext();

    const mutation = api.auth.updateProfile.useMutation();
    const utils = api.useUtils();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formUser, setFormUser] = useState({
        email: props.userAccount?.email ?? '',
        username: props.userAccount?.username ?? '',
    });

    useEffect(function syncFormUserWithProfile() {
        setFormUser({
            email: props.userAccount?.email ?? '',
            username: props.userAccount?.username ?? '',
        });
    }, [props.userAccount]);

    async function handleUpdateProfile(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSubmitting(true);

            const { message, userAccount, token } = await mutation.mutateAsync(formUser);

            toast(message, { type: 'success' });

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

        setIsSubmitting(false);
    }

    async function handleVerifyEmail(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSubmitting(true);

            await sendEmailVerification(props.user);

            toast('Email verification sent.', { type: 'success' });
        }
        catch (error) {
            toast('Issue sending email verification.', { type: 'error' });
        }

        setIsSubmitting(false);
    }

    function handleUserInputChange(e: React.FormEvent<HTMLInputElement>) {
        const input = e.currentTarget;
        const { name, value } = input;
        setFormUser({
            ...formUser,
            [name]: value,
        });
    }

    return (
        <>
            <form onSubmit={handleUpdateProfile}>
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
                        type="text"
                        className="block w-full max-w-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="Enter email..."
                        value={formUser.email}
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
                    label="Save Profile"
                    type="submit"
                    disabled={isSubmitting}
                />
            </form>
            <form
                onSubmit={handleVerifyEmail}
                className="block mt-14"
            >
                <h4 className="mb-2 text-xl font-bold">Email Verification</h4>
                <Button
                    label={`Verify Email ${props.user.emailVerified ? '(email already verified)' : ''}`}
                    type="submit"
                    disabled={isSubmitting || props.user.emailVerified}
                    className={isSubmitting || props.user.emailVerified ? 'opacity-50' : ''}
                />
            </form>
        </>
    );
}