import { FormEvent, useState } from "react";
import { User, sendEmailVerification } from "firebase/auth";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

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
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {`Verify Email ${props.user.emailVerified ? '(email already verified)' : ''}`}
            </Button>
        </form>
    );
}