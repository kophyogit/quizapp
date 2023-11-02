import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className='container'>
        <h1>Quiz App</h1>
        <Link href='/quiz'>
        <button>Start Quiz</button>
        </Link>
      </div>
    </main>
  )
}
