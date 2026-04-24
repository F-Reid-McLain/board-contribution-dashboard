# Choose Macon 2030 — Board Participation Dashboard

A lightweight, single-page dashboard tracking board member contributions to the Choose Macon 2030 campaign.

**Live repo:** https://github.com/F-Reid-McLain/board-contribution-dashboard

## Updating the data

All numbers — participation count, rate, dial, and contributing org cards — are driven by `board_members.csv`. To update:

1. Open `board_members.csv`
2. Change a `0` to `1` in the **Contributer** column for any member who has contributed
3. Save and refresh the page

No code changes needed.

## Adding a logo

1. Drop the logo file into the `logos/` folder
2. Add an entry to the `orgLogos` map in `dashboard.js`:
   ```js
   "Org Name": "logos/filename.png",
   ```

## Running locally

The dashboard uses `fetch()` to read the CSV, so it must be served — opening the HTML file directly won't work. Use any static server, e.g.:

```bash
npx serve .
```
