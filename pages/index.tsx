import { DefaultUserAvatar } from "@/components/Icons";
import NextLink from "@/components/NextLink";
import SEO from "@/components/SEO";
import { useUserContext } from "@/context/user/useUserContext";
import RootLayout from "@/layouts/RootLayout";
import { api } from "@/server/apiClient";
import { ReactElement, useMemo } from "react";

export default function HomePage() {

    const { user, isUserLoading } = useUserContext();

    const { data, isLoading } = api.posts.getAllPosts.useQuery(undefined);

    const posts = useMemo(() => {
        return data ? data.posts : [];
    }, [data]);

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
            <div className="posts-container my-12">
                <>
                    <h2 className="my-8 text-2xl font-extrabold leading-none tracking-tight text-gray-900">
                        Posts
                    </h2>
                    {isLoading ?
                        <div className="block border rounded border-gray-300 p-4">
                            <span className="my-8 text-lg font-medium leading-none tracking-tight text-gray-800">
                                Loading...
                            </span>
                        </div>
                    : posts.length ?
                        <div className="grid grid-cols-1 gap-4">
                            {posts.map(post => (
                                <div
                                    key={post.id}
                                    className="flex flex-col items-start border rounded border-gray-300 p-4"
                                >
                                    <span className="text-lg font-semibold leading-none tracking-tight text-gray-800">
                                        {post.title}
                                    </span>
                                    <NextLink
                                        href={`/user/${post.user.username}`}
                                        className="flex flex-row items-center mt-3"
                                    >
                                        <div className="relative overflow-hidden rounded-full mr-2">
                                            <DefaultUserAvatar
                                                className="w-5 h-5 min-w-5 min-h-5"
                                            />
                                        </div>
                                        <span className="text-md font-medium leading-none tracking-tight text-gray-800">
                                            {post.user.username}
                                        </span>
                                    </NextLink>
                                </div>
                            ))}
                        </div>
                    :
                        <div className="block border border-gray-300 rounded p-4">
                            <span className="my-8 text-lg font-medium leading-none tracking-tight text-gray-800">
                                No Posts Found
                            </span>
                        </div>
                    }
                </>
            </div>
        </div>
    );
}

HomePage.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}