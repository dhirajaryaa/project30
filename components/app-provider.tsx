"use client";

import * as React from "react";
import {
  deleteLog as deleteLogAction,
  getSessionData,
  onboardProject,
  resetAll as resetAllAction,
  saveLog as saveLogAction,
  setAvatar as setAvatarAction,
} from "@/lib/actions";
import { currentDayNumber } from "@/lib/dates";
import { getLogByDay } from "@/lib/storage";
import type {
  AppData,
  DailyLog,
  OnboardInput,
  SaveLogInput,
} from "@/lib/types";

type AuthStatus = "loading" | "ready" | "unauthenticated";

type ActionResult = { ok: true } | { ok: false; error: string };

type AppContextValue = {
  status: AuthStatus;
  data: AppData;
  user: AppData["user"];
  project: AppData["project"];
  logs: AppData["logs"];
  currentDay: number;
  todayLog: DailyLog | undefined;
  getLog: (dayNumber: number) => DailyLog | undefined;
  createOnboard: (input: OnboardInput) => Promise<ActionResult>;
  saveLog: (input: SaveLogInput) => Promise<ActionResult>;
  deleteLog: (dayNumber: number) => Promise<ActionResult>;
  setAvatar: (avatarUrl: string) => Promise<ActionResult>;
  resetAll: () => Promise<void>;
  signOut: () => void;
};

const AppContext = React.createContext<AppContextValue | null>(null);

const EMPTY: AppData = { user: null, project: null, logs: [] };

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<AuthStatus>("loading");
  const [data, setData] = React.useState<AppData>(EMPTY);

  React.useEffect(() => {
    let cancelled = false;
    getSessionData()
      .then((sessionData) => {
        if (cancelled) return;
        if (sessionData === null) {
          setStatus("unauthenticated");
          return;
        }
        setData(sessionData);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("unauthenticated");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const user = data.user;
  const project = data.project;
  const logs = data.logs;
  const currentDay = project ? currentDayNumber(project.start_date) : 0;
  const todayLog = project ? getLogByDay(logs, currentDay) : undefined;

  const getLog = React.useCallback(
    (dayNumber: number) => getLogByDay(logs, dayNumber),
    [logs]
  );

  const createOnboard = async (input: OnboardInput): Promise<ActionResult> => {
    const result = await onboardProject(input);
    if (!result.ok) return result;
    setData(result.data);
    setStatus("ready");
    return { ok: true };
  };

  const saveLog = async (input: SaveLogInput): Promise<ActionResult> => {
    const result = await saveLogAction(input);
    if (!result.ok) return result;
    setData(result.data);
    return { ok: true };
  };

  const deleteLog = async (dayNumber: number): Promise<ActionResult> => {
    const result = await deleteLogAction(dayNumber);
    if (!result.ok) return result;
    setData(result.data);
    return { ok: true };
  };

  const setAvatar = async (avatarUrl: string): Promise<ActionResult> => {
    const result = await setAvatarAction(avatarUrl);
    if (!result.ok) return result;
    setData(result.data);
    return { ok: true };
  };

  const resetAll = async (): Promise<void> => {
    const next = await resetAllAction();
    setData(next ?? EMPTY);
  };

  const signOut = (): void => {
    setData(EMPTY);
    setStatus("unauthenticated");
  };

  const value: AppContextValue = {
    status,
    data,
    user,
    project,
    logs,
    currentDay,
    todayLog,
    getLog,
    createOnboard,
    saveLog,
    deleteLog,
    setAvatar,
    resetAll,
    signOut,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}