import { Pool } from "mysql2/promise";
import { k3PayoutOdds } from "../config/k3.config";

// ============================================================================
// TYPES
// ============================================================================

interface PendingOrder {
  id: number;
  phone: string;
  bet: string;
  price: number;
  money: number;
  fee: number;
  amount: number;
  result: string;
  typeGame: "total" | "two-same" | "three-same" | "unlike";
}

// ============================================================================
// DATABASE QUERIES
// ============================================================================

const getPendingOrders = async (db: Pool, game: number): Promise<PendingOrder[]> => {
  const [rows] = await db.execute(
    `SELECT id, phone, bet, price, money, fee, amount, result, typeGame
     FROM result_k3
     WHERE status = 0 AND game = ?`,
    [game],
  );
  return rows as PendingOrder[];
};

const updateOrderPayout = async (db: Pool, id: number, payout: number): Promise<void> => {
  await db.execute("UPDATE result_k3 SET winAmount = ?, status = 1 WHERE id = ?", [payout, id]);
};

const updateUserBalance = async (db: Pool, phone: string, amount: number): Promise<void> => {
  await db.execute("UPDATE users SET balance = balance + ? WHERE phone = ?", [amount, phone]);
};

// ============================================================================
// PAYOUT CALCULATORS
// ============================================================================

const calculateTotalPayout = (order: PendingOrder): number => {
  const { bet, result, money, amount, fee } = order;
  const selections = bet.split(",");
  const resultDigits = result.split("");
  const totalSum = resultDigits.reduce((sum, d) => sum + Number(d), 0);

  const baseBet = money / selections.length / amount;
  const feePerBet = baseBet * 0.02;
  const pricePerBet = baseBet - feePerBet;

  let payout = 0;

  // Category bets (big/small/even/odd)
  const categorySelections = selections.filter((s) => !/^\d+$/.test(s));

  if (totalSum % 2 === 0 && categorySelections.includes("c")) {
    payout += pricePerBet * k3PayoutOdds.total.c;
  }
  if (totalSum % 2 !== 0 && categorySelections.includes("l")) {
    payout += pricePerBet * k3PayoutOdds.total.l;
  }
  if (totalSum >= 11 && totalSum <= 18 && categorySelections.includes("b")) {
    payout += pricePerBet * k3PayoutOdds.total.b;
  }
  if (totalSum >= 3 && totalSum <= 10 && categorySelections.includes("s")) {
    payout += pricePerBet * k3PayoutOdds.total.s;
  }

  // Number bets
  const numberSelections = selections.filter((s) => /^\d+$/.test(s));
  const winningNumbers = numberSelections.filter((n) => n === String(totalSum));

  if (winningNumbers.length > 0) {
    const oddsKey = `t${totalSum}` as keyof typeof k3PayoutOdds.total;
    const odds = k3PayoutOdds.total[oddsKey] || 0;
    payout += pricePerBet * odds;
  }

  return payout;
};

const calculateTwoSamePayout = (order: PendingOrder): number => {
  const { bet, result, money, amount, fee } = order;
  const resultDigits = result.split("");
  const pair1 = resultDigits[0] + resultDigits[1];
  const pair2 = resultDigits[1] + resultDigits[2];

  const [pairsPart, uniquePart] = bet.split("@");
  const pairSelections = pairsPart.split(",").filter((p) => p !== "");
  const uniqueSelections = uniquePart ? uniquePart.split("&") : [];

  let payout = 0;

  // Calculate total combinations for bet sizing
  let uniqueCount = 0;
  let uniqueDigitCount = 0;

  for (const unique of uniqueSelections) {
    if (unique) {
      const parts = unique.split("|");
      if (parts.length > 1) {
        uniqueDigitCount = parts[1].split(",").length;
      }
      uniqueCount++;
    }
  }

  const totalCombinations = uniqueCount + pairSelections.filter((p) => p !== "").length;
  const baseBet = money / amount / totalCombinations;

  // Check pair wins
  for (const pair of pairSelections) {
    if (pair === "") continue;

    if (pair === pair1 || pair === pair2) {
      payout += baseBet * k3PayoutOdds.two.twoSame;
    }
  }

  // Check unique wins
  for (const unique of uniqueSelections) {
    if (!unique) continue;

    const [pair, digitsStr] = unique.split("|");
    const digits = digitsStr ? digitsStr.split(",") : [];

    const matchPair = pair === pair1 || pair === pair2;

    if (matchPair) {
      payout += baseBet * k3PayoutOdds.two.twoD;
    }
  }

  return payout - fee;
};

const calculateThreeSamePayout = (order: PendingOrder): number => {
  const { bet, result, money, amount, fee } = order;
  const [uniquePart, triplePart] = bet.split("@");
  const uniqueSelections = uniquePart.split(",").filter((u) => u !== "");

  let uniqueCount = 0;
  for (const u of uniqueSelections) {
    if (u !== "") uniqueCount++;
  }

  const tripleCount = triplePart ? 1 : 0;
  const totalCombinations = uniqueCount + tripleCount;
  const baseBet = money / totalCombinations / amount;

  let payout = 0;

  // Check unique selections
  for (const unique of uniqueSelections) {
    if (unique === result) {
      payout += baseBet * k3PayoutOdds.three.threeD - fee;
    }
  }

  // Check triple selection
  if (triplePart) {
    const triples = ["111", "222", "333", "444", "555", "666"];
    if (triples.includes(result)) {
      payout += baseBet * k3PayoutOdds.three.threeSame - fee;
    }
  }

  return payout;
};

const calculateUnlikePayout = (order: PendingOrder): number => {
  const { bet, result, money, amount, fee } = order;
  const resultDigits = result.split("");
  const [firstPart, middle, lastPart] = bet.split("@");
  const firstSelections = firstPart.split(",").filter((f) => f !== "");
  const lastSelections = lastPart ? lastPart.split(",") : [];

  let payout = 0;

  // Calculate combinations
  let firstCount = 0;
  for (const f of firstSelections) {
    if (f !== "") firstCount++;
  }

  let lastCount = 0;
  for (const l of lastSelections) {
    if (l !== "") lastCount++;
  }

  const middleCount = middle === "u" ? 1 : 0;
  const totalCombinations = firstCount + lastCount + middleCount;
  const baseBet = money / totalCombinations / amount;

  // First part - unlike three (lose if any match)
  for (const first of firstSelections) {
    if (first === "") continue;

    if (!resultDigits.includes(first)) {
      payout += baseBet * k3PayoutOdds.unlike.unlikeThree - fee;

      if (middle === "u") {
        payout += (baseBet - fee) * k3PayoutOdds.unlike.threeL;
      }
    }
  }

  // Middle part - three consecutive
  if (middle === "u") {
    const firstNonEmpty = firstSelections.filter((f) => f !== "").length;
    const lastNonEmpty = lastSelections.filter((l) => l !== "").length;
    const total = money / (1 + firstNonEmpty + lastNonEmpty) / amount;
    payout += (total - fee) * k3PayoutOdds.unlike.threeL;
  }

  // Last part - unlike two (lose if any match)
  for (const last of lastSelections) {
    if (last === "") continue;

    if (!resultDigits.includes(last)) {
      const firstNonEmpty = firstSelections.filter((f) => f !== "").length;
      const total = money / (lastCount + firstNonEmpty) / amount;
      payout += total * k3PayoutOdds.unlike.unlikeTwo - fee;
    }
  }

  return payout;
};

// ============================================================================
// MAIN PAYOUT PROCESSOR
// ============================================================================

export const processK3Payouts =
  (db: Pool) =>
  async (game: number): Promise<void> => {
    const orders = await getPendingOrders(db, game);

    for (const order of orders) {
      let payout = 0;

      switch (order.typeGame) {
        case "total":
          payout = calculateTotalPayout(order);
          break;
        case "two-same":
          payout = calculateTwoSamePayout(order);
          break;
        case "three-same":
          payout = calculateThreeSamePayout(order);
          break;
        case "unlike":
          payout = calculateUnlikePayout(order);
          break;
        default:
          payout = 0;
      }

      // Only process if there's a payout
      if (payout > 0) {
        await updateOrderPayout(db, order.id, payout);
        await updateUserBalance(db, order.phone, payout);
      }
    }
  };
