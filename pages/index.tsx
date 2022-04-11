import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
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
        <meta
          name="description"
          content="A website dedicated to helping students receive the funding they need for college"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="px-11 pt-11 text-2xl">Students in your area</h1>
        <div className="flex flex-wrap gap-4 p-11">
          {students.map((student: Student) => (
            <div
              className="hover:cursor-pointer w-64"
              key={student.metadata.name}
            >
              <Link
                passHref
                href={`/student/${encodeURIComponent(student.slug)}`}
              >
                <div
                  key={student.slug}
                  className="border-2 rounded max-w-sm rounded overflow-hidden shadow-lg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${student.metadata.student_headshot.imgix_url}?w=400`}
                    alt={student.metadata.name}
                    className="w-full"
                    style={{ backgroundPosition: 'cover' }}
                  />
                  <div className="p-4">
                    <div className="text-amber-800 p-1">
                      {student.metadata.name}
                    </div>
                    <div className="border-b-2 p-1">
                      {student.metadata.major}
                    </div>
                    <div className="p-1">{student.metadata.university}</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const query = {
    type: 'students',
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
