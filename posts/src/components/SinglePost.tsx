import axios from 'axios';
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import { Post } from '../types';

function SinglePost({
  postId,
  setPostId,
}: {
  postId: number;
  setPostId: (num: number) => void;
}) {
  const queryClient = useQueryClient();

  const postQuery = useQuery<Post, Error>(
    ['post', postId],
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return axios
        .get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
        .then((res) => res.data);
    },
    {
      // we already have the post data from the 'posts' query, so we can use that
      // until the 'post' query comes in
      initialData: () => {
        const data = queryClient.getQueryData<Post[]>('posts');
        return data ? data.find(post => post.id === postId) : undefined;
      },
    }
  );

  return (
    <div>
      <a onClick={() => setPostId(-1)} href='#'>
        back
      </a>
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
