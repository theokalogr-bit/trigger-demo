import { task } from "@trigger.dev/sdk";
import { Resend } from "resend";

interface SerpApiPlace {
  title?: string;
  address?: string;
  phone?: string;
  website?: string;
  place_id?: string;
}

interface SerpApiResponse {
  local_results?: SerpApiPlace[];
  error?: string;
}

export const scrapeDentistLeads = task({
  id: "scrape-dentist-leads",
  retry: {
    maxAttempts: 2,
  },
  run: async () => {
    const serpApiKey = process.env.SERPAPI_API_KEY;
    if (!serpApiKey) throw new Error("SERPAPI_API_KEY is not set");

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) throw new Error("RESEND_API_KEY is not set");

    const recipientEmail = process.env.RECIPIENT_EMAIL;
    if (!recipientEmail) throw new Error("RECIPIENT_EMAIL is not set");

    // ── Step 1: Search Google Maps via SerpAPI (paginate until 5 leads found) ─
    console.log("Searching Google Maps for dentists in Athens, Greece...");

    const noWebsite: SerpApiPlace[] = [];
    const maxPages = 5; // up to 100 results across 5 pages

    for (let page = 0; page < maxPages; page++) {
      const start = page * 20;
      console.log(`Fetching page ${page + 1} (start=${start})...`);

      const searchUrl = new URL("https://serpapi.com/search.json");
      searchUrl.searchParams.set("engine", "google_maps");
      searchUrl.searchParams.set("q", "dentist athens greece");
      searchUrl.searchParams.set("type", "search");
      searchUrl.searchParams.set("hl", "en");
      searchUrl.searchParams.set("start", String(start));
      searchUrl.searchParams.set("api_key", serpApiKey);

      const response = await fetch(searchUrl.toString());
      if (!response.ok) {
        throw new Error(`SerpAPI request failed: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as SerpApiResponse;

      if (data.error) {
        throw new Error(`SerpAPI error: ${data.error}`);
      }

      const pageResults: SerpApiPlace[] = data.local_results ?? [];
      console.log(`Page ${page + 1}: ${pageResults.length} results`);

      if (pageResults.length === 0) {
        console.log("No more results — stopping pagination.");
        break;
      }

      for (const place of pageResults) {
        if (!place.website || place.website.trim() === "") {
          noWebsite.push(place);
          console.log(`Found no-website lead: ${place.title}`);
          if (noWebsite.length >= 5) break;
        }
      }

      if (noWebsite.length >= 5) break;
    }

    console.log(`Total dentists without a website found: ${noWebsite.length}`);

    if (noWebsite.length === 0) {
      throw new Error("No dentists without a website found across all pages. The area may have high web adoption.");
    }

    const leads = noWebsite.slice(0, 5);
    console.log(`Using top ${leads.length} leads`);

    // ── Step 3: Build CSV ──────────────────────────────────────────────────
    const csvHeader = "Name,Address,Phone,Google Maps URL";
    const csvRows = leads.map((place) => {
      const name = csvEscape(place.title ?? "");
      const address = csvEscape(place.address ?? "");
      const phone = csvEscape(place.phone ?? "");
      const mapsUrl = place.place_id
        ? `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
        : "";
      return `${name},${address},${phone},${mapsUrl}`;
    });

    const csvContent = [csvHeader, ...csvRows].join("\n");
    console.log("CSV built:\n" + csvContent);

    // ── Step 4: Send email with CSV attachment ─────────────────────────────
    const resend = new Resend(resendApiKey);
    const today = new Date().toISOString().slice(0, 10);

    const emailResult = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: recipientEmail,
      subject: `${leads.length} Dentist Leads — Athens, Greece (${today})`,
      text: [
        `Hi,`,
        ``,
        `Here are ${leads.length} dentists in Athens, Greece who currently have no website.`,
        `These are potential clients for your web design services.`,
        ``,
        `Find the full list in the attached CSV file.`,
        ``,
        `Good luck!`,
      ].join("\n"),
      attachments: [
        {
          filename: `dentist-leads-athens-${today}.csv`,
          content: Buffer.from(csvContent).toString("base64"),
        },
      ],
    });

    if (emailResult.error) {
      throw new Error(`Resend error: ${JSON.stringify(emailResult.error)}`);
    }

    console.log(`Email sent successfully to ${recipientEmail} (id: ${emailResult.data?.id})`);

    return {
      leadsFound: leads.length,
      emailSentTo: recipientEmail,
      leads: leads.map((p) => ({ name: p.title, phone: p.phone, address: p.address })),
    };
  },
});

// Wrap a CSV field in quotes if it contains a comma, quote, or newline
function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
