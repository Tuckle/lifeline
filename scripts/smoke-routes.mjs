import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const buildOutputPath = path.join(root, ".next");

if (!existsSync(buildOutputPath)) {
  throw new Error("Missing .next build output. Run `npm run build` before `npm run smoke`.");
}

const host = "127.0.0.1";
const port = Number(process.env.SMOKE_PORT ?? 3101);
const origin = `http://${host}:${port}`;
const nextBin = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next",
);

const server = spawn(nextBin, ["start", "--hostname", host, "--port", String(port)], {
  cwd: root,
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";

server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForServer() {
  const deadline = Date.now() + 15_000;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${origin}/auth/login?next=%2Ftimeline`, {
        method: "HEAD",
        redirect: "manual",
      });

      if (response.status === 200) {
        return;
      }

      lastError = new Error(`Expected login route 200 while starting, got ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await delay(250);
  }

  throw new Error(
    `Next production server did not become ready on ${origin}. ${lastError?.message ?? ""}\n${serverOutput}`,
  );
}

async function expectHead(pathname, expectedStatus, expectedLocation) {
  const response = await fetch(`${origin}${pathname}`, {
    method: "HEAD",
    redirect: "manual",
  });

  if (response.status !== expectedStatus) {
    throw new Error(`${pathname} expected ${expectedStatus}, got ${response.status}`);
  }

  if (expectedLocation) {
    const location = response.headers.get("location");

    if (location !== expectedLocation) {
      throw new Error(`${pathname} expected location ${expectedLocation}, got ${location}`);
    }
  }
}

try {
  await waitForServer();

  await expectHead("/", 307, "/auth/login");
  await expectHead("/auth/login?next=%2Ftimeline", 200);

  for (const route of ["/timeline", "/add", "/imports", "/reflect", "/search", "/settings"]) {
    await expectHead(route, 307, `/auth/login?next=%2F${route.slice(1)}`);
  }

  console.log("Production route smoke checks passed");
} finally {
  server.kill("SIGTERM");
}
