import Link from 'next/link'

export default function Navigation() {
    return (
        <header className="p-4 border-b-2">
            <Link
                passHref
                href={'/'}
            >
                Home
            </Link>
        </header>
    )
}