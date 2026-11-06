---
type: module
name: StockBounce US desktop flavor
status: accepted
---

# StockBounce US desktop flavor

## Problem

Add StockBounce as a fifth independently installable MarketEye desktop flavor without maintaining the legacy Electron repository or mixing bounce-specific state into the analytics criterion workflow.

## Callers

The build/start/package scripts, Electron main/preload adapter, and the renderer's top-level app selection.

## Interface

```text
MARKETEYE_MODE=bounce MARKETEYE_MARKET=US -> bounce-us only
getBounceSessions(request?) -> paginated bounce-ready sessions
getBounceResults({ date, period, price_range, tickers? }) -> ready-to-render result
```

The flavor key is `bounce-us`, product name `StockBounce`, app ID `com.marketeye.bounce.us`, and release name `bounce-us`. A Toronto bounce combination is rejected explicitly.

## Usage example

The user selects short/long lookback independently from a real close-price range. React Query keys include the complete screening specification. Selecting T+1 or T+2 switches to ordered tracking for the tickers from the originating screen. Screening and tracking rows already include frequencies, so the renderer performs no secondary frequency request.

## Hidden complexity

- A dedicated `src/renderer/bounce/` module exposes one `useBounceWorkflow` interface. React Query owns remote data; a reducer owns selection, the complete screen specification, and the originating screen's ordered tickers. Session-page accumulation, initialization, and T/T+1/T+2 transitions do not leak into controls or rendering.
- The existing app shell supplies React Query, MUI, theming, environment-based credentials, packaging, and updates.
- A focused Electron transport adapter owns URL construction, credentials, optional parameters, HTTP execution, and structured error serialization for both analytics and StockBounce. `main.ts` and `preload.js` remain thin registrations behind stable typed channel names.
- The flavor manifest is authoritative for identity and presentation. Existing brand, theme, icon, and packaging helpers delegate to it while preserving the four current flavors' outputs.
- Loading, empty, error, retry, unavailable-tracking, and degraded-coverage states remain distinct.
- Native keyboard operation, visible focus, labelled controls, and alert semantics are included in rendering acceptance tests.

## Trade-offs

A separate bounce renderer duplicates some layout/table structure from standard analytics, but avoids conditionals throughout an unrelated workflow. Consolidating analytics transport touches existing call sites, so parity tests must preserve their channels and behavior. Two initial resources require session-page loading before the first screen rather than a single bootstrap response. Only US is supported until the backend gains another market implementation.

## Chosen because

A dedicated renderer behind the existing flavor seam preserves the current four flavors and gives StockBounce its own workflow. One deep workflow implementation avoids the legacy shallow hooks and stale tracking-origin risk. Shared transport and a complete flavor-definition seam increase leverage without introducing a generic analytics/bounce UI abstraction. Reusing the MarketEye shell removes the legacy app's hard-coded credential, swallowed API failures, extra frequency request, and separate packaging/update maintenance.
