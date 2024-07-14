import { api } from "@/server/apiClient";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useMemo } from "react";
import NextLink from "../NextLink";
import { DefaultUserAvatar, EmptyBoxIcon } from "../Icons";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AllPosts() {

    const {
        data,
        hasNextPage,
        fetchNextPage,
        isFetching,
        isLoading,
    } = api.posts.getAllPosts.useInfiniteQuery(
        {
            search: '',
        },
        {
            refetchOnMount: false,
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            // initialCursor: 1, // <-- optional you can pass an initialCursor
        },
    );

    const dataLength = useMemo(() => {
        let dataLength = 0;
        data?.pages.forEach(page => dataLength += page.posts.length);
        return dataLength;
    }, [data]);

    return (
        <>
            {isLoading ? (
                <div className="p-8 w-full flex justify-center"><LoadingSpinner /></div>
            ) : dataLength ? (
                <InfiniteScroll
                    hasMore={hasNextPage || false}
                    next={fetchNextPage}
                    dataLength={dataLength}
                    loader={<div className="block w-[50px] h-[50px] sr-only" />}
                >
                    <div className="grid grid-cols-1 gap-4">
                        {data?.pages.map((pages) => {
                            return pages?.posts.map((post) => (
                                <Card key={post.id}>
                                    <CardHeader className="p-4">
                                        <CardTitle className="mb-1">{post.title}</CardTitle>
                                        <div>
                                            <NextLink
                                                href={`/user/${post.user.username}`}
                                                className="inline-flex flex-row items-center"
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
                                    </CardHeader>
                                </Card>
                            ));
                        })}
                        {isFetching && hasNextPage ? (
                            <div className="p-8 w-full flex justify-center"><LoadingSpinner /></div>
                        ) : null}
                    </div>
                </InfiniteScroll>
            ) :
                <div className="flex flex-col items-center justify-center w-full py-32">
                    <EmptyBoxIcon className="w-12 h-12 mb-2" />
                    <span className="text-lg">No Posts Found...</span>
                </div>
            }
        </>
    );
}