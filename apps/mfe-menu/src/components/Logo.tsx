export const Logo = () => (
  <a
    href="/"
    className="flex items-center gap-2 text-lg font-bold text-primary hover:text-primary/80 transition-colors"
  >
    <svg
      className="h-8 w-8 text-primary"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
    <span className="hidden sm:inline-block">ByteBank</span>
  </a>
)
