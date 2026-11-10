import { GuidePage, guideMetadata } from "@/components/guide/guide-page"
import { getGuide } from "@/lib/content/guides"

// Copy, FAQ and metadata: lib/content/guides.ts. Layout: components/guide/guide-page.tsx.
const page = getGuide("/es/comprar-en-mercadolibre-siendo-extranjero")

export const metadata = guideMetadata(page)

export default function Page() {
  return <GuidePage page={page} />
}
