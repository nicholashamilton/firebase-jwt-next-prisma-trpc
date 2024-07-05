import AllPosts from "@/components/api/AllPosts";
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
            <h1 className="mt-8 mb-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">
                {isUserLoading ? (
                    <span className="block w-full max-w-[440px] h-8 bg-gray-200 animate-pulse" />
                ) :
                    <>{user ? `Welcome, ${user.displayName ? user.displayName : user.email}` : 'No User'}</>
                }
            </h1>
            <div>
                <h2 className="my-8 text-2xl font-extrabold leading-none tracking-tight text-gray-900">
                    Posts
                </h2>
                <AllPosts />
            </div>
        </div>
    );
}

HomePage.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}
