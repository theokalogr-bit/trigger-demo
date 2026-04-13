# Dentist Lead Scraper — Athens, Greece

An automated lead generation tool built with **Trigger.dev**, **TypeScript**, and **SerpAPI**.

It finds dentists in Athens, Greece who have **no website** — potential clients for web design services — and delivers a ready-to-use CSV directly to your inbox.

---

## What It Does

1. Searches Google Maps for dentists in Athens, Greece via SerpAPI
2. Filters out businesses that already have a website
3. Collects the top 5 leads (name, address, phone, Google Maps link)
4. Generates a CSV file
5. Sends it to your email automatically via Resend

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Trigger.dev](https://trigger.dev) | Task orchestration & cloud execution |
| [SerpAPI](https://serpapi.com) | Google Maps scraping |
| [Resend](https://resend.com) | Transactional email delivery |
| TypeScript | Language |
| Node.js | Runtime |

---

## Project Structure

```
src/trigger/lead-scraper/
  scrape-leads.ts    ← main automation task
trigger.config.ts    ← Trigger.dev project config
tsconfig.json        ← TypeScript config
package.json
```

---

## How It Works

The core task (`scrape-dentist-leads`) runs entirely in the cloud on Trigger.dev's infrastructure:

- Paginates through Google Maps results (up to 100 listings) to find businesses without a website
- Stops as soon as 5 qualifying leads are found
- Builds a clean CSV and sends it as an email attachment

```typescript
// Filter dentists with no website
const noWebsite = pageResults.filter(
  (place) => !place.website || place.website.trim() === ""
);
```

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/theokalogr-bit/trigger-demo.git
cd trigger-demo
npm install
```

### 2. Create a `.env` file

```env
TRIGGER_SECRET_KEY=     # cloud.trigger.dev → Settings → API Keys
SERPAPI_API_KEY=        # serpapi.com → Dashboard
RESEND_API_KEY=         # resend.com → API Keys
RECIPIENT_EMAIL=        # email address to receive the leads CSV
```

### 3. Run locally

```bash
npm run dev
```

Then trigger the task from the [Trigger.dev dashboard](https://cloud.trigger.dev).

---

## Output

You receive an email with a CSV attachment like this:

| Name | Address | Phone | Google Maps URL |
|---|---|---|---|
| Tooth Experts Athens | Λεωφόρος Αλεξάνδρας 10, Αθήνα | +30 210 000 0000 | maps.google.com/... |
| Art Smile Dental Clinic | Πανεπιστημίου 25, Αθήνα | +30 210 000 0001 | maps.google.com/... |

---

## Author

Built by [theokalogr-bit](https://github.com/theokalogr-bit)
