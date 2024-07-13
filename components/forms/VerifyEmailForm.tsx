import Button from "@/components/Button";
import { FormEvent, useState } from "react";
import { User, sendEmailVerification } from "firebase/auth";
import { toast } from "../ui/use-toast";

export default function VerifyEmailForm(props: {
    user: User;
}) {

    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleVerifyEmail(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSubmitting(true);

            await sendEmailVerification(props.user);

            toast({ title: 'Email verification sent.' });
        }
        catch (error) {
            toast({ title: 'Issue sending email verification.', variant: 'destructive' });
        }

        setIsSubmitting(false);
    }

    return (
        <form onSubmit={handleVerifyEmail}>
            <h4 className="mb-2 text-xl font-bold">Email Verification</h4>
            <Button
                label={`Verify Email ${props.user.emailVerified ? '(email already verified)' : ''}`}
                type="submit"
                disabled={isSubmitting || props.user.emailVerified}
                className={isSubmitting || props.user.emailVerified ? 'opacity-50' : ''}
            />
        </form>
    );
}