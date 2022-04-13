import axios from 'axios';
import { useQuery } from 'react-query';
import { Post } from '../types';

function ManyPosts({ setPostId }: { setPostId: (num: number) => void }) {
  // https://jsonplaceholder.typicode.com/posts
  const postsQuery = useQuery<Post[], Error>(
    'posts',
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return axios
        .get('https://jsonplaceholder.typicode.com/posts')
        .then((res) => res.data);
    },
    {
      cacheTime: 60 * 60 * 1000,
    }
  );
  return (
    <div>
      <h1>Posts</h1>
      <div>
        {postsQuery.isLoading || postsQuery.isError || postsQuery.isIdle ? (
          <div>'Loading posts...'</div>
        ) : (
          <>
            <ul>
              {postsQuery.data.map((post) => {
                return (
                  <li key={post.id}>
                    <a onClick={() => setPostId(post.id)} href='#'>
                      {post.title}
                    </a>
                  </li>
                );
              })}
            </ul>
            {postsQuery.isFetching && 'Updating...'}
          </>
        )}
      </div>
    </div>
  );
}

export default ManyPosts;
