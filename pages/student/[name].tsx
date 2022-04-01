import { useEffect } from 'react'
import Cosmic from 'cosmicjs'
import Image from 'next/image'
import { Donor, Student } from '../../types'
import Navigation from '../../components/Navigation'
import { UserCircleIcon, UserIcon } from '@heroicons/react/solid'

function Student({ student, donors, total }) {
    console.log(donors)
    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search)

        if (query.get('success')) {
            console.log('Donation made! You will receive an email confirmation.');
        }

        if (query.get('canceled')) {
            console.log('Donation canceled -- something weird happened but please try again.');
        }
    }, []);

    return (
        <div>
            <Navigation />
            <h2 className="container text-3xl py-8">{student.metadata.name}</h2>
            <div className="container flex gap-4">
                <div>
                    <Image
                        src={student.metadata.student_headshot.url}
                        alt={student.metadata.name}
                        height={900}
                        width={1050}
                    />
                    <div className="container border-y-2 my-4">
                        <p className="font-bold">Major: {student.metadata.major}</p>
                        <p className="font-bold border-b-2">University: {student.metadata.university}</p>
                        <p className="py-2">{student.metadata.story}</p>
                    </div>
                </div>
                <div>
                    <p className="font-bold text-xl pb-4">Total raised: ${total}</p>
                    <form action="/api/donation" method="POST">
                        <input name="student_id" type="hidden" value={student.id} />
                        <div>
                            <label>
                                Donation Amount<br />
                                $<input className="border" name="amount" type="number" defaultValue={100} />
                            </label>
                        </div>
                        <div>
                            <label>
                                Name<br />
                                <input className="border" name="name" type="text" defaultValue="Anonymous" />
                            </label>
                        </div>
                        <div>
                            <label>
                                Message<br />
                                <input className="border" name="message" type="text" defaultValue="Good Luck!" />
                            </label>
                        </div>
                        <div>
                            <button type="submit" role="link" className="text-lg bg-lime-500 w-64 mt-6 mx-8">
                                Make a Donation
                            </button>
                        </div>
                    </form>
                    <div className="flex flex-col gap-4 pt-4 w-full">
                        {
                            donors ? donors.map((donor: Donor) => (
                                <div key={donor.slug} className="border-y-2 rounded p-4 w-64 flex gap-4">
                                    <UserCircleIcon className="h-12 w-12 text-green-300" />
                                    <div>
                                        <p>{donor.metadata.name}</p>
                                        <p>${donor.metadata.amount}</p>
                                    </div>
                                </div>
                            ))
                                :
                                <div className="border-2 rounded p-4 w-64 flex gap-4">
                                    <UserCircleIcon className="h-12 w-12 text-green-300" />
                                    <p>Be the first donor!</p>
                                </div>
                        }
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 p-11 w-full">
                <h2 className="text-xl font-bold">Encouragement</h2>
                {
                    donors ? donors.map((donor: Donor) => (
                        <div key={donor.slug} className="flex flex-col border-y-2 rounded p-4 gap-4">
                            <div className="w-64 flex gap-4 w-full">
                                <UserIcon className="h-12 w-12 text-green-300" />
                                <div className="flex flex-col">
                                    <p>{donor.metadata.name}</p>
                                    <p>${donor.metadata.amount}</p>
                                </div>
                            </div>
                            <p>{donor.metadata.message}</p>
                        </div>
                    ))
                        :
                        <div>You can do it!</div>
                }
            </div>
        </div>
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
        props: "metadata,id",
        query: {
            slug: slug,
            type: "students",
        }
    })

    const student: Student = studentRes.objects[0]

    let donorsRes, total

    try {
        donorsRes = await bucket.getObjects({
            props: "metadata",
            query: {
                type: "donors",
                'metadata.student': {
                    $eq: slug
                },
            }
        })

        total = donorsRes.objects.reduce((a, b) => (a.metadata.amount + b.metadata.amount))
    } catch {
        donorsRes = null
        total = 0
    }

    const donors: Donor[] = donorsRes ? donorsRes.objects : null

    return {
        props: {
            student,
            donors,
            total
        },
    }
}

export default Student
