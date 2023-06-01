import Navigation from "@/components/Header";
import classNames from "classnames";
import { ReactNode } from "react"

export default function RootLayout(props: {
    children: ReactNode;
    innerClassName?: string;
}) {
    return (
        <>
            <section className="block p-4">
                <Navigation />
                <div
                    className={classNames(
                        'block m-auto max-w-[800px]',
                        props.innerClassName ?? '',
                    )}
                >
                    {props.children}
                </div>
            </section>
        </>
    );
}