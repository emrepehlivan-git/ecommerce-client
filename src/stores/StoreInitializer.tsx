"use client";

import React from "react";
import { Session } from "next-auth";
import { useAppStore, useInitializeCart } from "./useAppStore";

export const StoreInitializer = ({ session }: { session: Session | null }) => {
    const fetchUserInfo = useAppStore((state) => state.fetchUserInfo);
    useInitializeCart(session);

    React.useEffect(() => {
        fetchUserInfo(session);
    }, [session, fetchUserInfo]);

    return null;
} 