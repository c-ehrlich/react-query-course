import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import axios from 'axios';
import IPost from '../types/Post';

const fetchPost = async (id: string) => {
  await new Promise((r) => setTimeout(r, 500));
  return axios
    .get('https://jsonplaceholder.typicode.com/posts/' + id)
    .then((res) => res.data);
};

export default function Post() {
  let {
    query: { postId },
  } = useRouter();

  const postQuery = useQuery<IPost>(['post', postId], () => fetchPost(String(postId)));

  return (
    <>
      {postQuery.isLoading ? (
        <span>Loading...</span>
      ) : (
        <div>
          <Link href="/">
            <a>Back</a>
          </Link>
          <h3>{postQuery.data?.title}</h3>
          <p><small>Post ID: {postQuery.data?.id}</small></p>
          <p>{postQuery.data?.body}</p>
        </div>
      )}
    </>
  )
}
