import { createClient } from "@/lib/supabase/server";
import { LikeRow, Profile as ProfileData, Project } from "@/lib/types";
import {
    HandymanRounded,
    StarRounded,
    TerminalRounded,
    VerifiedRounded,
} from "@mui/icons-material";
import {
    Box,
    Grid,
    Paper,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { blue, orange, yellow } from "@mui/material/colors";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Avatar from "../Avatar";

type ProfileCardProps = {
    userData: ProfileData;
    userProjects?: Project[];
    starred?: LikeRow[];
};

function ProfileCard({ userData }: ProfileCardProps) {
    return (
        <Grid>
            <Paper elevation={2} className="p-6 w-fit mx-auto sm:mx-0">
                <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar
                        size={128}
                        url={userData.avatar_url}
                        seed={userData.username}
                    />
                    <Box>
                        <Typography
                            variant="h4"
                            component="h1"
                            fontWeight="800"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            {userData.username}
                            {userData.verified && (
                                <Tooltip title="This user is verified!">
                                    <VerifiedRounded
                                        sx={{
                                            color: blue[500],
                                            fontSize: "inherit",
                                        }}
                                    />
                                </Tooltip>
                            )}
                            {userData.admin && (
                                <Tooltip title="This user is an admin!">
                                    <HandymanRounded
                                        sx={{
                                            color: orange[500],
                                            fontSize: "inherit",
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            User ID: {userData.id.slice(0, 8)}...
                        </Typography>
                    </Box>
                </Stack>
            </Paper>
        </Grid>
    );
}

function ProfileStats({ userProjects, starred }: ProfileCardProps) {
    return (
        <Grid>
            <Paper elevation={2} className="p-6 w-fit mx-auto sm:mx-0">
                <Typography>
                    Projects: {userProjects?.length}{" "}
                    <TerminalRounded
                        sx={{
                            color: blue[500],
                        }}
                    />
                </Typography>
                <Typography>
                    Starred projects: {starred?.length}{" "}
                    <StarRounded
                        sx={{
                            color: yellow[800],
                        }}
                    />
                </Typography>
            </Paper>
        </Grid>
    );
}

async function ProfileContent({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] };
}) {
    const supabase = await createClient();
    const params = await searchParams;
    const uidSearchParam = typeof params?.uid === "string" ? params.uid : null;

    const {
        data: { user },
    } = await supabase.auth.getUser();
    const targetUid = uidSearchParam ?? user?.id;

    if (!targetUid) notFound();

    const { data: userData, error: dbError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", targetUid)
        .single();

    if (dbError || !userData) {
        notFound();
    }

    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("created_by", targetUid);

    const { data: starred } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", targetUid);

    return (
        <>
            <ProfileCard userData={userData} />
            <ProfileStats
                userData={userData}
                userProjects={projects ?? []}
                starred={starred ?? []}
            />
        </>
    );
}

function ProfileSkeleton() {
    return (
        <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid>
                <Paper elevation={2} className="p-6 w-fit mx-auto sm:mx-0">
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Skeleton variant="circular" width={128} height={128} />
                        <Box>
                            <Skeleton variant="text" width={150} height={40} />
                            <Skeleton variant="text" width={100} height={20} />
                        </Box>
                    </Stack>
                </Paper>
            </Grid>
            <Grid>
                <Paper
                    elevation={2}
                    className="p-6 w-[100px] h-[72px] mx-auto sm:mx-0"
                ></Paper>
            </Grid>
        </Grid>
    );
}

export default async function ProfileWrapper({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] };
}) {
    return (
        <main className="min-h-screen max-w-6xl mx-auto mt-8 px-4">
            <Suspense fallback={<ProfileSkeleton />}>
                <Grid container rowSpacing={2} columnSpacing={2}>
                    <ProfileContent searchParams={searchParams} />
                </Grid>
            </Suspense>
        </main>
    );
}
