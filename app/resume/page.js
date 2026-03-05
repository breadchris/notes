export const metadata = {
  title: 'Resume - breadchris',
  description: 'Resume of breadchris',
}

export default function Resume() {
  return (
    <main>
      <article>
        <header className="post-header">
          <h1>Resume</h1>
        </header>

        <div className="post-content">
          <h2>Chris</h2>
          <p>Security Engineer & Developer</p>

          <h3>Experience</h3>
          <ul>
            <li><strong>Uber</strong> - Security Engineer</li>
            <li><strong>Northrop Grumman</strong> - Security Engineer</li>
          </ul>

          <h3>Skills</h3>
          <ul>
            <li>Go, Python, JavaScript/TypeScript</li>
            <li>Kubernetes, Docker, Cloud Infrastructure</li>
            <li>Application Security, Penetration Testing</li>
            <li>gRPC, REST APIs, Distributed Systems</li>
          </ul>

          <h3>Projects</h3>
          <ul>
            <li><strong>justshare</strong> - Content sharing platform</li>
            <li><strong>CSAW HSF</strong> - High school cybersecurity competition</li>
          </ul>

          <h3>Contact</h3>
          <p>
            <a href="mailto:chris@breadchris.com">chris@breadchris.com</a><br />
            <a href="https://github.com/breadchris">github.com/breadchris</a><br />
            <a href="https://cal.com/breadchris">cal.com/breadchris</a>
          </p>
        </div>
      </article>
    </main>
  )
}
