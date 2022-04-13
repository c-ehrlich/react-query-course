import axios from 'axios';
import {  useQuery } from 'react-query';
import { Post } from '../types';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

function SinglePost() {
  const { id } = useParams();

  const postQuery = useQuery<Post, Error>(
    ['post', id],
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const post = await axios
        .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then((res) => res.data);
      return post
    },
    {
      // // GETTING initialData
      // // we already have the post data from the 'posts' query, so we can use that
      // // until the 'post' query comes in
      // // this is a 'pull' sort of operation
      // initialData: () => {
      //   const data = queryClient.getQueryData<Post[]>('posts');
      //   return data ? data.find(post => post.id === postId) : undefined;
      // },
    }
  );

  return (
    <div>
      <Link to="/">
        back
      </Link>
      {postQuery.isLoading ? (
        'Loading...'
      ) : (
        <div>
          <h1>{postQuery.data?.title}</h1>
          <div>{postQuery.data?.body}</div>
          {postQuery.isFetching && 'Updating...'}
        </div>
      )}
    </div>
  );
}

export default SinglePost;
