import { useState } from "react";
import { HomePage } from "./Home";
import { BenchPage } from "./Bench";
import { BattlePage } from "./Battle";
import { useGetPokemons } from "../hooks/useGetPokemons";
import { Pokemon, PokemonDataArray, copyPokemonDataToPokemon } from "../api/types";
import { randomNum, getRandomNumbers } from "../utils";

const StartingNumberOfPokemon = 6;
const StartingCashPerPokemon: number = 20;
const StartingCashTotal: number = StartingNumberOfPokemon * StartingCashPerPokemon;
const UpgradeHpAmount = 10; // One dollar per Hp

function fillPokemonArray(numberOfPokemon: number, hasShinyBeenChosen: boolean, data: PokemonDataArray, moreNumbersToAvoid: number[]) : Pokemon[] {
  const PokemonData = [] as Pokemon[];
  const randomNumbers = getRandomNumbers(numberOfPokemon, 0, data.allPokemonData.length, true, moreNumbersToAvoid);
  let shinyHasBeenChosen = hasShinyBeenChosen; // only let one at most be shiny
  for (let step = 0; step < randomNumbers.length; step++) {
    const newPokemon = copyPokemonDataToPokemon(data.allPokemonData[randomNumbers[step]]);
    newPokemon.idKey = newPokemon.name.slice(0,6) + "-" + step + "-" + newPokemon.id;
    const isShiny = randomNum(10) === 5;
    if (isShiny === true && shinyHasBeenChosen === false) {
      newPokemon.isShiny = true;
      shinyHasBeenChosen = true;
    }
    else {
      newPokemon.isShiny = false;
    }
    PokemonData.push(newPokemon);
  }
  return PokemonData;
}

export const PageList = () => {
  const { allPokemonData, isLoading } = useGetPokemons();
  const [ page, setPage ] = useState("home");
  const [ playerCash, setPlayerCash ] = useState(StartingCashTotal);
  const [ playerBench, setPlayerBenchData] = useState([] as Pokemon[]);
  const [ playerBattlePokemon, setBattlePokemon] = useState(null as Pokemon | null);
  const [ opponentCash, setOpponentCash ] = useState(StartingCashTotal);
  const [ opponentBench, setOpponentBenchData] = useState([] as Pokemon[]);
  const [ opponentBattlePokemon, setOpponentBattlePokemon] = useState(null as Pokemon | null);
  const [ isGameOver, setGameOver ] = useState(false);

  function addPlayerCash(addAmount: number) {
    setPlayerCash(playerCash + addAmount);
  }
  function addOpponentCash(addAmount: number) {
    setOpponentCash(opponentCash + addAmount);
  }

  function sendPokemonToBattle(idKey: string) {
    if (playerBench.length > 0 && opponentBench.length > 0) {
      const activePokemon = playerBench.find((item) => item.idKey === idKey) as Pokemon;
      if (activePokemon) {
        setBattlePokemon(activePokemon);

        const opponentPokemon = opponentBench[0] as Pokemon;
        setOpponentBattlePokemon(opponentPokemon);

        setPage("battle");
      }
    }
  }

  function knockPlayerOut() {
    if (playerBattlePokemon) {
      const newBench = playerBench.filter((item) => item.idKey !== playerBattlePokemon.idKey);
      setPlayerBenchData(newBench);
      if (newBench.length === 0) {
        setGameOver(true);
      }
    }
  }
  function knockOpponentOut() {
    if (opponentBattlePokemon) {
      const newBench = opponentBench.filter((item) => item.idKey !== opponentBattlePokemon.idKey);
      setOpponentBenchData(newBench);
      if (newBench.length === 0) {
        setGameOver(true);
      }
    }
  }

  function restartGame() {
    // refill benches, adding cash for each new pokemon.
    const numToAddForPlayer = StartingNumberOfPokemon - playerBench.length;
    if (numToAddForPlayer > 0) {
      addPlayerCash(numToAddForPlayer * StartingCashPerPokemon);

      const hasShinyBeenChosen = playerBench.filter((pokemon) => pokemon.isShiny).length !== 0;
      const moreNumbersToAvoid = [] as number[];
      playerBench.forEach((pokemon) => {
        pokemon.species_evolution_chain_ids.forEach((evChainIdPokemon) => {
          const idx = data.allPokemonData.findIndex((pokemonData) => pokemonData.id === evChainIdPokemon);
          if (!moreNumbersToAvoid.includes(idx)) {
            moreNumbersToAvoid.push(idx);
          }
        });
      });
      const newBench = playerBench.concat(fillPokemonArray(numToAddForPlayer, hasShinyBeenChosen, data, moreNumbersToAvoid));
      setPlayerBenchData(newBench);
    }

    const numToAddForOpponent = StartingNumberOfPokemon - opponentBench.length;
    if (numToAddForOpponent > 0) {
      addOpponentCash(numToAddForOpponent * StartingCashPerPokemon);

      const hasShinyBeenChosen = opponentBench.filter((pokemon) => pokemon.isShiny).length !== 0;
      const moreNumbersToAvoid = opponentBench.map((pokemon) => data.allPokemonData.findIndex((pokemonData) => pokemonData.id === pokemon.id));
      opponentBench.forEach((pokemon) => {
        pokemon.species_evolution_chain_ids.forEach((evChainIdPokemon) => {
          const idx = data.allPokemonData.findIndex((pokemonData) => pokemonData.id === evChainIdPokemon);
          if (!moreNumbersToAvoid.includes(idx)) {
            moreNumbersToAvoid.push(idx);
          }
        });
      });
      const newBench = opponentBench.concat(fillPokemonArray(numToAddForOpponent, hasShinyBeenChosen, data, moreNumbersToAvoid));
      setOpponentBenchData(newBench);
    }

    setGameOver(false);
  }

  // Initialize bench pokemon
  const data = allPokemonData as PokemonDataArray;
  if (isGameOver === false && data && data.allPokemonData && data.allPokemonData.length > 0) {
    if (playerBench.length === 0) {
      setPlayerBenchData(fillPokemonArray(StartingNumberOfPokemon - playerBench.length, false, data, []));
    }
    if (opponentBench.length === 0) {
      setOpponentBenchData(fillPokemonArray(StartingNumberOfPokemon - opponentBench.length, false, data, []));
    }
  }

  return (
    <>
      { page === "home" && (<HomePage onBenchClick={() => setPage("bench")} />)}

      { page === "bench" && (<BenchPage isLoading={isLoading} allPokemonData={data.allPokemonData} playerBench={playerBench}
        onSetPlayerBench={(newBench:Pokemon[]) => setPlayerBenchData(newBench)} upgradeHpAmount={UpgradeHpAmount} playerCash={playerCash}
        onSetPlayerCash={(newAmount:number) => setPlayerCash(newAmount)} opponentCash={opponentCash} onBattleClick={sendPokemonToBattle}
        isGameOver={isGameOver} onPlayAgainClick={() => restartGame()}/>)}

      { page === "battle" && (<BattlePage playerBattlePokemon={playerBattlePokemon}
        onSetBattlePokemon={(newPlayerBattlePokemon: Pokemon | null) => setBattlePokemon(newPlayerBattlePokemon)}
        opponentBattlePokemon={opponentBattlePokemon}
        onSetOpponentBattlePokemon={(newOpponentBattlePokemon: Pokemon | null) => setOpponentBattlePokemon(newOpponentBattlePokemon)}
        playerBench={playerBench} onSetPlayerBench={(newBench:Pokemon[]) => setPlayerBenchData(newBench)} onBenchClick={() => setPage("bench")} opponentBench={opponentBench}
        onSetOpponentBench={(newBench:Pokemon[]) => setOpponentBenchData(newBench)} upgradeHpAmount={UpgradeHpAmount} playerCash={playerCash}
        addPlayerCash={(addAmount:number) => addPlayerCash(addAmount)} opponentCash={opponentCash} addOpponentCash={(addAmount:number) => addOpponentCash(addAmount)}
        onPlayerKnockOut={() => knockPlayerOut()}  onOpponentKnockOut={() => knockOpponentOut()} />)}
    </>
  );
};
