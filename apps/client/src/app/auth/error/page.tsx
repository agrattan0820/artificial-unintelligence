import ErrorScreen from "@ai/components/error-screen";

const errorDetails: Record<string, string> = {
  Configuration:
    "There is a problem with the sign-in configuration right now. Please try again later.",
  AccessDenied:
    "You do not have permission to sign in with that account. Please try a different account.",
  Verification:
    "That sign-in link is no longer valid. Please start the sign-in flow again.",
  OAuthSignin:
    "Google sign-in could not be started. Please try again.",
  OAuthCallback:
    "Google sign-in could not be completed. Please try again.",
  OAuthCreateAccount:
    "We could not create your account from Google sign-in. Please try again.",
  Callback:
    "We could not finish signing you in. Please try again.",
  Default:
    "Something went wrong while signing you in. Please try again.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <ErrorScreen
      details={errorDetails[error ?? "Default"] ?? errorDetails.Default}
    />
  );
}
