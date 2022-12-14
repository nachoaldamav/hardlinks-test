import { performance } from "perf_hooks";
import * as vite from "vite";
import {
  runHookConfigDone,
  runHookConfigSetup,
  runHookServerDone,
  runHookServerSetup,
  runHookServerStart
} from "../../integrations/index.js";
import { createVite } from "../create-vite.js";
import { info, warn } from "../logger/core.js";
import * as msg from "../messages.js";
import { apply as applyPolyfill } from "../polyfill.js";
async function dev(config, options) {
  var _a, _b, _c;
  const devStart = performance.now();
  applyPolyfill();
  await options.telemetry.record([]);
  config = await runHookConfigSetup({ config, command: "dev", logging: options.logging });
  const { host, port } = config.server;
  const rendererClientEntries = config._ctx.renderers.map((r) => r.clientEntrypoint).filter(Boolean);
  const viteConfig = await createVite(
    {
      mode: "development",
      server: { host },
      optimizeDeps: {
        include: rendererClientEntries
      }
    },
    { astroConfig: config, logging: options.logging, mode: "dev" }
  );
  await runHookConfigDone({ config, logging: options.logging });
  const viteServer = await vite.createServer(viteConfig);
  runHookServerSetup({ config, server: viteServer, logging: options.logging });
  await viteServer.listen(port);
  const devServerAddressInfo = viteServer.httpServer.address();
  const site = config.site ? new URL(config.base, config.site) : void 0;
  info(
    options.logging,
    null,
    msg.devStart({
      startupTime: performance.now() - devStart,
      config,
      devServerAddressInfo,
      site,
      https: !!((_a = viteConfig.server) == null ? void 0 : _a.https)
    })
  );
  const currentVersion = "1.1.5";
  if (currentVersion.includes("-")) {
    warn(options.logging, null, msg.prerelease({ currentVersion }));
  }
  if (((_c = (_b = viteConfig.server) == null ? void 0 : _b.fs) == null ? void 0 : _c.strict) === false) {
    warn(options.logging, null, msg.fsStrictWarning());
  }
  await runHookServerStart({ config, address: devServerAddressInfo, logging: options.logging });
  return {
    address: devServerAddressInfo,
    get watcher() {
      return viteServer.watcher;
    },
    stop: async () => {
      await viteServer.close();
      await runHookServerDone({ config, logging: options.logging });
    }
  };
}
export {
  dev as default
};
