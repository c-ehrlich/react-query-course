import axios from "axios";
import { useQuery } from "react-query";
import BerryList from "../types/BerryList";

const Berries = () => {
  const queryInfo = useQuery<BerryList[]>('berries', async () => {
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

export default Berries;