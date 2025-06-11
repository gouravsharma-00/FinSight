import Link from "next/link";
import React from "react";

export function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 shadow">
      <nav className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">FinSight</div>
        <ul className="flex space-x-4">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/chart">Charts</Link></li>
          <li><Link href="/budget">Budget</Link></li>
          <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-10">
      <span>Made with 💖 by Gourav Sharma</span>
    </footer>
  );
}
