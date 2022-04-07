import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="p-4 border-t-2">
            <a href="https://www.cosmicjs.com?ref=non-profit-cms" target="_blank" rel="noopener noreferrer"
            >
                <div className="flex gap-2">
                    <div>Powered by</div>
                    <Image alt="Cosmic logo" src="https://cdn.cosmicjs.com/049dabb0-8e19-11ea-81c6-b3a804bfff46-cosmic-dark.png" layout={undefined} width="90" height="25" />
                </div>
            </a>
        </footer>
    )
}