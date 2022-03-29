# Build a non-profit app with Next.js and Cosmic.js CMS

## Setting up the Next.js app

Run the following command in your terminal to create a new Next.js app:

```bash
$ yarn create next-app --typescript
```

Let's add the packages we'll be working with:

```bash
$ yarn add cosmicjs styled-components
```

### Creating the admin area in Cosmic.js

![set up user account]()
![make new project]()
![add a the student object]()
![add a the donor object]()

Make sure you get the `Bucket Slug` and `Read Key` from the API Access section in Settings. We'll need this to make requests to Cosmic to get our data.

![getting the required values for API requests from settings > API access]()

## Displaying all of the students

Now that we have the admin area set up, we can start working on the Next app to display this content to our users. We'll start by updating the existing `index.tsx` file to use the `getStaticProps` function to fetch the students' data from Cosmic:

```tsx
getStaticProps code here
```

Then we'll pass this data to the component to render it to the users.

```tsx
component code here
```

## Making a page for individual students

Next, we'll use Next's built-in dynamic routing to create pages for each student. Go ahead and add a new folder in the `pages` directory called `student`. Inside of that folder, add a new file called `[name].js`.

We'll get the name for the student and use that in the `getServerSideProps` function to pull the data for a specific student from Cosmic each time this route is called. None of this is happening in the browser, so the data is still secure.

```tsx
getServerSideProps code here
```

Then we'll pass this data to the component to highlight a specific student it to the users and potential donors.

```tsx
component code here
```

## Showing donors for the student

Now that we have the page for individual students, we need to show which donors have contributed to their funds. To do that, we'll add some new donors in the Cosmic admin area.

![adding new donor objects in Cosmic]()

This will give us some data to display for each of the students and we can add this to our existing `getServerSideProps` function.

```tsx
add donor call in getServerSideProps and add donor data to props here
```

### Adding a donation link

The last thing we need to add is a donation button. We're going to use [Stripe](https://stripe.com/) to handle those payments.

```tsx
stripe code here
```

## Finished code

You can find all of the code for this project in this repo and you can check out some of front-end stuff in this Code Sandbox.

## Conclusion