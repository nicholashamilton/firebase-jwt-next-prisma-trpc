// components/RequireUser.tsx
import { useUserContext } from "@/context/user/useUserContext";
import { ReactNode } from "react";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import { useRedirectToLoginIfNoUser } from "@/hooks/user/useRedirectToLoginIfNoUser";
import { User } from "@firebase/auth";

interface RequireUserProps {
    children: (user: User) => ReactNode;
}

export default function RequireUser({ children }: RequireUserProps) {
    const { user } = useUserContext();

    useRedirectToLoginIfNoUser();

    if (!user) {
        return (
            <div className="p-8 w-full flex justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return <>{children(user)}</>;
}
