import { cookies } from "next/headers";
import { AxiosResponse } from "axios";
import { proxyServerApi } from "./api";

import type { Note } from "@/types/note";

export const checkSession = async (): Promise<AxiosResponse> => {
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

export interface NoteHTTPResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  search: string;
  tag?: string;
}
export async function fetchNotes({
  page,
  search,
  tag,
}: FetchNotesParams): Promise<NoteHTTPResponse> {
  const cookieStore = await cookies();

  const res = await proxyServerApi.get<NoteHTTPResponse>("/notes", {
    params: { page, search, tag },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();

  const res = await proxyServerApi.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res.data;
}
