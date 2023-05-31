import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUserContext } from "@/context/user/useUserContext";

export const useRedirectToLoginIfNoUser = () => {

    const router = useRouter();

    const { user, isUserLoading } = useUserContext();

    useEffect(function verifyUser() {
        if (!user && !isUserLoading) router.push('/login');
    }, [user, isUserLoading]);

    return null;
};