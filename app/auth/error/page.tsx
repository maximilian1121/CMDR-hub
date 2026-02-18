"use client";

import { CopyAllRounded } from "@mui/icons-material";
import {
    Box,
    Divider,
    IconButton,
    Link,
    Paper,
    Tooltip,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import { useEffect, useState } from "react";

async function GetErrorContent(searchParams: Promise<{ error?: string }>) {
    const params = await searchParams;

    return params?.error
        ? `Code error: ${params.error}`
        : "An unspecified error occurred.";
}

export default function Page({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const [errorText, setErrorText] = useState("Loading error details...");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function loadError() {
            try {
                const text = await GetErrorContent(searchParams);
                setErrorText(text);
            } catch {
                setErrorText("Error getting error");
            }
        }

        loadError();
    }, [searchParams]);

    const handleCopy = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(errorText);
            } else {
                fallbackCopy(errorText);
            }
            setCopied(true);
        } catch {
            fallbackCopy(errorText);
            setCopied(true);
        }
    };

    function fallbackCopy(text: string) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <Paper
                elevation={3}
                sx={{
                    width: "100%",
                    maxWidth: 800,
                    borderRadius: 4,
                    overflow: "hidden",
                    display: "flex",
                }}
            >
                <Box
                    sx={{
                        p: { xs: 3, sm: 5 },
                        backgroundColor: "error.main",
                        color: "error.contrastText",
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                        sx={{ letterSpacing: "-0.5px" }}
                    >
                        An error occurred!
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 4 }}>
                        Try again in a few minutes!
                    </Typography>
                </Box>

                <Divider orientation="vertical" />

                <Box sx={{ p: { xs: 3, sm: 5 } }} className="w-1/2">
                    <Typography variant="h6">Error information:</Typography>

                    <br />

                    <Paper className="p-2 gap-2 min-w-fit flex items-center">
                        <Typography
                            onClick={handleCopy}
                            sx={{
                                textTransform: "none",
                                cursor: "pointer",
                                flex: 1,
                            }}
                            component={"pre"}
                            fontFamily={"monospace"}
                        >
                            {errorText}
                        </Typography>
                        <Tooltip title="Copy error to clipboard">
                            <IconButton onClick={handleCopy}>
                                <CopyAllRounded />
                            </IconButton>
                        </Tooltip>
                    </Paper>

                    <br />

                    <Typography>Contact me for support</Typography>
                    <Link href="mailto:maximilian@latific.click">
                        maximilian@latific.click
                    </Link>
                </Box>
            </Paper>

            <Snackbar
                open={copied}
                autoHideDuration={1500}
                onClose={() => setCopied(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="success" sx={{ width: "100%" }}>
                    Copied to clipboard!
                </Alert>
            </Snackbar>
        </main>
    );
}
