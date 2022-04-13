import axios from 'axios';
import { useQuery } from 'react-query';
import { Post } from '../types';

function SinglePost({
  postId,
  setPostId,
}: {
  postId: number;
  setPostId: (num: number) => void;
}) {
  const postQuery = useQuery<Post, Error>(['post', postId], async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return axios
      .get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then((res) => res.data);
  });

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
          {postQuery.isFetching && 'Updating...'}
        </div>
      )}
    </div>
  );
}

export default SinglePost;
