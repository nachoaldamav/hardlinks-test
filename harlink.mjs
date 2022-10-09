import { linkSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { performance } from "node:perf_hooks";
import path from "node:path";

function cloneFile() {
  const start = performance.now();
  const targetPath = path.join(process.cwd(), "target-dir");
  const sourcePath = path.join(process.cwd(), "data");

  mkdirSync(targetPath, { recursive: true });

  // Clone all the files in sourcePath to targetPath
  hardLinkSync(sourcePath, targetPath);
  const end = performance.now();
  console.log(`Time taken: ${(end - start).toFixed(2)} ms`);
}

cloneFile();

function hardLinkSync(sourcePath, targetPath) {
  const files = readdirSync(sourcePath);
  for (const file of files) {
    mkdirSync(path.join(targetPath, file), { recursive: true });
    // If the file is a directory, recurse
    if (statSync(path.join(sourcePath, file)).isDirectory()) {
      hardLinkSync(path.join(sourcePath, file), path.join(targetPath, file));
    } else {
      try {
        linkSync(path.join(sourcePath, file), path.join(targetPath, file));
      } catch (e) {}
    }
  }
}
