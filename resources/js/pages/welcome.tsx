import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { HiMenu } from 'react-icons/hi';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Wedding Organizer" />
            <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a]">
                {/* Header */}
                <header className="flex items-center justify-between p-6 lg:px-12">
                    <div className="flex items-center">
                        <img src="/images/logo.png" alt="Ultimate Organizer" className="h-25 w-auto" />
                    </div>
                    <nav className="hidden items-center gap-8 font-medium text-[#1b1b18] lg:flex dark:text-[#EDEDEC]">
                        <Link href="#home" className="hover:text-gray-500">
                            Home
                        </Link>
                        <Link href="#about-us" className="hover:text-gray-500">
                            About Us
                        </Link>
                        <Link href="#contact" className="hover:text-gray-500">
                            Contact
                        </Link>
                        {auth.user ? (
                            <Link href={route('dashboard')} className="rounded-sm border border-[#19140035] px-4 py-1.5 hover:border-[#1915014a]">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="px-4 py-1.5 hover:text-gray-500">
                                    Log in
                                </Link>
                                <Link href={route('register')} className="rounded-sm border border-[#19140035] px-4 py-1.5 hover:border-[#1915014a]">
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                    <div className="lg:hidden">
                        <HiMenu size={24} className="text-[#1b1b18] dark:text-[#EDEDEC]" />
                    </div>
                </header>

                {/* Hero Banner */}
                <section id="home" className="relative w-full">
                    <img src="/images/hero-banner.png" alt="Wedding banner" className="h-auto max-h-[100px] w-full object-cover lg:max-h-[200px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg lg:text-6xl">WEDDING ORGANIZER</h1>
                    </div>
                </section>

                {/* Detailed Content Section */}
                <section
                    id="about-detail"
                    className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-16 lg:flex-row lg:items-start lg:px-12"
                >
                    <div className="w-full flex-shrink-0 lg:w-1/3">
                        <img
                            src="/images/bride-groom.png"
                            alt="Bride and Groom"
                            className="h-auto w-full max-w-sm rounded-xl object-cover shadow-lg"
                        />
                    </div>
                    <div className="w-full text-[#1b1b18] lg:w-2/3 dark:text-[#EDEDEC]">
                        <h2 className="mb-2 text-4xl leading-tight font-bold lg:text-5xl">
                            Welcome to
                            <br />
                            Ultimate Organizer
                        </h2>
                        <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
                            Your Trusted Partner in Crafting Unforgettable Moments with Elegance and Professionalism.
                        </p>
                        <p className="mb-6 text-justify text-base leading-relaxed">
                            Setelah venue dan vendor terkonfirmasi, kini saatnya menyerahkan koordinasi acara kepada tim yang berpengalaman. Kami
                            hadir untuk memastikan setiap detail perayaan berjalan sesuai rencana, sehingga Anda dapat menikmati momen istimewa tanpa
                            stres. Percayakan kepada kami—karena hari penting Anda layak berjalan sempurna.
                        </p>
                    </div>
                </section>

                {/* About Us Intro Moved Below */}
                <section id="about-us" className="bg-gray-100 px-6 py-16 text-center lg:px-12 dark:bg-[#1a1a1a]">
                    <h3 className="mb-2 text-base font-medium text-[#A67C52]">About Us</h3>
                    <h2 className="mb-4 text-3xl font-bold text-[#1b1b18] lg:text-4xl dark:text-[#EDEDEC]">WEDDING ORGANIZER</h2>
                    <p className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-[#1b1b18] dark:text-[#ccc]">
                        Hai, kami adalah Wedding Organizer yang siap jadi partner seru kamu buat ngerancang hari bahagia! Mulai dari nyusun konsep,
                        cari vendor in expert experiences, sampai ngatur jalannya acara biar kamu tinggal santai dan nikmatin momen. Biar kamu fokus
                        bahagia, kami yang urus sisanya. Yuk, wujudkan pernikahan impian bareng kami!
                    </p>

                    <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-2">
                        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-[#2a2a2a]">
                            <ul className="space-y-4 text-left text-sm text-gray-700 dark:text-gray-300">
                                {[...Array(4)].map((_, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="font-semibold text-[#A67C52]">◐ Ultimate Organizer</span>
                                        <span>
                                            adalah penyedia jasa Wedding Organizer profesional yang siap mewujudkan pernikahan impian Anda. Dengan tim
                                            berpengalaman dan sistem kerja terstruktur, kami memastikan setiap momen berjalan lancar, teratur, dan
                                            penuh kesan.
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col gap-6">
                            <img src="/images/showcase-1.png" alt="Decor Showcase" className="rounded-xl shadow-lg" />
                            <img src="/images/showcase-2.png" alt="Stage Showcase" className="rounded-xl shadow-lg" />
                        </div>
                    </div>
                </section>

                <section className="relative mt-16">
                    <img src="/images/contact-banner.png" alt="Contact us background" className="h-[300px] w-full rounded-t-xl object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="px-4 text-center">
                            <p className="mb-2 text-lg">Contact Us</p>
                            <h2 className="mb-4 text-2xl font-semibold lg:text-3xl">
                                Want The Perfect Wedding? <br /> Let's Discuss!
                            </h2>
                            <Link href="#contact" className="rounded-md border border-white px-6 py-2 transition hover:bg-white hover:text-black">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Real Wedding Gallery */}
                <section className="bg-gray-100 px-6 py-16 lg:px-12 dark:bg-[#1a1a1a]">
                    <h2 className="mb-8 text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Real Wedding</h2>
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
                        <img src="/images/real1.png" alt="Wedding 1" className="aspect-[3/4] h-full w-full rounded-xl object-cover" />
                        <img src="/images/real2.png" alt="Wedding 2" className="aspect-[3/4] h-full w-full rounded-xl object-cover" />
                        <img src="/images/real3.png" alt="Wedding 3" className="aspect-[3/4] h-full w-full rounded-xl object-cover" />
                        <img src="/images/real4.png" alt="Wedding 4" className="aspect-[3/4] h-full w-full rounded-xl object-cover" />
                        <img src="/images/real5.png" alt="Wedding 5" className="aspect-[3/4] h-full w-full rounded-xl object-cover" />
                    </div>
                </section>

                {/* Footer Section */}
                <footer id="contact" className="text-center text-[#1b1b18] py-12 mt-16 px-4">
                    <img src="/images/logo.png" alt="Ultimate Organizer Logo" className="mx-auto mb-4 h-25" />
                    <p className="text-sm font-semibold">📞 +62895618835969</p>
                    <p className="mb-2 text-sm">JL. SLAMET RIYADI NO.07, KEC. TELANAIPURA, KOTA JAMBI</p>
                    <hr className="mx-auto my-4 w-11/12 border-gray-400" />
                    <p className="text-xs">ULTIMATE ORGANIZER 2025, All Rights Reserved</p>
                </footer>
            </div>
        </>
    );
}
