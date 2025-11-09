# Agentic Website Blueprint

This project demonstrates a multi-route Next.js experience that exposes page-scoped tool manifests for agentic browsers or LLM copilots. Each page declares the tools it supports, registers DOM bindings through a shared handler, and publishes a scoped manifest so agents always know the actions available in the current context.

## Architecture Overview

- `public/.well-known/llms.txt` – directory card that lists every route alongside a static `manifestUrl`, including a dedicated `navigation` manifest.
- `public/manifests/*.json` – immutable manifest files (one per route) describing available tools and outbound navigation targets. `navigation.json` defines the global `navigate_to_route` tool.
- `public/js/agentic-handler.js` – exposes `initAgent`, `teardownAgent`, and maintains runtime state. Pages call `initAgent({ pageId, tools, routes, bindings })` to register DOM event handlers; it also hydrates the navigation manifest so tools are always mapped back to their owning pages.
- `public/js/modules/*.js` – page-specific bindings that wire DOM events for each tool and return teardown callbacks.
- `public/js/tools/*.tools.js` – per-page bootstrappers that fetch the static manifest, load bindings, and call `initAgent`.

## Pages & Tools

| Route | Key Components | Tools Exposed |
|-------|----------------|---------------|
| `/` | Hero showcase, featured products, quick CTA, contact & cart widgets | `featured_product_highlight`, `quick_contact_fill`, `quick_contact_fill_submit`, plus legacy contact/search/cart events |
| `/consultations` | Overview, availability, FAQ, booking form | `consultation_form_fill`, `consultation_form_submit`, `faq_reveal` |
| `/analytics` | KPI deck, filters, session table, trend chart | `dashboard_filter_apply`, `session_detail_focus`, `export_insights` |
| `/docs` | Sidebar navigation, doc sections, playbooks, training form | `doc_section_focus`, `playbook_expand`, `training_request_fill` |
| `/support` | Ticket list/detail, response composer, checklist, escalation banner | `ticket_select`, `response_compose_send`, `resolution_checklist_update` |

Each tool groups related fields so agents can perform meaningful actions with a single call (e.g., fill & submit a form in one request).

## Running Tests

```bash
npm test
```

The test suite covers page rendering expectations for each route.

## Developing New Pages

1. Add a static manifest JSON file under `public/manifests/<page>.json`.
2. Build page components under `components/<page>/`.
3. Create DOM bindings in `public/js/modules/<page>-tools.js` (return a teardown function). Shared navigation bindings live in `public/js/modules/navigation-tools.js`.
4. Add a bootstrapper `public/js/tools/<page>.tools.js` that fetches the manifest and calls `initAgent`, including `registerNavigationTools` in the bindings array.
5. Include the bootstrapper via `<Script type="module" src="/js/tools/<page>.tools.js" />` in the page and write tests to cover the new UI.

This pattern keeps manifests scoped, prevents tool explosion across pages, and provides a consistent contract for agentic browsers.

