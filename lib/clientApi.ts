import axios from "axios";
import toast from "react-hot-toast";

import type { Note, NoteTag } from "../types/note";
import type { User } from "@/types/user";

import { proxyServerApi } from "./api";

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
  const res = await proxyServerApi.get<NoteHTTPResponse>("/notes", {
    params: { page, search, tag },
  });
  return res.data;
}

interface CreateNoteRequest {
  title: string;
  content: string;
  tag: NoteTag;
}
export async function createNote(data: CreateNoteRequest): Promise<Note> {
  try {
    const res = await proxyServerApi.post<Note>("/notes", data);
    return res.data;
  } catch (error) {
    toast.error("Failed to create note");
    throw error;
  }
}

export async function deleteNote(id: string): Promise<Note> {
  try {
    const res = await proxyServerApi.delete<Note>(`/notes/${id}`);
    return res.data;
  } catch (error) {
    toast.error("Failed to delete note");
    throw error;
  }
}

export async function fetchNoteById(id: string): Promise<Note> {
  try {
    const res = await proxyServerApi.get<Note>(`/notes/${id}`);
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch note");
    throw error;
  }
}

// Функція запиту на реєстрацію
export type RegisterRequest = {
  email: string;
  password: string;
};
export async function register(data: RegisterRequest) {
  const res = await proxyServerApi.post<User>("/auth/register", data);
  return res.data;
}

// Функція аутентифікації зареєстрованого користувача
export type LoginRequest = {
  email: string;
  password: string;
};
export async function login(data: LoginRequest) {
  const res = await proxyServerApi.post<User>("/auth/login", data);
  return res.data;
}

//Функція розлогін
export async function logout() {
  await proxyServerApi.post("/auth/logout");
}

// Функція перевірки наявності сесії
export const checkSession = async () => {
  try {
    await proxyServerApi.get("/auth/session");
    return true;
  } catch {
    return false;
  }
};

//Отримання об’єкта користувача
export const getMe = async () => {
  const { data } = await proxyServerApi.get<User>("/users/me");
  return data;
};

//Функція оновлення профілю
export type EditProfileRequest = {
  email: string;
  username: string;
};
export async function editProfile(data: EditProfileRequest) {
  const res = await proxyServerApi.patch<User>("/users/me", data);
  return res.data;
}
