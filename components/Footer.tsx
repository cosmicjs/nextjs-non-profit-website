export default function Footer() {
    return (
        <footer className="p-4 border-t-2 flex gap-2">
            <div>Powered by</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Cosmic logo" src="https://cdn.cosmicjs.com/049dabb0-8e19-11ea-81c6-b3a804bfff46-cosmic-dark.png" width="100" height="100"/>
        </footer>
    )
}