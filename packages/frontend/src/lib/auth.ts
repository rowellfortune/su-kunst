import { Auth } from "aws-amplify";

export async function handleLogout(userHasAuthenticated: (auth: boolean) => void, navigate: any) {
  try {
    await Auth.signOut();
    userHasAuthenticated(false);
    sessionStorage.clear(); // Clear any stored session data
    localStorage.clear(); // Ensure all stored tokens are removed
    navigate("/login"); // Default redirect after logout
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
