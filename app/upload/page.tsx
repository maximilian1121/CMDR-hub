"use client";

import { createClient } from "@/lib/supabase/client";
import {
    Box,
    Paper,
    Tab,
    Tabs,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel,
    FormGroup,
    ButtonGroup,
    Button,
    Alert,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import Navbar from "../navbar";
import Editor from "@monaco-editor/react";

export default function Upload() {
    const supabase = createClient();

    // Form State
    const [projectName, setProjectName] = useState<string>("");
    const [activeTab, setActiveTab] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // File Inclusion State
    const [includeCommand, setIncludeCommand] = useState(true);
    const [includeHook, setIncludeHook] = useState(false);
    const [includeType, setIncludeType] = useState(false);

    // Editor Content State
    const [fileContents, setFileContents] = useState<Record<string, string>>({
        commandShared: "-- Shared command module\n",
        commandServer: "-- Server-side logic\n",
        hook: "-- Hook logic\n",
        type: "-- Custom type definitions\n",
    });

    const activeFiles = useMemo(() => {
        const safeName = projectName || "unnamed";
        const files = [];

        if (includeCommand) {
            files.push({ id: "commandShared", name: `${safeName}.lua` });
            files.push({ id: "commandServer", name: `${safeName}Server.lua` });
        }
        if (includeHook) {
            files.push({ id: "hook", name: `${safeName}Hook.lua` });
        }
        if (includeType) {
            files.push({ id: "type", name: `${safeName}Type.lua` });
        }

        return files;
    }, [projectName, includeCommand, includeHook, includeType]);

    useEffect(() => {
        if (activeTab >= activeFiles.length) {
            setActiveTab(0);
        }
    }, [activeFiles, activeTab]);

    const handleEditorChange = (value: string | undefined) => {
        if (!activeFiles[activeTab]) return;
        const currentFileId = activeFiles[activeTab].id;
        setFileContents((prev) => ({
            ...prev,
            [currentFileId]: value || "",
        }));
    };

    const handleSubmit = async () => {
        setError(null);

        if (projectName.length < 8 || projectName.length > 32) {
            setError("Project name must be between 8 and 32 characters.");
            return;
        }

        const selectedTypes = [];
        if (includeCommand) selectedTypes.push("command");
        if (includeHook) selectedTypes.push("hook");
        if (includeType) selectedTypes.push("type");

        if (selectedTypes.length === 0) {
            setError("Please select at least one file type to upload.");
            return;
        }

        setIsSubmitting(true);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            const { error: dbError } = await supabase
                .from("projects")
                .insert([
                    {
                        project_name: projectName,
                        type: selectedTypes,
                        created_by: user?.id,
                        command_shared: includeCommand
                            ? fileContents.commandShared
                            : null,
                        command_server: includeCommand
                            ? fileContents.commandServer
                            : null,
                        hook_content: includeHook ? fileContents.hook : null,
                        type_content: includeType ? fileContents.type : null,
                    },
                ])
                .select()
                .single();

            if (dbError) throw dbError;
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <Box
                component="main"
                className="max-w-6xl my-4 mx-auto min-h-screen flex flex-col gap-4 px-4"
            >
                <Typography variant="h4" fontWeight="bold" textAlign="center">
                    Upload your creation!
                </Typography>

                {error && (
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Paper elevation={2} className="p-4 flex flex-col gap-4">
                    <Typography variant="h6">Project Settings</Typography>
                    <TextField
                        fullWidth
                        label="Project Name"
                        value={projectName}
                        inputProps={{ maxLength: 32 }}
                        onChange={(e) => {
                            const val = e.target.value.replace(
                                /[^-A-Za-z0-9_]/g,
                                "",
                            );
                            setProjectName(val);
                        }}
                        error={projectName.length > 0 && projectName.length < 8}
                        helperText={`${projectName.length}/32 (Min 8 characters, alphanumeric/underscores only)`}
                    />

                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeCommand}
                                    onChange={(e) =>
                                        setIncludeCommand(e.target.checked)
                                    }
                                />
                            }
                            label="Command"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeHook}
                                    onChange={(e) =>
                                        setIncludeHook(e.target.checked)
                                    }
                                />
                            }
                            label="Hook"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeType}
                                    onChange={(e) =>
                                        setIncludeType(e.target.checked)
                                    }
                                />
                            }
                            label="Type"
                        />
                    </FormGroup>
                </Paper>

                <Paper elevation={2} className="flex flex-col overflow-hidden">
                    {activeFiles.length > 0 ? (
                        <>
                            <Box
                                sx={{ borderBottom: 1, borderColor: "divider" }}
                            >
                                <Tabs
                                    value={activeTab}
                                    onChange={(_, val) => setActiveTab(val)}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                >
                                    {activeFiles.map((file) => (
                                        <Tab
                                            key={file.id}
                                            label={file.name}
                                            sx={{ textTransform: "none" }}
                                        />
                                    ))}
                                </Tabs>
                            </Box>
                            <Editor
                                height="60vh"
                                theme="vs-dark"
                                language="lua"
                                path={activeFiles[activeTab]?.id}
                                value={fileContents[activeFiles[activeTab]?.id]}
                                onChange={handleEditorChange}
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                }}
                            />
                        </>
                    ) : (
                        <Box className="h-40 flex items-center justify-center">
                            <Typography color="textSecondary">
                                Select at least one file type to start coding.
                            </Typography>
                        </Box>
                    )}
                </Paper>

                <Paper elevation={2} className="p-4 flex flex-col gap-4">
                    <ButtonGroup fullWidth>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Uploading..." : "Submit Project"}
                        </Button>
                    </ButtonGroup>
                </Paper>
            </Box>
        </>
    );
}
