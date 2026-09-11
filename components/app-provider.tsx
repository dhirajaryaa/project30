"use client";

import * as React from "react";
import {
  api,
  ApiError,
  clearToken,
  setToken,
} from "@/lib/api";
import { currentDayNumber } from "@/lib/dates";
import { getLogByDay, sortLogs } from "@/lib/storage";
import type {
  AppData,
  ActivityType,
  DailyLog,
  LogStatus,
  MissedReason,
} from "@/lib/types";

type Status = "loading" | "ready" | "unauthenticated";

export type SaveLogInput = {
  day_number: number;
  date: string;
  task: string;
  status: LogStatus;
  activity_type: ActivityType;
  what_i_did: string;
  what_i_learned: string;
  what_was_difficult?: string;
  tomorrow_plan: string;
  missed_reason?: MissedReason;
  evidence_url?: string;
};

type OnboardInput = {
  username: string;
  display_name: string;
  area: string;
  goal: string;
  start_date: string;
};

type AppContextValue = {
  status: Status;
  data: AppData;
  user: AppData["user"];
  project: AppData["project"];
  logs: AppData["logs"];
  currentDay: number;
  todayLog: DailyLog | undefined;
  createOnboard: (
    input: OnboardInput
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  saveLog: (input: SaveLogInput) => Promise<DailyLog>;
  deleteLog: (dayNumber: number) => Promise<void>;
  getLog: (dayNumber: number) => DailyLog | undefined;
  resetAll: () => Promise<void>;
};

const AppContext = React.createContext<AppContextValue | null>(null);

const EMPTY: AppData = { user: null, project: null, logs: [] };

function updateLogs(logs: AppData["logs"], log: DailyLog): AppData["logs"] {
  const next = logs.filter((l) => l.day_number !== log.day_number);
  return sortLogs([...next, log]);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<Status>("loading");
  const [data, setData] = React.useState<AppData>(EMPTY);

  React.useEffect(() => {
    let cancelled = false;
    api<AppData>("/api/me")
      .then((me) => {
        if (cancelled) return;
        setData(me);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) clearToken();
        setStatus("unauthenticated");
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

  const createOnboard = async (
    input: OnboardInput
  ): Promise<{ ok: true } | { ok: false; error: string }> => {
    try {
      const result = await api<{ token: string; data: AppData }>(
        "/api/onboarding",
        { method: "POST", body: JSON.stringify(input) }
      );
      setToken(result.token);
      setData(result.data);
      setStatus("ready");
      return { ok: true };
    } catch (err) {
      if (err instanceof ApiError) {
        return { ok: false, error: err.message };
      }
      return { ok: false, error: "Something went wrong. Try again." };
    }
  };

  const saveLog = async (input: SaveLogInput): Promise<DailyLog> => {
    const log = await api<DailyLog>(`/api/logs/${input.day_number}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
    setData((prev) => ({ ...prev, logs: updateLogs(prev.logs, log) }));
    return log;
  };

  const deleteLog = async (dayNumber: number): Promise<void> => {
    await api(`/api/logs/${dayNumber}`, { method: "DELETE" });
    setData((prev) => ({
      ...prev,
      logs: prev.logs.filter((l) => l.day_number !== dayNumber),
    }));
  };

  const getLog = React.useCallback(
    (dayNumber: number) => getLogByDay(logs, dayNumber),
    [logs]
  );

  const resetAll = async (): Promise<void> => {
    try {
      await api("/api/me", { method: "DELETE" });
    } catch {
      /* already gone */
    }
    clearToken();
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
    createOnboard,
    saveLog,
    deleteLog,
    getLog,
    resetAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}