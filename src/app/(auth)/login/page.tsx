import LoginForm from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const initialError =
    params.error === "auth_callback_failed"
      ? "Link inválido ou expirado. Tente novamente."
      : "";

  return <LoginForm initialError={initialError} />;
}
