import NextLink from "@/components/NextLink";
import { useUserContext } from "@/context/user/useUserContext";
import SignOutButton from "./SignOutButton";

interface Props {}

export default function Navigation(props: Props) {

    const { user, isUserLoading } = useUserContext();

    return (
        <header>
            <nav>
                <nav>
                    <NextLink
                        href="/"
                        className="mr-4 text-lg font-medium"
                    >
                        Home
                    </NextLink>
                    {isUserLoading ?
                        <span className="mr-4 text-lg font-medium">
                            Loading User...
                        </span>
                    :
                        <>
                            {user ?
                                <>
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
                                        href="login"
                                        className="mr-4 text-lg font-medium"
                                    >
                                        Login
                                    </NextLink>
                                    <NextLink
                                        href="sign-up"
                                        className="mr-4 text-lg font-medium"
                                    >
                                        Sign up
                                    </NextLink>
                                    <NextLink
                                        href="forgot-password"
                                        className="text-lg font-medium"
                                    >
                                        Forgot Password
                                    </NextLink>
                                </>
                            }
                        </>
                    }
                </nav>
            </nav>
        </header>
    );
};