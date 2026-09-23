// Fixed-position by design (mobile sticky bottom bar). The parent must only
// ever conditionally MOUNT this component (never hide it in the DOM while
// mounted) — see the iOS scroll rule in CLAUDE.md. Presentational only: no
// hooks here. The parent is responsible for setting --cg-ctabar on
// documentElement when mounting this, if consumers need to know its height.

interface CtaBarProps {
  label: string
  waLink: string
  onCta: () => void
}

export function CtaBar({ label, waLink, onCta }: CtaBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="cg-glass border-t border-border/60 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onCta}
          className="cg-sheen flex h-12 w-full items-center justify-center gap-2 rounded-full text-base font-semibold text-white"
          style={{ backgroundColor: "#25D366" }}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.45zM12.045 21.785h-.007c-1.773 0-3.513-.476-5.031-1.37l-.361-.214-3.741.981 1.001-3.652-.235-.374c-.986-1.57-1.507-3.385-1.505-5.25C2.169 6.4 6.634 1.95 12.05 1.95c2.62 0 5.08 1.02 6.931 2.87 1.85 1.849 2.867 4.31 2.866 6.929-.003 5.408-4.47 9.836-9.802 9.836zm5.39-7.363c-.294-.147-1.742-.858-2.012-.957-.27-.098-.466-.147-.663.148-.198.294-.76.956-.932 1.154-.173.197-.345.22-.638.073-.294-.147-1.24-.458-2.362-1.458-.872-.779-1.461-1.74-1.633-2.034-.172-.294-.018-.453.129-.6.133-.132.294-.344.441-.516.148-.172.197-.294.295-.49.099-.197.05-.369-.025-.516-.074-.148-.663-1.6-.908-2.19-.24-.577-.483-.498-.663-.508-.172-.007-.369-.008-.565-.008-.197 0-.516.074-.786.369-.27.294-1.03 1.006-1.03 2.453 0 1.448 1.054 2.848 1.201 3.045.147.197 2.072 3.163 5.021 4.434.702.303 1.25.484 1.677.619.705.225 1.347.193 1.854.117.565-.083 1.741-.711 1.987-1.398.245-.688.245-1.277.172-1.399-.074-.123-.27-.197-.565-.344z" />
          </svg>
          {label}
        </a>
      </div>
    </div>
  )
}
