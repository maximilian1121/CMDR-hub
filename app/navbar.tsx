/* eslint-disable @next/next/no-img-element */
"use client";

import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";
import {
    AccountCircleRounded,
    HomeRounded,
    ListRounded,
    LoginRounded,
    LogoutRounded,
    PhishingRounded,
    SettingsRounded,
    TerminalRounded,
    UploadRounded,
} from "@mui/icons-material";
import {
    AppBar,
    Box,
    Button,
    ButtonBase,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import { useMediaQuery } from "@mui/system";
import { Session } from "@supabase/supabase-js";
import Image from "next/image";
import { default as NextLink } from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import {
    getCachedProfile,
    purgeAllProfileCache,
} from "./profile/getCachedProfile";
import theme from "./theme";

export default function Navbar() {
    // Rely on the client to know about itself
    const supabase = createClient();
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [userMenuAnchor, setUserMenuAnchor] =
        useState<HTMLButtonElement | null>(null);
    const isUserMenuOpen = Boolean(userMenuAnchor);

    const [logoutDialog, setLogoutDialog] = useState<boolean>(false);
    const [session, setSession] = useState<Session | null>(null);
    const [profileData, setProfileData] = useState<Profile | null>(null);

    const updateSession = async (newSession: Session | null) => {
        setSession(newSession ?? null);

        if (!newSession) {
            setProfileData(null);
            return;
        }

        const profile = await getCachedProfile(newSession);
        setProfileData(profile);
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            updateSession(session);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                updateSession(newSession);
            },
        );

        return () => listener.subscription.unsubscribe();
    }, []);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogoutClose = () => {
        setLogoutDialog(false);
    };

    const handleLogOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            purgeAllProfileCache();
            router.push("/");
        } else {
            console.error("Logout failed:", error.message);
        }
    };

    const shouldUseSmallIcon = useMediaQuery(theme.breakpoints.down("lg"));
    const shouldCollapseButtons = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <>
            <AppBar position="sticky">
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mx: shouldUseSmallIcon ? 2 : 16,
                        gap: theme.spacing(2),
                    }}
                >
                    <Tooltip title="Go to homepage">
                        <ButtonBase
                            sx={{
                                borderRadius: `${theme.shape.borderRadius}px`,
                            }}
                            href="/"
                            component={NextLink}
                        >
                            {shouldUseSmallIcon && !shouldCollapseButtons ? (
                                <Image
                                    alt="Logo"
                                    src="/cmdr-hub-logo.svg"
                                    width={50}
                                    height={50}
                                    draggable={false}
                                    className="select-none"
                                    style={{ objectFit: "contain" }}
                                />
                            ) : (
                                <Image
                                    alt="Logo"
                                    src="/cmdr-hub-banner.svg"
                                    width={200}
                                    height={50}
                                    draggable={false}
                                    className="select-none"
                                    style={{ objectFit: "contain" }}
                                />
                            )}
                        </ButtonBase>
                    </Tooltip>
                    {!shouldCollapseButtons ? (
                        <Box className="flex gap-2">
                            {/* Regular Buttons */}
                            <Button
                                startIcon={<HomeRounded />}
                                href="/"
                                component={NextLink}
                            >
                                Home
                            </Button>
                            <Button
                                startIcon={<TerminalRounded />}
                                href="/projects"
                                component={NextLink}
                            >
                                Projects
                            </Button>
                            {session ? (
                                <Button
                                    startIcon={<UploadRounded />}
                                    href="/upload"
                                    component={NextLink}
                                >
                                    Upload
                                </Button>
                            ) : (
                                <Button
                                    startIcon={<UploadRounded />}
                                    href="/auth"
                                    component={NextLink}
                                >
                                    Upload
                                </Button>
                            )}

                            {/* User Profile Button */}
                            <Button
                                onClick={(e) =>
                                    setUserMenuAnchor(e.currentTarget)
                                }
                                sx={{
                                    minWidth: 0,
                                    p: 1,
                                    textTransform: "none",
                                }}
                                endIcon={
                                    session && profileData ? (
                                        <Avatar
                                            size={32}
                                            url={profileData.avatar_url}
                                            seed={profileData.username}
                                        />
                                    ) : (
                                        <AccountCircleRounded />
                                    )
                                }
                            >
                                {profileData
                                    ? profileData.username
                                    : "Not logged in"}
                            </Button>
                        </Box>
                    ) : (
                        <Box className="flex gap-1">
                            <IconButton
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                                sx={{ minWidth: 0, p: 1 }}
                            >
                                <ListRounded />
                            </IconButton>

                            <IconButton
                                onClick={(e) =>
                                    setUserMenuAnchor(e.currentTarget)
                                }
                                sx={{ minWidth: 0, p: 1 }}
                            >
                                {session && profileData ? (
                                    <Avatar
                                        size={32}
                                        url={profileData.avatar_url}
                                        seed={profileData.username}
                                    />
                                ) : (
                                    <AccountCircleRounded />
                                )}
                            </IconButton>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem component={NextLink} href="/">
                    Home
                </MenuItem>
                <MenuItem component={NextLink} href="/projects">
                    Projects
                </MenuItem>
                {session && (
                    <MenuItem component={NextLink} href="/upload">
                        Upload
                    </MenuItem>
                )}
            </Menu>
            <Menu
                anchorEl={userMenuAnchor}
                open={isUserMenuOpen}
                onClose={() => setUserMenuAnchor(null)}
            >
                {session
                    ? [
                          <Typography
                              key="user-name"
                              sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  px: 2,
                                  py: 1,
                              }}
                          >
                              {session && profileData ? (
                                  <Avatar
                                      size={32}
                                      url={profileData.avatar_url}
                                      seed={profileData.username}
                                  />
                              ) : (
                                  <AccountCircleRounded />
                              )}
                              {profileData
                                  ? profileData.username
                                  : "Not logged in"}
                          </Typography>,

                          <MenuItem
                              key="profile"
                              component={NextLink}
                              href="/profile"
                              onClick={() => handleMenuClose}
                          >
                              <AccountCircleRounded sx={{ mr: 1 }} />
                              Profile
                          </MenuItem>,

                          <MenuItem
                              key="settings"
                              component={NextLink}
                              href="/profile/account"
                              onClick={() => handleMenuClose}
                          >
                              <SettingsRounded sx={{ mr: 1 }} />
                              Settings
                          </MenuItem>,

                          <MenuItem
                              key="logout"
                              onClick={() => {
                                  handleMenuClose();
                                  setLogoutDialog(true);
                              }}
                          >
                              <LogoutRounded sx={{ mr: 1 }} />
                              Logout
                          </MenuItem>,
                      ]
                    : [
                          <MenuItem
                              key="login"
                              onClick={() => router.push("/auth")}
                          >
                              <LoginRounded sx={{ mr: 1 }} />
                              Log in
                          </MenuItem>,
                      ]}
            </Menu>

            <Dialog
                open={logoutDialog}
                onClose={handleLogoutClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="logout-dialog-title">Log Out</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to log out of your account?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogoutClose}>Cancel</Button>
                    <Button
                        onClick={() => {
                            handleLogOut();
                        }}
                        color="error"
                        autoFocus
                    >
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
