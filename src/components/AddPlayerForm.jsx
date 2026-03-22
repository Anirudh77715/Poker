import { useState } from 'react';

const MAX_PLAYERS = 20;

export default function AddPlayerForm({
    players, onAddPlayer, buyIn, onBuyInChange, onStartGame,
    gameStarted, rosterPlayers = [], onAddRosterPlayer
}) {
    const [name, setName] = useState('');
    const [showRosterPicker, setShowRosterPicker] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
        if (players.length >= MAX_PLAYERS) return;
        if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) return;
        onAddPlayer(trimmed);
        setName('');
    };

    const canStart = players.length >= 2 && buyIn > 0;

    return (
        <div className="animate-fade-in">
            {/* Buy-in Setting (only during setup) */}
            {!gameStarted && (
                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2 dark:text-felt-200 text-felt-700">
                        Buy-in Amount (₹)
                    </label>
                    <input
                        id="buyin-input"
                        type="number"
                        min="1"
                        value={buyIn}
                        onChange={(e) => onBuyInChange(Math.max(0, Number(e.target.value)))}
                        className="w-full max-w-xs px-4 py-3 rounded-xl border-2
              dark:bg-felt-800 dark:border-felt-600 dark:text-white dark:focus:border-gold-400
              bg-white border-felt-200 text-felt-900 focus:border-felt-500
              outline-none transition-all duration-200 text-lg font-semibold"
                        placeholder="e.g. 150"
                    />
                </div>
            )}

            {/* Add Player */}
            {players.length < MAX_PLAYERS && (
                <div className="mb-4">
                    <form onSubmit={handleAdd} className="flex gap-3 flex-wrap">
                        <input
                            id="player-name-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex-1 min-w-[180px] px-4 py-3 rounded-xl border-2
                dark:bg-felt-800 dark:border-felt-600 dark:text-white dark:placeholder-felt-400 dark:focus:border-gold-400
                bg-white border-felt-200 text-felt-900 placeholder-felt-400 focus:border-felt-500
                outline-none transition-all duration-200"
                            placeholder="Enter player name"
                            maxLength={20}
                        />
                        <button
                            id="add-player-btn"
                            type="submit"
                            disabled={!name.trim() || players.length >= MAX_PLAYERS}
                            className="px-6 py-3 rounded-xl font-semibold transition-all duration-200
                bg-felt-600 hover:bg-felt-500 text-white
                disabled:opacity-40 disabled:cursor-not-allowed
                active:scale-95 shadow-lg shadow-felt-600/20"
                        >
                            + Add Player
                        </button>
                    </form>

                    {/* Roster quick-pick */}
                    {rosterPlayers.length > 0 && (
                        <div className="mt-3">
                            <button
                                onClick={() => setShowRosterPicker(!showRosterPicker)}
                                className="text-xs font-medium dark:text-felt-400 text-felt-500 hover:dark:text-gold-400 hover:text-felt-700 transition-colors"
                            >
                                {showRosterPicker ? '▾ Hide roster' : '▸ Pick from roster'} ({rosterPlayers.length} available)
                            </button>
                            {showRosterPicker && (
                                <div className="flex flex-wrap gap-2 mt-2 animate-fade-in">
                                    {rosterPlayers.map((r) => (
                                        <button
                                            key={r.id}
                                            onClick={() => { onAddRosterPlayer(r); }}
                                            className="px-3 py-1.5 rounded-full text-sm font-medium
                        dark:bg-felt-700 dark:hover:bg-felt-600 dark:text-felt-100
                        bg-felt-100 hover:bg-felt-200 text-felt-700
                        transition-colors duration-150 animate-scale-in"
                                        >
                                            + {r.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Info bar */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm dark:text-felt-300 text-felt-600">
                    {players.length} / {MAX_PLAYERS} players
                </span>
                {players.length >= MAX_PLAYERS && (
                    <span className="text-xs text-chip-red font-medium">Maximum reached</span>
                )}
            </div>

            {/* Player chips (preview, only during setup) */}
            {!gameStarted && players.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {players.map((p) => (
                        <span
                            key={p.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                dark:bg-felt-700 dark:text-felt-100
                bg-felt-100 text-felt-800
                animate-scale-in"
                        >
                            {p.name}
                            <button
                                onClick={() => onAddPlayer(null, p.id)}
                                className="w-5 h-5 rounded-full flex items-center justify-center text-xs
                  dark:bg-felt-600 dark:hover:bg-chip-red
                  bg-felt-200 hover:bg-chip-red hover:text-white
                  transition-colors duration-150"
                                aria-label={`Remove ${p.name}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Start Game (only during setup) */}
            {!gameStarted && (
                <button
                    id="start-game-btn"
                    onClick={onStartGame}
                    disabled={!canStart}
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300
            bg-gradient-to-r from-gold-500 to-gold-400 text-felt-900
            hover:from-gold-400 hover:to-gold-300
            disabled:opacity-30 disabled:cursor-not-allowed
            active:scale-[0.98] shadow-xl shadow-gold-500/20"
                >
                    🃏 Start Game
                </button>
            )}
        </div>
    );
}
