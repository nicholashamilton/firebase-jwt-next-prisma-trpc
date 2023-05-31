import SEO from "@/components/SEO";
import RootLayout from "@/layouts/RootLayout";
import { ReactElement } from "react";

export default function HomePage() {
    return (
        <div className="block relative">
            <SEO
                title="Home"
                description="Home"
            />
            <h1>Home</h1>
        </div>
    );
}


HomePage.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout innerClassName="!max-w-[2160px]">{page}</RootLayout>;
}