# Build a Non-Profit App with Next and Cosmic

There are a number of local and global issues happening right now and most of the time it feels like there's not much we can do to help. But there's always something we can do! Even if it means striking out and starting our own non-profit organization or joining to help a smaller, existing one from a technical standpoint.

For example, there are still students at all grade levels trying get support to further their educations so they can help with some of the bigger problems in the world. Helping them learning what they need to handle the future coming for them is something that will make a huge difference in the way things move forward.

That's why we're going to build a simple non-profit app that will show off potential students and their stories and it will allow anyone who wants to donate to do so using [Stripe](https://stripe.com/). By the time you finish this tutorial, you'll have a basic template for a student-donor website that uses [TailwindCSS](https://tailwindcss.com/) so you can expand on it later.

## Making a Cosmic account

The first thing you'll need to set up is a [free Cosmic account](https://app.cosmicjs.com/signup). Then you'll be prompted to create a new project. Make sure that you select the "Start from scratch" option. The name of the project is `non-profit-cms`, but feel free to call it anything you want. You can leave the bucket environment as "Production".

![new Cosmic project screen](https://cdn.cosmicjs.com/fda2ef10-af9e-11ec-97bc-19d12908cbbe-Screenshot-from-2022-03-29-15-29-17.png)

Next, we'll need to make a few object types for our donors and students. In the Cosmic dashboard, go to "Add Object Type". You'll see this screen.

![new object type](https://cdn.cosmicjs.com/ee335620-afa1-11ec-97bc-19d12908cbbe-Screenshot-from-2022-03-29-15-50-25.png)

Make sure you choose the "Multiple" object option. You only have to fill in the "Singular Name" with `Donor` and the other two fields auto-generate. Further down, we need to define the metafields in the "Content Model".

![new metafield](https://cdn.cosmicjs.com/aba57050-afaa-11ec-97bc-19d12908cbbe-Screenshot-from-2022-03-29-16-53-10.png)

We'll have a few different fields for our donors: a student name, donation amount, and optionally, a donor name and message. You should have the following metafields when you're done.

![complete donor object type](https://cdn.cosmicjs.com/fee15a20-afac-11ec-97bc-19d12908cbbe-Screenshot-from-2022-03-29-17-09-13.png)

We'll add new donor objects every time a donation is made through Stripe and then we'll be able to show donations for each student once we start building the Next app. Before we get there, let's finish up the object types we'll need by adding another type called `Student`.

You'll go back to your Cosmic dashboard and create a "New Object Type". It will also have the "Multiple" type and this time the "Singular Name" will be `Student`. Once again, we need to create some metafields for this object type. So scroll down to the "Content Model" section add these metafields: the student name, a major, a university, their story, and a headshot. Here's what all of the metafields should look like when you're finished.

![complete student object type](https://cdn.cosmicjs.com/fee15a20-afac-11ec-97bc-19d12908cbbe-Screenshot-from-2022-03-29-17-09-13.png)

That's all we need to get everything set up in Cosmic.

### Getting some values for the Next app

Now that we have Cosmic configured like we need, let's get a few environment variables we'll need for the Next app we about to build. Go to your Cosmic Dashboard and go to `Settings > API Access`. This will give you the ability to access, read, and write to your Cosmic project. We'll be working with the students and donors so that we're able to maintain good records of who to send the proper student updates to.

Before we make the Next project, there's one more service we need to get configured correctly. We need to have Stripe so that we can accept donations.

## Setting up your Stripe account

You'll need to go to the Stripe site to [create a free account](https://dashboard.stripe.com/login). The main things you'll want to make sure of here is that your dashboard is left in test mode and that you add a "Public business name" in `Settings > Account Details`.

Now that your dashboard is configured, you can get the last two environment variables we'll need for the app. Go to [`Developers > API keys`](https://dashboard.stripe.com/test/apikeys) and get your `Publishable key` and `Secret key`.

With these values, we're ready to make this Next app.

## Setting up the Next.js app

Lucky for us, there is a `yarn` command to generate a new Next app with the configs in place. That way we can just jump into writing code. To generate this project, run the following command in your terminal:

```bash
$ yarn create next-app --typescript
```

Then we can add the packages we'll be working with the following command:

```bash
$ yarn add cosmicjs tailwindcss stripe postcss
```

There's just one last piece of setup we need to do before we can dive into the code.

### Adding the .env file

Remember those values we grabbed from our Cosmic dashboard and our Stripe dashboard? We're going to add them to the project in a `.env` file. In the root of the project, add a new `.env` file. Inside that file, add the following values:

```env
READ_KEY=your_cosmic_read_key
WRITE_KEY=your_cosmic_write_key
BUCKET_SLUG=your_cosmic_bucket_slug

STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

With all of these values finally in place, we can get to the fun part of building the app.

## Displaying all of the students

e can start working on the Next app to display all of the students to anyone who visits the website. We'll start by updating the existing `index.tsx` file to import and use Cosmic to pull in the student data. So add the follow code right below the existing imports in the file.

```tsx
...
import Cosmic from 'cosmicjs'

const api = Cosmic()

const bucket = api.bucket({
  slug: process.env.BUCKET_SLUG,
  read_key: process.env.READ_KEY,
})
...
```

Then, we'll need to add the `getStaticProps` function to fetch the student data from Cosmic:

```tsx
export async function getStaticProps() {
  const query = {
    type: "students",
  }
  const studentsReq = await bucket.getObjects({ query })
  const students: Student[] = studentsReq.objects

  return {
    props: {
      students,
    },
  }
}
```

This function only runs at build time for a page, so you won't be making a request each time. Inside this function, we're defining the `query` that we'll send in the Cosmic request. Then we make the request to the `bucket` we defined earlier and we get all of the student objects returned. Finally, we send the `students` array to the props of the page component.

Now that we have this data, we can render some elements to the home page. You can remove all of the current code that's inside the `Home` component and replace it with this.

```tsx
...
const Home: NextPage = ({ students }) => {
  if (!students) {
    return <div>Loading our incredible students...</div>
  }

  return (
    <div>
      <Head>
        <title>Student Raiser</title>
        <meta name="description" content="A website dedicated to helping students receive the funding they need for college" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="container pb-8 text-2xl">
          All of our students
        </h1>
        <div
          className="flex gap-4 p-11"
        >
          {
            students.map((student: Student) => (
              <Link
                passHref
                key={student.metadata.name}
                href={`/student/${encodeURIComponent(student.slug)}`}
              >
                <div
                  key={student.slug}
                  className="hover:text-blue-600 border-2 rounded p-4 w-64"
                >
                  <div className="text-lg text-amber-800">
                    {student.metadata.name}
                  </div>
                  <Image
                    src={student.metadata.student_headshot.url}
                    alt={student.metadata.name}
                    height={250}
                    width={250}
                  />
                  <div>{student.metadata.major}</div>
                  <div>{student.metadata.university}</div>
                  <div>{student.metadata.story}</div>
                </div>
              </Link>
            ))
          }
        </div>
      </main>
    </div>
  )
}
...
```

It's mapping over the `students` array to create an element to highlight each student. Each of these elements can be clicked on to learn more about a particular student and that's the page we're going to work on now. We'll come back and add more styling, but if you run the app with `yarn dev`, you should see something similar to this.

![students on the home page](https://cdn.cosmicjs.com/753670c0-b07f-11ec-97bc-19d12908cbbe-Screenshot-from-2022-03-30-18-16-28.png)

## Making a page for individual students

Now, we'll use Next's built-in dynamic routing to create pages for each student. Go ahead and add a new folder in the `pages` directory called `student`. Inside of that folder, add a new file called `[name].tsx`.

Let's start by adding the imports we'll need to get this page working. At the top of the `[name].tsx` file, add the following lines.

```tsx
import { useEffect } from 'react'
import Cosmic from 'cosmicjs'
import Image from 'next/image'
import { Donor, Student } from '../../types'
```

Don't worry about the types file yet. We'll be adding that shortly. For now, let's add a skeleton for the `Student` component below our imports.

```tsx
function Student({ student, donors }) {
    return (
        <>
            <h2 className="text-3xl pb-8">{student.metadata.name}</h2>
        </>
    )
}

export default Student
```

We'll be adding a lot more to this component, but we have to get the `student` and `donors` data first. We'll use the `getServerSideProps` function to pull the data for a specific student from Cosmic each time this route is called. None of this is happening in the browser, so the data is still secure.

```tsx
export async function getServerSideProps(context) {
    const slug = context.params.name

    const api = Cosmic()

    const bucket = api.bucket({
        slug: process.env.BUCKET_SLUG,
        read_key: process.env.READ_KEY,
    })

    const studentRes = await bucket.getObjects({
        props: "metadata,id",
        query: {
            slug: slug,
            type: "students",
        }
    })

    const student: Student = studentRes.objects[0]
    const donorsRes = await bucket.getObjects({
        props: "metadata",
        query: {
            type: "donors",
            'metadata.student': {
                $eq: student.id
            },
        }
    })
    const donors: Donor[] = donorsRes?.objects
    

    return {
        props: {
            student,
            donors
        },
    }
}
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

Now you have a fully-integrated donation website that you can customize for any type of fundraiser-donor non-profit. Feel free to clone this and change the styles to match your own business needs.