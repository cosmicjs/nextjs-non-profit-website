export interface Student {
    metadata: {
        name: string
        student_headshot: {
            url: string
            imgix_url: string
        }
        major: string
        university: string
        story: string
    }
    slug: string
}

export interface Donor {
    metadata: {
        name: string
        amount: number
        message: string
    }
}