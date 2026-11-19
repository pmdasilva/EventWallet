export interface WalletState {
  walletId: string
  ownerName: string
  createdAt?: string
  balance: number
}

export interface WalletEvent {
  aggregateId: string
  eventType: string
  occurredAt: string
  version: number
  payload: unknown
}

interface WalletCreatedResponse {
  walletId: string
}

interface HistoricalBalanceResponse {
  walletId: string
  balance: number
  date: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function request(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const responseText = await response.text()
    let message = responseText || `A API respondeu com status ${response.status}.`
    try {
      const body: unknown = JSON.parse(responseText)
      if (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string') {
        message = body.message
      }
    } catch {
      // Keep the response text when the server does not return JSON.
    }
    throw new Error(message)
  }

  return response
}

async function readJson<T>(path: string): Promise<T> {
  const response = await request(path)
  return response.json() as Promise<T>
}

export function getWallet(walletId: string) {
  return readJson<WalletState>(`/wallets/${encodeURIComponent(walletId)}`)
}

export function getEvents(walletId: string) {
  return readJson<WalletEvent[]>(`/wallets/${encodeURIComponent(walletId)}/events`)
}

export async function createWallet(ownerName: string) {
  const response = await request('/wallets', {
    method: 'POST',
    body: JSON.stringify({ ownerName }),
  })
  return response.json() as Promise<WalletCreatedResponse>
}

export async function postMoneyMovement(
  walletId: string,
  movement: 'deposit' | 'withdraw',
  amount: number,
) {
  await request(`/wallets/${encodeURIComponent(walletId)}/${movement}`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  })
}

export function getWalletBalanceAt(walletId: string, date: Date) {
  const query = encodeURIComponent(date.toISOString())
  return readJson<HistoricalBalanceResponse>(
    `/wallets/${encodeURIComponent(walletId)}/balance-at?date=${query}`,
  )
}
