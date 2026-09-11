const { readFileSync, existsSync, readdirSync, mkdirSync, rmSync, writeFileSync } = require("node:fs");
const { join, dirname } = require("node:path");
const { default: satori } = require("satori");
const { Resvg } = require("@resvg/resvg-js");
const { createElement: h } = require("react");

const root = join(__dirname, "..");
const ogRoot = join(root, "public", "og");
const config = JSON.parse(
  readFileSync(join(root, "config", "config.json"), "utf8")
);
const user = config.user;
const project = config.project;

function cleanOg() {
  if (!existsSync(ogRoot)) return;
  for (const entry of readdirSync(ogRoot)) {
    rmSync(join(ogRoot, entry), { recursive: true, force: true });
  }
}

function loadFont(weight) {
  const file = join(
    root,
    "node_modules",
    "@fontsource",
    "inter",
    "files",
    `inter-latin-${weight}-normal.woff`
  );
  return { name: "Inter", data: readFileSync(file), weight, style: "normal" };
}

const fonts = [400, 500, 600, 700].map(loadFont);

const COLORS = {
  bg: "#faf7f2",
  text: "#1c1a18",
  muted: "#8a8378",
  accent: "#e08a5c",
};

const column = { display: "flex", flexDirection: "column" };

function rootStyle() {
  return {
    ...column,
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: COLORS.bg,
    color: COLORS.text,
    padding: 64,
  };
}

function headerRight(text) {
  return h("span", { style: { color: COLORS.muted } }, text);
}

function cardTitle() {
  return h("div", { style: { letterSpacing: 8, fontWeight: 600 } }, "PROJECT 30");
}

function rule() {
  return h("div", {
    style: { height: 4, width: 96, backgroundColor: COLORS.accent, marginBottom: 32 },
  });
}

function headerSection(rightText) {
  return h(
    "div",
    { style: { display: "flex", justifyContent: "space-between", fontSize: 22 } },
    cardTitle(),
    headerRight(rightText)
  );
}

function renderLanding() {
  return h(
    "div",
    { style: rootStyle() },
    headerSection("project30"),
    h(
      "div",
      { style: column },
      h(
        "div",
        { style: { fontSize: 120, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 } },
        "30 minutes."
      ),
      h(
        "div",
        { style: { fontSize: 120, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 } },
        "30 days."
      ),
      h(
        "div",
        { style: { fontSize: 120, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 } },
        "One area."
      ),
      h(
        "div",
        { style: { marginTop: 32, fontSize: 36, color: COLORS.accent, fontWeight: 600 } },
        "Build the habit. Not the hype."
      )
    )
  );
}

function renderProfile(day) {
  return h(
    "div",
    { style: rootStyle() },
    headerSection(`@${user.username}`),
    h(
      "div",
      { style: column },
      h(
        "div",
        {
          style: {
            fontSize: 28,
            fontWeight: 600,
            color: COLORS.text,
            marginBottom: 8,
          },
        },
        user.display_name
      ),
      h(
        "div",
        {
          style: {
            fontSize: 28,
            fontWeight: 500,
            color: COLORS.muted,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 24,
          },
        },
        project.area
      ),
      h(
        "div",
        {
          style: {
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: -2,
            maxWidth: 900,
          },
        },
        project.goal
      ),
      h(
        "div",
        { style: { display: "flex", alignItems: "flex-end", gap: 16, marginTop: 48 } },
        h(
          "span",
          { style: { fontSize: 96, fontWeight: 700, lineHeight: 1, color: COLORS.accent } },
          day
        ),
        h(
          "span",
          { style: { fontSize: 40, color: COLORS.muted, marginBottom: 8 } },
          "/ 30"
        )
      )
    )
  );
}

function renderJourney() {
  return h(
    "div",
    { style: rootStyle() },
    headerSection("journey"),
    rule(),
    h(
      "div",
      { style: { fontSize: 40, fontWeight: 600, letterSpacing: 4, color: COLORS.text } },
      "THE 30-DAY JOURNEY"
    ),
    h(
      "div",
      { style: column },
      h(
        "div",
        {
          style: {
            fontSize: 28,
            fontWeight: 500,
            color: COLORS.muted,
            letterSpacing: 3,
            textTransform: "uppercase",
          },
        },
        project.area
      ),
      h(
        "div",
        {
          style: {
            marginTop: 16,
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: -2,
            maxWidth: 900,
          },
        },
        project.goal
      )
    )
  );
}

function renderDay(day) {
  const statusLabel =
    { completed: "Completed", partial: "Partial", missed: "Missed" }[
      day.status
    ] ?? "";
  return h(
    "div",
    { style: rootStyle() },
    headerSection(`@${user.username}`),
    rule(),
    h(
      "div",
      { style: { fontSize: 40, fontWeight: 600, letterSpacing: 4, color: COLORS.text } },
      `DAY ${day.day} / 30`
    ),
    h(
      "div",
      { style: column },
      h(
        "div",
        {
          style: {
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: 3,
            color: COLORS.accent,
            textTransform: "uppercase",
          },
        },
        statusLabel
      ),
      h(
        "div",
        {
          style: {
            marginTop: 24,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: -2,
            maxWidth: 900,
          },
        },
        day.task
      ),
      h(
        "div",
        { style: { marginTop: 48, fontSize: 36, color: COLORS.muted } },
        project.area
      )
    )
  );
}

function parseFrontmatter(file) {
  const text = readFileSync(join(root, "daily-log", file), "utf8");
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return {};
  const data = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim().replace(/^"|"$/g, "");
      data[key] = value;
    }
  }
  return data;
}

const logs = readdirSync(join(root, "daily-log"))
  .filter((f) => /^\d+\.md$/.test(f))
  .map((f) => ({ day: Number.parseInt(f, 10), ...parseFrontmatter(f) }))
  .sort((a, b) => a.day - b.day);

function currentDay() {
  const start = new Date(project.start_date);
  const today = new Date();
  const diff = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
  return Math.max(0, Math.min(30, diff));
}

async function write(element, relPath) {
  const svg = await satori(element, { width: 1200, height: 630, fonts });
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const png = resvg.render().asPng();
  const abs = join(ogRoot, relPath);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, png);
  console.log("og:", `/og/${relPath}`);
}

(async () => {
  cleanOg();
  await write(renderLanding(), "home.png");
  await write(renderJourney(), "journey.png");
  await write(renderProfile(currentDay()), "profile.png");
  for (const l of logs) {
    await write(renderDay(l), `day/${l.day}.png`);
    await write(renderDay(l), `profile/day/${l.day}.png`);
  }
})();
