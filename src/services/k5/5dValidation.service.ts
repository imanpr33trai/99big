export const isNumber = (value: string): boolean => /^\d+$/.test(value);

export const validate5dBet = (
  join: string,
  listJoin: string,
  x: string,
  money: string,
  game: string,
): boolean => {
  const checkJoin = isNumber(listJoin);
  const checkX = isNumber(x);
  const checks = ["a", "b", "c", "d", "e", "total"].includes(join);
  const checkGame = ["1", "3", "5", "10"].includes(String(game));
  const checkMoney = ["1", "10", "100", "1000"].includes(money);

  if (!checks || listJoin.length > 10 || !checkX || !checkMoney || !checkGame) {
    return false;
  }

  const arr = listJoin.split("");

  if (checkJoin) {
    return arr.every((char) => ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(char));
  } else {
    return arr.every((char) => ["c", "l", "b", "s"].includes(char));
  }
};
