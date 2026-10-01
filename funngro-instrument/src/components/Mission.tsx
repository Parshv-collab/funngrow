import { MISSION_PARAGRAPHS } from "@/content/site";
import Kicker from "./ui/Kicker";

/**
 * Mission.
 *
 * Three paragraphs at 18px / 1.7, as specified. The page needed a statement of
 * purpose in the middle: a Company page that opens with a timeline and never
 * says why the company exists is a press kit, not a company page.
 *
 * The writing is in Funngro's register — plain sentences, named cities, rupees
 * rather than "monetisation" — and every claim inside it restates a verifiable
 * Funngro fact. Nothing here is invented.
 */
export default function Mission() {
  return (
    <section
      id="mission"
      aria-labelledby="mission-heading"
      className="section border-b border-frame-border"
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <Kicker>Mission</Kicker>
            <h2 id="mission-heading" className="type-section mt-4 text-foreground">
              <span className="block">Make earning normal</span>
              <span className="emphasis block">for young India.</span>
            </h2>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-6">
              {MISSION_PARAGRAPHS.map((paragraph, i) => (
                <p
                  key={paragraph.slice(0, 20)}
                  className={
                    i === 0
                      ? "text-[18px] leading-[1.7] text-foreground"
                      : "text-[18px] leading-[1.7] text-prose-soft"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <blockquote className="mt-10 border-l-2 border-accent/40 pl-5">
              <p className="font-serif text-2xl italic leading-snug text-foreground">
                The internet already pays people. We just made it pay people who
                were told to wait.
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
