import siteMetadata from '@/data/siteMetadata'
import Card from '@/components/Card'

export default function Posts({ posts }) {
  const MAX_DISPLAY = 6

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl sm:leading-10 md:text-3xl md:leading-14">
            Latest Posts
          </h1>
        </div>
        <div className="container py-12">
          <div className="flex flex-wrap -m-4">
            {!posts.length && 'No posts found.'}
            {posts
              .filter((frontMatter) => frontMatter.isTop)
              .map((frontMatter) => {
                const { slug, date, title, summary, tags, image } = frontMatter
                return (
                  <Card
                    key={title}
                    title={title}
                    description={summary}
                    imgSrc={image}
                    href={'/blog/' + slug}
                  />
                )
              })}
          </div>
        </div>
      </div>
    </>
  )
}
