import { redirect } from "next/navigation";

/**
 * Layout for all /chat/* routes.
 * Auth is enforced by:
 *  1. src/middleware.ts (server-level Clerk protection)
 *  2. Client-side guard in Chat.tsx using useAuth()
 */
export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
