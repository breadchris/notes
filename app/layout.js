import './globals.css'

export const metadata = {
  title: 'breadchris',
  description: 'hack the planet',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <nav className="nav">
            <div className="logo">
              <a href="/">breadchris</a>
            </div>
            <ul className="menu">
              <li><a href="/blog/">blog</a></li>
              <li><a href="/resume/">resume</a></li>
              <li><a href="/talks/">talks</a></li>
            </ul>
          </nav>
        </header>
        {children}
        <footer>
          <span>&copy; {new Date().getFullYear()} <a href="/">breadchris</a></span>
        </footer>
      </body>
    </html>
  )
}
