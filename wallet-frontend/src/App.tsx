import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createWallet,
  getEvents,
  getWallet,
  getWalletBalanceAt,
  postMoneyMovement,
  type WalletEvent,
  type WalletState,
} from './api'

const WALLET_STORAGE_KEY = 'event-wallet:last-wallet'

function localDateTimeValue(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 16)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(value: string | Date) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Data indisponível'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
}

async function loadWalletData(walletId: string) {
  const [nextWallet, nextEvents] = await Promise.all([
    getWallet(walletId),
    getEvents(walletId),
  ])

  if (!nextWallet.walletId) {
    throw new Error('Carteira não encontrada. Confira o ID informado.')
  }

  return { wallet: nextWallet, events: nextEvents }
}

function App() {
  const [selectedWalletId, setSelectedWalletId] = useState(
    () => window.localStorage.getItem(WALLET_STORAGE_KEY) ?? '',
  )
  const [walletIdInput, setWalletIdInput] = useState(selectedWalletId)
  const [ownerNameInput, setOwnerNameInput] = useState('')
  const [wallet, setWallet] = useState<WalletState | null>(null)
  const [events, setEvents] = useState<WalletEvent[]>([])
  const [isLoading, setIsLoading] = useState(
    () => Boolean(window.localStorage.getItem(WALLET_STORAGE_KEY)),
  )
  const [isCreating, setIsCreating] = useState(false)
  const [activeMovement, setActiveMovement] = useState<'deposit' | 'withdraw' | null>(null)
  const [isCheckingHistory, setIsCheckingHistory] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [historyDate, setHistoryDate] = useState(() => localDateTimeValue(new Date()))
  const [historicalBalance, setHistoricalBalance] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const orderedEvents = useMemo(() => [...events].reverse(), [events])
  const creationEvent = events.find((event) => event.eventType === 'WalletCreatedEvent')

  const refreshWallet = useCallback(async (walletId: string) => {
    if (!walletId) return

    try {
      const data = await loadWalletData(walletId)
      if (window.localStorage.getItem(WALLET_STORAGE_KEY) !== walletId) return
      setWallet(data.wallet)
      setEvents(data.events)
      setHistoricalBalance(null)
    } catch (loadError) {
      if (window.localStorage.getItem(WALLET_STORAGE_KEY) !== walletId) return
      setWallet(null)
      setEvents([])
      setError(errorMessage(loadError))
    } finally {
      if (window.localStorage.getItem(WALLET_STORAGE_KEY) === walletId) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!selectedWalletId) return

    let active = true

    async function loadSelectedWallet() {
      try {
        const data = await loadWalletData(selectedWalletId)
        if (!active) return
        setWallet(data.wallet)
        setEvents(data.events)
        setHistoricalBalance(null)
      } catch (loadError) {
        if (!active) return
        setWallet(null)
        setEvents([])
        setError(errorMessage(loadError))
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadSelectedWallet()

    return () => {
      active = false
    }
  }, [selectedWalletId])

  function selectWallet(walletId: string) {
    const normalizedId = walletId.trim()
    setWalletIdInput(normalizedId)
    setSelectedWalletId(normalizedId)
    setIsLoading(Boolean(normalizedId))
    setWallet(null)
    setEvents([])
    setNotice('')
    setError('')
    setHistoricalBalance(null)
    if (normalizedId) {
      window.localStorage.setItem(WALLET_STORAGE_KEY, normalizedId)
    } else {
      window.localStorage.removeItem(WALLET_STORAGE_KEY)
      setWallet(null)
      setEvents([])
    }
  }

  async function handleLoadWallet(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const id = walletIdInput.trim()
    if (!id) {
      setError('Informe o ID da carteira.')
      return
    }

    if (id === selectedWalletId) {
      setIsLoading(true)
      setError('')
      await refreshWallet(id)
      return
    }

    selectWallet(id)
  }

  async function handleCreateWallet(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const ownerName = ownerNameInput.trim()
    if (ownerName.length < 3) {
      setError('Informe um nome com pelo menos 3 caracteres.')
      return
    }

    setIsCreating(true)
    setError('')
    setNotice('')
    try {
      const result = await createWallet(ownerName)
      setOwnerNameInput('')
      selectWallet(result.walletId)
      setNotice('Carteira criada e carregada com sucesso.')
    } catch (createError) {
      setError(errorMessage(createError))
    } finally {
      setIsCreating(false)
    }
  }

  async function handleMovement(
    event: React.FormEvent<HTMLFormElement>,
    movement: 'deposit' | 'withdraw',
  ) {
    event.preventDefault()
    if (!selectedWalletId) return

    const input = movement === 'deposit' ? depositAmount : withdrawAmount
    const amount = Number(input)
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Informe um valor maior que zero.')
      return
    }

    setActiveMovement(movement)
    setError('')
    setNotice('')
    try {
      await postMoneyMovement(selectedWalletId, movement, amount)
      if (movement === 'deposit') setDepositAmount('')
      else setWithdrawAmount('')
      setNotice(movement === 'deposit' ? 'Depósito registrado.' : 'Saque registrado.')
      setIsLoading(true)
      await refreshWallet(selectedWalletId)
    } catch (movementError) {
      setError(errorMessage(movementError))
    } finally {
      setActiveMovement(null)
    }
  }

  async function handleHistoricalBalance(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedWalletId) return

    const date = new Date(historyDate)
    if (Number.isNaN(date.getTime())) {
      setError('Informe uma data e hora válidas.')
      return
    }

    setIsCheckingHistory(true)
    setError('')
    setNotice('')
    try {
      const result = await getWalletBalanceAt(selectedWalletId, date)
      setHistoricalBalance(result.balance)
      setNotice(`Saldo reconstruído para ${formatDate(result.date)}.`)
    } catch (historyError) {
      setError(errorMessage(historyError))
    } finally {
      setIsCheckingHistory(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080d16] text-slate-100">
      <header className="border-b border-slate-800/80 bg-[#0b111c]/90">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-lg text-cyan-300">
              ◈
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.18em] text-white">EVENT WALLET</p>
              <p className="mt-0.5 text-xs text-slate-500">Event sourcing · MongoDB · TypeScript</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-1.5 text-xs font-medium text-emerald-300 sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            PAINEL DE EVENTOS
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Visão geral</p>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Observabilidade financeira
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Acompanhe o estado da carteira e a sequência imutável de eventos.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="rounded-md border border-slate-800 bg-slate-900/70 px-2.5 py-1.5 font-mono">
              EVENT STORE
            </span>
            <span className="rounded-md border border-slate-800 bg-slate-900/70 px-2.5 py-1.5">
              {events.length} {events.length === 1 ? 'evento' : 'eventos'}
            </span>
          </div>
        </div>

        {(error || notice) && (
          <div
            role={error ? 'alert' : 'status'}
            className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
              error
                ? 'border-rose-400/20 bg-rose-400/5 text-rose-200'
                : 'border-emerald-400/20 bg-emerald-400/5 text-emerald-200'
            }`}
          >
            {error || notice}
          </div>
        )}

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(330px,2fr)_minmax(0,3fr)]">
          <section className="space-y-5">
            <article className="rounded-2xl border border-slate-800 bg-[#0d1522] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.18)] sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Carteira</p>
                  <h2 className="mt-1 text-base font-semibold text-slate-100">Selecionar ou criar</h2>
                </div>
                <span className="text-lg" aria-hidden="true">▣</span>
              </div>

              <form onSubmit={handleLoadWallet} className="space-y-2.5">
                <label htmlFor="wallet-id" className="text-xs font-medium text-slate-400">
                  Wallet ID
                </label>
                <div className="flex gap-2">
                  <input
                    id="wallet-id"
                    value={walletIdInput}
                    onChange={(event) => setWalletIdInput(event.target.value)}
                    placeholder="Cole o ID da carteira"
                    className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-[#080e18] px-3 py-2.5 font-mono text-xs text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !walletIdInput.trim()}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? '...' : 'Abrir'}
                  </button>
                </div>
              </form>

              {!wallet && !isLoading && (
                <div className="my-4 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.15em] text-slate-600">
                  <span className="h-px flex-1 bg-slate-800" />
                  ou crie uma nova
                  <span className="h-px flex-1 bg-slate-800" />
                </div>
              )}

              {!wallet && !isLoading && (
                <form onSubmit={handleCreateWallet} className="space-y-2.5">
                  <label htmlFor="owner-name" className="text-xs font-medium text-slate-400">
                    Nome do titular
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="owner-name"
                      value={ownerNameInput}
                      onChange={(event) => setOwnerNameInput(event.target.value)}
                      placeholder="Ex.: Paulo Silva"
                      minLength={3}
                      className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-[#080e18] px-3 py-2.5 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10"
                    />
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="rounded-lg bg-cyan-400 px-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-60"
                    >
                      {isCreating ? 'Criando...' : 'Criar'}
                    </button>
                  </div>
                </form>
              )}

              {wallet && (
                <div className="mt-5 border-t border-slate-800 pt-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-full bg-violet-400/10 text-sm font-semibold text-violet-200">
                      {(wallet.ownerName || 'W').slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-100">{wallet.ownerName || 'Titular'}</p>
                      <p className="text-xs text-slate-500">Carteira ativa</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectWallet('')}
                      className="ml-auto text-xs text-slate-500 transition hover:text-slate-200"
                    >
                      Trocar
                    </button>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-[#090f19] px-3.5 py-3">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                      Wallet ID
                    </p>
                    <p className="break-all font-mono text-xs text-slate-400">{wallet.walletId}</p>
                  </div>
                </div>
              )}
            </article>

            <article className="overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.09] via-[#0d1522] to-[#0d1522] p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/80">Saldo atual</p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-[2.75rem]">
                    {wallet ? formatCurrency(wallet.balance) : '—'}
                  </p>
                </div>
                <span className="grid size-10 place-items-center rounded-xl border border-cyan-300/15 bg-cyan-300/10 text-xl text-cyan-200" aria-hidden="true">
                  ◉
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-700/60 pt-3.5 text-xs">
                <span className="text-slate-500">Titular</span>
                <span className="font-medium text-slate-300">{wallet?.ownerName ?? '—'}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">Criada em</span>
                <span className="text-slate-400">
                  {creationEvent ? formatDate(creationEvent.occurredAt) : '—'}
                </span>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-[#0d1522] p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="text-lg" aria-hidden="true">💰</span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">Depósito</h2>
                  <p className="text-xs text-slate-500">Adicionar saldo à carteira</p>
                </div>
              </div>
              <form onSubmit={(event) => void handleMovement(event, 'deposit')} className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">R$</span>
                  <input
                    aria-label="Valor do depósito"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={depositAmount}
                    onChange={(event) => setDepositAmount(event.target.value)}
                    placeholder="0,00"
                    disabled={!wallet || isLoading || activeMovement !== null}
                    className="w-full rounded-lg border border-slate-700 bg-[#080e18] py-2.5 pl-9 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500/50 disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!wallet || isLoading || activeMovement !== null || !depositAmount}
                  className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {activeMovement === 'deposit' ? 'Enviando...' : 'Depositar'}
                </button>
              </form>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-[#0d1522] p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="text-lg" aria-hidden="true">💸</span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">Saque</h2>
                  <p className="text-xs text-slate-500">Retirar saldo da carteira</p>
                </div>
              </div>
              <form onSubmit={(event) => void handleMovement(event, 'withdraw')} className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">R$</span>
                  <input
                    aria-label="Valor do saque"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={withdrawAmount}
                    onChange={(event) => setWithdrawAmount(event.target.value)}
                    placeholder="0,00"
                    disabled={!wallet || isLoading || activeMovement !== null}
                    className="w-full rounded-lg border border-slate-700 bg-[#080e18] py-2.5 pl-9 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-rose-400/50 disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!wallet || isLoading || activeMovement !== null || !withdrawAmount}
                  className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-4 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {activeMovement === 'withdraw' ? 'Enviando...' : 'Sacar'}
                </button>
              </form>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-[#0d1522] p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="text-lg" aria-hidden="true">📅</span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">Saldo histórico</h2>
                  <p className="text-xs text-slate-500">Reconstruir o estado até uma data</p>
                </div>
              </div>
              <form onSubmit={(event) => void handleHistoricalBalance(event)} className="space-y-3">
                <label htmlFor="history-date" className="sr-only">Data e hora da consulta</label>
                <input
                  id="history-date"
                  type="datetime-local"
                  value={historyDate}
                  onChange={(event) => setHistoryDate(event.target.value)}
                  disabled={!wallet || isCheckingHistory}
                  className="w-full rounded-lg border border-slate-700 bg-[#080e18] px-3 py-2.5 text-sm text-slate-300 outline-none transition focus:border-violet-400/50 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!wallet || isCheckingHistory}
                  className="w-full rounded-lg border border-violet-400/20 bg-violet-400/10 px-4 py-2.5 text-sm font-semibold text-violet-200 transition hover:bg-violet-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isCheckingHistory ? 'Consultando...' : 'Consultar saldo'}
                </button>
              </form>
              {historicalBalance !== null && (
                <div className="mt-4 flex items-center justify-between rounded-lg border border-violet-400/15 bg-violet-400/[0.06] px-3.5 py-3">
                  <span className="text-xs text-slate-400">Saldo no período</span>
                  <span className="font-semibold tabular-nums text-violet-200">{formatCurrency(historicalBalance)}</span>
                </div>
              )}
            </article>
          </section>

          <section className="min-h-[520px] rounded-2xl border border-slate-800 bg-[#0d1522] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.18)] sm:p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-slate-100">Timeline de eventos</h2>
                  <span className="rounded-md border border-cyan-400/15 bg-cyan-400/5 px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.12em] text-cyan-300">
                    EVENT LOG
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  Histórico imutável ordenado por ocorrência
                </p>
              </div>
              {wallet && (
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true)
                    setError('')
                    void refreshWallet(selectedWalletId)
                  }}
                  disabled={isLoading}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
                >
                  {isLoading ? 'Atualizando...' : 'Atualizar'}
                </button>
              )}
            </div>

            {!selectedWalletId && (
              <div className="grid min-h-[390px] place-items-center rounded-xl border border-dashed border-slate-800 bg-[#090f19]/50 px-6 text-center">
                <div>
                  <span className="text-3xl" aria-hidden="true">◷</span>
                  <p className="mt-3 text-sm font-medium text-slate-300">Nenhuma carteira selecionada</p>
                  <p className="mt-1 text-xs text-slate-500">Crie uma carteira ou informe um ID para ver os eventos.</p>
                </div>
              </div>
            )}

            {selectedWalletId && isLoading && events.length === 0 && (
              <div className="grid min-h-[390px] place-items-center text-sm text-slate-500">
                Carregando eventos...
              </div>
            )}

            {selectedWalletId && !isLoading && events.length === 0 && wallet && (
              <div className="grid min-h-[390px] place-items-center rounded-xl border border-dashed border-slate-800 bg-[#090f19]/50 px-6 text-center">
                <div>
                  <span className="text-3xl" aria-hidden="true">◷</span>
                  <p className="mt-3 text-sm font-medium text-slate-300">Ainda não há eventos</p>
                  <p className="mt-1 text-xs text-slate-500">As operações desta carteira aparecerão aqui.</p>
                </div>
              </div>
            )}

            {orderedEvents.length > 0 && (
              <ol className="relative ml-3 space-y-0 border-l border-slate-800 pl-7">
                {orderedEvents.map((event, index) => {
                  const isCreated = event.eventType === 'WalletCreatedEvent'
                  const isDeposit = event.eventType === 'MoneyDepositedEvent'
                  const isWithdraw = event.eventType === 'MoneyWithdrawnEvent'
                  const amount = (event.payload as { amount?: number } | null)?.amount
                  const ownerName = (event.payload as { ownerName?: string } | null)?.ownerName
                  const icon = isCreated ? '✅' : isDeposit ? '💰' : isWithdraw ? '💸' : '◇'
                  const title = isCreated
                    ? 'Carteira criada'
                    : isDeposit
                      ? 'Depósito'
                      : isWithdraw
                        ? 'Saque'
                        : event.eventType

                  return (
                    <li key={`${event.eventType}-${event.version}-${event.occurredAt}-${index}`} className="relative pb-7 last:pb-0">
                      <span className="absolute -left-[2.15rem] top-0.5 grid size-8 place-items-center rounded-full border border-slate-700 bg-[#111c2a] text-sm shadow-[0_0_0_5px_#0d1522]">
                        {icon}
                      </span>
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                        <div>
                          <p className="text-sm font-medium text-slate-100">{title}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {isCreated && ownerName ? `Titular: ${ownerName}` : `Versão do evento ${event.version}`}
                          </p>
                        </div>
                        <div className="sm:text-right">
                          {typeof amount === 'number' && (
                            <p className={`text-sm font-semibold tabular-nums ${isDeposit ? 'text-emerald-300' : 'text-rose-300'}`}>
                              {isDeposit ? '+' : '−'} {formatCurrency(amount)}
                            </p>
                          )}
                          <p className="mt-1 text-[11px] text-slate-500">{formatDate(event.occurredAt)}</p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>
        </div>
      </main>
      <footer className="mx-auto flex max-w-[1440px] items-center justify-between border-t border-slate-800/70 px-5 py-5 text-[11px] text-slate-600 sm:px-8">
        <span>EVENT WALLET · FINANCIAL EVENT STREAM</span>
        <span>Event Sourcing Dashboard</span>
      </footer>
    </div>
  )
}

export default App
