import { useEffect, useMemo, useState } from "react";
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from '@firebase/auth';
import { api } from "@/server/apiClient";

export const useUser = () => {

    const [user, setUser] = useState<User | null>(null);
    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(function getUser() {
        const unsubscribe = onAuthStateChanged(auth, (updatedUser) => {
            setIsUserLoading(false);
            setUser(updatedUser);
        });
        return () => unsubscribe();
    }, []);

    const { data, isLoading: isUserAccountLoading } = api.auth.getCurrentUserAccount.useQuery(
        undefined,
        {
            enabled: !!user,
            retry: 3,
        },
    );

    const userAccount = useMemo(() => data ? data.userAccount : null, [data]);

    return {
        user,
        setUser,
        isUserLoading,

        userAccount,
        isUserAccountLoading,
    };
};

export type UseUser = ReturnType<typeof useUser>;
