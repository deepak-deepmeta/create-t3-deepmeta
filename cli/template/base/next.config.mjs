/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

import CopyPlugin from 'copy-webpack-plugin'
import path from 'path';

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      const publicDir = path.join(process.cwd(), "public").replace(/\\/g, "/")
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            { from: '../../packages/ui/dist/*.{png, jpg}', to: path.join(publicDir, '[name][ext]') }
          ]
        })
      )
    }
    return config
  },
  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
export default config;
