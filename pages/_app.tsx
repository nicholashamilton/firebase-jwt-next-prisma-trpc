import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { api } from "@/server/apiClient";
import { Inter } from "next/font/google";
import ToastNotifications from "@/components/ToastNotifications";
import { UserProvider } from "@/context/user/useUserContext";
import { useFixSafariBackSwipe } from "@/hooks/useFixSafariBackSwipe";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";

const inter = Inter({ subsets: ["latin"] });

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function WebApp({ Component, pageProps }: AppPropsWithLayout) {

    useFixSafariBackSwipe();

    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <>
            <meta
                name='viewport'
                content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
            />
            <UserProvider>
                <main className={inter.className}>
                    {/* <UserInfo /> */}
                    {getLayout(<Component {...pageProps} />)}
                    <ToastNotifications />
                </main>
            </UserProvider>
        </>
    );
}

export default api.withTRPC(WebApp);
