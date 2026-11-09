import Script from "next/script"
import { OPENAI_PIXEL_ID } from "@/lib/marketing"

// ChatGPT Ads Measurement Pixel — official snippet from
// https://developers.openai.com/ads/measurement-pixel. Not rendered at all until
// NEXT_PUBLIC_OPENAI_PIXEL_ID is set (session 4 provides it). Respects the cookie banner's
// "Decline": consent is set to false before init, as the docs require, so no event is sent.
// The WhatsApp-click conversion is fired from lib/marketing.ts (reportWhatsAppConversion).
export function OpenAIPixel() {
  if (!OPENAI_PIXEL_ID) return null
  return (
    <Script id="openai-pixel" strategy="afterInteractive">
      {`
        (function (w, d, s, u) {
          if (w.oaiq) return;
          var q = function () {
            q.q.push(arguments);
          };
          q.q = [];
          w.oaiq = q;
          var js = d.createElement(s);
          js.async = true;
          js.src = u;
          var f = d.getElementsByTagName(s)[0];
          f.parentNode.insertBefore(js, f);
        })(window, document, "script", "https://bzrcdn.openai.com/sdk/oaiq.min.js");
        try {
          if (localStorage.getItem("cookie_consent") === "denied") oaiq("consent", false);
        } catch (e) {}
        oaiq("init", { pixelId: "${OPENAI_PIXEL_ID}" });
      `}
    </Script>
  )
}
