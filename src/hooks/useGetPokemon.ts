import { useQuery } from "@tanstack/react-query";
import { Pokemon } from "../api/types";
import { getPokemon } from "../api/pokemon";
import { POKEMON_QUERY_KEY } from "./keys";

export const useGetPokemon = (id: string) => {
  const { data, error, isLoading } = useQuery<Pokemon>({
    queryKey: [POKEMON_QUERY_KEY, id],
    queryFn: () => getPokemon(id),
  });
  return { data, error, isLoading };
};
