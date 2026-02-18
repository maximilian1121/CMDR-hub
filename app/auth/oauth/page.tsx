"use client";

import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        async function handleOAuth() {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error) {
                console.error("OAuth error:", error);
                router.replace("/login");
                return;
            }

            if (session) {
                console.log("Logged in user:", session.user);
                router.replace("/profile");
            } else {
                router.replace("/login");
            }
        }

        handleOAuth();
    }, [router, supabase]);

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <Paper
                elevation={3}
                sx={{
                    width: "100%",
                    maxWidth: 480,
                    borderRadius: 4,
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        p: { xs: 3, sm: 5 },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 200,
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                        sx={{ textAlign: "center", letterSpacing: "-0.5px" }}
                    >
                        Almost there!
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{ textAlign: "center", mb: 2 }}
                    >
                        Signing you in!
                    </Typography>

                    <CircularProgress color="primary" />
                </Box>
            </Paper>
        </main>
    );
}
