"use client"
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { Home, TrendingUp, PlusSquare, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { WalletConnect } from "@/components/WalletConnect";

const Navbar = () => {
	const router = useRouter();
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const navItems = [
		{ name: "Home", path: "/", icon: Home },
		{ name: "Feed", path: "/feed", icon: TrendingUp },
		{ name: "Create", path: "/create", icon: PlusSquare },
		{ name: "Profile", path: "/profile", icon: User },
	];

	return (
		<nav className="bg-white w-full px-4 py-4 sticky top-0 z-50 border-b-4 shadow-lg" style={{borderColor: '#a4ff31'}}>
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2">
					<div className="w-10 h-10 bg-[#a4ff31] flex items-center justify-center neon-glow">
						<span className="text-black text-2xl font-bold">M</span>
					</div>
					<div className="hidden sm:block">
						<div className="text-2xl font-black text-foreground">MOMENTS</div>
						<div className="text-xs font-semibold -mt-1" style={{color: '#a4ff31'}}>Predict & Win</div>
					</div>
				</Link>

				{/* Desktop Menu */}
				<div className="hidden md:flex items-center gap-2">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.path;
						return (
							<Link
								key={item.path}
								href={item.path}
								className={cn(
									"flex items-center gap-2 px-4 py-2 font-bold transition-all duration-200",
									isActive
										? "bg-[#a4ff31] text-black shadow-lg neon-glow"
										: "bg-gray-50 text-gray-700 hover:bg-[#e8ffe0] border-2 border-gray-200"
								)}
								style={isActive ? {} : {borderColor: pathname.includes(item.path) ? '#a4ff31' : undefined}}
							>
								<Icon className="h-5 w-5" />
								<span>{item.name}</span>
							</Link>
						);
					})}
				</div>

				{/* Wallet Connect */}
				<div className="hidden md:block">
					<WalletConnect />
				</div>

				{/* Mobile Menu Button */}
				<div className="md:hidden flex items-center gap-3">
					<WalletConnect />
					<button
						onClick={toggleMenu}
						className="text-gray-700 text-2xl focus:outline-none p-2 hover:bg-gray-100"
					>
						{isMenuOpen ? <X /> : <Menu />}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				className={cn(
					"md:hidden absolute left-0 right-0 bg-white border-b-2 border-gray-200 transition-all duration-300 ease-in-out overflow-hidden shadow-lg",
					isMenuOpen ? "max-h-[500px] py-4" : "max-h-0"
				)}
			>
				<div className="flex flex-col px-4 space-y-2">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.path;
						return (
							<Link
								key={item.path}
								href={item.path}
								onClick={() => setIsMenuOpen(false)}
								className={cn(
									"flex items-center gap-3 px-4 py-3 font-bold transition-all duration-200",
									isActive
										? "bg-[#a4ff31] text-black neon-glow"
										: "bg-gray-50 text-gray-700 hover:bg-[#e8ffe0] border-2 border-gray-200"
								)}
							>
								<Icon className="h-5 w-5" />
								<span>{item.name}</span>
							</Link>
						);
					})}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
