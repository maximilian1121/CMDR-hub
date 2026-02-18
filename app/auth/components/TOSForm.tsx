"use client";

import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Link,
    Typography,
} from "@mui/material";
import { useState } from "react";

type TOSFormProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function TOSForm({ open, onClose, onConfirm }: TOSFormProps) {
    const [hasAgreed, setHasAgreed] = useState(false);

    const handleConfirm = () => {
        if (hasAgreed) {
            onConfirm();
            setHasAgreed(false); // Reset state for next time it opens
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Review our Privacy Policy and Terms of Service
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={hasAgreed}
                                onChange={(e) => setHasAgreed(e.target.checked)}
                                color="primary"
                            />
                        }
                        label={
                            <span>
                                I have read and agree to the{" "}
                                <Link
                                    href="/legal"
                                    target="_blank"
                                    rel="noopener"
                                    underline="hover"
                                >
                                    Terms of Service and Privacy Policy
                                </Link>
                                .
                            </span>
                        }
                    />
                    <Typography>
                        Breach of TOS can result in a suspension or permanent
                        ban of your account.
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleConfirm} disabled={!hasAgreed}>
                    Agree & Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
}
