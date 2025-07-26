// src/server/actions/login.ts
"use server";

import { LoginSchema } from "@/types/login-schema";
import { actionClient } from "@/lib/safe-action";
import bcrypt from "bcrypt";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { signIn } from "../auth";

export const LoginAccount = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !user.password) {
      return { error: "Invalid email or password" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: "Invalid email or password" };
    }

    // Sign in and get the callback URL
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent immediate redirect
    });

    if (result?.error) {
      return { error: result.error };
    }

    // Use a client-side redirect after session update
    return { success: true, redirect: "/dashboard" };
  });
