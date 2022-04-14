import React, { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import axios from 'axios';
import IPost from '../types/Post';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

const fetchPost = async (id: string) => {
  await new Promise((r) => setTimeout(r, 500));
  return axios
    .get('https://jsonplaceholder.typicode.com/posts/' + id)
    .then((res) => res.data);
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = (context.params![0] as string) || '1';
  const post = await fetchPost(id);

  return {
    props: { post },
  };
};

interface PageProps {
  post: IPost;
}

const Post: FC<PageProps> = (props: PageProps) => {
  let {
    query: { postId },
  } = useRouter();

  const postQuery = useQuery<IPost>(
    ['post', postId],
    () => {
      return fetchPost(String(postId));
    },
    {
      initialData: props.post,
      refetchOnMount: true,
    }
  );

  return (
    <>
      {postQuery.isLoading ? (
        <span>Loading...</span>
      ) : (
        <div>
          <Link href='/'>
            <a>Back</a>
          </Link>
          <h3>{postQuery.data?.title}</h3>
          <p>
            <small>Post ID: {postQuery.data?.id}</small>
          </p>
          <p>{postQuery.data?.body}</p>
        </div>
      )}
    </>
  );
};

export default Post;
