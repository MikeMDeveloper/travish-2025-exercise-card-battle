import { sleep } from "../utils";
import { Pokemon } from "./types";
import { PokemonDataArray } from "./types";

export const getPokemons = async (): Promise<PokemonDataArray> => {
  await sleep(500); // simulate slow network
  const response = await fetch(`/pokemons`);
  return response.json();
};

export const getPokemon = async (id: string): Promise<Pokemon> => {
  await sleep(500); // simulate slow network
  const response = await fetch(`/pokemons/${id}`);
  return response.json();
};
