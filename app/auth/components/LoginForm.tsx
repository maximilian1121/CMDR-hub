"use client";

import { createClient } from "@/lib/supabase/client";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import {
    Box,
    Button,
    Divider,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiDiscord } from "react-icons/si";
import TOSForm from "./TOSForm"; // Adjust the import path as needed

type LoginFormProps = {
    showDiscord?: boolean;
};

export default function LoginForm({ showDiscord }: LoginFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Dialog State
    const [openTos, setOpenTos] = useState(false);

    const router = useRouter();

    const handleLogIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const supabase = createClient();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            router.push("/profile");
        } catch (error: unknown) {
            setError(
                error instanceof Error ? error.message : "An error occurred",
            );
        } finally {
            setIsLoading(false);
        }
    };

    // This runs AFTER the user clicks "Agree" in the TOSForm
    const handleDiscordAuth = async () => {
        setOpenTos(false);
        setIsLoading(true);
        try {
            const supabase = createClient();
            await supabase.auth.signInWithOAuth({
                provider: "discord",
                options: { redirectTo: `${window.location.origin}/auth/oauth` },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Reusable TOS Modal */}
            <TOSForm
                open={openTos}
                onClose={() => setOpenTos(false)}
                onConfirm={handleDiscordAuth}
            />

            <Box sx={{ p: 6, flex: 1 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Log In
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Please enter your details to sign in.
                </Typography>

                <form onSubmit={handleLogIn}>
                    <Stack spacing={2}>
                        <TextField
                            label="Email"
                            name="email"
                            fullWidth
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <VisibilityOffRounded />
                                            ) : (
                                                <VisibilityRounded />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {error && (
                            <Typography color="error">{error}</Typography>
                        )}
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{ mt: 1 }}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading" : "Log in"}
                        </Button>

                        {(showDiscord || showDiscord === undefined) && (
                            <>
                                <Divider sx={{ my: 1 }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        OR
                                    </Typography>
                                </Divider>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    startIcon={
                                        <span style={{ fontSize: "1.2rem" }}>
                                            <SiDiscord />
                                        </span>
                                    }
                                    sx={{
                                        backgroundColor: "#5865F2",
                                        color: "white",
                                        textTransform: "none",
                                        fontWeight: "bold",
                                        "&:hover": {
                                            backgroundColor: "#4752C4",
                                        },
                                    }}
                                    onClick={() => setOpenTos(true)}
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? "Loading"
                                        : "Continue with Discord"}
                                </Button>
                            </>
                        )}
                    </Stack>
                </form>
            </Box>
        </>
    );
}
