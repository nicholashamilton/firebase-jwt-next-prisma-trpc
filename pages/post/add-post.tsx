"use client"

import { ReactElement } from "react";
import SEO from "@/components/SEO";
import RootLayout from "@/layouts/RootLayout";
import { AddPostForm } from "@/components/forms/AddPostForm";
import Typography from "@/components/ui/typography";

export default function AddPostPage() {
    return (
        <>
            <SEO
                title="Add Post"
                description="Add Post"
            />
            <>
                <Typography variant="h2" className="my-8">
                    Add Post
                </Typography>
                <AddPostForm />
            </>
        </>
    );
}

AddPostPage.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}
