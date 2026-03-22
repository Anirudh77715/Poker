export default function SettlementPanel({ players, onBack, onEndGame }) {
    const results = players
        .map((p) => ({
            name: p.name,
            invested: p.totalInvested,
            chips: p.currentChips || 0,
            net: (p.currentChips || 0) - p.totalInvested,
        }))
        .sort((a, b) => b.net - a.net);

    const transactions = computeSettlement(results);

    const winners = results.filter((r) => r.net > 0);
    const losers = results.filter((r) => r.net < 0);
    const breakEven = results.filter((r) => r.net === 0);

    const totalChips = results.reduce((s, r) => s + r.chips, 0);
    const totalInvested = results.reduce((s, r) => s + r.invested, 0);
    const isBalanced = totalChips === totalInvested;

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold dark:text-white text-felt-900">🏆 Final Results</h2>
                <div className="flex gap-2">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 rounded-xl text-sm font-semibold
              dark:bg-felt-700 dark:hover:bg-felt-600 dark:text-felt-200
              bg-felt-100 hover:bg-felt-200 text-felt-700
              transition-colors duration-150"
                    >
                        ← Edit Chips
                    </button>
                    <button
                        onClick={onEndGame}
                        className="px-4 py-2 rounded-xl text-sm font-semibold
              bg-chip-green hover:bg-green-600 text-white
              transition-colors duration-150 shadow-lg shadow-green-500/20"
                    >
                        ✓ Save & End Game
                    </button>
                </div>
            </div>

            {!isBalanced && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <p className="text-chip-red font-semibold text-sm">
                        ⚠️ Warning: Total chips (₹{totalChips}) ≠ Total invested (₹{totalInvested}).
                        Difference: ₹{Math.abs(totalChips - totalInvested)}
                    </p>
                </div>
            )}

            {/* Results cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((r) => (
                    <div
                        key={r.name}
                        className={`rounded-xl p-4 border transition-all duration-200
              ${r.net > 0
                                ? 'dark:bg-green-900/20 dark:border-green-800/50 bg-green-50 border-green-200'
                                : r.net < 0
                                    ? 'dark:bg-red-900/20 dark:border-red-800/50 bg-red-50 border-red-200'
                                    : 'dark:bg-felt-800 dark:border-felt-700 bg-gray-50 border-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold dark:text-white text-felt-900">{r.name}</span>
                            <span className="text-lg">{r.net > 0 ? '🟢' : r.net < 0 ? '🔴' : '⚪'}</span>
                        </div>
                        <div className="text-sm dark:text-felt-300 text-felt-600 mb-1">
                            Invested: ₹{r.invested} → Chips: ₹{r.chips}
                        </div>
                        <div className={`text-2xl font-extrabold
              ${r.net > 0 ? 'text-chip-green' : r.net < 0 ? 'text-chip-red' : 'dark:text-felt-400 text-felt-500'}`}>
                            {r.net >= 0 ? '+' : ''}₹{r.net}
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-3">
                <SummaryCard title="Winners" count={winners.length} total={winners.reduce((s, w) => s + w.net, 0)} color="green" />
                <SummaryCard title="Losers" count={losers.length} total={losers.reduce((s, l) => s + l.net, 0)} color="red" />
                <SummaryCard title="Break Even" count={breakEven.length} total={0} color="gray" />
            </div>

            {/* Transactions */}
            {transactions.length > 0 && (
                <div className="rounded-2xl p-6
          dark:bg-surface-card dark:border dark:border-felt-800
          bg-white border border-felt-100 shadow-lg">
                    <h3 className="text-lg font-bold mb-4 dark:text-white text-felt-900">
                        💸 Settlement Transactions
                    </h3>
                    <p className="text-sm dark:text-felt-400 text-felt-600 mb-4">
                        Minimum {transactions.length} transaction{transactions.length > 1 ? 's' : ''} needed:
                    </p>
                    <div className="space-y-3">
                        {transactions.map((t, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-xl
                  dark:bg-felt-800 bg-felt-50 animate-fade-in flex-wrap"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  dark:bg-felt-700 dark:text-felt-300 bg-felt-200 text-felt-600">{i + 1}</span>
                                <span className="font-semibold text-chip-red">{t.from}</span>
                                <span className="dark:text-felt-400 text-felt-500">pays</span>
                                <span className="font-bold dark:text-gold-400 text-felt-700">₹{t.amount}</span>
                                <span className="dark:text-felt-400 text-felt-500">to</span>
                                <span className="font-semibold text-chip-green">{t.to}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function SummaryCard({ title, count, total, color }) {
    const colorStyles = {
        green: 'dark:bg-green-900/20 dark:border-green-800/50 bg-green-50 border-green-200',
        red: 'dark:bg-red-900/20 dark:border-red-800/50 bg-red-50 border-red-200',
        gray: 'dark:bg-felt-800 dark:border-felt-700 bg-gray-50 border-gray-200',
    };
    const textColor = { green: 'text-chip-green', red: 'text-chip-red', gray: 'dark:text-felt-400 text-felt-500' };

    return (
        <div className={`rounded-xl p-4 border ${colorStyles[color]}`}>
            <div className="text-sm font-medium dark:text-felt-300 text-felt-600 mb-1">{title}</div>
            <div className="text-2xl font-extrabold dark:text-white text-felt-900">{count}</div>
            {total !== 0 && (
                <div className={`text-sm font-bold ${textColor[color]}`}>
                    {total >= 0 ? '+' : ''}₹{total}
                </div>
            )}
        </div>
    );
}

function computeSettlement(results) {
    const creditors = results.filter((r) => r.net > 0).map((r) => ({ name: r.name, amount: r.net })).sort((a, b) => b.amount - a.amount);
    const debtors = results.filter((r) => r.net < 0).map((r) => ({ name: r.name, amount: Math.abs(r.net) })).sort((a, b) => b.amount - a.amount);
    const transactions = [];
    let ci = 0, di = 0;
    while (ci < creditors.length && di < debtors.length) {
        const amount = Math.min(creditors[ci].amount, debtors[di].amount);
        if (amount > 0) transactions.push({ from: debtors[di].name, to: creditors[ci].name, amount });
        creditors[ci].amount -= amount;
        debtors[di].amount -= amount;
        if (creditors[ci].amount === 0) ci++;
        if (debtors[di].amount === 0) di++;
    }
    return transactions;
}
