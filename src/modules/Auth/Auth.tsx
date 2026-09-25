import { AuthBody } from "./partials/AuthBody";
import { AuthCard } from "./partials/AuthCard";

type Props = {
  view: "login" | "register";
  /** Base64 return path from `?back=`, passed straight through. */
  back?: string;
};

export function Auth({ view, back }: Props) {
  return (
    <AuthCard active={view} back={back}>
      <AuthBody view={view} back={back} />
    </AuthCard>
  );
}
