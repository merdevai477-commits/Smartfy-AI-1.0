import "dotenv/config";
import { createApp } from "./express/app";

async function main() {
  const { app, start } = await createApp();
  await start();
  return app;
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[express] Failed to start:", err);
  process.exit(1);
});

