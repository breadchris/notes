import { getAllPostSlugs, getPostData } from '../../../lib/posts'
import { format, parseISO } from 'date-fns'

export async function generateStaticParams() {
  const posts = getAllPostSlugs()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata(props) {
  const params = await props.params
  const post = await getPostData(params.slug)
  return {
    title: `${post.title} - breadchris`,
    description: post.excerpt || '',
  }
}

export default async function Post(props) {
  const params = await props.params
  const post = await getPostData(params.slug)

  return (
    <main>
      <article>
        <header className="post-header">
          <h1>{post.title}</h1>
          <div className="meta">
            <span>{post.date ? format(parseISO(post.date), 'MMMM d, yyyy') : ''}</span>
            <span> &middot; breadchris</span>
          </div>
        </header>

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <a key={tag} href={`/tags/${tag}/`}>{tag}</a>
            ))}
          </div>
        )}
      </article>
    </main>
  )
}
