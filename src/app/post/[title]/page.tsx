// utils
import { paramCase } from 'src/utils/change-case';
import axios, { endpoints } from 'src/utils/axios';
// sections
import { PostDetailsHomeView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Post: Details',
};

type Props = {
  params: {
    title: string;
  };
};

export default function PostDetailsHomePage({ params }: Props) {
  const { title } = params;

  return <PostDetailsHomeView title={title} />;
}

export async function generateStaticParams() {
  const res = await axios.get(endpoints.post.list);

  return res.data.posts.map((post: { title: string }) => ({
    title: paramCase(post.title),
  }));
}
