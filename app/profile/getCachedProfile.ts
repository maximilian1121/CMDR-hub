import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";
import { Session } from "@supabase/supabase-js";

const CACHE_DURATION = 8 * 60 * 1000;
const supabase = createClient();

/**
 * Fetches a user's profile with 8-minute sessionStorage caching.
 * @param session Supabase session object
 * @returns Profile data or null
 */
export async function getCachedProfile(
    session: Session | null,
): Promise<Profile | null> {
    if (!session) return null;

    const userId = session.user.id;
    const now = Date.now();

    const cached = sessionStorage.getItem(`profile-${userId}`);
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (now - parsed.timestamp < CACHE_DURATION) {
                return parsed.data;
            }
        } catch {}
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error || !data) return null;

    sessionStorage.setItem(
        `profile-${userId}`,
        JSON.stringify({ data, timestamp: now }),
    );

    return data;
}

/**
 * Purges all cached profiles from sessionStorage
 */
export function purgeAllProfileCache(): void {
    try {
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith("profile-")) {
                sessionStorage.removeItem(key);
            }
        }
    } catch (err) {
        console.warn("Failed to purge all profile caches:", err);
    }
}
