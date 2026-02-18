"use client";

import { Box } from "@mui/material";
import Confetti from "react-confetti"; // Yes I installed a whole ass library for this.
import { useWindowSize } from "react-use";

export default function ConfettiWrapper() {
    const { width, height } = useWindowSize();

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 9999,
            }}
        >
            <Confetti
                width={width}
                height={height}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                }}
            />
        </Box>
    );
}
