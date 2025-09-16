// eslint.config.mjs
import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
    // Ignorieren
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "build/**",
            "coverage/**",
            ".vite/**",
            ".next/**",
            // keine Lint-Schleife über die eigene Config/CI-Artefakte
            "eslint.config.*",
        ],
    },

    // Basis: JS-Empfehlungen (untyped)
    eslintJs.configs.recommended,

    // Basis: TS-Empfehlungen ohne Type-Infos (schnell, untyped)
    ...tseslint.configs.recommended,

    // React + Hooks (gilt für JSX/TSX)
    {
        files: ["**/*.{jsx,tsx}"],
        plugins: { react: reactPlugin, "react-hooks": reactHooks },
        settings: { react: { version: "detect" } },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
        },
    },

    // Typed-Linting NUR für Projektquellen mit Type-Infos
    // -> nutzt den Project Service, findet tsconfig automatisch relativ zu dieser Datei
    ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
        ...cfg,
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            ...(cfg.languageOptions ?? {}),
            parserOptions: {
                ...(cfg.languageOptions?.parserOptions ?? {}),
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    })),

    // Optional: Stylistic typed rules (ebenfalls nur für src)
    ...tseslint.configs.stylisticTypeChecked.map((cfg) => ({
        ...cfg,
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            ...(cfg.languageOptions ?? {}),
            parserOptions: {
                ...(cfg.languageOptions?.parserOptions ?? {}),
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    })),

    // Eigene Zusatzregeln für typed-Bereich
    {
        files: ["src/**/*.{ts,tsx}"],
        rules: {
            // "@typescript-eslint/await-thenable": "error",
            // Beispiele zum Entschärfen, falls nötig:
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            // "@typescript-eslint/no-unsafe-assignment": "off",
            // "@typescript-eslint/no-unsafe-call": "off",
        },
    },

    // Tests: erlaubte Globals & ggf. mildere Regeln
    {
        files: ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                // Vitest-Globals (minimal, damit describe/it/expect/vi nicht meckern)
                describe: "readonly",
                it: "readonly",
                test: "readonly",
                expect: "readonly",
                vi: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly",
            },
        },
        rules: {
            // Beispiele: Tests weniger streng
            // "@typescript-eslint/no-explicit-any": "off",
            // "@typescript-eslint/no-unused-expressions": "off",
        },
    },
];
