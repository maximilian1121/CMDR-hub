"use client";

import { Box, Divider, Paper, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "register">("login");

    return (
        <main className="min-h-screen flex items-center justify-center p-4 ">
            <Paper
                elevation={3}
                sx={{
                    display: "flex",
                    width: "100%",
                    maxWidth: 900,
                    overflow: "hidden",
                    borderRadius: 3,
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        width: "100%",
                    }}
                >
                    <Tabs
                        value={mode === "login" ? 0 : 1}
                        onChange={(e, n) => {
                            setMode(n === 0 ? "login" : "register");
                        }}
                        variant="fullWidth"
                        sx={{ width: "100%" }}
                        aria-label="auth tabs"
                    >
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>
                </Box>

                <Divider flexItem />

                {mode === "login" ? <LoginForm /> : <RegisterForm />}
            </Paper>
        </main>
    );
}
