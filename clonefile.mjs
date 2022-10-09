import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  statSync,
  constants,
} from "node:fs";
import { performance } from "node:perf_hooks";
import path from "node:path";

function cloneFile() {
  const start = performance.now();
  const targetPath = path.join(process.cwd(), "target-dir");
  const sourcePath = path.join(process.cwd(), "data");

  mkdirSync(targetPath, { recursive: true });

  // Clone all the files in sourcePath to targetPath
  cloneFileSync(sourcePath, targetPath);
  const end = performance.now();
  console.log(`Time taken: ${(end - start).toFixed(2)} ms`);
}

function cloneFileSync(sourcePath, targetPath) {
  const files = readdirSync(sourcePath);
  for (const file of files) {
    mkdirSync(path.join(targetPath, file), { recursive: true });
    // If the file is a directory, recurse
    if (statSync(path.join(sourcePath, file)).isDirectory()) {
      cloneFileSync(path.join(sourcePath, file), path.join(targetPath, file));
    } else {
      try {
        copyFileSync(
          path.join(sourcePath, file),
          path.join(targetPath, file),
          constants.COPYFILE_FICLONE
        );
      } catch (e) {}
    }
  }
}

cloneFile();
