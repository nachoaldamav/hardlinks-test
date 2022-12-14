import boxen from "boxen";
import {
  bgCyan,
  bgGreen,
  bgRed,
  bgWhite,
  bgYellow,
  black,
  bold,
  cyan,
  dim,
  green,
  red,
  underline,
  yellow
} from "kleur/colors";
import os from "os";
import { emoji, getLocalAddress, padMultilineString } from "./util.js";
const PREFIX_PADDING = 6;
function req({
  url,
  statusCode,
  reqTime
}) {
  let color = dim;
  if (statusCode >= 500)
    color = red;
  else if (statusCode >= 400)
    color = yellow;
  else if (statusCode >= 300)
    color = dim;
  else if (statusCode >= 200)
    color = green;
  return `${bold(color(`${statusCode}`.padStart(PREFIX_PADDING)))} ${url.padStart(40)} ${reqTime ? dim(Math.round(reqTime) + "ms") : ""}`.trim();
}
function reload({ file }) {
  return `${green("reload".padStart(PREFIX_PADDING))} ${file}`;
}
function hmr({ file, style = false }) {
  return `${green("update".padStart(PREFIX_PADDING))} ${file}${style ? ` ${dim("style")}` : ""}`;
}
function devStart({
  startupTime,
  devServerAddressInfo,
  config,
  https,
  site
}) {
  const version = "1.1.5";
  const rootPath = site ? site.pathname : "/";
  const localPrefix = `${dim("\u2503")} Local    `;
  const networkPrefix = `${dim("\u2503")} Network  `;
  const { address: networkAddress, port } = devServerAddressInfo;
  const localAddress = getLocalAddress(networkAddress, config.server.host);
  const networkLogging = getNetworkLogging(config.server.host);
  const toDisplayUrl = (hostname) => `${https ? "https" : "http"}://${hostname}:${port}${rootPath}`;
  let local = `${localPrefix}${bold(cyan(toDisplayUrl(localAddress)))}`;
  let network = null;
  if (networkLogging === "host-to-expose") {
    network = `${networkPrefix}${dim("use --host to expose")}`;
  } else if (networkLogging === "visible") {
    const nodeVersion = Number(process.version.substring(1, process.version.indexOf(".", 5)));
    const ipv4Networks = Object.values(os.networkInterfaces()).flatMap((networkInterface) => networkInterface ?? []).filter(
      (networkInterface) => (networkInterface == null ? void 0 : networkInterface.address) && (networkInterface == null ? void 0 : networkInterface.family) === (nodeVersion < 18 || nodeVersion >= 18.4 ? "IPv4" : 4)
    );
    for (let { address } of ipv4Networks) {
      if (address.includes("127.0.0.1")) {
        const displayAddress = address.replace("127.0.0.1", localAddress);
        local = `${localPrefix}${bold(cyan(toDisplayUrl(displayAddress)))}`;
      } else {
        network = `${networkPrefix}${bold(cyan(toDisplayUrl(address)))}`;
      }
    }
    if (!network) {
      network = `${networkPrefix}${dim("unable to find network to expose")}`;
    }
  }
  const messages = [
    `${emoji("\u{1F680} ", "")}${bgGreen(black(` astro `))} ${green(`v${version}`)} ${dim(
      `started in ${Math.round(startupTime)}ms`
    )}`,
    "",
    local,
    network,
    ""
  ];
  return messages.filter((msg) => typeof msg === "string").map((msg) => `  ${msg}`).join("\n");
}
function telemetryNotice() {
  const headline = yellow(`Astro now collects ${bold("anonymous")} usage data.`);
  const why = `This ${bold("optional program")} will help shape our roadmap.`;
  const more = `For more info, visit ${underline("https://astro.build/telemetry")}`;
  const box = boxen([headline, why, "", more].join("\n"), {
    margin: 0,
    padding: 1,
    borderStyle: "round",
    borderColor: "yellow"
  });
  return box;
}
function telemetryEnabled() {
  return `
  ${green("\u25C9")} Anonymous telemetry is ${bgGreen(
    black(" enabled ")
  )}. Thank you for improving Astro!
`;
}
function telemetryDisabled() {
  return `
  ${yellow("\u25EF")}  Anonymous telemetry is ${bgYellow(
    black(" disabled ")
  )}. We won't share any usage data.
`;
}
function telemetryReset() {
  return `
  ${cyan("\u25C6")} Anonymous telemetry has been ${bgCyan(
    black(" reset ")
  )}. You may be prompted again.
`;
}
function fsStrictWarning() {
  return yellow(
    "\u26A0\uFE0F Serving with vite.server.fs.strict: false. Note that all files on your machine will be accessible to anyone on your network!"
  );
}
function prerelease({ currentVersion }) {
  const tag = currentVersion.split("-").slice(1).join("-").replace(/\..*$/, "");
  const badge = bgYellow(black(` ${tag} `));
  const headline = yellow(`\u25B6 This is a ${badge} prerelease build`);
  const warning = `  Feedback? ${underline("https://astro.build/issues")}`;
  return [headline, warning, ""].map((msg) => `  ${msg}`).join("\n");
}
function success(message, tip) {
  const badge = bgGreen(black(` success `));
  const headline = green(message);
  const footer = tip ? `
  \u25B6 ${tip}` : void 0;
  return ["", `${badge} ${headline}`, footer].filter((v) => v !== void 0).map((msg) => `  ${msg}`).join("\n");
}
function failure(message, tip) {
  const badge = bgRed(black(` error `));
  const headline = red(message);
  const footer = tip ? `
  \u25B6 ${tip}` : void 0;
  return ["", `${badge} ${headline}`, footer].filter((v) => v !== void 0).map((msg) => `  ${msg}`).join("\n");
}
function cancelled(message, tip) {
  const badge = bgYellow(black(` cancelled `));
  const headline = yellow(message);
  const footer = tip ? `
  \u25B6 ${tip}` : void 0;
  return ["", `${badge} ${headline}`, footer].filter((v) => v !== void 0).map((msg) => `  ${msg}`).join("\n");
}
function portInUse({ port }) {
  return `Port ${port} in use. Trying a new one\u2026`;
}
const LOCAL_IP_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1"]);
function getNetworkLogging(host) {
  if (host === false) {
    return "host-to-expose";
  } else if (typeof host === "string" && LOCAL_IP_HOSTS.has(host)) {
    return "none";
  } else {
    return "visible";
  }
}
function formatConfigErrorMessage(err) {
  const errorList = err.issues.map(
    (issue) => `  ! ${bold(issue.path.join("."))}  ${red(issue.message + ".")}`
  );
  return `${red("[config]")} Astro found issue(s) with your configuration:
${errorList.join(
    "\n"
  )}`;
}
function formatErrorMessage(err, args = []) {
  args.push(`${bgRed(black(` error `))}${red(bold(padMultilineString(err.message)))}`);
  if (err.hint) {
    args.push(`  ${bold("Hint:")}`);
    args.push(yellow(padMultilineString(err.hint, 4)));
  }
  if (err.id) {
    args.push(`  ${bold("File:")}`);
    args.push(red(`    ${err.id}`));
  }
  if (err.frame) {
    args.push(`  ${bold("Code:")}`);
    args.push(red(padMultilineString(err.frame, 4)));
  }
  if (args.length === 1 && err.stack) {
    args.push(dim(err.stack));
  } else if (err.stack) {
    args.push(`  ${bold("Stacktrace:")}`);
    args.push(dim(err.stack));
    args.push(``);
  }
  return args.join("\n");
}
function printHelp({
  commandName,
  headline,
  usage,
  tables,
  description
}) {
  const linebreak = () => "";
  const title = (label) => `  ${bgWhite(black(` ${label} `))}`;
  const table = (rows, { padding }) => {
    const split = process.stdout.columns < 60;
    let raw = "";
    for (const row of rows) {
      if (split) {
        raw += `    ${row[0]}
    `;
      } else {
        raw += `${`${row[0]}`.padStart(padding)}`;
      }
      raw += "  " + dim(row[1]) + "\n";
    }
    return raw.slice(0, -1);
  };
  let message = [];
  if (headline) {
    message.push(
      linebreak(),
      `  ${bgGreen(black(` ${commandName} `))} ${green(
        `v${"1.1.5"}`
      )} ${headline}`
    );
  }
  if (usage) {
    message.push(linebreak(), `  ${green(commandName)} ${bold(usage)}`);
  }
  if (tables) {
    let calculateTablePadding2 = function(rows) {
      return rows.reduce((val, [first]) => Math.max(val, first.length), 0) + 2;
    };
    var calculateTablePadding = calculateTablePadding2;
    const tableEntries = Object.entries(tables);
    const padding = Math.max(...tableEntries.map(([, rows]) => calculateTablePadding2(rows)));
    for (const [tableTitle, tableRows] of tableEntries) {
      message.push(linebreak(), title(tableTitle), table(tableRows, { padding }));
    }
  }
  if (description) {
    message.push(linebreak(), `${description}`);
  }
  console.log(message.join("\n") + "\n");
}
export {
  cancelled,
  devStart,
  failure,
  formatConfigErrorMessage,
  formatErrorMessage,
  fsStrictWarning,
  getNetworkLogging,
  hmr,
  portInUse,
  prerelease,
  printHelp,
  reload,
  req,
  success,
  telemetryDisabled,
  telemetryEnabled,
  telemetryNotice,
  telemetryReset
};
