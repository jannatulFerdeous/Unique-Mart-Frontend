import { AuthCard } from "./partials/AuthCard";
import { ForgotForm } from "./partials/ForgotForm";

export function ForgotPassword({ back }: { back?: string }) {
  return (
    <AuthCard active="login" back={back}>
      <ForgotForm back={back} />
    </AuthCard>
  );
}
