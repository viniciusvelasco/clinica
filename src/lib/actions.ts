"use server";

import { signOut as nextAuthSignOut } from "@/lib/auth";

export async function handleSignOut() {
  await nextAuthSignOut({ redirectTo: "/login" });
} 