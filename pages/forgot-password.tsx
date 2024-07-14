import { ReactElement } from "react";
import SEO from "@/components/SEO";
import RootLayout from "@/layouts/RootLayout";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import Typography from "@/components/ui/typography";

export default function ForgotPassword() {
    return (
        <div className="block relative">
            <SEO
                title="Forgot Password"
                description="Forgot Password"
            />
            <Typography variant="h2" className="my-8">
                Forgot Password
            </Typography>
            <ForgotPasswordForm />
        </div>
    );
}

ForgotPassword.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}
