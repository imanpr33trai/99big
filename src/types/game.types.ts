export interface GameSessionRecord {
  id: number;
  period: string;
  gameTypeId: number;
  result: string | null;
  status: number;
  startedAt: bigint;
  closedAt: bigint;
  resultAt: bigint;
  createdAt: bigint;
}

export interface GameWingoRecord {
  id: number;
  period: string;
  game: string;
  amount: number;
  status: number;
  time: number;
  sessionId: number | null;
}

export interface Game5dRecord {
  id: number;
  period: string;
  result: string;
  game: number;
  status: number;
  time: number;
  sessionId: number | null;
}

export interface GameK3Record {
  id: number;
  period: string;
  result: string;
  game: number;
  status: number;
  time: number;
  sessionId: number | null;
}

export interface GameBetRecord {
  id: number;
  id_product: number;
  phone: string;
  code: string;
  invite: string;
  stage: number;
  level: number;
  money: number;
  price: number;
  amount: number;
  fee: number;
  get: number;
  game: string | number;
  join_bet: string;
  bet: string;
  result: string | number;
  status: number;
  today: string;
  time: number;
  typeGame?: string;
}
