export default function Welcome() {
  return (
    <main className="p-8 bg-gradient-to-r from-purple-100 via-white to-indigo-100 min-h-screen">
      <h1 className="text-5xl font-extrabold text-indigo-700 underline underline-offset-4">
        🌟 AI Demo
      </h1>
      <p className="mt-6 text-lg text-gray-800 bg-white/50 rounded-lg p-4 shadow-lg max-w-md">
        Добро пожаловать в проект чата на <span className="font-mono">Next.js</span> и{" "}
        <span className="font-mono">Tailwind CSS</span>!
      </p>
    </main>
  );
}