import Link from "next/link";
import { ReactNode } from "react";

interface NextLinkProps {
    href: string;
    className?: string;
    children?: ReactNode;
}

export default function NextLink(props: NextLinkProps) {

    const { href, children, ...rest } = props;

    return (
        <Link href={href} legacyBehavior>
            <a {...rest}>
                {children}
            </a>
        </Link>
    );
}