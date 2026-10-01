/**
 * Renders a JSON-LD <script> tag.
 *
 * A component rather than a metadata object, so the schema graph is explicit
 * and each page declares exactly the entity types it needs with shared @ids.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Serialising a trusted, static object. The escape guards against a
      // stray "</script>" inside a string breaking out of the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
