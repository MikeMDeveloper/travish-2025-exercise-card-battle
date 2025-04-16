export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomNum(max: number) : number {
  return Math.floor(Math.random() * max);
}

export function getRandomNumbers(howMany: number, min: number, max: number, tryToPreventDupes: boolean, moreNumbersToAvoid: number[]) : number[] {
  const numbers = [] as number[];
  for (let step = 0; step < howMany; step++) {
    for (let tries = 0; tries < 4; tries++) {
      const newNumber = randomNum(max - min) + min;
      if (tryToPreventDupes === false || (numbers.includes(newNumber) === false && moreNumbersToAvoid.includes(newNumber) === false)) {
        numbers.push(newNumber);
        break;
      }
    }
  }
  return numbers;
}
