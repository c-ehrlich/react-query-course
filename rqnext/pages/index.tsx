import type { NextPage } from 'next';
import Link from 'next/link';
import { useQuery } from 'react-query';
import axios from 'axios';
import IPost from '../types/Post';
import React, { FC } from 'react';

const fetchPosts = async (): Promise<IPost[]> => {
  await new Promise((r) => setTimeout(r, 500));
  return axios
    .get('https://jsonplaceholder.typicode.com/posts')
    .then((res) => res.data.slice(0, 10));
};

export const getServerSideProps = async () => {
  const posts = await fetchPosts()
  
  return {
    props: { posts, }
  }
}

interface PageProps {
  posts: IPost[];
}

const Posts: FC<PageProps> = (props: PageProps) => {
  const postsQuery = useQuery<IPost[]>(['posts'], fetchPosts, {
    initialData: props.posts,
    // refetchOnMount: true, //if we want to refetch when the user gets the page
  });

  return (
    <section>
      <div>
        <div>
          {postsQuery.isLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              <h3>Posts {postsQuery.isFetching ? <small>...</small> : null}</h3>
              <ul>
                {postsQuery.data &&
                  postsQuery.data.map((post) => (
                    <Link href='/[postId]' as={`/${post.id}`} key={post.id}>
                      <a>
                        <li key={post.id}>{post.title}</li>
                      </a>
                    </Link>
                  ))}
              </ul>
              <br />
              <br />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Posts;
