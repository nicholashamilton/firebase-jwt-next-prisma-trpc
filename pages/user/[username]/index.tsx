import { api } from "@/server/apiClient";
import { useRouter } from "next/router";
import { ReactElement, useMemo } from "react";
import { DefaultUserAvatar } from "@/components/Icons";
import RootLayout from "@/layouts/RootLayout";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Typography from "@/components/ui/typography";

export default function UserPage() {

    const router = useRouter();

    const username = typeof router.query.username === 'string' ? router.query.username : '';

    const { data, isLoading } = api.user.getPublicProfile.useQuery(
        { username },
        { enabled: !!username }
    );

    const publicUser = useMemo(() => data && data.user ? data.user : null, [data]);

    if (isLoading) {
        return (
            <div className="p-8 py-24 w-full flex justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (publicUser) {
        return (
            <div className="block w-full py-12">
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="relative overflow-hidden rounded-full mb-2">
                        <DefaultUserAvatar
                            className="w-20 h-20 min-w-20 min-h-20"
                        />
                    </div>
                    <h1 className="my-2 text-3xl font-extrabold leading-none tracking-tight text-gray-900">
                        {publicUser.username}
                    </h1>
                </div>
                <div className="flex justify-center items-center">
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-2xl font-regular text-gray-800">
                            {publicUser.postsCount}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                            Posts
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 py-24 w-full flex justify-center">
            <Typography variant="h2">
                User not found...
            </Typography>
        </div>
    );
}

UserPage.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}