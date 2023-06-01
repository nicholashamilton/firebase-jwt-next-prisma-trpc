
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignOutButton(props: {
    className?: string;
}) {

    async function handleSignOut() {
        await signOut(auth);
    }

    return (
        <button
            className={props.className ?? ''}
            onClick={handleSignOut}
        >
            Sign Out
        </button>
    );
}