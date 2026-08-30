import { spawnSync } from "node:child_process";

const isVercelBuild =
  process.env.VERCEL === "1" || process.env.NITRO_PRESET === "vercel";
const command = isVercelBuild ? "vite" : "vinext";
const environment = { ...process.env };

if (isVercelBuild) {
  environment.NITRO_PRESET = "vercel";
}

const result = spawnSync(command, ["build"], {
  env: environment,
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
