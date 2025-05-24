import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    ...compat.config({
        extends: ["next/core-web-vitals", "next/typescript", "next", "prettier"],
        rules: {
            "react/jsx-max-props-per-line": ["error", { maximum: 2 }],
        },
    }),
]

export default eslintConfig
