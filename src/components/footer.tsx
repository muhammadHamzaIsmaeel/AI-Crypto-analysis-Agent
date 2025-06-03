// Footer.tsx
'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">
          © {new Date().getFullYear()} Built with 💻 by{' '}
          <span className="font-semibold text-blue-400">MHI</span>
        </p>
        <a
          href="https://muhammadhamzaismail.vercel.app" // <-- replace with your portfolio link
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline hover:text-blue-300 transition"
        >
          Visit my portfolio →
        </a>
      </div>
    </footer>
  );
}
