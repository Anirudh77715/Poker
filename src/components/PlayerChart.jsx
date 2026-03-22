import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';

export default function PlayerChart({ history, playerName }) {
    if (!history || history.length === 0) return null;

    const data = history.map((h, i) => ({
        game: `G${i + 1}`,
        date: new Date(h.date).toLocaleDateString(),
        net: h.net,
        cumulative: h.cumulative,
        invested: h.invested,
        chips: h.chips,
    }));

    return (
        <div className="rounded-xl p-4 dark:bg-felt-800/50 bg-felt-50/50">
            <h4 className="text-sm font-semibold dark:text-felt-200 text-felt-700 mb-3">
                📈 Cumulative P/L Over Games
            </h4>
            <div className="h-48 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id={`gradient-${playerName}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id={`gradient-neg-${playerName}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#dc2626" stopOpacity={0} />
                                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.3} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,100,0.2)" />
                        <XAxis
                            dataKey="game"
                            tick={{ fontSize: 11, fill: '#888' }}
                            axisLine={{ stroke: 'rgba(100,100,100,0.3)' }}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#888' }}
                            axisLine={{ stroke: 'rgba(100,100,100,0.3)' }}
                            tickFormatter={(v) => `₹${v}`}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload?.[0]) return null;
                                const d = payload[0].payload;
                                return (
                                    <div className="dark:bg-felt-900 bg-white rounded-lg p-3 shadow-xl border dark:border-felt-700 border-felt-200 text-sm">
                                        <div className="font-semibold dark:text-white text-felt-900">{d.date}</div>
                                        <div className="dark:text-felt-300 text-felt-600 mt-1">
                                            Invested: ₹{d.invested} → ₹{d.chips}
                                        </div>
                                        <div className={`font-bold mt-1 ${d.net >= 0 ? 'text-chip-green' : 'text-chip-red'}`}>
                                            Game: {d.net >= 0 ? '+' : ''}₹{d.net}
                                        </div>
                                        <div className={`font-bold ${d.cumulative >= 0 ? 'text-chip-green' : 'text-chip-red'}`}>
                                            Cumulative: {d.cumulative >= 0 ? '+' : ''}₹{d.cumulative}
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <ReferenceLine y={0} stroke="rgba(150,150,150,0.5)" strokeDasharray="4 4" />
                        <Area
                            type="monotone"
                            dataKey="cumulative"
                            stroke="#16a34a"
                            strokeWidth={2.5}
                            fill={`url(#gradient-${playerName})`}
                            dot={{ r: 4, fill: '#16a34a', strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
