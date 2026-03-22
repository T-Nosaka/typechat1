// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  // ...既存の設定
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
