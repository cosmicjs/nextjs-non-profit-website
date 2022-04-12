# Next.js Non-Profit Website
A non-profit website template powered by the [Cosmic headless CMS](https://www.cosmicjs.com). Uses Next.js, Tailwind CSS, and Stripe for donation payment processing.

## Links
[Read how this website is built](https://www.cosmicjs.com/articles/build-a-non-profit-app-with-next-and-cosmic)<br/>
[Install the App Template](https://www.cosmicjs.com/apps/nextjs-non-profit-website)<br/>
[View the live demo](https://nextjs-non-profit-website.vercel.app/)

## Screenshots
<img width="1116" alt="nextjs-non-profit-website-1" src="https://user-images.githubusercontent.com/1950722/162981025-da14b0ab-25ef-436d-b248-a851c403dc71.png">
<img width="1375" alt="nextjs-non-profit-website-2" src="https://user-images.githubusercontent.com/1950722/162981041-b316e4d1-2a59-4c9e-b49a-a52f653825aa.png">

## Getting Started
First, install the dependencies with

```bash
yarn
```

Then, run the development server:

```bash
yarn dev
```

## Environment Variables

You'll need to create an `.env` file in the root of the project. It should have the following values:

```env
BUCKET_SLUG=your_cosmic_bucket_slug
READ_KEY=your_cosmic_read_key
WRITE_KEY=your_cosmic_write_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Deploy
<p>Use the following button to deploy to <a href="https://vercel.com/" rel="noopener noreferrer" target="_blank">Vercel</a>. You will need to add API accesss keys as environment variables. Find these in <em>Bucket Settings &gt; API Access</em><em>.</em></p>
<p>
<a href="https://vercel.com/import/git?c=1&s=https://vercel.com/import/git?c=1&s=https://github.com/cosmicjs/nextjs-non-profit-website&env=READ_KEY,WRITE_KEY,BUCKET_SLUG,STRIPE_SECRET_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" rel="noopener noreferrer" target="_blank"><img src="https://cdn.cosmicjs.com/d3f0d5e0-c064-11ea-9a05-6f8a16b0b14c-deploy-to-vercel.svg" style="width: 100px;" class="fr-fic fr-dib fr-fil"></a>
</p>
