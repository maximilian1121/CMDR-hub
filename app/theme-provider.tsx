"use client";

import { ReactNode } from "react";
import {
    ThemeProvider,
    CssBaseline,
    InitColorSchemeScript,
} from "@mui/material";
import theme from "./theme";

interface AppThemeProviderProps {
    children: ReactNode;
}

export default function AppThemeProvider({ children }: AppThemeProviderProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <InitColorSchemeScript attribute="class" />
            {children}
        </ThemeProvider>
    );
}
