import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import AddPlayerForm from './components/AddPlayerForm';
import PlayerTable from './components/PlayerTable';
import RebuyModal from './components/RebuyModal';
import SettlementPanel from './components/SettlementPanel';
import PlayerRoster from './components/PlayerRoster';
import GameHistory from './components/GameHistory';
import DarkModeToggle from './components/DarkModeToggle';

const DEFAULT_GAME = {
  players: [],
  buyIn: 150,
  gameStarted: false,
  showSettlement: false,
};

let nextId = 1;
let nextGameId = 1;

export default function App() {
  const [darkMode, setDarkMode] = useLocalStorage('poker-dark-mode', true);
  const [roster, setRoster] = useLocalStorage('poker-roster', []);
  const [history, setHistory] = useLocalStorage('poker-history', []);
  const [gameState, setGameState] = useLocalStorage('poker-game-state', DEFAULT_GAME);
  const [activeTab, setActiveTab] = useLocalStorage('poker-tab', 'game');
  const [rebuyPlayer, setRebuyPlayer] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { players, buyIn, gameStarted, showSettlement } = gameState;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (players.length > 0) nextId = Math.max(...players.map((p) => p.id)) + 1;
    if (history.length > 0) nextGameId = Math.max(...history.map((g) => g.id)) + 1;
  }, []);

  const updateGame = (updates) => setGameState((prev) => ({ ...prev, ...updates }));

  const addToRoster = (name) => {
    const trimmed = name.trim();
    if (!trimmed || roster.some((r) => r.name.toLowerCase() === trimmed.toLowerCase())) return false;
    setRoster((prev) => [...prev, { id: Date.now(), name: trimmed, createdAt: new Date().toISOString() }]);
    return true;
  };

  const removeFromRoster = (id) => setRoster((prev) => prev.filter((r) => r.id !== id));

  const addPlayerToGame = (name, removeId) => {
    if (removeId) { updateGame({ players: players.filter((p) => p.id !== removeId) }); return; }
    if (!name || players.length >= 20) return;
    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) return;
    if (!roster.some((r) => r.name.toLowerCase() === name.toLowerCase())) addToRoster(name);
    updateGame({ players: [...players, { id: nextId++, name, buyIn, totalRebuy: 0, totalInvested: buyIn, currentChips: 0, rebuys: [] }] });
  };

  const addRosterPlayerToGame = (rosterPlayer) => addPlayerToGame(rosterPlayer.name);
  const removePlayer = (id) => updateGame({ players: players.filter((p) => p.id !== id) });
  const startGame = () => updateGame({ gameStarted: true });
  const updateChips = (id, chips) => updateGame({ players: players.map((p) => (p.id === id ? { ...p, currentChips: chips } : p)) });

  const handleRebuy = (id, amount) => {
    updateGame({
      players: players.map((p) => p.id === id
        ? { ...p, totalRebuy: p.totalRebuy + amount, totalInvested: p.totalInvested + amount, rebuys: [...p.rebuys, { amount, time: new Date().toISOString() }] }
        : p),
    });
  };

  const calculateResults = () => updateGame({ showSettlement: true });
  const backToGame = () => updateGame({ showSettlement: false });

  const endGameAndSave = () => {
    setHistory((prev) => [{
      id: nextGameId++, date: new Date().toISOString(), buyInAmount: buyIn,
      players: players.map((p) => ({ name: p.name, buyIn: p.buyIn, totalRebuy: p.totalRebuy, totalInvested: p.totalInvested, finalChips: p.currentChips || 0, net: (p.currentChips || 0) - p.totalInvested })),
    }, ...prev]);
    nextId = 1;
    setGameState(DEFAULT_GAME);
    setActiveTab('roster');
  };

  const resetGame = () => { nextId = 1; setGameState(DEFAULT_GAME); setShowResetConfirm(false); };

  const playerStats = useMemo(() => {
    const stats = {};
    roster.forEach((r) => { stats[r.name] = { games: 0, wins: 0, totalBuyIn: 0, totalNet: 0, history: [] }; });
    history.forEach((game) => {
      game.players.forEach((p) => {
        if (!stats[p.name]) stats[p.name] = { games: 0, wins: 0, totalBuyIn: 0, totalNet: 0, history: [] };
        stats[p.name].games += 1;
        stats[p.name].totalBuyIn += p.totalInvested;
        stats[p.name].totalNet += p.net;
        if (p.net > 0) stats[p.name].wins += 1;
        stats[p.name].history.push({ date: game.date, gameId: game.id, invested: p.totalInvested, chips: p.finalChips, net: p.net, cumulative: 0 });
      });
    });
    Object.values(stats).forEach((s) => {
      s.history.sort((a, b) => new Date(a.date) - new Date(b.date));
      let cum = 0;
      s.history.forEach((h) => { cum += h.net; h.cumulative = cum; });
      s.winRate = s.games > 0 ? Math.round((s.wins / s.games) * 100) : 0;
    });
    return stats;
  }, [roster, history]);

  const totalInPot = players.reduce((s, p) => s + p.totalInvested, 0);
  const allChipsEntered = players.length > 0 && players.every((p) => p.currentChips > 0);
  const rosterNotInGame = roster.filter((r) => !players.some((p) => p.name.toLowerCase() === r.name.toLowerCase()));

  const tabs = [
    { id: 'game', label: '🃏 Game', badge: gameStarted ? 'LIVE' : null },
    { id: 'roster', label: '👥 Players', badge: roster.length > 0 ? roster.length : null },
    { id: 'history', label: '📊 History', badge: history.length > 0 ? history.length : null },
  ];

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card
        dark:bg-primary-900/70 bg-white/70
        border-b dark:border-primary-800/50 border-primary-100">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-extrabold gradient-text leading-tight">
            ♠ Poker Manager
          </h1>
          <DarkModeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-3 sm:px-4">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-all duration-200 flex items-center justify-center gap-1.5
                  ${activeTab === tab.id
                    ? 'dark:bg-surface-card bg-white dark:text-primary-300 text-primary-600 border-b-2 dark:border-primary-400 border-primary-500'
                    : 'dark:text-primary-500 text-primary-400 hover:dark:text-primary-300 hover:text-primary-600'
                  }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold
                    ${tab.badge === 'LIVE'
                      ? 'bg-pink-500 text-white animate-pulse'
                      : 'dark:bg-primary-800 bg-primary-100 dark:text-primary-300 text-primary-600'
                    }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {activeTab === 'game' && (
          <>
            {showSettlement ? (
              <SettlementPanel players={players} onBack={backToGame} onEndGame={endGameAndSave} />
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <AddPlayerForm
                  players={players} onAddPlayer={addPlayerToGame} buyIn={buyIn}
                  onBuyInChange={(val) => updateGame({ buyIn: val })} onStartGame={startGame}
                  gameStarted={gameStarted} rosterPlayers={rosterNotInGame} onAddRosterPlayer={addRosterPlayerToGame}
                />
                <PlayerTable
                  players={players} onUpdateChips={updateChips} onOpenRebuy={setRebuyPlayer}
                  onRemovePlayer={removePlayer} gameStarted={gameStarted}
                />
                {gameStarted && players.length > 0 && (
                  <div className="space-y-3 animate-fade-in">
                    <button
                      onClick={calculateResults} disabled={!allChipsEntered}
                      className="w-full py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300
                        bg-gradient-to-r from-primary-500 via-pink-500 to-primary-500 text-white
                        hover:shadow-lg hover:shadow-pink-500/25
                        disabled:opacity-30 disabled:cursor-not-allowed
                        active:scale-[0.98]"
                    >
                      🏆 Calculate Results
                    </button>
                    {!allChipsEntered && (
                      <p className="text-center text-xs dark:text-primary-500 text-primary-400">
                        Enter final chips for all players to calculate
                      </p>
                    )}
                    {!showResetConfirm ? (
                      <button onClick={() => setShowResetConfirm(true)}
                        className="w-full py-2 text-xs font-medium dark:text-primary-600 text-primary-400 hover:text-danger transition-colors">
                        Reset Game
                      </button>
                    ) : (
                      <div className="flex gap-2 p-3 rounded-xl bg-danger/10 border border-danger/20 animate-scale-in">
                        <span className="text-sm text-danger flex-1 flex items-center">⚠️ Discard?</span>
                        <button onClick={resetGame} className="px-4 py-1.5 rounded-lg text-xs font-bold bg-danger text-white">Yes</button>
                        <button onClick={() => setShowResetConfirm(false)} className="px-4 py-1.5 rounded-lg text-xs font-bold dark:bg-primary-700 bg-primary-100 dark:text-primary-200 text-primary-700">No</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {activeTab === 'roster' && <PlayerRoster roster={roster} stats={playerStats} onAddToRoster={addToRoster} onRemoveFromRoster={removeFromRoster} />}
        {activeTab === 'history' && <GameHistory history={history} stats={playerStats} onClearHistory={() => setHistory([])} />}
      </main>

      <RebuyModal player={rebuyPlayer} buyIn={buyIn} onConfirm={handleRebuy} onClose={() => setRebuyPlayer(null)} />
      <footer className="text-center py-4 text-[10px] dark:text-primary-700 text-primary-300">♠ ♥ ♦ ♣</footer>
    </div>
  );
}
