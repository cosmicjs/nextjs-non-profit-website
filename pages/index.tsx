import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { Student } from '../types'

const Home: NextPage = ({ students }) => {
  if (!students) {
    return <div>Loading our incredible students...</div>
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Student Raiser</title>
        <meta name="description" content="A website dedicated to helping students receive the funding they need for college" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          All of our students
        </h1>
        {
          students.map((student: Student) => (
            <Link
              passHref
              key={student.metadata.name}
              href={`/student/${encodeURIComponent(student.slug)}`}
            >
              <div key={student.slug}>
                <div>{student.metadata.name}</div>
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
