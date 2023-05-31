import NextLink from "@/components/NextLink";

interface Props {}

export default function Navigation(props: Props) {
    return (
        <header>
            <nav>
                <nav>
                    <NextLink
                        href="/"
                    >
                        Home
                    </NextLink>
                </nav>
            </nav>
        </header>
    );
};