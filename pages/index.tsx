import AllPosts from "@/components/api/AllPosts";
import SEO from "@/components/SEO";
import Typography from "@/components/ui/typography";
import { useUserContext } from "@/context/user/useUserContext";
import RootLayout from "@/layouts/RootLayout";
import { ReactElement } from "react";

export default function HomePage() {
    const { user, isUserLoading } = useUserContext();
    return (
        <>
            <SEO
                title="Home"
                description="Home"
            />
            <div className="mt-8 block relative">
                {isUserLoading ? (
                    <span className="block w-full max-w-[580px] h-10 bg-gray-200 animate-pulse" />
                ) :
                    <Typography variant="h2">
                        {user ? `Welcome, ${user.displayName ? user.displayName : user.email}` : 'No User'}
                    </Typography>
                }
                <div className="mt-6">
                    <Typography variant="h2" className="mb-4">
                        All Posts
                    </Typography>
                    <AllPosts />
                </div>
            </div>
        </>
    );
}

HomePage.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}
