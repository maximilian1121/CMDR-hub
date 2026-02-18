export type Profile = {
    id: string;
    username: string | null;
    avatar_url: string | null;
    verified: boolean;
    admin: boolean;
};

export type ProjectType = "command" | "type" | "hook";
export type ProjectVisibility = "private" | "unlisted" | "public";

export type Project = {
    id: number;
    created_by: string;
    created_at: string;
    updated_at: string;
    visibility: ProjectVisibility;
    project_name: string;
    type: ProjectType[];
    command_shared: string;
    command_server: string;
    hook_content: string;
    type_content: string;
    under_review: boolean;
};

export type LikeRow = {
    user_id: string;
    project_id: string;
    created_at: string;
};
