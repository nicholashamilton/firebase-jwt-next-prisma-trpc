import NextLink from "@/components/NextLink";
import { useUserContext } from "@/context/user/useUserContext";
import SignOutButton from "./SignOutButton";

interface Props { }

export default function Navigation(props: Props) {

    const { user, isUserLoading } = useUserContext();

    return (
        <header className="relative">
            <nav className="m-auto max-w-6xl">
                <nav className="flex items-center justify-between">
                    <NextLink
                        href="/"
                        className="mr-4 text-lg font-medium"
                    >
                        Home
                    </NextLink>
                    <div>
                        {isUserLoading ?
                            <span className="mr-4 text-lg font-medium">
                                Loading User...
                            </span>
                            :
                            <>
                                {user ?
                                    <>
                                        <NextLink
                                            href={`/post/add-post`}
                                            className="mr-4 text-lg font-medium"
                                        >
                                            Add Post
                                        </NextLink>
                                        <NextLink
                                            href={`/user/${user.displayName}`}
                                            className="mr-4 text-lg font-medium"
                                        >
                                            Profile
                                        </NextLink>
                                        <NextLink
                                            href="/edit-profile"
                                            className="mr-4 text-lg font-medium"
                                        >
                                            Edit Profile
                                        </NextLink>
                                        <SignOutButton
                                            className="mr-4 text-lg font-medium"
                                        />
                                    </>
                                    :
                                    <>
                                        <NextLink
                                            href="/sign-up"
                                            className="mr-4 text-lg font-medium"
                                        >
                                            Sign up
                                        </NextLink>
                                        <NextLink
                                            href="/login"
                                            className="mr-4 text-lg font-medium"
                                        >
                                            Login
                                        </NextLink>
                                        <NextLink
                                            href="/forgot-password"
                                            className="text-lg font-medium"
                                        >
                                            Forgot Password
                                        </NextLink>
                                    </>
                                }
                            </>
                        }
                    </div>
                </nav>
            </nav>
        </header>
    );
};