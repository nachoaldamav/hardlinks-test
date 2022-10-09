import MagicString from "magic-string";
import { rehype } from "rehype";
import { VFile } from "vfile";
import escape from "./escape.js";
import slots, { SLOT_PREFIX } from "./slots.js";
async function transform(code, id) {
  const s = new MagicString(code, { filename: id });
  const imports = /* @__PURE__ */ new Map();
  const parser = rehype().data("settings", { fragment: true }).use(escape, { s }).use(slots, { s });
  const vfile = new VFile({ value: code, path: id });
  await parser.process(vfile);
  s.prepend(
    `export default {
	"astro:html": true,
	render({ slots: ${SLOT_PREFIX} }) {
		return \``
  );
  s.append("`\n	}\n}");
  if (imports.size > 0) {
    let importText = "";
    for (const [path, importName] of imports.entries()) {
      importText += `import ${importName} from "${path}";
`;
    }
    s.prepend(importText);
  }
  return {
    code: s.toString(),
    map: s.generateMap()
  };
}
export {
  transform
};
