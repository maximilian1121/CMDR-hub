import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: "class",
    },
    shape: {
        borderRadius: 8,
    },
    colorSchemes: {
        light: false,
        dark: true,
    },
    palette: {
        mode: "dark",
        primary: {
            main: "#ffffff",
        },
        secondary: {
            main: "#cccccc",
        },
    },
    components: {
        MuiLink: {
            styleOverrides: {
                root: {
                    color: "#4287f5",
                    textDecoration: "none",
                    "&:hover": {
                        color: "#4287f5",
                    },
                    "&.footerLink": {
                        color: "#3ee600",
                    },
                },
            },
        },
    },
});

export default theme;
