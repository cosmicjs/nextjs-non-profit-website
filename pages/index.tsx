import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Student } from '../types'

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

export async function getStaticProps() {
  const cosmicUrl = `${process.env.BASE_URL}/buckets/${process.env.BUCKET_SLUG}/objects`

  const query = {
    type: "students",
  }

  const params = {
    read_key: process.env.READ_KEY,
    query: encodeURIComponent(JSON.stringify(query)),
    limit: 10,
  }

  // const studentsReq = await axios.get(cosmicUrl, { params })

  const studentsReq = await axios.get(`${cosmicUrl}?read_key=${process.env.READ_KEY}&query=%7B%22type%22%3A%22students%22%7D`)

  const students: Student[] = studentsReq.data.objects

  return {
    props: {
      students,
    },
  }
}

export default Home
