const{resolve}=require("path"),{existsSync}=require("fs");exports.$defaults=function(l){let{FORCE_COLOR:e,NO_COLOR:s,NODE_DISABLE_COLORS:o,TERM:t}=process.env,i=process.argv.slice(2),n=new Set(i),f=n.has("-q")||n.has("--quiet"),d=!o&&s==null&&t!=="dumb"&&(e!=null&&e!=="0"||process.stdout.isTTY),r=n.has("--tsmconfig")?i.indexOf("--tsmconfig"):-1,a=resolve(".",!!~r&&i[++r]||"tsm.js");return{file:existsSync(a)&&a,isESM:l==="esm",options:{format:l,charset:"utf8",sourcemap:"inline",target:"node"+process.versions.node,logLevel:f?"silent":"warning",color:d}}},exports.$finalize=function(l,e){let s=l.options;e&&e.common&&(Object.assign(s,e.common),delete e.common);let o={".mts":{...s,loader:"ts"},".jsx":{...s,loader:"jsx"},".tsx":{...s,loader:"tsx"},".cts":{...s,loader:"ts"},".ts":{...s,loader:"ts"}};l.isESM?o[".json"]={...s,loader:"json"}:o[".mjs"]={...s,loader:"js"};let t;if(e&&e.loaders)for(t in e.loaders)o[t]={...s,loader:e.loaders[t]};else if(e){let i=e.config||e;for(t in i)o[t]={...s,...i[t]}}return o};