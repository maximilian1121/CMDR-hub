"use server";

import { createClient } from "@/lib/supabase/server";
import { PeopleRounded, SearchRounded, Timer } from "@mui/icons-material";
import {
    Box,
    Button,
    ButtonGroup,
    Divider,
    Paper,
    Typography,
} from "@mui/material";
import Image from "next/image";
import { Suspense } from "react";
import Navbar from "./navbar";

async function CallToActionButtons() {
    const supabase = await createClient();

    const claims = await supabase.auth.getClaims();
    const validSession = claims.data && !claims.error;

    return (
        <ButtonGroup>
            {!validSession ? (
                <Button href="/auth" variant="contained" color="primary">
                    Sign in / Sign up
                </Button>
            ) : (
                <Button href="/upload" variant="contained" color="primary">
                    Upload new command
                </Button>
            )}

            <Button href="/commands" variant="outlined" color="primary">
                Browse commands
            </Button>
        </ButtonGroup>
    );
}

async function Home() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen max-w-6xl mx-auto mt-4 flex flex-col gap-6 items-center px-4">
                <Box className="w-fit flex flex-col gap-2 items-center">
                    <Image
                        alt="Logo"
                        src="/cmdr-hub-banner.svg"
                        width={512}
                        height={512}
                        draggable={false}
                        className="select-none"
                        style={{ objectFit: "contain" }}
                    />
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        textAlign="center"
                    >
                        A.k.a CMDR Hub
                    </Typography>
                    <Typography variant="h6" textAlign="center">
                        Your one-stop playground for CMDR commands, hooks, and
                        types!
                    </Typography>
                </Box>

                <Divider className="w-full" />

                <Typography variant="h6" fontWeight="medium">
                    Ready to stop writing commands manually?
                </Typography>

                <Suspense>
                    <CallToActionButtons />
                </Suspense>

                <Divider className="w-full" />

                <Box className="flex flex-col gap-4 w-full">
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        textAlign="center"
                    >
                        Why CMDR Hub?
                    </Typography>

                    <Box className="flex flex-col md:flex-row gap-4 justify-center items-stretch">
                        <Paper className="p-4 flex-1" elevation={3}>
                            <Typography variant="h6" fontWeight="bold">
                                <SearchRounded /> Browse Freely
                            </Typography>
                            <Typography>
                                Explore commands, hooks, and types uploaded by
                                the community - all for free no account
                                required!
                            </Typography>
                        </Paper>
                        <Paper className="p-4 flex-1" elevation={3}>
                            <Typography variant="h6" fontWeight="bold">
                                <PeopleRounded /> Contribute
                            </Typography>
                            <Typography>
                                Logged-in users can upload their own CMDR
                                scripts and share them with other developers.
                            </Typography>
                        </Paper>
                        <Paper className="p-4 flex-1" elevation={3}>
                            <Typography variant="h6" fontWeight="bold">
                                <Timer /> Save Time
                            </Typography>
                            <Typography>
                                Stop re-scripting the same fly command! Use an
                                already made one by the community!
                            </Typography>
                        </Paper>
                    </Box>
                </Box>

                <Divider className="w-full" />

                <Typography variant="h6" textAlign="center">
                    Whether you&apos;re a scripting rookie or a seasoned dev,
                    CMDR Hub makes scripting CMDR commands easier, because you
                    don&apos;t need to script them!
                </Typography>
            </main>
        </>
    );
}

export default async function HomeWrapper() {
    return <Home />;
}
