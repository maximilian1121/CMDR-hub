import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { Box, Typography, Link, Divider } from "@mui/material";
import Navbar from "../navbar";

export default async function Legal() {
    const filePath = path.join(process.cwd(), "app/TOS.md");

    try {
        const fileContent = fs.readFileSync(filePath, "utf-8");

        return (
            <>
                <Navbar />
                <Box
                    component="article"
                    sx={{ maxWidth: "800px", margin: "0 auto", p: 3 }}
                >
                    <Markdown
                        components={{
                            h1: ({ children }) => (
                                <Typography
                                    variant="h3"
                                    component="h1"
                                    gutterBottom
                                >
                                    {children}
                                </Typography>
                            ),
                            h2: ({ children }) => (
                                <Typography
                                    variant="h4"
                                    component="h2"
                                    sx={{ mt: 4, mb: 2 }}
                                >
                                    {children}
                                </Typography>
                            ),
                            h3: ({ children }) => (
                                <Typography
                                    variant="h5"
                                    component="h3"
                                    sx={{ mt: 3, mb: 1 }}
                                >
                                    {children}
                                </Typography>
                            ),
                            p: ({ children }) => (
                                <Typography
                                    variant="body1"
                                    sx={{ mb: 2, lineHeight: 1.7 }}
                                >
                                    {children}
                                </Typography>
                            ),
                            a: ({ href, children }) => (
                                <Link
                                    href={href}
                                    target="_blank"
                                    rel="noopener"
                                >
                                    {children}
                                </Link>
                            ),
                            hr: () => <Divider sx={{ my: 4 }} />,
                            li: ({ children }) => (
                                <Box component="li" sx={{ mb: 1 }}>
                                    <Typography variant="body1">
                                        {children}
                                    </Typography>
                                </Box>
                            ),
                        }}
                    >
                        {fileContent}
                    </Markdown>
                </Box>
            </>
        );
    } catch {
        notFound();
    }
}
