"use client"

import { Button } from "@/components/ui/button"
import { useWaRef } from "@/hooks/use-wa-ref"
import { trackEvent } from "@/lib/analytics"
import { whatsappUrl } from "@/lib/wa-ref"

// WhatsApp CTA for the guide and FAQ pages. `message` is the natural sentence in the page's
// language; the visitor's ref (" (ref GS-7K2Q)", " (ref CO)", …) is appended once known — see
// lib/wa-ref.ts. Tapping it fires the GA4 "whatsapp_click" event, which lib/analytics.ts also
// reports as a conversion to Google Ads and the ChatGPT Ads pixel.
//
// The landing (app/page.tsx) keeps its own hand-written buttons and gets the same ref through
// useWhatsAppLink().

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.45zM12.045 21.785h-.007c-1.773 0-3.513-.476-5.031-1.37l-.361-.214-3.741.981 1.001-3.652-.235-.374c-.986-1.57-1.507-3.385-1.505-5.25C2.169 6.4 6.634 1.95 12.05 1.95c2.62 0 5.08 1.02 6.931 2.87 1.85 1.849 2.867 4.31 2.866 6.929-.003 5.408-4.47 9.836-9.802 9.836zm5.39-7.363c-.294-.147-1.742-.858-2.012-.957-.27-.098-.466-.147-.663.148-.198.294-.76.956-.932 1.154-.173.197-.345.22-.638.073-.294-.147-1.24-.458-2.362-1.458-.872-.779-1.461-1.74-1.633-2.034-.172-.294-.018-.453.129-.6.133-.132.294-.344.441-.516.148-.172.197-.294.295-.49.099-.197.05-.369-.025-.516-.074-.148-.663-1.6-.908-2.19-.24-.577-.483-.498-.663-.508-.172-.007-.369-.008-.565-.008-.197 0-.516.074-.786.369-.27.294-1.03 1.006-1.03 2.453 0 1.448 1.054 2.848 1.201 3.045.147.197 2.072 3.163 5.021 4.434.702.303 1.25.484 1.677.619.705.225 1.347.193 1.854.117.565-.083 1.741-.711 1.987-1.398.245-.688.245-1.277.172-1.399-.074-.123-.27-.197-.565-.344z" />
    </svg>
  )
}

export function WhatsAppButton({
  message,
  label,
  location,
  size = "lg",
}: {
  message: string
  label: string
  /** GA4 `location` param, e.g. "guide_hero". */
  location: string
  size?: "sm" | "lg"
}) {
  const ref = useWaRef()
  const big = size === "lg"
  return (
    <Button
      size={size}
      className={
        big
          ? "text-base md:text-lg px-8 py-6 font-bold bg-accent text-accent-foreground hover:bg-accent/90 transition-[transform,box-shadow] duration-300 hover:scale-105 hover:shadow-xl"
          : "bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
      }
      asChild
    >
      <a
        href={whatsappUrl(message, ref)}
        target="_blank"
        rel="noopener noreferrer"
        data-wa-ref={ref ?? ""}
        onClick={() => trackEvent("whatsapp_click", { location, ref: ref ?? "none" })}
      >
        <WhatsAppIcon className={big ? "w-5 h-5 mr-2" : "w-4 h-4"} />
        {label}
      </a>
    </Button>
  )
}
