import { cookies } from "next/headers";
import { proxyServerApi } from "./api";

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await proxyServerApi.get("/auth/session", {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  // Повертаємо повний респонс, щоб proxy мав доступ до нових cookie
  return res;
};
