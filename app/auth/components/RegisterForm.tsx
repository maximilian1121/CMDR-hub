"use client";

import { createClient } from "@/lib/supabase/client";
import { VisibilityRounded, VisibilityOffRounded } from "@mui/icons-material";
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
import { useEffect, useState } from "react";
import { SiDiscord } from "react-icons/si";
import TOSForm from "./TOSForm";

export default function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [openTos, setOpenTos] = useState(false);
    const [pendingAction, setPendingAction] = useState<
        "email" | "discord" | null
    >(null);

    const router = useRouter();

    useEffect(() => {
        if (password !== repeatPassword && repeatPassword !== "") {
            setError("Passwords do not match");
        } else {
            setError(null);
        }
    }, [password, repeatPassword]);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            setError("Passwords do not match");
            return;
        }

        setPendingAction("email");
        setOpenTos(true);
    };

    const handleConfirmTos = async () => {
        const supabase = createClient();

        setOpenTos(false);
        setIsLoading(true);
        setError(null);

        try {
            if (pendingAction === "email") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/profile`,
                        data: {
                            tosAccepted: true,
                            tosAcceptedAt: new Date().toISOString(),
                            tosVersion: "1.0",
                        },
                    },
                });

                if (error) throw error;

                router.push("/auth/sign-up-success");
            }

            if (pendingAction === "discord") {
                await supabase.auth.signInWithOAuth({
                    provider: "discord",
                    options: {
                        redirectTo: `${window.location.origin}/auth/oauth`,
                        queryParams: {
                            tosAccepted: "true",
                        },
                    },
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsLoading(false);
            setPendingAction(null);
        }
    };

    return (
        <>
            <TOSForm
                open={openTos}
                onClose={() => {
                    setOpenTos(false);
                    setPendingAction(null);
                }}
                onConfirm={handleConfirmTos}
            />

            <Box sx={{ p: 6, flex: 1 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Hello new user!
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Please enter your details to sign-up!
                </Typography>

                <form onSubmit={handleEmailSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Email"
                            name="email"
                            fullWidth
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            inputProps={{ autoComplete: "new-password" }}
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            required
                            value={password}
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

                        <TextField
                            label="Confirm password"
                            type="password"
                            fullWidth
                            required
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />

                        {error && (
                            <Typography color="error">{error}</Typography>
                        )}

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Create account"}
                        </Button>

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
                            startIcon={<SiDiscord />}
                            sx={{
                                backgroundColor: "#5865F2",
                                color: "white",
                                textTransform: "none",
                                fontWeight: "bold",
                                "&:hover": { backgroundColor: "#4752C4" },
                            }}
                            onClick={() => {
                                setPendingAction("discord");
                                setOpenTos(true);
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Continue with Discord"}
                        </Button>
                    </Stack>
                </form>
            </Box>
        </>
    );
}
