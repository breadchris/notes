export const metadata = {
  title: 'Talks - breadchris',
  description: 'Talks and presentations by breadchris',
}

export default function Talks() {
  return (
    <main>
      <article>
        <header className="post-header">
          <h1>Talks</h1>
        </header>

        <div className="post-content">
          <p>Presentations and talks on security, Go, and web development.</p>

          <h3>Upcoming</h3>
          <p>Check back for upcoming talks and presentations.</p>

          <h3>Past Talks</h3>
          <ul>
            <li>Building Secure Plugin Systems</li>
            <li>Go Patterns for Production</li>
            <li>Web Security Fundamentals</li>
          </ul>

          <h3>YouTube</h3>
          <p>
            <a href="https://youtube.com/@breadchris/streams" target="_blank" rel="noopener noreferrer">
              Watch streams and recordings on YouTube
            </a>
          </p>
        </div>
      </article>
    </main>
  )
}
