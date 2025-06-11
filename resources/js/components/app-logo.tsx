export default function AppLogo() {
    return (
        <>
            <div className="flex h-15 w-15 shrink-0 items-center justify-center overflow-hidden rounded-full p-1">
                <img src="/images/logo.png" alt="Logo" className="h-full w-full object-contain" />
            </div>

            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Ultimate Organizer</span>
            </div>
        </>
    );
}
