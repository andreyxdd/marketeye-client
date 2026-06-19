# MarketEye Client — glossary

| Term | Meaning |
|------|---------|
| **Market** | Trading venue code baked into each desktop build: `US` or `TO` (Toronto Stock Exchange). Matches the API `market=` parameter. |
| **Market-wide analytics** | End-of-day indices for the US venue only: S&P 500, VIX family, normalized CVI slope. Not available for `TO`. |
| **Ticker** | Bare symbol for the active Market (e.g. `AAPL` for US, `SHOP` for TO — not `SHOP.TO`). |
| **Client flavor** | One of four packaged desktop apps locked to a Market and Client mode at build time: `standard-us` (MarketEye US), `standard-to` (MarketEye TSX), `micro-us` (MicroFTM), `micro-to` (MicroFTM TSX). |
| **Client flavor display name** | User-facing product label for a Client flavor (`MarketEye US`, `MarketEye TSX`, `MicroFTM`, `MicroFTM TSX`). Set via `MARKETEYE_PRODUCT_NAME` at package time. |
| **Client flavor identity** | Windows co-install fields per flavor: `appId` (e.g. `com.marketeye.standard.us`), `executableName` (Start Menu / `.exe` name), `releaseAppName` (internal `release/app/package.json` name), and distinct flavor icon assets under `assets/flavors/{flavor-key}/`. |
| **Installable client flavor** | A Client flavor that can be installed alongside the other three on Windows because each has a unique `appId`, executable name, and release app name. |
| **Client mode** | `standard` (MarketEye) or `micro` (MicroFTM); build-time via `MARKETEYE_MODE`. |
| **Micro Client flavor** | `micro-us` or `micro-to` — price-band screening desktop build. Uses distinct theme palettes and desktop icons from standard Client flavors. |
| **Price band tab** | UI tab selecting one of four close-price ranges ($5 / $10 / $20 / $50). |
| **Prefetch bundle** | One `get_analytics_lists_by_criteria` response (all five sort keys) for a date and optional price band, seeded into React Query so tab/criterion switches read cache instead of refetching. |
| **Bulk band prefetch** | MicroFTM background fetch of the full prefetch bundle for every price band after a date or band change (active band first, then others with concurrency 1). |
| **Criterion gap-fill prefetch** | MicroFTM background fetch of a single criterion via `get_analytics_lists_by_criterion` across all price bands when the user changes sort criterion, filling any band that still lacks that criterion (active band first, then others with concurrency 1). |
| **Analytics IPC error** | Main-process axios failures serialize to `{ code, status?, message }` and propagate through IPC; renderer hooks surface them to React Query `isError` instead of returning empty data. |
| **Update feed URL** | Per-flavor gh-pages generic feed baked at package time (`MARKETEYE_UPDATES_FEED_URL`), e.g. `https://andreyxdd.github.io/marketeye-client/updates/marketeye-us/`. |

API glossary: see [marketeye-api/CONTEXT.md](../marketeye-api/CONTEXT.md).
