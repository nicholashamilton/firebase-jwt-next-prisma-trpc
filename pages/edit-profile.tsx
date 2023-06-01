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

export default function EditProfilePage() {

    const { profile, user } = useUserContext();

    useRedirectToLoginIfNoUser();

    if (!user || !profile) return null;

    return (
        <>
            <SEO
                title="Edit Profile"
                description="Edit Profile"
            />
            <h1 className="my-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">
                Edit Profile
            </h1>
            <EditProfileForms
                user={user}
                profile={profile}
            />
        </>
    );
}

EditProfilePage.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}

function EditProfileForms(props: {
    user: User;
    profile: UserAccount;
}) {

    const { setUser } = useUserContext();

    const mutation = api.auth.updateProfile.useMutation();
    const utils = api.useContext();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formUser, setFormUser] = useState({
        email: props.profile?.email ?? '',
        username: props.profile?.username ?? '',
    });

    useEffect(function syncFormUserWithProfile() {
        setFormUser({
            email: props.profile?.email ?? '',
            username: props.profile?.username ?? '',
        });
    }, [props.profile]);

    async function handleUpdateProfile(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSubmitting(true);

            const updateProfileRes = await mutation.mutateAsync(formUser);

            toast(updateProfileRes.message, {
                type: updateProfileRes.messageType,
            });

            if (updateProfileRes.user && updateProfileRes.profile) {

                utils.auth.getProfile.setData(undefined, updateProfileRes.profile);

                setUser({
                    ...props.user,
                    email: updateProfileRes.profile.email,
                    displayName: updateProfileRes.profile.username,
                });

                if (updateProfileRes.token) {
                    await signInWithCustomToken(auth, updateProfileRes.token);
                }
            }
        }
        catch (error) {
            let errorMessage = 'Unknown error occurred while editing profile';

            toast(errorMessage, {
                type: 'error',
            });
        }

        setIsSubmitting(false);
    }

    async function handleVerifyEmail(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSubmitting(true);

            await sendEmailVerification(props.user);

            toast('Email Verification Sent.', {
                type: 'success',
            });
        }
        catch (error) {
            let errorMessage = 'Unknown error occurred while sending email verification.';

            toast(errorMessage, {
                type: 'error',
            });
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