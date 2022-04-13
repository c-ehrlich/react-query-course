import axios from 'axios';
import { useReducer } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Post } from '../types';
import { Link } from 'react-router-dom';
import { getSinglePost } from './SinglePost';

export const fetchPosts = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const posts: Post[] = await axios
    .get('https://jsonplaceholder.typicode.com/posts')
    .then((res) => res.data);

  // // iterate over posts and optimistically push into query cache
  // posts.forEach((post) => {
  //   queryClient.setQueryData(['post', post.id], post);
  // });

  return posts;
};

function ManyPosts() {
  const queryClient = useQueryClient();
  const [count, increment] = useReducer((d) => d + 1, 0);

  const postsQuery = useQuery<Post[], Error>('posts', fetchPosts, {
    cacheTime: 60 * 60 * 1000,
    onSuccess: (data) => {
      increment();
    },
    // onError: (error) => {}
    // onSettled: (da ta, error) => {} runs on both success and error
    // these run everytime the query is run, ie if we use it in 4 components
    // then it gets run 4 times

    // refetchInterval: 1000 * 5, // refetch after 5 seconds while focus
    // refetchIntervalInBackground: true, // also refetch when tab is in background
    staleTime: Infinity,
  });

  return (
    <div>
      <h1>Posts{postsQuery.isFetching && '...'}</h1>
      <h4>Fetched {count} times</h4>

      <div>
        {postsQuery.isLoading || postsQuery.isError || postsQuery.isIdle ? (
          <div>'Loading posts...'</div>
        ) : (
          <>
            <ul>
              {postsQuery.data.map((post) => {
                return (
                  <li
                    key={post.id}
                    onMouseEnter={() =>
                      queryClient.prefetchQuery(
                        ['post', String(post.id)],
                        () => {
                          return getSinglePost(String(post.id));
                        },
                        {
                          staleTime: 1000 * 60 * 60, // 1 hour
                        }
                      )
                    }
                  >
                    <Link to={`/post/${post.id}`}>{post.title}</Link>
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
