import SEO from "@/components/SEO";
import { useUserContext } from "@/context/user/useUserContext";
import RootLayout from "@/layouts/RootLayout";
import { ReactElement } from "react";

export default function HomePage() {

    const { user, isUserLoading } = useUserContext();

    return (
        <div className="block relative">
            <SEO
                title="Home"
                description="Home"
            />
            <h1 className="mt-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">
                {isUserLoading ?
                    <>Loading User...</>
                :
                    <>{user ? `Welcome, ${user.displayName ? user.displayName : user.email}` : 'No User'}</>
                }
            </h1>
        </div>
    );
}


HomePage.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout innerClassName="!max-w-[2160px]">{page}</RootLayout>;
}