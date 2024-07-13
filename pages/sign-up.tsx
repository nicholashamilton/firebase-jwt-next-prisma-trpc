
import { ReactElement } from "react";
import SEO from "@/components/SEO";
import RootLayout from "@/layouts/RootLayout";
import { SignUpForm } from "@/components/forms/SignUpForm";
import Typography from "@/components/ui/typography";

export default function SignUp() {
    return (
        <>
            <SEO
                title="Sign Up"
                description="Sign Up"
            />
            <Typography variant="h2">
                Sign Up
            </Typography>
            <SignUpForm />
        </>
    );
}

SignUp.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}