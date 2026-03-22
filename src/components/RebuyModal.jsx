import { useState } from 'react';

export default function RebuyModal({ player, buyIn, onConfirm, onClose }) {
    const [amount, setAmount] = useState(buyIn);

    if (!player) return null;

    const handleConfirm = () => {
        if (amount > 0) {
            onConfirm(player.id, amount);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm rounded-2xl p-6
        dark:bg-surface-card dark:border dark:border-felt-700
        bg-white shadow-2xl
        animate-scale-in"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold dark:text-white text-felt-900">
                        Rebuy for {player.name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center
              dark:hover:bg-felt-700 hover:bg-gray-100
              transition-colors duration-150 text-lg"
                    >
                        ×
                    </button>
                </div>

                {/* Current stats */}
                <div className="mb-6 p-3 rounded-xl dark:bg-felt-800 bg-felt-50 space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="dark:text-felt-300 text-felt-600">Current buy-in</span>
                        <span className="font-semibold dark:text-white text-felt-900">₹{player.buyIn}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="dark:text-felt-300 text-felt-600">Total rebuys</span>
                        <span className="font-semibold dark:text-white text-felt-900">₹{player.totalRebuy}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t dark:border-felt-700 border-felt-200 pt-1 mt-1">
                        <span className="dark:text-felt-300 text-felt-600">Total invested</span>
                        <span className="font-bold dark:text-gold-400 text-felt-600">₹{player.totalInvested}</span>
                    </div>
                </div>

                {/* Amount input */}
                <label className="block text-sm font-semibold mb-2 dark:text-felt-200 text-felt-700">
                    Rebuy Amount (₹)
                </label>
                <input
                    id="rebuy-amount-input"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-3 rounded-xl border-2 mb-6
            dark:bg-felt-800 dark:border-felt-600 dark:text-white dark:focus:border-gold-400
            bg-white border-felt-200 text-felt-900 focus:border-felt-500
            outline-none transition-all duration-200 text-lg font-semibold"
                    autoFocus
                />

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl font-bold transition-all duration-200
              dark:bg-felt-700 dark:hover:bg-felt-600 dark:text-felt-200
              bg-gray-100 hover:bg-gray-200 text-felt-700 active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        id="confirm-rebuy-btn"
                        onClick={handleConfirm}
                        disabled={amount <= 0}
                        className="flex-1 py-3 rounded-xl font-extrabold transition-all duration-300
              bg-gradient-to-r from-accent-500 to-accent-400 text-white
              hover:from-accent-400 hover:to-accent-300
              disabled:opacity-40 disabled:cursor-not-allowed
              active:scale-95 hover:scale-[1.02] shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/50"
                    >
                        Confirm Rebuy
                    </button>
                </div>
            </div>
        </div>
    );
}
