# MarketEye Client glossary

| Term | Meaning |
|------|---------|
| **StockBounce** | The `bounce-us` desktop flavor for US bounce screening and T/T+1/T+2 tracking. |
| **Bounce workflow** | The deep renderer module that owns session accumulation, selection, complete screen specifications, and originating-screen tracking transitions. |
| **Originating screen** | The screening specification and ordered ticker list retained when the user enters tracking; it does not depend on the currently visible query cache. |
| **Electron transport adapter** | The implementation behind typed IPC channels that owns HTTP execution, credentials, request mapping, and structured errors for analytics and StockBounce. |
| **Flavor definition** | The authoritative manifest entry for a flavor's identity, presentation, and update feed. |
| **Degraded coverage** | A historical snapshot reconstructed from archived tickers plus the current EODHD universe; the UI warns that it is not point-in-time or survivorship-free. |

Additional client terms: see `CONTEXT.md`.
