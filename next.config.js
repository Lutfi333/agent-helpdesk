/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (config) => {
    /** @type {import('webpack').Configuration} */
    const c = config;
    c.resolve.alias.canvas = false;
    c.plugins = c.plugins || [];

    c.plugins.push(
      require("unplugin-auto-import/webpack").default({
        imports: [
          "react",
          "react-i18next",
          {
            "next/navigation": [
              "useRouter",
              "usePathname",
              "useSearchParams",
              "useSearchParamsState",
              "navigate",
            ],
          },
        ],
        dirs: [
          "./src/common/**/*",
          "./src/hooks/**/*",
          "./src/components/**/*",
        ],
        eslintrc: {
          enabled: true,
        },
        dts: "./auto-imports.d.ts",
        include: [/\.ts$/, /\.tsx$/],
      })
    );

    return c;
  },
};

module.exports = nextConfig;
