import Image from 'next/image'

function Student({ student, donors }) {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Image src={student.student_headshot} alt={student.name} height={250} width={250} />
                <div style={{ width: '30%' }}>
                    <h2>{student.name}</h2>
                    <p>{student.major}</p>
                    <p>{student.university}</p>
                    <p>{student.story}</p>
                </div>
            </div>
            {
                donors.map(donor => {
                    <>
                        <p>{donor.name || 'Anon'}</p>
                        <p>{donor.amount}</p>
                        <p>{donor.message || 'Good luck!'}</p>
                    </>
                })
            }
        </>
    )
}

// This gets called on every request
export async function getServerSideProps(context) {
    const slug = context.params.name

    const student = {} // fetch from Cosmic
    const donors = {} // fetch from Cosmic
    

    return {
        props: {
            student,
            donors
        },
    }
}

export default Student