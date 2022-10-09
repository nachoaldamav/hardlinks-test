"use strict";exports.parse=parse,exports.init=void 0;const A=1===new Uint8Array(new Uint16Array([1]).buffer)[0];function parse(E,g="@"){if(!C)return init.then((()=>parse(E)));const I=E.length+1,o=(C.__heap_base.value||C.__heap_base)+4*I-C.memory.buffer.byteLength;o>0&&C.memory.grow(Math.ceil(o/65536));const i=C.sa(I-1);if((A?B:Q)(E,new Uint16Array(C.memory.buffer,i,I)),!C.parse())throw Object.assign(new Error(`Parse error ${g}:${E.slice(0,C.e()).split("\n").length}:${C.e()-E.lastIndexOf("\n",C.e()-1)}`),{idx:C.e()});const k=[],J=[];for(;C.ri();){const A=C.is(),Q=C.ie(),B=C.ai(),g=C.id(),I=C.ss(),o=C.se();let i;C.ip()&&(i=w(E.slice(-1===g?A-1:A,-1===g?Q+1:Q))),k.push({n:i,s:A,e:Q,ss:I,se:o,d:g,a:B})}for(;C.re();){const A=E.slice(C.es(),C.ee()),Q=A[0];J.push('"'===Q||"'"===Q?w(A):A)}function w(A){try{return(0,eval)(A)}catch(A){}}return[k,J,!!C.f()]}function Q(A,Q){const C=A.length;let B=0;for(;B<C;){const C=A.charCodeAt(B);Q[B++]=(255&C)<<8|C>>>8}}function B(A,Q){const C=A.length;let B=0;for(;B<C;)Q[B]=A.charCodeAt(B++)}let C;const init=WebAssembly.compile((E="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ajYCiApBARAhIQMLQQAoAogKIQICQCADQf0ARg0AIAIgAUYNBSACIQEgAkEAKAKMCk0NAQwFCwtBACACQQJqNgKICgwBC0EAIANBAmo2AogKQQEQIRpBACgCiAoiAiACECYaC0EBECEhAgtBACgCiAohAwJAIAJB5gBHDQAgA0ECakGeCEEGECgNAEEAIANBCGo2AogKIABBARAhECIPC0EAIANBfmo2AogKDAMLEB0PCwJAIAMpAAJC7ICEg7COwDlSDQAgAy8BChAeRQ0AQQAgA0EKajYCiApBARAhIQJBACgCiAohAyACECQaIANBACgCiAoQAkEAQQAoAogKQX5qNgKICg8LQQAgA0EEaiIDNgKICgtBACADQQRqIgI2AogKQQBBADoA5AkDQEEAIAJBAmo2AogKQQEQISEDQQAoAogKIQICQCADECRBIHJB+wBHDQBBAEEAKAKICkF+ajYCiAoPC0EAKAKICiIDIAJGDQEgAiADEAICQEEBECEiAkEsRg0AAkAgAkE9Rw0AQQBBACgCiApBfmo2AogKDwtBAEEAKAKICkF+ajYCiAoPC0EAKAKICiECDAALCw8LQQAgA0EKajYCiApBARAhGkEAKAKICiEDC0EAIANBEGo2AogKAkBBARAhIgJBKkcNAEEAQQAoAogKQQJqNgKICkEBECEhAgtBACgCiAohAyACECQaIANBACgCiAoQAkEAQQAoAogKQX5qNgKICg8LIAMgA0EOahACC6sGAQR/QQBBACgCiAoiAEEMaiIBNgKICgJAAkACQAJAAkACQAJAAkACQAJAQQEQISICQVlqDggCCAECAQEBBwALIAJBIkYNASACQfsARg0CC0EAKAKICiABRg0HC0EALwHqCQ0BQQAoAogKIQJBACgCjAohAwNAIAIgA08NBAJAAkAgAi8BACIBQSdGDQAgAUEiRw0BCyAAIAEQIg8LQQAgAkECaiICNgKICgwACwtBACgCiAohAkEALwHqCQ0BAkADQAJAAkACQCACQQAoAowKTw0AQQEQISICQSJGDQEgAkEnRg0BIAJB/QBHDQJBAEEAKAKICkECajYCiAoLQQEQIRpBACgCiAoiAikAAELmgMiD8I3ANlINBkEAIAJBCGo2AogKQQEQISICQSJGDQMgAkEnRg0DDAYLIAIQFwtBAEEAKAKICkECaiICNgKICgwACwsgACACECIMBQtBAEEAKAKICkF+ajYCiAoPC0EAIAJBfmo2AogKDwsQHQ8LQQBBACgCiApBAmo2AogKQQEQIUHtAEcNAUEAKAKICiICQQJqQZYIQQYQKA0BQQAoAvAJLwEAQS5GDQEgACAAIAJBCGpBACgCqAkQAQ8LQQAoAvwJQQAvAeoJIgJBAnRqQQAoAogKNgIAQQAgAkEBajsB6glBACgC8AkvAQBBLkYNAEEAQQAoAogKIgFBAmo2AogKQQEQISECIABBACgCiApBACABEAFBAEEALwHoCSIBQQFqOwHoCUEAKAKACiABQQJ0akEAKALECTYCAAJAIAJBIkYNACACQSdGDQBBAEEAKAKICkF+ajYCiAoPCyACEBdBAEEAKAKICkECaiICNgKICgJAAkACQEEBECFBV2oOBAECAgACC0EAQQAoAogKQQJqNgKICkEBECEaQQAoAsQJIgEgAjYCBCABQQE6ABggAUEAKAKICiICNgIQQQAgAkF+ajYCiAoPC0EAKALECSIBIAI2AgQgAUEBOgAYQQBBAC8B6glBf2o7AeoJIAFBACgCiApBAmo2AgxBAEEALwHoCUF/ajsB6AkPC0EAQQAoAogKQX5qNgKICg8LC0cBA39BACgCiApBAmohAEEAKAKMCiEBAkADQCAAIgJBfmogAU8NASACQQJqIQAgAi8BAEF2ag4EAQAAAQALC0EAIAI2AogKC5gBAQN/QQBBACgCiAoiAUECajYCiAogAUEGaiEBQQAoAowKIQIDQAJAAkACQCABQXxqIAJPDQAgAUF+ai8BACEDAkACQCAADQAgA0EqRg0BIANBdmoOBAIEBAIECyADQSpHDQMLIAEvAQBBL0cNAkEAIAFBfmo2AogKDAELIAFBfmohAQtBACABNgKICg8LIAFBAmohAQwACwu/AQEEf0EAKAKICiEAQQAoAowKIQECQAJAA0AgACICQQJqIQAgAiABTw0BAkACQCAALwEAIgNBpH9qDgUBAgICBAALIANBJEcNASACLwEEQfsARw0BQQBBAC8B5gkiAEEBajsB5glBACgC+AkgAEEBdGpBAC8B7Ak7AQBBACACQQRqNgKICkEAQQAvAeoJQQFqIgA7AewJQQAgADsB6gkPCyACQQRqIQAMAAsLQQAgADYCiAoQHQ8LQQAgADYCiAoL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","undefined"!=typeof Buffer?Buffer.from(E,"base64"):Uint8Array.from(atob(E),(A=>A.charCodeAt(0))))).then(WebAssembly.instantiate).then((({exports:A})=>{C=A}));var E;exports.init=init;