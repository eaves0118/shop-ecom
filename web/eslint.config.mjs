import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier, // tắt rule format để nhường cho Prettier
  {
    rules: {
      "no-unused-vars": "warn", // Cảnh báo biến không sử dụng
      "@typescript-eslint/no-explicit-any": "warn", // Không cho phép dùng 'any'
      "react/react-in-jsx-scope": "off", // Next.js không cần import React
      // "no-console": ["warn", { allow: ["warn", "error"] }], // Hạn chế console.log
      "no-console": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
