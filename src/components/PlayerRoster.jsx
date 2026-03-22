import { useState } from 'react';
import PlayerChart from './PlayerChart';

export default function PlayerRoster({ roster, stats, onAddToRoster, onRemoveFromRoster }) {
    const [name, setName] = useState('');
    const [expandedPlayer, setExpandedPlayer] = useState(null);
    const [duplicateError, setDuplicateError] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        setDuplicateError(false);
        const success = onAddToRoster(name.trim());
        if (success) {
            setName('');
        } else if (name.trim()) {
            setDuplicateError(true);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-xl font-bold dark:text-white text-felt-900 mb-1">👥 Player Roster</h2>
                <p className="text-sm dark:text-felt-400 text-felt-500">
                    Manage your player roster. Stats update automatically after each game.
                </p>
            </div>

            {/* Add Player to Roster */}
            <form onSubmit={handleAdd} className="flex gap-3 flex-wrap">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setDuplicateError(false); }}
                    className="flex-1 min-w-[180px] px-4 py-3 rounded-xl border-2
            dark:bg-felt-800 dark:border-felt-600 dark:text-white dark:placeholder-felt-400 dark:focus:border-gold-400
            bg-white border-felt-200 text-felt-900 placeholder-felt-400 focus:border-felt-500
            outline-none transition-all duration-200"
                    placeholder="New player name"
                    maxLength={20}
                />
                <button
                    type="submit"
                    disabled={!name.trim()}
                    className="px-6 py-3 rounded-xl font-bold transition-all duration-300
            bg-primary-600 hover:bg-primary-500 text-white
            disabled:opacity-40 disabled:cursor-not-allowed
            active:scale-95 hover:scale-[1.02] shadow-lg shadow-primary-500/30 hover:shadow-xl"
                >
                    + Add to Roster
                </button>
            </form>
            {duplicateError && (
                <p className="text-sm text-chip-red -mt-3">Player already exists in roster</p>
            )}

            {/* Player List */}
            {roster.length === 0 ? (
                <div className="text-center py-12 dark:text-felt-500 text-felt-400">
                    <p className="text-4xl mb-3">🃏</p>
                    <p className="font-medium">No players yet</p>
                    <p className="text-sm mt-1">Add players above to start tracking stats</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {roster.map((player) => {
                        const s = stats[player.name] || { games: 0, wins: 0, totalBuyIn: 0, totalNet: 0, winRate: 0, history: [] };
                        const isExpanded = expandedPlayer === player.id;

                        return (
                            <div key={player.id} className="rounded-2xl overflow-hidden
                dark:bg-surface-card dark:border dark:border-felt-800
                bg-white border border-felt-100 shadow-sm
                transition-all duration-200">
                                {/* Player row */}
                                <button
                                    onClick={() => setExpandedPlayer(isExpanded ? null : player.id)}
                                    className="w-full p-4 flex items-center gap-4 text-left
                    dark:hover:bg-surface-card-hover hover:bg-felt-50/50
                    transition-colors duration-150"
                                >
                                    {/* Avatar */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0
                    ${s.totalNet > 0
                                            ? 'bg-green-100 dark:bg-green-900/30 text-chip-green'
                                            : s.totalNet < 0
                                                ? 'bg-red-100 dark:bg-red-900/30 text-chip-red'
                                                : 'dark:bg-felt-700 bg-felt-100 dark:text-felt-300 text-felt-600'
                                        }`}>
                                        {player.name[0].toUpperCase()}
                                    </div>

                                    {/* Name & stats preview */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold dark:text-white text-felt-900 truncate">{player.name}</div>
                                        <div className="text-xs dark:text-felt-400 text-felt-500">
                                            {s.games > 0 ? `${s.games} games · ${s.winRate}% win rate` : 'No games yet'}
                                        </div>
                                    </div>

                                    {/* Net P/L */}
                                    {s.games > 0 && (
                                        <div className={`text-right flex-shrink-0 ${s.totalNet > 0 ? 'text-chip-green' : s.totalNet < 0 ? 'text-chip-red' : 'dark:text-felt-400 text-felt-500'}`}>
                                            <div className="text-lg font-extrabold">
                                                {s.totalNet >= 0 ? '+' : ''}₹{s.totalNet}
                                            </div>
                                            <div className="text-xs dark:text-felt-400 text-felt-500">
                                                Invested: ₹{s.totalBuyIn}
                                            </div>
                                        </div>
                                    )}

                                    {/* Expand icon */}
                                    <span className={`text-xs transition-transform duration-200 dark:text-felt-500 text-felt-400
                    ${isExpanded ? 'rotate-90' : ''}`}>
                                        ▸
                                    </span>
                                </button>

                                {/* Expanded: detailed stats + chart */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 border-t dark:border-felt-800 border-felt-100 animate-fade-in">
                                        {s.games > 0 ? (
                                            <>
                                                {/* Stats grid */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 mb-4">
                                                    <StatBox label="Games" value={s.games} />
                                                    <StatBox label="Wins" value={s.wins} color="green" />
                                                    <StatBox label="Win Rate" value={`${s.winRate}%`} />
                                                    <StatBox
                                                        label="Net P/L"
                                                        value={`${s.totalNet >= 0 ? '+' : ''}₹${s.totalNet}`}
                                                        color={s.totalNet > 0 ? 'green' : s.totalNet < 0 ? 'red' : 'gray'}
                                                    />
                                                    <StatBox label="Total Buy-in" value={`₹${s.totalBuyIn}`} />
                                                    <StatBox
                                                        label="Avg P/L per Game"
                                                        value={`${Math.round(s.totalNet / s.games) >= 0 ? '+' : ''}₹${Math.round(s.totalNet / s.games)}`}
                                                        color={s.totalNet > 0 ? 'green' : s.totalNet < 0 ? 'red' : 'gray'}
                                                    />
                                                    <StatBox label="Best Game" value={`+₹${Math.max(...s.history.map(h => h.net), 0)}`} color="green" />
                                                    <StatBox label="Worst Game" value={`₹${Math.min(...s.history.map(h => h.net), 0)}`} color="red" />
                                                </div>

                                                {/* Chart */}
                                                {s.history.length >= 1 && (
                                                    <PlayerChart history={s.history} playerName={player.name} />
                                                )}

                                                {/* Game-by-game table */}
                                                <h4 className="text-sm font-semibold dark:text-felt-200 text-felt-700 mt-4 mb-2">Game History</h4>
                                                <div className="space-y-1.5">
                                                    {[...s.history].reverse().map((h, i) => (
                                                        <div key={i} className="flex items-center justify-between p-2 rounded-lg text-sm
                              dark:bg-felt-800 bg-felt-50">
                                                            <span className="dark:text-felt-400 text-felt-500">
                                                                {new Date(h.date).toLocaleDateString()}
                                                            </span>
                                                            <span className="dark:text-felt-300 text-felt-600">
                                                                Invested ₹{h.invested} → ₹{h.chips}
                                                            </span>
                                                            <span className={`font-bold ${h.net > 0 ? 'text-chip-green' : h.net < 0 ? 'text-chip-red' : 'dark:text-felt-400 text-felt-500'}`}>
                                                                {h.net >= 0 ? '+' : ''}₹{h.net}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-sm dark:text-felt-400 text-felt-500 py-4">
                                                No game history yet. Stats will appear after this player completes a game.
                                            </p>
                                        )}

                                        {/* Remove from roster */}
                                        <button
                                            onClick={() => onRemoveFromRoster(player.id)}
                                            className="mt-4 px-3 py-1.5 rounded-lg text-xs font-semibold text-danger bg-danger/10 hover:bg-danger hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
                                        >
                                            Remove from roster
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function StatBox({ label, value, color }) {
    const textColor = {
        green: 'text-chip-green',
        red: 'text-chip-red',
        gray: 'dark:text-felt-400 text-felt-500',
    };

    return (
        <div className="p-3 rounded-xl dark:bg-felt-800 bg-felt-50">
            <div className="text-xs dark:text-felt-400 text-felt-500 mb-1">{label}</div>
            <div className={`text-lg font-extrabold ${color ? textColor[color] : 'dark:text-white text-felt-900'}`}>
                {value}
            </div>
        </div>
    );
}
