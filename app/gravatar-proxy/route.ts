// app/api/gravatar/route.ts
import { NextRequest } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
        return new Response("Missing email query param", { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const hash = crypto.createHash("md5").update(normalizedEmail).digest("hex");

    const gravatarUrl = `https://www.gravatar.com/avatar/${hash}`;

    return new Response(null, {
        status: 301,
        headers: {
            Location: gravatarUrl,
        },
    });
}
