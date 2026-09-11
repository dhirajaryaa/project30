import type { CSSProperties } from "react";

type OgCardProps = {
  day?: number;
  status?: string;
  task?: string;
  area?: string;
  username?: string;
  goal?: string;
  subline?: string;
  variant?: "landing" | "profile" | "day";
};

const COLORS = {
  bg: "#faf7f2",
  text: "#1c1a18",
  muted: "#8a8378",
  accent: "#b04a24",
  light: "#e8e2d8",
};

const column: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

export function OgCard({
  day,
  status,
  task,
  area,
  username,
  goal,
  subline,
  variant = "landing",
}: OgCardProps) {
  const root: CSSProperties = {
    ...column,
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: COLORS.bg,
    color: COLORS.text,
    padding: 64,
  };

  const rule: CSSProperties = {
    height: 4,
    width: 96,
    backgroundColor: COLORS.accent,
    marginBottom: 32,
  };

  const header: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 22,
  };

  if (variant === "profile") {
    return (
      <div style={root}>
        <div style={header}>
          <span style={{ letterSpacing: 8, fontWeight: 600 }}>PROJECT 30</span>
          <span style={{ color: COLORS.muted }}>
            {username ? `@${username}` : "project30"}
          </span>
        </div>
        <div style={column}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 600,
              color: COLORS.accent,
              letterSpacing: 2,
            }}
          >
            {area?.toUpperCase() ?? ""}
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            {goal ?? ""}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: 48 }}>
            <span style={{ fontSize: 96, fontWeight: 700, lineHeight: 1 }}>
              {day ?? 0}
            </span>
            <span style={{ fontSize: 40, color: COLORS.muted, marginBottom: 8 }}>
              / 30
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "day") {
    return (
      <div style={root}>
        <div style={header}>
          <span style={{ letterSpacing: 8, fontWeight: 600 }}>PROJECT 30</span>
          <span style={{ color: COLORS.muted }}>
            {username ? `@${username}` : "project30"}
          </span>
        </div>
        <div style={rule} />
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: 4, color: COLORS.text }}>
          DAY {day ?? 0} / 30
        </div>
        <div style={column}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: 3,
              color: COLORS.accent,
              textTransform: "uppercase",
            }}
          >
            {status ?? ""}
          </div>
          {task ? (
            <div
              style={{
                marginTop: 24,
                fontSize: 72,
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: -2,
                maxWidth: 900,
              }}
            >
              {task}
            </div>
          ) : null}
          <div style={{ marginTop: 48, fontSize: 36, color: COLORS.muted }}>
            {area ?? ""} {subline ? `· ${subline}` : ""}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={root}>
      <div style={header}>
        <span style={{ letterSpacing: 8, fontWeight: 600 }}>PROJECT 30</span>
        <span style={{ color: COLORS.muted }}>project30</span>
      </div>
      <div style={column}>
        <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }}>
          30 minutes.
        </div>
        <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }}>
          30 days.
        </div>
        <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }}>
          One area.
        </div>
        <div style={{ marginTop: 32, fontSize: 36, color: COLORS.accent, fontWeight: 600 }}>
          Build the habit. Not the hype.
        </div>
      </div>
    </div>
  );
}