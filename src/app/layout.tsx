import type { Metadata } from "next";
import { Montserrat} from "next/font/google"
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

import "@/styles/globals.scss";

const montserrat = Montserrat({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "SME - Auto Serviço",
    description: "SME - Auto Serviço",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br">
            <body className={`${montserrat.className} mx-auto`}>
                <ReactQueryProvider>
                    <TooltipProvider delayDuration={200}>
                        {children}
                    </TooltipProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
