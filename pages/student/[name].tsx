import { useEffect } from 'react'
import Cosmic from 'cosmicjs'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js';
import { Donor, Student } from '../../types'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function Student({ student, donors }) {
    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
            console.log('Donation made! You will receive an email confirmation.');
        }

        if (query.get('canceled')) {
            console.log('Donation canceled -- something weird happened but please try again.');
        }
    }, []);

    return (
        <>
            <h2 className="text-3xl pb-8">{student.metadata.name}</h2>
            <div className="container flex gap-4">
                <Image
                    src={student.metadata.student_headshot.url}
                    alt={student.metadata.name}
                    height={250}
                    width={250}
                />
                <div>
                    <p>{student.metadata.major}</p>
                    <p>{student.metadata.university}</p>
                    <p>{student.metadata.story}</p>
                    <form action="/api/donation" method="POST">
                        <button type="submit" role="link" className="text-lg bg-lime-500 w-64 mt-6 mx-8">
                            Make a Donation
                        </button>
                    </form>
                </div>
            </div>
            <div
                className="flex gap-4 p-11"
            >
                {
                    donors?.map((donor: Donor) => (
                        <div key={donor.slug} className="hover:text-blue-600 border-2 rounded p-4 w-64">
                            <p>{donor.metadata.name || 'Anon'}</p>
                            <p>${donor.metadata.amount}</p>
                            <p>{donor.metadata.message || 'Good luck!'}</p>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

// This gets called on every request
export async function getServerSideProps(context) {
    const slug = context.params.name

    const api = Cosmic()

    const bucket = api.bucket({
        slug: process.env.BUCKET_SLUG,
        read_key: process.env.READ_KEY,
    })

    const studentRes = await bucket.getObjects({
        props: "metadata",
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
                $eq: student.metadata.name
            },
        }
    })

    const donors: Donor[] = donorsRes.objects

    return {
        props: {
            student,
            donors
        },
    }
}

export default Student
