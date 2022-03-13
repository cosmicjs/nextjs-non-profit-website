import axios from 'axios'
import Image from 'next/image'
import { Donor, Student } from '../../types'

function Student({ student, donors }) {
    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'space-evenly'
            }}>
                <Image
                    src={student.metadata.student_headshot.url}
                    alt={student.metadata.name}
                    height={250}
                    width={250}
                />
                <div style={{ width: '30%' }}>
                    <h2>{student.metadata.name}</h2>
                    <p>{student.metadata.major}</p>
                    <p>{student.metadata.university}</p>
                    <p>{student.metadata.story}</p>
                </div>
            </div>
            {
                donors?.map((donor: Donor) => {
                    <>
                        <p>{donor.metadata.name || 'Anon'}</p>
                        <p>$ {donor.metadata.amount}</p>
                        <p>{donor.metadata.message || 'Good luck!'}</p>
                    </>
                })
            }
        </>
    )
}

// This gets called on every request
export async function getServerSideProps(context) {
    const slug = context.params.name

    const cosmicUrl = `${process.env.BASE_URL}/buckets/${process.env.BUCKET_SLUG}/objects`

    const studentQuery = {
        type: "students",
        slug: slug
    }

    const studentParams = {
        query: encodeURIComponent(JSON.stringify(studentQuery)),
        limit: 10,
        read_key: process.env.READ_KEY,
    }

    // const studentReq: Student = await axios.get(cosmicUrl, { params: studentParams })

    // const donorsReq: Donor[] = await axios.get(cosmicUrl, { params: donorParams })

    const studentReq = await axios.get(`${cosmicUrl}?read_key=${process.env.READ_KEY}&query=%7B%22slug%22%3A%22${slug}%22%7D`)

    const student: Student = studentReq.data.objects[0]

    const donorsQuery = {
        type: "donors",
        "$or": [{"metadata.student": student.metadata.name}]
    }

    const donorsParams = {
        query: encodeURIComponent(JSON.stringify(donorsQuery)),
        limit: 10,
        read_key: process.env.READ_KEY
    }
    
    const donorsReq = await axios.get(`${cosmicUrl}?read_key=${process.env.READ_KEY}&query=%7B%22%24or%22%3A%20%5B%7B%22metadata.student%22%3A%20${encodeURIComponent(JSON.stringify(student.metadata.name))}%7D%5D%7D`)

    const donors: Donor[] = donorsReq.data.objects

    return {
        props: {
            student,
            donors
        },
    }
}

export default Student
