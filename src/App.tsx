import './App.css';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import axios from 'axios';

type PokemonListType = {
  name: string;
  url: string;
};

type LocationListType = {
  name: string;
  url: string;
}

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Count />
      <Pokemon />
      <Berries />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

// custom hook for react query
function usePokemon() {
  // useQuery takes 3 things:
  // 1. a name for the query
  // 2. an api
  //    - need to make sure your data arrives as json!
  // 3. (optional) an object of options
  return useQuery<PokemonListType[]>(
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
      // inactive state: query not being used on screen becomes
      // inactive, but is cached until the cacheTime runs out
      // default: ~5 minutes
      cacheTime: 1000000,
    }
  );
}

const Count = () => {
  const queryInfo = usePokemon();
  
  return <h3>You are looking at {queryInfo.data?.length} Pokemon</h3>;
};

const Berries = () => {
  const queryInfo = useQuery<LocationListType[]>('berries', async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return axios.get('https://pokeapi.co/api/v2/berry')
    .then(res => res.data.results)
  })

  if (queryInfo.isLoading) return <div>'Loading...'</div>;

  if (queryInfo.isError) return <div>'Error'</div>;

  return (
    <div>
      <h3>You are looking at {queryInfo.data?.length} berries</h3>
      {queryInfo.data!.map((result) => {
        return <div key={result.name}>{result.name}</div>;
      })}
      <br />
      {queryInfo.isFetching ? <div>'Updating...'</div> : null}
    </div>
  );
}

const Pokemon = () => {
  const queryInfo = usePokemon();

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

export default App;
