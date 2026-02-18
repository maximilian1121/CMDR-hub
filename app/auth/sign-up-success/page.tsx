import { Paper, Typography, Box, Divider } from "@mui/material";
import ConfettiWrapper from "./confetti";

export default function AuthPage() {
    return (
        <>
            <ConfettiWrapper />
            <main className="min-h-screen flex items-center justify-center p-6">
                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
                        maxWidth: 800,
                        borderRadius: 4,
                        overflow: "hidden",
                        display: "flex",
                    }}
                >
                    <Box
                        sx={{
                            p: { xs: 3, sm: 5 },
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                        }}
                        className="max-w-1/2 w-1/2"
                    >
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            gutterBottom
                            sx={{ letterSpacing: "-0.5px" }}
                        >
                            Almost there!
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.primary.contrastText"
                            sx={{ mb: 4 }}
                        >
                            Check your inbox for the email we sent you to finish
                            the account creation process!
                        </Typography>
                    </Box>
                    <Divider orientation="vertical" />
                    <Box
                        sx={{
                            p: { xs: 3, sm: 5 },
                        }}
                        className="max-w-1/2 w-1/2"
                    >
                        <Typography variant="body1" className="p-4 h-[300px]">
                            Tip: Check spam the email should be sent from
                            cmdr-hub@latific.click
                        </Typography>
                    </Box>
                </Paper>
            </main>
        </>
    );
}
