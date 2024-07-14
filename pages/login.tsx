import { ReactElement } from "react";
import SEO from "@/components/SEO";
import RootLayout from "@/layouts/RootLayout";
import { LoginForm } from "@/components/forms/LoginForm";
import Typography from "@/components/ui/typography";

export default function Login() {
    return (
        <>
            <SEO
                title="Login"
                description="Login"
            />
            <Typography variant="h2" className="my-8">
                Login
            </Typography>
            <LoginForm />
        </>
    );
}

Login.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}