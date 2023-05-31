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

    const { data: profileData, isLoading: isProfileLoading } = api.auth.getProfile.useQuery(
        undefined,
        {
            enabled: !!user,
            retry: 3,
        },
    );

    const profile = useMemo(function getProfile() {
        return profileData ? profileData : null;
    }, [profileData]);

    return {
        user,
        setUser,
        isUserLoading,
        profile,
        isProfileLoading,
    };
};

export type UseUser = ReturnType<typeof useUser>;
