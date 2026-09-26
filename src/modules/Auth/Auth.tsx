import { AuthBody } from "./partials/AuthBody";
import { AuthCard } from "./partials/AuthCard";

type Props = {
  view: "login" | "register";
  back?: string;
};

export function Auth({ view, back }: Props) {
  return (
    <AuthCard active={view} back={back}>
      <AuthBody view={view} back={back} />
    </AuthCard>
  );
}
