import { getSortedPostsData } from '../lib/posts'
import { format, parseISO } from 'date-fns'

export default function Home() {
  const posts = getSortedPostsData()

  return (
    <main>
      <article className="home-info">
        <h1>breadchris</h1>
        <p className="tagline">hack the planet</p>
        <div className="social-icons">
          <a href="https://github.com/breadchris" target="_blank" rel="noopener noreferrer">github</a>
          <a href="https://twitter.com/breadchris" target="_blank" rel="noopener noreferrer">twitter</a>
          <a href="https://youtube.com/@breadchris/streams" target="_blank" rel="noopener noreferrer">youtube</a>
          <a href="https://cal.com/breadchris" target="_blank" rel="noopener noreferrer">cal.com</a>
        </div>
      </article>

      {posts.map(({ slug, date, title, excerpt }) => (
        <article key={slug} className="post-entry">
          <a href={`/blog/${slug}/`}>
            <h2>{title}</h2>
            <p className="excerpt">{excerpt}</p>
            <div className="meta">
              <span>{date ? format(parseISO(date), 'MMMM d, yyyy') : ''}</span>
              <span> &middot; breadchris</span>
            </div>
          </a>
        </article>
      ))}
    </main>
  )
}
