# MarketEye Client — glossary

| Term | Meaning |
|------|---------|
| **Market** | Trading venue code baked into each desktop build: `US` or `TO` (Toronto Stock Exchange). Matches the API `market=` parameter. |
| **Market-wide analytics** | End-of-day indices for the US venue only: S&P 500, VIX family, normalized CVI slope. Not available for `TO`. |
| **Ticker** | Bare symbol for the active Market (e.g. `AAPL` for US, `SHOP` for TO — not `SHOP.TO`). |
| **Client flavor** | A packaged desktop app locked to one Market at build time (e.g. MarketEye US vs MarketEye TSX). |
| **Client flavor display name** | User-facing product label for a Client flavor (`MarketEye` for US, `MarketEye TSX` for TO). |

API glossary: see [marketeye-api/CONTEXT.md](../marketeye-api/CONTEXT.md).
