import Head from "next/head";

export default function SEO(props: {
    title: string;
    description: string;
}) {
    return (
        <Head>
            <title>{props.title}</title>
            <meta
                name="description"
                content={props.description}
            />
        </Head>
    );
}
