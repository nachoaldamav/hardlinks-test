"use strict"

const { commonGlobals, commonRules } = require("./_commons")

module.exports = {
    globals: {
        ...commonGlobals,
        __dirname: "readonly",
        __filename: "readonly",
        exports: "writable",
        module: "readonly",
        require: "readonly",
    },
    parserOptions: {
        ecmaFeatures: { globalReturn: true },
        ecmaVersion: 2019,
        sourceType: "script",
    },
    plugins: ["n"],
    rules: {
        ...commonRules,
        "n/no-unsupported-features/es-syntax": ["error", { ignores: [] }],
    },
}
