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
