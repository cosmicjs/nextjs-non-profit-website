import { useEffect } from 'react'
import Cosmic from 'cosmicjs'
import { Donor, Student } from '../../types'
import Navigation from '../../components/Navigation'
import { UserCircleIcon, UserIcon } from '@heroicons/react/solid'

const api = Cosmic()

const bucket = api.bucket({
    slug: process.env.BUCKET_SLUG,
    read_key: process.env.READ_KEY,
})

function Student({ student, donors, total }) {
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`${student.metadata.student_headshot.imgix_url}?w=800`}
                        alt={student.metadata.name}
                        style={{ backgroundPosition: "cover" }}
                    />
                    <div className="container border-y-2 my-4">
                        <p className="font-bold">Major: {student.metadata.major}</p>
                        <p className="font-bold border-b-2">University: {student.metadata.university}</p>
                        <p className="py-2">{student.metadata.story}</p>
                    </div>
                </div>
                <div>
                    <p className="font-bold text-xl pb-4">Total raised: ${total}</p>
                    <form action="/api/donation" method="POST" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <input name="student_id" type="hidden" value={student.id} />
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                                Donation Amount
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="amount" type="number" defaultValue={100} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Name
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="name" type="text" defaultValue="Anonymous" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Message
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="message" type="text" defaultValue="Good Luck!" />
                        </div>
                        <div>
                            <button type="submit" role="link" className="hover:bg-lime-400 text-white font-bold py-2 px-4 border-b-12 border-lime-700 hover:border-lime-500 rounded-full text-lg bg-lime-500 w-64 mt-6 mx-8">
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

    const studentRes = await bucket.getObjects({
        props: "metadata,id",
        query: {
            slug: slug,
            type: "students",
        }
    })

    const student: Student = studentRes.objects[0]

    try {
        const donorsRes = await bucket.getObjects({
            props: "metadata",
            query: {
                type: "donors",
                "metadata.student": slug,
            }
        })

        let total

        const donors: Donor[] = donorsRes ? donorsRes.objects : null

        if (donors.length === 1) {
            total = donors[0].metadata.amount
        } else {
            total = donors.map(donor => donor.metadata.amount).reduce((prev, curr) => prev + curr, 0)
        }

        return {
            props: {
                student,
                donors,
                total
            },
        }
    } catch {
        return {
            props: {
                student,
                donors: null,
                total: 0
            },
        }
    }
}

export default Student
