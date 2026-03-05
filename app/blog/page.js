import { getSortedPostsData } from '../../lib/posts'
import { format, parseISO } from 'date-fns'

export const metadata = {
  title: 'Blog - breadchris',
  description: 'Blog posts by breadchris',
}

export default function BlogIndex() {
  const posts = getSortedPostsData()

  return (
    <main>
      <h1 style={{ marginBottom: 'var(--gap)' }}>Blog</h1>

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
