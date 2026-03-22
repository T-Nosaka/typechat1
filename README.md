This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## depedency

npm install -g npm@11.12.0

## Environment Variables

This project uses environment variables for configuration. Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add the necessary environment variables to this file.
* OCI Compartment ID
```
OCI_COMPARTMENTID = "ocid1.compartment.oc1..hogehoge...."
```
* OCI Config
```
OCI_CONFIG_PATH = "~/.oci/config"
```
* OCI Config define
```
OCI_CONFIG = "DEFAULT"
```
* OCI LLM Model
```
LLM_MODEL = "google.gemini-2.5-flash"
LLM_MAXTOKEN = "65530"
```
## Troubleshooting

### Migration Issues (e.g. x64 to arm64)

If you encounter errors related to missing native modules (e.g., `Error: Cannot find module ... lightningcss.linux-arm64-gnu.node`), please try performing a clean install of your dependencies:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

npm install next@latest react@latest react-dom@latest
