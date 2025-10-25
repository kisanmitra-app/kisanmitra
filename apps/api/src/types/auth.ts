import { auth } from "~/lib/auth";

export interface ISession {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
}

export interface HonoContext {
  Variables: ISession;
}

export interface IGraphQLContext {
  get: (key: "user") => typeof auth.$Infer.Session.user | null;
}
