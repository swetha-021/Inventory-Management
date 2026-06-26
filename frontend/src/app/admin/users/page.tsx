"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { api } from "@/lib/api";
import type { AppUser, AuditLog, PageResponse, Role } from "@/lib/types";

function UsersInner() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    setUsers(await api<AppUser[]>("/users"));
    const page = await api<PageResponse<AuditLog>>("/audit-logs?size=15");
    setLogs(page.content);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "Failed to load admin data"));
  }, []);

  const changeRole = async (userId: number, role: Role) => {
    try {
      await api(`/users/${userId}/role`, { method: "PUT", body: JSON.stringify({ role }) });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Role update failed");
    }
  };

  const toggleEnabled = async (user: AppUser) => {
    try {
      await api(`/users/${user.id}/enabled`, {
        method: "PATCH",
        body: JSON.stringify({ enabled: !user.enabled }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">User administration</h1>
        <p className="text-sm text-slate-500">Admin-only. Roles are enforced on the API with @PreAuthorize.</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="px-4 py-2">{user.fullName}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <select
                    value={user.roles[0] ?? "STAFF"}
                    onChange={(e) => changeRole(user.id, e.target.value as Role)}
                  >
                    <option value="STAFF">STAFF</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button onClick={() => toggleEnabled(user)} className="underline">
                    {user.enabled ? "Enabled" : "Disabled"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b px-5 py-3 font-medium">Audit logs</div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">When</th>
              <th className="px-4 py-2 font-medium">Actor</th>
              <th className="px-4 py-2 font-medium">Action</th>
              <th className="px-4 py-2 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-slate-100">
                <td className="px-4 py-2 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{log.actorEmail ?? "system"}</td>
                <td className="px-4 py-2">{log.action}</td>
                <td className="px-4 py-2">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <UsersInner />
    </AuthGuard>
  );
}
