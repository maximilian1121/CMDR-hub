"use client";

import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { glass } from "@dicebear/collection";
import Image from "next/image";

export default function Avatar({
    url,
    seed,
    size,
}: {
    url: string | null;
    seed: string | null;
    size: number;
}) {
    const avatarUri = useMemo(() => {
        const avatar = createAvatar(glass, {
            seed: seed ?? "default",
            size: size,
        });
        return avatar.toDataUri();
    }, [seed, size]);

    if (url) {
        return (
            <Image
                className="rounded-full"
                width={size}
                height={size}
                src={url}
                alt="Avatar"
                draggable={false}
            />
        );
    } else {
        return (
            <Image
                className="rounded-full"
                width={size}
                height={size}
                src={avatarUri}
                unoptimized
                alt="Avatar"
                draggable={false}
            />
        );
    }
}
