import { Box, Paper, Typography } from "@mui/material";
import Navbar from "./navbar";
import Image from "next/image";

export default async function NotFound() {
    return (
        <>
            <Navbar />
            <Box className="max-w-6xl mx-auto min-h-screen flex justify-center items-center">
                <Paper className="p-6 w-fit flex flex-col gap-4">
                    <Typography variant="h4" fontWeight="BOLD">
                        404 - Not found
                    </Typography>
                    <Typography variant="body1">
                        We really tried to find it, but we just couldn&apos;t!?!
                    </Typography>
                    <Box className="w-full flex justify-between">
                        <Image
                            alt="Logo"
                            src="/cmdr-hub-banner.svg"
                            width={200}
                            height={50}
                            draggable={false}
                            className="select-none"
                            style={{ objectFit: "contain" }}
                        />
                        <Image
                            alt="Lost gubby"
                            src="/gubbylost.svg"
                            width={64}
                            height={64}
                            draggable={false}
                            className="select-none"
                            style={{ objectFit: "contain" }}
                        />
                    </Box>
                </Paper>
            </Box>
        </>
    );
}
