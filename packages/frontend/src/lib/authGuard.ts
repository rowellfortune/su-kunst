// src/lib/authGuard.ts
import { Auth } from "aws-amplify";

/**
 * Ensure the current user is authenticated.
 * Throws if not authenticated. Call this inside API functions or hooks.
 */
export async function ensureAuth() {
  // If this throws, caller should catch and handle gracefully
  await Auth.currentAuthenticatedUser();
}
