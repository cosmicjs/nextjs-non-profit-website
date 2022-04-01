import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Student } from '../types'

import Cosmic from 'cosmicjs'

const api = Cosmic()

const bucket = api.bucket({
  slug: process.env.BUCKET_SLUG,
  read_key: process.env.READ_KEY,
})



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
        <h1 className="container pt-8 text-2xl">
          All of our students
        </h1>
        <div
          className="flex flex-wrap gap-4 p-11"
        >
          {
            students.map((student: Student) => (
              <div
                className="h-96 hover:cursor-pointer hover:text-xl"
                key={student.metadata.name}
              >
                <Link
                  passHref
                  href={`/student/${encodeURIComponent(student.slug)}`}
                >
                  <div
                    key={student.slug}
                    className="border-2 rounded p-4 w-64"
                  >
                    <div className="text-amber-800">
                      {student.metadata.name}
                    </div>
                    <Image
                      src={student.metadata.student_headshot.url}
                      alt={student.metadata.name}
                      height={300}
                      width={300}
                    />
                    <div className="border-b-2 p-1">{student.metadata.major}</div>
                    <div className="p-1">{student.metadata.university}</div>
                  </div>
                </Link>
              </div>
            ))
          }
        </div>
      </main>
    </div>
  )
}

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

export default Home
