# MarketEye Client — glossary

| Term | Meaning |
|------|---------|
| **Market** | Trading venue code baked into each desktop build: `US` or `TO` (Toronto Stock Exchange). Matches the API `market=` parameter. |
| **Market-wide analytics** | End-of-day indices for the US venue only: S&P 500, VIX family, normalized CVI slope. Not available for `TO`. |
| **Ticker** | Bare symbol for the active Market (e.g. `AAPL` for US, `SHOP` for TO — not `SHOP.TO`). |
| **Client flavor** | A packaged desktop app locked to one Market at build time (e.g. MarketEye US vs MarketEye TSX). |
| **Client flavor display name** | User-facing product label for a Client flavor (`MarketEye` for US, `MarketEye TSX` for TO; `MicroFTM` for micro US, `MicroFTM TSX` for micro TO). |
| **Client mode** | `standard` (MarketEye) or `micro` (MicroFTM); build-time via `MARKETEYE_MODE`. |
| **Micro Client flavor** | MicroFTM (US) or MicroFTM TSX (TO) — price-band screening desktop build. Uses distinct theme palettes and desktop icons from standard Client flavors. |
| **Price band tab** | UI tab selecting one of four close-price ranges ($5 / $10 / $20 / $50). |
| **Prefetch bundle** | One `get_analytics_lists_by_criteria` response (all five sort keys) for a date and optional price band, seeded into React Query so tab/criterion switches read cache instead of refetching. |
| **Bulk band prefetch** | MicroFTM background fetch of the full prefetch bundle for every price band after a date or band change (active band first, then others with concurrency 2). |
| **Criterion gap-fill prefetch** | MicroFTM background fetch of a single criterion via `get_analytics_lists_by_criterion` across all price bands when the user changes sort criterion, filling any band that still lacks that criterion (active band first, then others with concurrency 2). |

API glossary: see [marketeye-api/CONTEXT.md](../marketeye-api/CONTEXT.md).
