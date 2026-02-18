"use client";
import { Box, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/system";
import { Suspense } from "react";

const CurrentYear = () => {
    return <span>{new Date().getFullYear()}</span>;
};

const Footer = () => {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

    return (
        <Box
            component="footer"
            sx={{
                mt: "auto",
                py: 3,
                px: 2,
                backgroundColor: (theme) => {
                    if (prefersDarkMode) {
                        return theme.darken(
                            theme.palette.background.default,
                            0.9,
                        );
                    } else {
                        return theme.darken(
                            theme.palette.background.default,
                            0.1,
                        );
                    }
                },
                textAlign: "center",
            }}
        >
            <Typography variant="body2" color="textSecondary">
                ©{" "}
                {
                    <Suspense fallback="...">
                        <CurrentYear />
                    </Suspense>
                }{" "}
                Maximilian. This site is an independent project and is not
                affiliated with or endorsed by CMDR or Eryn L. K. All CMDR
                content remains the property of their respective creators.
            </Typography>
        </Box>
    );
};

export default Footer;
