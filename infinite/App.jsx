// don't have access to the API anymore, so here's the now no longer functioning code
import axios from 'axios';
import { useInfiniteQuery } from 'react-query';

// useInifiniteQuery uses syntax very similar to usePaginatedQuery,
// but lets us keep all the past loaded data visible at once

// page is always the last arg AFTER all the parts of the query key
const fetchPosts = (_posts, _fake, page = 0) =>
  axios
    .get('/api/posts', {
      params: {
        pageOffset: page,
        pageSize: 10,
      },
    })
    .then((res) => res.data);

export default function Posts() {
  const postsQuery = useInfiniteQuery(['posts', 'fake'], fetchPosts, {
    // /!\ this function is required for useInfiniteQuery to work
    // this nextPageOffset needs to come from the api
    getFetchMore: (lastPage, _allPages) => lastPage.nextPageOffset,
  });

  return (
    <div>
      {postsQuery.isLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          <h3>Posts {postsQuery.isFetching ? <small>...</small> : null}</h3>
          <ul>
            {postsQuery.data.map((page, index) => {
              <React.Fragment key={index}>
                {page.items.map((post) => (
                  <li key={post.id}>{post.title}</li>
                ))}
              </React.Fragment>;
            })}
          </ul>
        </>
      )}
      <button
        onClick={() => postsQuery.fetchMore}
        disabled={!postsQuery.canFetchMore}
      >
        Fetch more
      </button>
    </div>
  );
}
