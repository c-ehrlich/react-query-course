import usePokemon from "../hooks/usePokemon";
import Count from "./Count";

const Pokemon = () => {
  const queryInfo = usePokemon();

  if (queryInfo.isLoading) return <div>'Loading...'</div>;

  if (queryInfo.isError) return <div>'Error'</div>;

  return (
    <div>
      <Count />
      {queryInfo.data!.map((result) => {
        return <div key={result.name}>{result.name}</div>;
      })}
      <br />
      {queryInfo.isFetching ? <div>'Updating...'</div> : null}
    </div>
  );
};

export default Pokemon;