// app.d.ts
/// <reference types="lucia" />

declare namespace Lucia {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type Auth = import("./lib/lucia-auth").Auth;
  type DatabaseUserAttributes = {
    email: string;
    name: string | null;
    role: UserRole;
  };
  type DatabaseSessionAttributes = {};
}
