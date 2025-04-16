import { Pokemon, PokemonData, copyPokemonDataToPokemon } from "../api/types";
import { PokemonBenchCard } from "../components/PokemonBenchCard";

type BenchPageProps = {
  allPokemonData: PokemonData[];
  playerBench: Pokemon[];
  onSetPlayerBench: (newBench: Pokemon[]) => void;
  isLoading: boolean;
  upgradeHpAmount: number;
  playerCash: number;
  onSetPlayerCash: (newAmount: number) => void;
  opponentCash: number;
  onBattleClick: (idKey: string) => void;
  isGameOver: boolean;
  onPlayAgainClick: () => void;
};

export const BenchPage = ({ allPokemonData, playerBench, onSetPlayerBench, isLoading, upgradeHpAmount, playerCash, onSetPlayerCash, onBattleClick,
  isGameOver, onPlayAgainClick }: BenchPageProps) => {

  function upgradeThisPokemon(idKey: string) {
    const upgradeThisPokemonIndex = playerBench.findIndex((item) => item.idKey === idKey);
    if (upgradeThisPokemonIndex === -1) {
      return;
    }

    const upgradeThisPokemon = playerBench.at(upgradeThisPokemonIndex) as Pokemon;

    // just add hp
    if (upgradeThisPokemon.stats_hp + upgradeHpAmount <= upgradeThisPokemon.stats_hpTotal) {
      if (playerCash >= upgradeHpAmount) {
        onSetPlayerCash(playerCash - upgradeHpAmount);

        const newBench = [...playerBench];
        newBench[upgradeThisPokemonIndex] = upgradeThisPokemon;
        newBench[upgradeThisPokemonIndex].stats_hp = upgradeThisPokemon.stats_hp + upgradeHpAmount;
        onSetPlayerBench(newBench);
      }
    }
    else {
      // top off hp since it can't evolve
      if (upgradeThisPokemon.evolves_to === "none") {
        const hpLeftToUpgrade = upgradeThisPokemon.stats_hpTotal - upgradeThisPokemon.stats_hp;
        if (playerCash >= hpLeftToUpgrade) {
          onSetPlayerCash(playerCash - hpLeftToUpgrade);

          const newBench = [...playerBench];
          newBench[upgradeThisPokemonIndex] = upgradeThisPokemon;
          newBench[upgradeThisPokemonIndex].stats_hp = upgradeThisPokemon.stats_hp + hpLeftToUpgrade;
          onSetPlayerBench(newBench);
        }
      }
      else {
        // evolve and add leftover hp
        // caterpie 45 - metapod 50 - butterfree 60
        // weedle 40 - kakuna 45 - beedrill 65
        const evolveToPokemonIndex = allPokemonData.findIndex((item) => item.name === upgradeThisPokemon.evolves_to);
        if (evolveToPokemonIndex !== -1) {
          const evolvedPokemon = copyPokemonDataToPokemon(allPokemonData.at(evolveToPokemonIndex) as PokemonData);

          const hpToUpgradeThisPokemon = upgradeThisPokemon.stats_hpTotal - upgradeThisPokemon.stats_hp;
          const hpToEvolve = evolvedPokemon.stats_hpTotal - upgradeThisPokemon.stats_hpTotal;
          const hpAmountToUpgrade = Math.min(hpToUpgradeThisPokemon + hpToEvolve, upgradeHpAmount);
          if (playerCash >= hpAmountToUpgrade) {
            onSetPlayerCash(playerCash - hpAmountToUpgrade);

            const newBench = [...playerBench];
            newBench[upgradeThisPokemonIndex] = evolvedPokemon;
            newBench[upgradeThisPokemonIndex].stats_hp = Math.min(upgradeThisPokemon.stats_hp + hpAmountToUpgrade, evolvedPokemon.stats_hpTotal);
            newBench[upgradeThisPokemonIndex].idKey = upgradeThisPokemon.idKey;
            newBench[upgradeThisPokemonIndex].isShiny = upgradeThisPokemon.isShiny;
            onSetPlayerBench(newBench);
          }
        }
      }
    }
  }

  return (
    <>
      <img width="175" height="50" src="https://assets.pokemon.com/assets/cms2/img/misc/gus/promotions/tcg-175-en.png"></img>
      <h1>Pokémon Bench</h1>
      <h2>Train your Pokémon here on your Bench! Each training costs ${upgradeHpAmount} for {upgradeHpAmount} HP!<br/>Then send them into Battle to win more cash!</h2>
      <h3>Player Cash ${playerCash}</h3>
      {playerBench.map((item) => (
        <PokemonBenchCard key={item.idKey} idKey={item.idKey} playerBench={playerBench} onUpgradeClick={upgradeThisPokemon} onBattleClick={onBattleClick}
        isGameOver={isGameOver }/>
      ))}
      {isLoading === true && <span>Initializing...</span>}
      <p/>
      {isGameOver === true && <button style={{ background: "#3B4CCA", color: "#FFDE00" }} onClick={() => onPlayAgainClick()}>Play Again!</button>}
    </>
  );
};
