import { getPost } from "@/lib/get-post";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) return null;
  return (
    <article>
      <h1>{post.title?.rendered}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content?.rendered ?? "" }} />
    </article>
  );
}
