import SEO from "@/components/SEO";
import { useUserContext } from "@/context/user/useUserContext";
import { ReactElement } from "react";
import RootLayout from "@/layouts/RootLayout";
import RequireUser from "@/components/RequireUser";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Typography from "@/components/ui/typography";
import EditUserAccountForm from "@/components/forms/EditUserAccountForm";
import VerifyEmailForm from "@/components/forms/VerifyEmailForm";

export default function EditProfilePage() {

    const { userAccount } = useUserContext();

    return (
        <RequireUser>
            {(user) => (
                <>
                    <SEO
                        title="Edit Profile"
                        description="Edit Profile"
                    />
                    <Typography variant="h2" className="mt-8 mb-10">
                        Edit Profile
                    </Typography>
                    {userAccount ? (
                        <>
                            <Typography variant="h3" className="mb-4">
                                Profile
                            </Typography>
                            <EditUserAccountForm
                                user={user}
                                userAccount={userAccount}
                            />
                        </>
                    ) :
                        <div className="p-8 w-full flex justify-center"><LoadingSpinner /></div>
                    }
                    <div className="mt-16">
                        <Typography variant="h3" className="mb-4">
                            Email Verification
                        </Typography>
                        <VerifyEmailForm
                            user={user}
                        />
                    </div>
                </>
            )}
        </RequireUser>
    );
}

EditProfilePage.getLayout = function GetLayout(page: ReactElement) {
    return <RootLayout>{page}</RootLayout>;
}
