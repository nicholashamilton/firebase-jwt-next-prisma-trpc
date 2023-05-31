import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUserContext } from "@/context/user/useUserContext";

export const useRedirectToProfileIfUser = () => {

    const router = useRouter();

    const { user, isUserLoading } = useUserContext();

    useEffect(function verifyUser() {
        if (user) router.push('/');
    }, [isUserLoading, user]);

    return null;
};