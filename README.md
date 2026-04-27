# Dentist Lead Scraper — Athens

> Automated lead generation that finds local businesses with no website and delivers qualified prospects to your inbox — zero manual work.

Most web designers and automation consultants waste hours searching Google Maps by hand to find businesses that need their services. This tool does it automatically: search a city and business type, filter for those without websites, and get a CSV of warm leads delivered to your inbox. Change the search query and it works for any city, any industry.


## How It Works
Trigger.dev scheduled job
         │
         ▼
SerpAPI → Google Maps search: "dentists in Athens"
         │
         ▼
Filter: businesses with no website listed
         │
         ▼
Top 5 leads compiled into CSV
         │
         ▼
Resend → CSV delivered to your inbox
```

## Tech Stack
|-----------|------|
| Trigger.dev | Cloud job orchestration — runs on schedule or on demand |
| SerpAPI | Google Maps data extraction |
| Resend | Transactional email with CSV attachment |
| TypeScript + Node.js | Core logic |

## Setup
```bash
npm install
```
```
TRIGGER_SECRET_KEY=     # from cloud.trigger.dev → Settings
SERPAPI_API_KEY=        # from serpapi.com
RESEND_API_KEY=         # from resend.com
LEAD_RECIPIENT_EMAIL=   # where you want leads delivered
```
```bash
npx trigger.dev@latest deploy
```

## Adapting It
```typescript
const query = "lawyers in Thessaloniki"; // any city, any business type
```

## Use Cases
- **AI automation consultants** — demonstrate automation value to potential clients
- **Sales teams** — generate hyper-local B2B leads at scale
Built by [Theo](https://github.com/theokalogr-bit) — AI automation consultant based in Athens, Greece.
