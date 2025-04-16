import { useState } from "react";
import { Pokemon } from "../api/types";
import { PokemonBattleCard } from "../components/PokemonBattleCard";
import { randomNum } from "../utils";

const BattleAttackDamage = 10;
const BattleWinCash = 30;
const RoundWinCash = 15;

type BattlePageProps = {
  playerBattlePokemon: Pokemon | null;
  onSetBattlePokemon: (newPlayerBattlePokemon: Pokemon | null) => void;
  opponentBattlePokemon: Pokemon | null;
  onSetOpponentBattlePokemon: (newOpponentBattlePokemon: Pokemon | null) => void;
  playerBench: Pokemon[];
  onSetPlayerBench: (newBench: Pokemon[]) => void;
  onBenchClick: () => void;
  opponentBench: Pokemon[];
  onSetOpponentBench: (newBench: Pokemon[]) => void;
  upgradeHpAmount: number;
  playerCash: number;
  addPlayerCash: (newAmount: number) => void;
  opponentCash: number;
  addOpponentCash: (newAmount: number) => void;
  onPlayerKnockOut: () => void;
  onOpponentKnockOut: () => void;
};

export const BattlePage = ({ playerBattlePokemon, onSetBattlePokemon, opponentBattlePokemon, onSetOpponentBattlePokemon, playerBench, onSetPlayerBench, onBenchClick,
  opponentBench, onSetOpponentBench, upgradeHpAmount, playerCash, addPlayerCash, addOpponentCash, onPlayerKnockOut, onOpponentKnockOut }: BattlePageProps) => {
  const [ gameState, setGameState ] = useState(randomNum(10) >= 5 ? "YourTurn" : "InitOpponentTurn");
  const [ hasBeenDamaged, setHasBeenDamaged ] = useState(false);
  const [ opponentHadInitAttack, setOpponentHadInitAttack ] = useState(false);

  if (gameState === "InitOpponentTurn" && opponentHadInitAttack === false) {
    setOpponentHadInitAttack(true);
    setTimeout(startInitAttackOnPlayer, (Math.random() * 500) + 1000);
  }
  async function startInitAttackOnPlayer() {
    if (gameState === "InitOpponentTurn" && opponentHadInitAttack === false) {
      setTimeout(startAttackOnPlayer, (Math.random() * 500) + 500);
    }
  }

  function startAttackOnPlayer() {
    setGameState("AttackingYou");

    if (playerBattlePokemon && opponentBattlePokemon) {
      const attackDamage = Math.floor(BattleAttackDamage * opponentBattlePokemon.stats_attack / playerBattlePokemon.stats_defense); // * Power of attack
      setHasBeenDamaged(true);
      //console.log("startAttackOnPlayer() setHasBeenDamaged() " + playerBattlePokemon.stats_hp + " - " + attackDamage + " = " + (playerBattlePokemon.stats_hp - attackDamage));

      const isDead = (playerBattlePokemon.stats_hp - attackDamage) <= 0;
      const attackThisPokemonIndex = playerBench.findIndex((item) => item.idKey === playerBattlePokemon.idKey);
      if (attackThisPokemonIndex !== -1) {
        const attackThisPokemon = { ...playerBench.at(attackThisPokemonIndex), stats_hp: Math.max(playerBattlePokemon.stats_hp - attackDamage, 0) } as Pokemon;
        const newBench = [...playerBench];
        newBench[attackThisPokemonIndex] = attackThisPokemon;
        onSetPlayerBench(newBench);
        onSetBattlePokemon(attackThisPokemon);
      }

      if (isDead) {
        // Player Lost!
        setGameState("YouLost");
        let totalWinnings = RoundWinCash;
        if (playerBench.length === 1) {
          totalWinnings = BattleWinCash + RoundWinCash;
        }
        addOpponentCash(totalWinnings);
        onPlayerKnockOut();
        return;
      }
    }

    setTimeout(endAttackOnPlayer, (Math.random() * 500) + 500);
  }
  function endAttackOnPlayer() {
    setGameState("YourTurn");
  }

  function startAttackOnOpponent() {
    setGameState("AttackingOpponent");

    if (playerBattlePokemon && opponentBattlePokemon) {
      // https://bulbapedia.bulbagarden.net/wiki/Damage
      const attackDamage = Math.floor(BattleAttackDamage * playerBattlePokemon.stats_attack / opponentBattlePokemon.stats_defense); // * Power of attack
      // https://bulbapedia.bulbagarden.net/wiki/Attack_(TCG)
      //console.log("startAttackOnOpponent() hasBeenDamaged() " + opponentBattlePokemon.stats_hp + " - " + attackDamage + " = " + (opponentBattlePokemon.stats_hp - attackDamage));

      const isDead = (opponentBattlePokemon.stats_hp - attackDamage) <= 0;
      const attackThisPokemonIndex = opponentBench.findIndex((item) => item.idKey === opponentBattlePokemon.idKey);
      if (attackThisPokemonIndex !== -1) {
        const attackThisPokemon = { ...opponentBench.at(attackThisPokemonIndex), stats_hp: Math.max(opponentBattlePokemon.stats_hp - attackDamage, 0) } as Pokemon;
        const newBench = [...opponentBench];
        newBench[attackThisPokemonIndex] = attackThisPokemon;
        onSetOpponentBench(newBench);
        onSetOpponentBattlePokemon(attackThisPokemon);
      }

      if (isDead) {
        // Player Won!
        setGameState("YouWin");
        let totalWinnings = RoundWinCash;
        if (opponentBench.length === 1) {
          totalWinnings = BattleWinCash + RoundWinCash;
        }
        addPlayerCash(totalWinnings);

        onOpponentKnockOut();
        return;
      }
    }

    setTimeout(endAttackOnOpponent, (Math.random() * 500) + 500);
  }
  function endAttackOnOpponent() {
    setGameState("OpponentTurn");
    setTimeout(startAttackOnPlayer, (Math.random() * 500) + 1000);
  }

  function onAttackClick() {
    if (gameState === "YourTurn") {
      startAttackOnOpponent();
    }
    else if (gameState === "OpponentTurn") {
      startAttackOnPlayer();
    }
  }

  function onHealClick() {
    if (playerCash > 0 && playerBattlePokemon) {
      const hpAmountToUpgrade = Math.min(Math.min(playerBattlePokemon.stats_hpTotal - playerBattlePokemon.stats_hp, upgradeHpAmount), playerCash);
      if (playerBattlePokemon.stats_hp + hpAmountToUpgrade <= playerBattlePokemon.stats_hpTotal) {
        addPlayerCash(-hpAmountToUpgrade);

        const healThisPokemonIndex = playerBench.findIndex((item) => item.idKey === playerBattlePokemon.idKey);
        if (healThisPokemonIndex !== -1) {
          const healThisPokemon = { ...playerBench.at(healThisPokemonIndex), stats_hp: playerBattlePokemon.stats_hp + hpAmountToUpgrade } as Pokemon;
          const newBench = [...playerBench];
          newBench[healThisPokemonIndex] = healThisPokemon;
          onSetPlayerBench(newBench);
          onSetBattlePokemon(healThisPokemon);
        }
      }
    }
  }

  // TODO: Should Heal only restore what they started the battle with?
  const canHeal = hasBeenDamaged && playerBattlePokemon && playerBattlePokemon.stats_hp < playerBattlePokemon.stats_hpTotal && playerCash > 0;

  return (
    <>
      <img width="175" height="50" src="https://assets.pokemon.com/assets/cms2/img/misc/gus/promotions/tcg-175-en.png"></img>
      <h1>Pokémon Battle</h1>
      <h2>Round ends when a Pokémon is Knocked Out!<br/>Battle ends when all Pokémon are Knocked Out!</h2>
      <h3>Player Cash ${playerCash}</h3>

      <p/>
      <table style={{ textAlign:"center" }}>
        <thead>
          <tr style={{ height:60 }}>
            <th style={{ width:50 }}></th>
            <th>
              {(gameState === "YourTurn" || gameState === "AttackingOpponent") && <span>Your Turn</span>}
              {gameState === "YouWin" && <span>+${opponentBench.length === 0 ? (BattleWinCash + RoundWinCash) : RoundWinCash}</span>}
            </th>
            <th style={{ width:80,height:60 }}>
              {gameState === "YouWin" && opponentBench.length > 0 && <span>You Win<br/>the Round!</span>}
              {gameState === "YouWin" && opponentBench.length === 0 && <span>You Win<br/>the Battle!</span>}
              {gameState === "YouLost" && playerBench.length > 0 && <span>You Lost<br/>the Round!</span>}
              {gameState === "YouLost" && playerBench.length === 0 && <span>You Lost<br/>the Battle!</span>}
            </th>
            <th>
              {(gameState === "OpponentTurn" || gameState === "AttackingYou" || gameState === "InitOpponentTurn") && <span>Opponent's<br/>Turn</span>}
              {gameState === "YouLost" && <span>+${playerBench.length === 0 ? (BattleWinCash + RoundWinCash) : RoundWinCash}</span>}
            </th>
            <th style={{ width:50 }}></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ width:50, borderRight:"solid" }}>
              {playerBench.map((item) => (
                item.idKey !== playerBattlePokemon?.idKey && <img key={item.idKey} width="40" height="30" style={{ transform: "scaleX(-1)" }} src={item.sprites_versions_generation_vii_icons_front_default}></img>
              ))}
            </td>
            <td>{playerBattlePokemon && <PokemonBattleCard playerBattlePokemon={playerBattlePokemon} scaleX={-1} />}</td>
            <td style={{ width:80 }}>
              {(gameState === "YourTurn" || gameState === "AttackingOpponent") && <span><br/><br/>&#8649; &#8649; &#8649;</span>}
              {(gameState === "OpponentTurn" || gameState === "AttackingYou" || gameState === "InitOpponentTurn") && <span><br/><br/>&#8647; &#8647; &#8647;</span>}
            </td>
            <td>{opponentBattlePokemon && <PokemonBattleCard playerBattlePokemon={opponentBattlePokemon} scaleX={1} />}</td>
            <td style={{ width:50, borderLeft:"solid" }}>
              {opponentBench.map((item) => (
                item.idKey !== opponentBattlePokemon?.idKey && <img key={item.idKey} width="40" height="30" style={{ transform: "scaleX(1)" }} alt={item.name} src={item.sprites_versions_generation_vii_icons_front_default}></img>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      <p/>

      {gameState === "YourTurn" && <button style={{ background: playerBattlePokemon?.species_color }} onClick={() => onAttackClick()}>Attack!</button>}
      {gameState === "YourTurn" && canHeal && <button style={{ background: playerBattlePokemon?.species_color }} onClick={() => onHealClick()}>Heal!</button>}
      {<br/>}
      {gameState === "YourTurn" && <button style={{ background: playerBattlePokemon?.species_color }} onClick={() => onBenchClick()}>Retreat to Bench!</button>}
      {(gameState === "YouWin" || gameState === "YouLost") && <button style={{ background: playerBattlePokemon?.species_color }}
        onClick={() => onBenchClick()}>Back to Bench!</button>}
    </>
  );
};
// https://www.w3schools.com/charsets/ref_utf_arrows.asp
