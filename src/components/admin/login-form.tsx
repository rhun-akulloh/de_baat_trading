"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { useAdmin } from "./admin-i18n-provider";

export function LoginForm() {
  const { t } = useAdmin();
  const [state, action, pending] = useActionState(login, undefined);
  const input =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 font-medium outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15";
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm font-bold">
        {t.login.email}
        <input name="email" type="email" required autoComplete="username" defaultValue={state?.email} className={`${input} mt-1.5`} />
      </label>
      <label className="block text-sm font-bold">
        {t.login.password}
        <input name="password" type="password" required autoComplete="current-password" className={`${input} mt-1.5`} />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500">
          {t.login[state.error]}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="bg-accent-gradient w-full rounded-full px-6 py-3.5 font-bold text-[#1a0d00] shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? t.login.submitting : t.login.submit}
      </button>
    </form>
  );
}
