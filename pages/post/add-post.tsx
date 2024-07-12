"use client"

import { ReactElement } from "react";
import SEO from "@/components/SEO";
import RootLayout from "@/layouts/RootLayout";
import { AddPostForm } from "@/components/forms/AddPostForm";

export default function AddPostPage() {
    return (
        <>
            <SEO
                title="Add Post"
                description="Add Post"
            />
            <>
                <h1 className="my-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">
                    Add Post
                </h1>
                <AddPostForm />
            </>
        </>
    );
}

AddPostPage.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}
