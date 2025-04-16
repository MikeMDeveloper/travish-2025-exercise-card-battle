import { useQuery } from "@tanstack/react-query";
import { PokemonDataArray } from "../api/types";
import { getPokemons } from "../api/pokemon";
import { POKEMONS_QUERY_KEY } from "./keys";

export const useGetPokemons = () => {
  const { data, error, isLoading, refetch } = useQuery<PokemonDataArray>({
    queryKey: [POKEMONS_QUERY_KEY],
    queryFn: () => getPokemons(),
  });

  return { allPokemonData: data ? data : [], error, isLoading, refetch };
};
