import { useState } from 'react';

export default function PlayerTable({ players, onUpdateChips, onOpenRebuy, onRemovePlayer, gameStarted }) {
    const [editingId, setEditingId] = useState(null);

    if (players.length === 0) return null;

    const totalInSystem = players.reduce((s, p) => s + p.totalInvested, 0);
    const totalChips = players.reduce((s, p) => s + (p.currentChips || 0), 0);
    const isBalanced = totalChips === totalInSystem;

    return (
        <div className="animate-fade-in">
            {/* Summary bar */}
            {gameStarted && (
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg
            dark:bg-felt-800 bg-felt-50">
                        <span className="dark:text-felt-400 text-felt-600">Total in pot:</span>
                        <span className="font-bold dark:text-gold-400 text-felt-700">₹{totalInSystem}</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg
            ${isBalanced
                            ? 'dark:bg-felt-800 bg-felt-50'
                            : 'dark:bg-red-900/30 bg-red-50 border dark:border-red-800 border-red-200'}`}>
                        <span className="dark:text-felt-400 text-felt-600">Chips entered:</span>
                        <span className={`font-bold ${isBalanced ? 'dark:text-chip-green text-chip-green' : 'text-chip-red'}`}>
                            ₹{totalChips}
                        </span>
                        {!isBalanced && totalChips > 0 && (
                            <span className="text-xs text-chip-red ml-1">
                                ({totalChips > totalInSystem ? '+' : ''}{totalChips - totalInSystem})
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-2xl
        dark:bg-surface-card bg-white shadow-lg
        dark:border dark:border-felt-800 border border-felt-100">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="dark:bg-felt-800 bg-felt-50">
                            <th className="text-left py-3.5 px-4 font-semibold dark:text-felt-300 text-felt-600">#</th>
                            <th className="text-left py-3.5 px-4 font-semibold dark:text-felt-300 text-felt-600">Player</th>
                            <th className="text-right py-3.5 px-4 font-semibold dark:text-felt-300 text-felt-600">Buy-in</th>
                            <th className="text-right py-3.5 px-4 font-semibold dark:text-felt-300 text-felt-600">Rebuy</th>
                            <th className="text-right py-3.5 px-4 font-semibold dark:text-felt-300 text-felt-600">Total Invested</th>
                            {gameStarted && (
                                <>
                                    <th className="text-right py-3.5 px-4 font-semibold dark:text-felt-300 text-felt-600">Current Chips</th>
                                    <th className="text-right py-3.5 px-4 font-semibold dark:text-felt-300 text-felt-600">Profit / Loss</th>
                                    <th className="text-center py-3.5 px-4 font-semibold dark:text-felt-300 text-felt-600">Actions</th>
                                </>
                            )}
                            {!gameStarted && (
                                <th className="text-center py-3.5 px-4 font-semibold dark:text-felt-300 text-felt-600">Remove</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player, idx) => {
                            const profitLoss = (player.currentChips || 0) - player.totalInvested;
                            return (
                                <tr
                                    key={player.id}
                                    className="dark:border-felt-800 border-felt-100 border-t
                    dark:hover:bg-surface-card-hover hover:bg-felt-50/50 transition-colors duration-150"
                                >
                                    <td className="py-3 px-4 dark:text-felt-400 text-felt-500">{idx + 1}</td>
                                    <td className="py-3 px-4 font-semibold dark:text-white text-felt-900">{player.name}</td>
                                    <td className="py-3 px-4 text-right dark:text-felt-200 text-felt-700">₹{player.buyIn}</td>
                                    <td className="py-3 px-4 text-right dark:text-felt-200 text-felt-700">₹{player.totalRebuy}</td>
                                    <td className="py-3 px-4 text-right font-semibold dark:text-gold-400 text-felt-700">₹{player.totalInvested}</td>
                                    {gameStarted && (
                                        <>
                                            <td className="py-3 px-4 text-right">
                                                {editingId === player.id ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={player.currentChips || ''}
                                                        onChange={(e) => onUpdateChips(player.id, Math.max(0, Number(e.target.value)))}
                                                        onBlur={() => setEditingId(null)}
                                                        onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                                                        className="w-24 px-2 py-1 rounded-lg text-right
                              dark:bg-felt-800 dark:border-felt-600 dark:text-white
                              bg-white border-felt-300 text-felt-900
                              border outline-none focus:ring-2 dark:focus:ring-gold-500 focus:ring-felt-500"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <button
                                                        onClick={() => setEditingId(player.id)}
                                                        className="px-3 py-1 rounded-lg text-right font-mono
                              dark:hover:bg-felt-700 hover:bg-felt-100
                              transition-colors duration-150 cursor-text
                              dark:text-white text-felt-900"
                                                    >
                                                        {player.currentChips > 0 ? `₹${player.currentChips}` : '—'}
                                                    </button>
                                                )}
                                            </td>
                                            <td className={`py-3 px-4 text-right font-bold
                        ${profitLoss > 0 ? 'text-chip-green' : profitLoss < 0 ? 'text-chip-red' : 'dark:text-felt-400 text-felt-500'}`}>
                                                {player.currentChips > 0
                                                    ? `${profitLoss >= 0 ? '+' : ''}₹${profitLoss}`
                                                    : '—'}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => onOpenRebuy(player)}
                                                    className="px-4 py-2 rounded-lg text-xs font-bold
                            dark:bg-felt-700 dark:hover:bg-felt-600 dark:text-felt-100
                            bg-primary-100 hover:bg-primary-200 text-primary-700
                            transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                                                >
                                                    + Rebuy
                                                </button>
                                            </td>
                                        </>
                                    )}
                                    {!gameStarted && (
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => onRemovePlayer(player.id)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center mx-auto
                          dark:hover:bg-danger/20 hover:bg-danger/10
                          dark:text-felt-400 text-felt-500 hover:text-danger
                          transition-all duration-200 active:scale-90"
                                                aria-label={`Remove ${player.name}`}
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {players.map((player, idx) => {
                    const profitLoss = (player.currentChips || 0) - player.totalInvested;
                    return (
                        <div
                            key={player.id}
                            className="rounded-xl p-4 
                dark:bg-surface-card dark:border dark:border-felt-800
                bg-white border border-felt-100 shadow-sm
                animate-fade-in"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    dark:bg-felt-700 dark:text-felt-300
                    bg-felt-100 text-felt-600">
                                        {idx + 1}
                                    </span>
                                    <span className="font-bold dark:text-white text-felt-900">{player.name}</span>
                                </div>
                                {gameStarted ? (
                                    <button
                                        onClick={() => onOpenRebuy(player)}
                                        className="px-4 py-1.5 rounded-lg text-xs font-bold
                      dark:bg-felt-700 dark:hover:bg-felt-600 dark:text-felt-100
                      bg-primary-100 hover:bg-primary-200 text-primary-700 transition-all active:scale-95 shadow-sm"
                                    >
                                        + Rebuy
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onRemovePlayer(player.id)}
                                        className="w-8 h-8 rounded-full flex items-center justify-center dark:hover:bg-danger/20 hover:bg-danger/10 text-felt-400 hover:text-danger transition-all duration-200 active:scale-90"
                                        aria-label={`Remove ${player.name}`}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="dark:text-felt-400 text-felt-600">Buy-in</div>
                                <div className="text-right font-medium dark:text-felt-200 text-felt-700">₹{player.buyIn}</div>

                                <div className="dark:text-felt-400 text-felt-600">Rebuy</div>
                                <div className="text-right font-medium dark:text-felt-200 text-felt-700">₹{player.totalRebuy}</div>

                                <div className="dark:text-felt-400 text-felt-600">Total Invested</div>
                                <div className="text-right font-bold dark:text-gold-400 text-felt-700">₹{player.totalInvested}</div>

                                {gameStarted && (
                                    <>
                                        <div className="dark:text-felt-400 text-felt-600">Current Chips</div>
                                        <div className="text-right">
                                            <input
                                                type="number"
                                                min="0"
                                                value={player.currentChips || ''}
                                                onChange={(e) => onUpdateChips(player.id, Math.max(0, Number(e.target.value)))}
                                                className="w-24 px-2 py-1 rounded-lg text-right
                          dark:bg-felt-800 dark:border-felt-600 dark:text-white
                          bg-felt-50 border-felt-200 text-felt-900
                          border outline-none text-sm font-semibold"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="dark:text-felt-400 text-felt-600">Profit / Loss</div>
                                        <div className={`text-right font-bold
                      ${profitLoss > 0 ? 'text-chip-green' : profitLoss < 0 ? 'text-chip-red' : 'dark:text-felt-400 text-felt-500'}`}>
                                            {player.currentChips > 0
                                                ? `${profitLoss >= 0 ? '+' : ''}₹${profitLoss}`
                                                : '—'}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
