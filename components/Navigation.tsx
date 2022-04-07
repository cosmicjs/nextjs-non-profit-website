import Link from 'next/link'
import { HomeIcon } from '@heroicons/react/solid'

export default function Navigation() {
    return (
        <header className="p-4 border-b-2">
            <Link
                passHref
                href={'/'}
            >
                <div className="flex hover:cursor-pointer gap-2">
                    <HomeIcon className="h-6 w-6 text-blue-300" />
                    <div>Home</div>
                </div>
            </Link>
        </header>
    )
}