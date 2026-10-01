import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseTrip, type SavedTrip } from "@/lib/trip-store";

const FILE = path.join(process.cwd(), "data", "trip.json");
const REPO_PATH = "data/trip.json";

function token(): string {
  return (
    process.env.TRIP_GITHUB_TOKEN?.trim() ||
    process.env.GITHUB_TOKEN?.trim() ||
    ""
  );
}

function repo(): string {
  return process.env.TRIP_GITHUB_REPO?.trim() || "anamueller/japan2026";
}

export async function readSharedTrip(): Promise<SavedTrip | null> {
  const remote = await readGithub();
  if (remote) return remote;
  try {
    return parseTrip(JSON.parse(await readFile(FILE, "utf8")));
  } catch {
    return null;
  }
}

export async function writeSharedTrip(trip: SavedTrip): Promise<void> {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, `${JSON.stringify(trip)}\n`, "utf8");
  if (token()) {
    await writeGithub(trip);
    return;
  }
  if (process.env.VERCEL) throw new Error("missing token");
}

async function readGithub(): Promise<SavedTrip | null> {
  const key = token();
  const response = await fetch(
    `https://api.github.com/repos/${repo()}/contents/${REPO_PATH}`,
    {
      headers: githubHeaders(key),
      cache: "no-store",
    },
  );
  if (response.status === 404) return null;
  if (!response.ok) return null;
  const payload = (await response.json()) as { content?: string };
  if (!payload.content) return null;
  return parseTrip(JSON.parse(Buffer.from(payload.content, "base64").toString("utf8")));
}

async function writeGithub(trip: SavedTrip): Promise<void> {
  const key = token();
  const url = `https://api.github.com/repos/${repo()}/contents/${REPO_PATH}`;
  const current = await fetch(url, { headers: githubHeaders(key), cache: "no-store" });
  const sha = current.ok
    ? ((await current.json()) as { sha?: string }).sha
    : undefined;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      ...githubHeaders(key),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "chore: atualiza roteiro compartilhado",
      content: Buffer.from(`${JSON.stringify(trip)}\n`).toString("base64"),
      sha,
    }),
  });
  if (!response.ok) {
    throw new Error(`github write ${response.status}`);
  }
}

function githubHeaders(key: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(key ? { Authorization: `Bearer ${key}` } : {}),
  };
}
