import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <main className={`block relative ${inter.className}`}>
            <h1>Hello, World</h1>
        </main>
    );
}
