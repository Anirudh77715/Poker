import { useState } from 'react';

export default function GameHistory({ history, stats, onClearHistory }) {
    const [expandedGame, setExpandedGame] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold dark:text-white text-felt-900 mb-1">📊 Game History</h2>
                    <p className="text-sm dark:text-felt-400 text-felt-500">
                        {history.length} game{history.length !== 1 ? 's' : ''} recorded
                    </p>
                </div>
                {history.length > 0 && (
                    !showClearConfirm ? (
                        <button
                            onClick={() => setShowClearConfirm(true)}
                            className="text-xs dark:text-felt-500 text-felt-400 hover:text-chip-red transition-colors"
                        >
                            Clear all
                        </button>
                    ) : (
                        <div className="flex gap-2 animate-scale-in">
                            <button
                                onClick={() => { onClearHistory(); setShowClearConfirm(false); }}
                                className="px-3 py-1 rounded-lg text-xs font-semibold bg-chip-red text-white"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="px-3 py-1 rounded-lg text-xs font-semibold
                  dark:bg-felt-700 dark:text-felt-200 bg-gray-200 text-felt-700"
                            >
                                Cancel
                            </button>
                        </div>
                    )
                )}
            </div>

            {history.length === 0 ? (
                <div className="text-center py-12 dark:text-felt-500 text-felt-400">
                    <p className="text-4xl mb-3">📊</p>
                    <p className="font-medium">No games recorded yet</p>
                    <p className="text-sm mt-1">Complete a game and click "Save & End Game" to record it</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {history.map((game) => {
                        const isExpanded = expandedGame === game.id;
                        const totalPot = game.players.reduce((s, p) => s + p.totalInvested, 0);
                        const winner = [...game.players].sort((a, b) => b.net - a.net)[0];
                        const dateStr = new Date(game.date).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                        });
                        const timeStr = new Date(game.date).toLocaleTimeString('en-IN', {
                            hour: '2-digit', minute: '2-digit',
                        });

                        return (
                            <div key={game.id} className="rounded-2xl overflow-hidden
                dark:bg-surface-card dark:border dark:border-felt-800
                bg-white border border-felt-100 shadow-sm">
                                {/* Summary row */}
                                <button
                                    onClick={() => setExpandedGame(isExpanded ? null : game.id)}
                                    className="w-full p-4 flex items-center gap-4 text-left
                    dark:hover:bg-surface-card-hover hover:bg-felt-50/50
                    transition-colors duration-150"
                                >
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    dark:bg-felt-700 bg-felt-100 dark:text-gold-400 text-felt-600 flex-shrink-0">
                                        #{game.id}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold dark:text-white text-felt-900">{dateStr}</div>
                                        <div className="text-xs dark:text-felt-400 text-felt-500">
                                            {timeStr} · {game.players.length} players · ₹{totalPot} pot
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-sm font-semibold text-chip-green">
                                            🏆 {winner.name}
                                        </div>
                                        <div className="text-xs dark:text-felt-400 text-felt-500">
                                            +₹{winner.net}
                                        </div>
                                    </div>
                                    <span className={`text-xs transition-transform duration-200 dark:text-felt-500 text-felt-400
                    ${isExpanded ? 'rotate-90' : ''}`}>
                                        ▸
                                    </span>
                                </button>

                                {/* Expanded details */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 border-t dark:border-felt-800 border-felt-100 animate-fade-in">
                                        <div className="mt-3 space-y-2">
                                            {[...game.players].sort((a, b) => b.net - a.net).map((p, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl
                          dark:bg-felt-800 bg-felt-50">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                              ${p.net > 0 ? 'bg-green-100 dark:bg-green-900/30 text-chip-green'
                                                                : p.net < 0 ? 'bg-red-100 dark:bg-red-900/30 text-chip-red'
                                                                    : 'dark:bg-felt-700 bg-felt-200 dark:text-felt-400 text-felt-500'}`}>
                                                            {i + 1}
                                                        </span>
                                                        <span className="font-semibold dark:text-white text-felt-900">{p.name}</span>
                                                    </div>
                                                    <div className="text-right text-sm">
                                                        <span className="dark:text-felt-400 text-felt-500 mr-3">
                                                            Buy: ₹{p.buyIn}{p.totalRebuy > 0 ? ` + ₹${p.totalRebuy} rebuy` : ''}
                                                        </span>
                                                        <span className={`font-bold ${p.net > 0 ? 'text-chip-green' : p.net < 0 ? 'text-chip-red' : 'dark:text-felt-400 text-felt-500'}`}>
                                                            {p.net >= 0 ? '+' : ''}₹{p.net}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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
