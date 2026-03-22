export default function DarkModeToggle({ darkMode, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center
        dark:bg-primary-800/60 dark:hover:bg-primary-700
        bg-primary-100 hover:bg-primary-200
        transition-all duration-300 active:scale-90"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <span className="text-lg transition-transform duration-300"
                style={{ transform: darkMode ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                {darkMode ? '🌙' : '☀️'}
            </span>
        </button>
    );
}
