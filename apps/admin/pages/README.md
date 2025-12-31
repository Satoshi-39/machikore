# Why is this folder empty?

This empty `pages` folder is intentionally placed here to prevent Next.js from using `src/pages` as the Pages Router.

Next.js will try to use `src/pages` as the Pages Router even if you use the App Router, which would break the build and conflict with the FSD (Feature-Sliced Design) pages layer.

By having this empty `pages` folder at the root, Next.js recognizes it as the Pages Router location and ignores `src/pages`, allowing FSD to work correctly.

Reference: https://feature-sliced.design/docs/guides/tech/with-nextjs
