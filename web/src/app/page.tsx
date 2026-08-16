'use client';
import { useState } from 'react';
import {
    Search,
    Heart,
    Star,
    Menu,
    Globe2,
    Home,
    Sparkles,
    TreePine,
    Waves,
    Mountain,
    Building2,
    Wheat,
    TrendingUp,
    ArrowRight,
    ShieldCheck,
    Wallet,
    Headphones,
} from 'lucide-react';

/* ---------------------------------- data ---------------------------------- */

const CATEGORIES = [
    { label: 'Beachfront', icon: Waves },
    { label: 'Treehouses', icon: TreePine },
    { label: 'Cabins', icon: Home },
    { label: 'Amazing pools', icon: Sparkles },
    { label: 'Countryside', icon: Wheat },
    { label: 'Iconic cities', icon: Building2 },
    { label: 'Trending now', icon: TrendingUp },
    { label: 'Mountain view', icon: Mountain },
];

const STAYS = [
    {
        id: 1,
        title: 'Cliffside Villa',
        place: 'Santorini, Greece',
        dates: 'Sep 12 – 17',
        price: 210,
        rating: 4.97,
        img: 'https://picsum.photos/seed/roost-santorini/640/520',
    },
    {
        id: 2,
        title: 'Redwood Treehouse',
        place: 'Big Sur, California',
        dates: 'Oct 3 – 8',
        price: 180,
        rating: 4.89,
        img: 'https://picsum.photos/seed/roost-bigsur/640/520',
    },
    {
        id: 3,
        title: 'Lakeside A-Frame',
        place: 'Lake Tahoe, Nevada',
        dates: 'Nov 1 – 6',
        price: 145,
        rating: 4.92,
        img: 'https://picsum.photos/seed/roost-tahoe-card/640/520',
    },
    {
        id: 4,
        title: 'Riad Courtyard',
        place: 'Marrakech, Morocco',
        dates: 'Sep 20 – 25',
        price: 98,
        rating: 4.85,
        img: 'https://picsum.photos/seed/roost-marrakech/640/520',
    },
    {
        id: 5,
        title: 'Glass-Walled Loft',
        place: 'Tokyo, Japan',
        dates: 'Dec 2 – 7',
        price: 165,
        rating: 4.9,
        img: 'https://picsum.photos/seed/roost-tokyo-loft/640/520',
    },
    {
        id: 6,
        title: 'Desert Dome',
        place: 'Joshua Tree, California',
        dates: 'Oct 18 – 23',
        price: 220,
        rating: 4.95,
        img: 'https://picsum.photos/seed/roost-joshuatree/640/520',
    },
];

const INSPIRATION = [
    {
        city: 'Paris',
        country: 'France',
        img: 'https://picsum.photos/seed/roost-paris/700/900',
        tall: true,
    },
    {
        city: 'Bali',
        country: 'Indonesia',
        img: 'https://picsum.photos/seed/roost-bali/700/440',
    },
    {
        city: 'Kyoto',
        country: 'Japan',
        img: 'https://picsum.photos/seed/roost-kyoto/700/440',
    },
    {
        city: 'Cape Town',
        country: 'South Africa',
        img: 'https://picsum.photos/seed/roost-capetown/700/900',
        tall: true,
    },
    {
        city: 'Reykjavík',
        country: 'Iceland',
        img: 'https://picsum.photos/seed/roost-reykjavik/700/440',
    },
];

const STATS = [
    { value: '4.9', label: 'Average rating' },
    { value: '150+', label: 'Countries' },
    { value: '2.3M', label: 'Nights booked' },
    { value: '60K+', label: 'Verified hosts' },
];

/* --------------------------------- widgets --------------------------------- */

function Postcard({ img, place, className = '' }) {
    return (
        <div
            className={`absolute rounded-2xl bg-white p-2 pb-8 shadow-2xl ${className}`}
        >
            <img
                src={img}
                alt={place}
                className="h-full w-full rounded-xl object-cover"
            />
            <span className="absolute bottom-2 left-3 font-mono text-xs tracking-wide text-stone-500">
                {place}
            </span>
        </div>
    );
}

function StayCard({ stay, isFavorite, onToggleFavorite }) {
    return (
        <div className="group">
            <div className="relative overflow-hidden rounded-2xl">
                <img
                    src={stay.img}
                    alt={stay.title}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                    onClick={() => onToggleFavorite(stay.id)}
                    aria-label="Save listing"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-700 shadow-md transition-colors hover:text-rose-500"
                >
                    <Heart
                        className="h-4 w-4"
                        fill={isFavorite ? 'currentColor' : 'none'}
                        color={isFavorite ? '#f43f5e' : 'currentColor'}
                    />
                </button>
            </div>

            <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                    <h3 className="font-display text-lg font-semibold text-stone-900">
                        {stay.title}
                    </h3>
                    <p className="text-sm text-stone-500">{stay.place}</p>
                    <p className="text-sm text-stone-400">{stay.dates}</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1 pt-1">
                    <Star
                        className="h-3.5 w-3.5 text-amber-500"
                        fill="#f59e0b"
                    />
                    <span className="font-mono text-sm text-stone-700">
                        {stay.rating}
                    </span>
                </div>
            </div>

            <p className="mt-2 font-mono text-sm text-stone-900">
                <span className="font-semibold">${stay.price}</span>
                <span className="text-stone-400"> / night</span>
            </p>
        </div>
    );
}

/* ---------------------------------- page ---------------------------------- */

export default function RoostLandingPage() {
    const [activeCategory, setActiveCategory] = useState('Beachfront');
    const [favorites, setFavorites] = useState(new Set());
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleFavorite = (id) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

            {/* ---------------------------- nav ---------------------------- */}
            <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
                    <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-white">
                            <Home className="h-5 w-5" />
                        </span>
                        <span className="font-display text-2xl font-semibold tracking-tight">
                            Roost
                        </span>
                    </div>

                    <nav className="hidden items-center gap-8 md:flex">
                        <a
                            href="#"
                            className="border-b-2 border-teal-700 pb-1 text-sm font-medium text-stone-900"
                        >
                            Stays
                        </a>
                        <a
                            href="#"
                            className="text-sm font-medium text-stone-500 hover:text-stone-900"
                        >
                            Experiences
                        </a>
                        <a
                            href="#"
                            className="text-sm font-medium text-stone-500 hover:text-stone-900"
                        >
                            Online experiences
                        </a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <button className="hidden rounded-full px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200 md:block">
                            Become a host
                        </button>
                        <button className="hidden items-center justify-center rounded-full p-2 text-stone-700 hover:bg-stone-200 md:flex">
                            <Globe2 className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className="flex items-center gap-2 rounded-full border border-stone-300 bg-white py-1.5 pl-3 pr-1.5 shadow-sm hover:shadow-md"
                        >
                            <Menu className="h-4 w-4 text-stone-600" />
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-700 text-xs font-semibold text-white">
                                A
                            </span>
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <div className="border-t border-stone-200 bg-white px-6 py-4 md:hidden">
                        <div className="flex flex-col gap-3 text-sm font-medium text-stone-700">
                            <a href="#">Stays</a>
                            <a href="#">Experiences</a>
                            <a href="#">Become a host</a>
                            <a href="#">Log in / Sign up</a>
                        </div>
                    </div>
                )}
            </header>

            {/* ---------------------------- hero ---------------------------- */}
            <section className="relative overflow-hidden">
                <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-20 pt-14 lg:grid-cols-2 lg:items-center lg:px-10 lg:pt-20">
                    {/* copy + search */}
                    <div>
                        <p className="font-mono text-xs font-medium uppercase tracking-widest text-amber-600">
                            Where to next?
                        </p>
                        <h1 className="mt-4 font-display text-5xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-6xl">
                            Find a stay that feels like{' '}
                            <em className="text-teal-700">coming home</em>
                        </h1>
                        <p className="mt-6 max-w-md text-lg leading-relaxed text-stone-600">
                            Handpicked homes, cabins, and hideaways from real
                            hosts in 150+ countries. Pack light — we&rsquo;ll
                            handle the rest.
                        </p>

                        <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-2 shadow-lg">
                            <div className="grid divide-y divide-stone-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                                <label className="flex flex-col gap-1 px-4 py-3">
                                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Location
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search destinations"
                                        className="bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
                                    />
                                </label>
                                <label className="flex flex-col gap-1 px-4 py-3">
                                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Check in — out
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Add dates"
                                        className="bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
                                    />
                                </label>
                                <div className="flex items-center justify-between gap-2 px-4 py-3">
                                    <label className="flex flex-1 flex-col gap-1">
                                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-400">
                                            Guests
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Add guests"
                                            className="bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
                                        />
                                    </label>
                                    <button className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-teal-700 text-white transition-colors hover:bg-teal-800">
                                        <Search className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-2">
                            <span className="text-xs text-stone-400">
                                Popular:
                            </span>
                            {['Bali', 'Lisbon', 'Aspen', 'Kyoto'].map((p) => (
                                <button
                                    key={p}
                                    className="rounded-full border border-stone-200 px-3 py-1 text-xs text-stone-600 hover:border-teal-700 hover:text-teal-700"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* postcard stack */}
                    <div className="relative mx-auto h-96 w-full max-w-md lg:h-96">
                        <Postcard
                            img="https://picsum.photos/seed/roost-santorini-hero/500/440"
                            place="Santorini, GR"
                            className="left-0 top-0 w-64 rotate-2"
                        />
                        <Postcard
                            img="https://picsum.photos/seed/roost-tahoe-hero/500/440"
                            place="Lake Tahoe, US"
                            className="bottom-0 left-16 z-20 w-56 -rotate-6 shadow-2xl"
                        />
                        <Postcard
                            img="https://picsum.photos/seed/roost-tokyo-hero/500/440"
                            place="Tokyo, JP"
                            className="right-0 top-6 z-30 w-40 rotate-6"
                        />
                    </div>
                </div>

                {/* stats */}
                <div className="border-y border-stone-200 bg-white">
                    <div className="mx-auto grid max-w-7xl grid-cols-2 divide-y divide-stone-200 px-6 sm:grid-cols-4 sm:divide-x sm:divide-y-0 lg:px-10">
                        {STATS.map((s) => (
                            <div
                                key={s.label}
                                className="px-4 py-8 text-center"
                            >
                                <p className="font-mono text-3xl font-semibold text-stone-900">
                                    {s.value}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-wider text-stone-400">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ------------------------- categories ------------------------- */}
            <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {CATEGORIES.map(({ label, icon: Icon }) => {
                        const active = activeCategory === label;
                        return (
                            <button
                                key={label}
                                onClick={() => setActiveCategory(label)}
                                className={`flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                                    active
                                        ? 'border-teal-700 bg-teal-700 text-white'
                                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* -------------------------- featured -------------------------- */}
            <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <p className="font-mono text-xs font-medium uppercase tracking-widest text-amber-600">
                            Handpicked
                        </p>
                        <h2 className="mt-2 font-display text-3xl font-semibold text-stone-900">
                            Stays our guests keep returning to
                        </h2>
                    </div>
                    <a
                        href="#"
                        className="hidden items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800 sm:flex"
                    >
                        View all stays <ArrowRight className="h-4 w-4" />
                    </a>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    {STAYS.map((stay) => (
                        <StayCard
                            key={stay.id}
                            stay={stay}
                            isFavorite={favorites.has(stay.id)}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))}
                </div>
            </section>

            {/* ------------------------- inspiration ------------------------- */}
            <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
                <p className="font-mono text-xs font-medium uppercase tracking-widest text-amber-600">
                    Live anywhere
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-stone-900">
                    Wherever you land, it&rsquo;s yours for the week
                </h2>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-rows-2">
                    {INSPIRATION.map((place) => (
                        <div
                            key={place.city}
                            className={`group relative overflow-hidden rounded-2xl ${
                                place.tall ? 'row-span-2' : ''
                            }`}
                        >
                            <img
                                src={place.img}
                                alt={place.city}
                                className="h-full min-h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-stone-900 opacity-20 transition-opacity group-hover:opacity-30" />
                            <div className="absolute bottom-4 left-4">
                                <p className="font-display text-xl italic text-white">
                                    {place.city}
                                </p>
                                <p className="font-mono text-xs uppercase tracking-wider text-stone-200">
                                    {place.country}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --------------------------- host cta --------------------------- */}
            <section className="bg-teal-800">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div>
                            <p className="font-mono text-xs font-medium uppercase tracking-widest text-amber-400">
                                Become a host
                            </p>
                            <h2 className="mt-3 font-display text-4xl font-semibold text-white">
                                Turn your extra space into extra income
                            </h2>
                            <p className="mt-4 max-w-md text-teal-100">
                                Roost makes hosting simple. We handle payments,
                                guest screening, and support, so you can focus
                                on the part you actually like: welcoming people
                                in.
                            </p>
                            <button className="mt-8 flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-stone-900 hover:bg-amber-300">
                                Start hosting <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {[
                                {
                                    icon: Wallet,
                                    title: 'Get paid fast',
                                    copy: 'Payouts land within days of checkout.',
                                },
                                {
                                    icon: ShieldCheck,
                                    title: 'Stay protected',
                                    copy: 'Every stay is covered end to end.',
                                },
                                {
                                    icon: Headphones,
                                    title: '24/7 support',
                                    copy: 'Real people, whenever you need them.',
                                },
                            ].map(({ icon: Icon, title, copy }) => (
                                <div
                                    key={title}
                                    className="rounded-2xl bg-teal-700 p-5"
                                >
                                    <Icon className="h-6 w-6 text-amber-400" />
                                    <p className="mt-3 font-display text-base font-semibold text-white">
                                        {title}
                                    </p>
                                    <p className="mt-1 text-sm text-teal-100">
                                        {copy}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------------------------- footer ---------------------------- */}
            <footer className="bg-stone-900 text-stone-300">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                        <div>
                            <p className="text-sm font-semibold text-white">
                                Support
                            </p>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Help center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Safety information
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Cancellation options
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Contact us
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">
                                Community
                            </p>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Roost.org
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Diversity &amp; belonging
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Accessibility
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">
                                Hosting
                            </p>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Try hosting
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Host resources
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Community forum
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">
                                Company
                            </p>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Press
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col gap-4 border-t border-stone-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-stone-400">
                            © 2026 Roost, Inc. · Privacy · Terms · Sitemap
                        </p>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-xs text-stone-300 hover:text-white">
                                <Globe2 className="h-4 w-4" /> English (US)
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
