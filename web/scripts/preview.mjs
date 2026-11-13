// Serves the production static export (out/) like Cloudflare Pages would, plus /data from
// public/data so snapshots the API publishes locally show up live without a rebuild.
// Usage: npm run preview   (PORT=3000 by default; binds 0.0.0.0 so previews work)
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "out");
const DATA = join(ROOT, "public", "data");
const PORT = Number(process.env.PORT ?? 3000);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function resolveFile(base, rel) {
  const target = normalize(join(base, rel));
  if (!target.startsWith(base)) return null; // no path traversal
  for (const candidate of [target, join(target, "index.html"), `${target}.html`]) {
    const s = await stat(candidate).catch(() => null);
    if (s?.isFile()) return candidate;
  }
  return null;
}

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  const isData = path.startsWith("/data/");
  const file = isData
    ? await resolveFile(DATA, path.slice("/data/".length))
    : await resolveFile(OUT, path);
  if (!file) {
    res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
    return;
  }
  res.writeHead(200, {
    "content-type": TYPES[extname(file)] ?? "application/octet-stream",
    "cache-control": isData ? "no-cache" : "public, max-age=60",
  });
  createReadStream(file).pipe(res);
}).listen(PORT, "0.0.0.0", () => console.log(`Preview: http://localhost:${PORT} (static export + live /data)`));
