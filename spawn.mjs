import { mkdirSync, readdirSync, statSync, constants } from "node:fs";
import { spawnSync } from "node:child_process";
import { performance } from "node:perf_hooks";
import path from "node:path";

function cloneFile() {
  const start = performance.now();
  const targetPath = path.join(process.cwd(), "target-dir");
  const sourcePath = path.join(process.cwd(), "data");

  mkdirSync(targetPath, { recursive: true });

  // Execute cp -r --reflink=always data target-dir
  const cp = spawnSync("cp", [
    "-r",
    "--reflink=always",
    sourcePath,
    targetPath,
  ]);
  if (cp.status !== 0) {
    console.error(cp.stderr.toString());
    process.exit(1);
  }
  const end = performance.now();
  console.log(`Time taken: ${(end - start).toFixed(2)} ms`);
}

cloneFile();
