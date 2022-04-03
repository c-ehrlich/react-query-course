import axios from 'axios';
import { useQuery } from 'react-query';

type PokemonListType = {
  name: string;
  url: string;
};

const Inner = () => {
  // useQuery takes 2 things:
  // 1. a name for the query
  // 2. an api
  //    - need to make sure your data arrives as json!
  const queryInfo = useQuery<PokemonListType[]>(
    'pokemon',
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return axios
        .get('https://pokeapi.co/api/v2/pokemon')
        .then((res) => res.data.results);
    },
    {
      // this is TRUE by default because users often
      // open tabs and then ignore them for a while
      refetchOnWindowFocus: true,
      // queries that are still fresh / not stale yet
      // don't refetch on window focus etc. default 0, max Infinity
      staleTime: 5000,
    }
  );

  if (queryInfo.isLoading) return <div>'Loading...'</div>;

  if (queryInfo.isError) return <div>'Error'</div>;

  return (
    <div>
      {queryInfo.data!.map((result) => {
        return <div key={result.name}>{result.name}</div>;
      })}
      <br />
      {queryInfo.isFetching ? <div>'Updating...'</div> : null}
    </div>
  );
};

export default Inner;
