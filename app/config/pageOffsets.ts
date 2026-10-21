/**
 * Fixed header offset.
 *
 * The header is `fixed`, so every page below it has to reserve room. It is
 * 3.5rem tall on mobile and 4.25rem from the `md` breakpoint up (see
 * Header.tsx). Several pages still use hand-written `pt-24`-style utilities
 * tuned for the older, taller navbar, which leaves noticeably more dead space
 * than needed; this constant is the single source those should migrate to.
 *
 * The values include breathing room above the first heading.
 */
export const HEADER_OFFSET = "pt-[5.5rem] md:pt-[6.5rem]";
