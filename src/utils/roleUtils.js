export function normalizeRole(role) {
  const normalizedRole = String(role || "")
    .trim()
    .toLowerCase();

  if (normalizedRole === "admin" || normalizedRole === "staff" || normalizedRole === "user") {
    return normalizedRole;
  }

  return "user";
}
