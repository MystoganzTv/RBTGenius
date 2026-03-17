import crypto from "node:crypto";

const OAUTH_PROVIDERS = {
  google: {
    id: "google",
    label: "Google",
    authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scopes: ["openid", "email", "profile"],
    clientIdEnv: "GOOGLE_CLIENT_ID",
    clientSecretEnv: "GOOGLE_CLIENT_SECRET",
    extraAuthParams: {
      access_type: "offline",
      prompt: "consent",
    },
    async getProfile(accessToken) {
      const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load Google profile");
      }

      const profile = await response.json();
      return {
        id: profile.sub,
        email: profile.email,
        name: profile.name || profile.email,
        avatar_url: profile.picture || null,
      };
    },
  },
  github: {
    id: "github",
    label: "GitHub",
    authorizationUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    scopes: ["read:user", "user:email"],
    clientIdEnv: "GITHUB_CLIENT_ID",
    clientSecretEnv: "GITHUB_CLIENT_SECRET",
    async getProfile(accessToken) {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "RBT-Genius",
      };

      const userResponse = await fetch("https://api.github.com/user", { headers });
      if (!userResponse.ok) {
        throw new Error("Unable to load GitHub profile");
      }

      const user = await userResponse.json();

      const emailsResponse = await fetch("https://api.github.com/user/emails", { headers });
      const emails = emailsResponse.ok ? await emailsResponse.json() : [];
      const primaryEmail =
        emails.find((entry) => entry.primary && entry.verified)?.email ||
        emails.find((entry) => entry.verified)?.email ||
        user.email ||
        null;

      return {
        id: String(user.id),
        email: primaryEmail,
        name: user.name || user.login || primaryEmail,
        avatar_url: user.avatar_url || null,
      };
    },
  },
  microsoft: {
    id: "microsoft",
    label: "Microsoft",
    scopes: ["openid", "profile", "email", "User.Read"],
    clientIdEnv: "MICROSOFT_CLIENT_ID",
    clientSecretEnv: "MICROSOFT_CLIENT_SECRET",
    getAuthorizationUrl(env) {
      const tenant = env.MICROSOFT_TENANT_ID || "common";
      return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`;
    },
    getTokenUrl(env) {
      const tenant = env.MICROSOFT_TENANT_ID || "common";
      return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
    },
    async getProfile(accessToken) {
      const response = await fetch(
        "https://graph.microsoft.com/v1.0/me?$select=id,displayName,mail,userPrincipalName",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unable to load Microsoft profile");
      }

      const profile = await response.json();
      return {
        id: profile.id,
        email: profile.mail || profile.userPrincipalName || null,
        name: profile.displayName || profile.mail || profile.userPrincipalName,
        avatar_url: null,
      };
    },
  },
};

function getProviderDefinition(providerId) {
  return OAUTH_PROVIDERS[providerId] || null;
}

export function listOAuthProviders(env = process.env) {
  return Object.values(OAUTH_PROVIDERS)
    .filter((provider) => env[provider.clientIdEnv] && env[provider.clientSecretEnv])
    .map((provider) => ({
      id: provider.id,
      label: provider.label,
    }));
}

export function createOAuthState() {
  return crypto.randomBytes(18).toString("hex");
}

export function normalizeRedirectPath(value) {
  if (!value) {
    return "/";
  }

  if (value.startsWith("/")) {
    return value;
  }

  try {
    const url = new URL(value);
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return "/";
  }
}

export function normalizeOrigin(value, fallbackOrigin) {
  try {
    return new URL(value).origin;
  } catch {
    return fallbackOrigin;
  }
}

export function buildOAuthAuthorizationUrl({
  providerId,
  state,
  backendOrigin,
  env = process.env,
}) {
  const provider = getProviderDefinition(providerId);
  if (!provider) {
    throw new Error("Unsupported OAuth provider");
  }

  const clientId = env[provider.clientIdEnv];
  const clientSecret = env[provider.clientSecretEnv];
  if (!clientId || !clientSecret) {
    throw new Error(`${provider.label} sign-in is not configured yet`);
  }

  const authorizationUrl = new URL(
    provider.authorizationUrl || provider.getAuthorizationUrl(env),
  );
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", `${backendOrigin}/api/auth/oauth/${providerId}/callback`);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", provider.scopes.join(" "));
  authorizationUrl.searchParams.set("state", state);

  Object.entries(provider.extraAuthParams || {}).forEach(([key, value]) => {
    authorizationUrl.searchParams.set(key, value);
  });

  return authorizationUrl.toString();
}

export async function exchangeOAuthCodeForProfile({
  providerId,
  code,
  backendOrigin,
  env = process.env,
}) {
  const provider = getProviderDefinition(providerId);
  if (!provider) {
    throw new Error("Unsupported OAuth provider");
  }

  const clientId = env[provider.clientIdEnv];
  const clientSecret = env[provider.clientSecretEnv];
  if (!clientId || !clientSecret) {
    throw new Error(`${provider.label} sign-in is not configured yet`);
  }

  const redirectUri = `${backendOrigin}/api/auth/oauth/${providerId}/callback`;
  const tokenUrl = provider.tokenUrl || provider.getTokenUrl(env);
  const tokenParams = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: tokenParams.toString(),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Unable to complete ${provider.label} sign-in`);
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  if (!accessToken) {
    throw new Error(`Unable to complete ${provider.label} sign-in`);
  }

  const profile = await provider.getProfile(accessToken, env);
  if (!profile?.email) {
    throw new Error(`${provider.label} did not return an email address`);
  }

  return {
    ...profile,
    email: String(profile.email).trim().toLowerCase(),
    name: String(profile.name || profile.email).trim(),
  };
}
