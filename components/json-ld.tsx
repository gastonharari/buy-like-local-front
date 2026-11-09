// <script type="application/ld+json">. `<` is escaped so no string inside the data can close the
// script tag; JSON.parse reads < back as "<".
export function JsonLd({ data, id }: { data: unknown; id?: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
