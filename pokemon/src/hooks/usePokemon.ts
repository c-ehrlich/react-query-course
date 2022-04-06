import axios from "axios";
import { useQuery } from "react-query";
import PokemonList from "../types/PokemonList";

// custom hook for react query
function usePokemon() {
  // useQuery takes 3 things:
  // 1. a name for the query
  // 2. an api
  //    - need to make sure your data arrives as json!
  // 3. (optional) an object of options
  return useQuery<PokemonList[]>(
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

export default usePokemon;
