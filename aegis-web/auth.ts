
import NextAuth from "next-auth";
import type { OAuthConfig } from "next-auth/providers";

const tidecloak: OAuthConfig<Record<string, unknown>> = {
  id: "tidecloak",
  name: "TideCloak",
  type: "oidc",
  issuer: "http://localhost:8081/realms/aegis-ai",
  clientId: "aegis-web",
  client: {
    token_endpoint_auth_method: "none",
  },
  checks: ["pkce", "state"],
  profile(profile) {
    return {
      id: String(profile.sub),
      name: typeof profile.name === "string" ? profile.name : null,
      email: typeof profile.email === "string" ? profile.email : null,
    };
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [tidecloak],
  session: {
    strategy: "jwt",
  },
});
