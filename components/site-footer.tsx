import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandOpenai,
  IconHeart,
  IconRobot,
  IconSearch,
  IconSun,
} from "@tabler/icons-react";
import { absoluteUrl } from "@/lib/site";

const REPO_URL = "https://github.com/dhirajaryaa/project30";
const PROJECT_LLMS = absoluteUrl("/llms.txt");

const PROMPT = `What does this project do and why does it matter? Read ${PROJECT_LLMS} and explain it in plain words.`;

const AIS = [
  {
    name: "ChatGPT",
    href: `https://chatgpt.com/?q=${encodeURIComponent(PROMPT)}`,
  },
  {
    name: "Claude",
    href: `https://claude.ai/new?q=${encodeURIComponent(PROMPT)}`,
  },
  {
    name: "Gemini",
    href: `https://gemini.google.com/app?q=${encodeURIComponent(PROMPT)}`,
  },
  {
    name: "Perplexity",
    href: `https://www.perplexity.ai/search?q=${encodeURIComponent(PROMPT)}`,
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-muted-foreground/40 px-6 py-5 text-center font-light ">
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              # Ask AI why this project matters
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {AIS.map((ai) => (
                <Link
                  key={ai.name}
                  href={ai.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span>{ai.name}</span>
                </Link>
              ))}
              <span className="text-muted-foreground/40">·</span>
              <Link
                href={PROJECT_LLMS}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                llms.txt
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div>
              <p className="text-center text-sm font-semibold tracking-widest text-foreground sm:text-left">
                PROJECT&nbsp;30
              </p>
              <p className="mt-1 text-center text-sm text-muted-foreground sm:text-left">
                Less management. More doing. More reflection. More visible
                progress.
              </p>
            </div>
            <Link
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 sm:text-sm"
            >
              <IconBrandGithub size={14} />
              Get Project 30
            </Link>
          </div>
        </div>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          Built with ❤️ by
          <a
            href="https://github.com/dhirajaryaa"
            target="_blank"
            rel="noopener noreferrer"
            className="font-normal text-foreground duration-200 transition-colors hover:text-primary"
          >
            dhirajaryaa
          </a>
        </p>
      </div>
    </footer>
  );
}