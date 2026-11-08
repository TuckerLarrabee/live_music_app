# Custom domain setup: memphisegypt.net

Goal: serve the app directly at **https://memphisegypt.net**, with that address staying in the URL bar (no `tuckerlarrabee.github.io` visible).

## Why this is needed

The domain is currently set up with **GoDaddy domain forwarding**:

| URL typed | What happens today |
|---|---|
| `http://memphisegypt.net` | Redirects to `tuckerlarrabee.github.io/live_music_app/`, so the GitHub address shows in the URL bar |
| `https://memphisegypt.net` | Times out, because GoDaddy's forwarder doesn't answer on HTTPS |

Phones try `https://` first, which is why the domain fails on mobile.

The fix is to point the domain's DNS straight at GitHub Pages and have GitHub serve the site as `memphisegypt.net`, with a free HTTPS certificate.

**Do the steps in order.** The code change in step 4 breaks the old `github.io/live_music_app/` address, so deploy it only after DNS and GitHub are set up.

---

## Step 1: (Optional, recommended) Verify the domain with GitHub

Verifying stops anyone else from claiming the domain on GitHub Pages if the setup is ever half-finished.

1. On GitHub, open your **profile picture → Settings → Pages** (account settings, not the repo).
2. Click **Add a domain** and enter `memphisegypt.net`.
3. GitHub shows a **TXT record**, with a name like `_github-pages-challenge-TuckerLarrabee` and a random value. Keep this page open.
4. Add that TXT record in GoDaddy (see step 2, "Adding a record"), then come back and click **Verify**. It can take a few minutes to go through.

## Step 2: Update DNS in GoDaddy

1. Log in to GoDaddy and go to **My Products → memphisegypt.net → DNS** (sometimes labeled "Manage DNS").
2. **Turn off forwarding.** Find the **Forwarding** section, which shows a forward to `tuckerlarrabee.github.io/live_music_app`, and delete it.
   - Forwarding owns the current A records (`15.197.142.173` and `3.33.152.147`). They may be locked until forwarding is removed.
3. **Delete the old A records** for `@` if they're still there after removing forwarding.
4. **Add four A records** pointing to GitHub Pages:

   | Type | Name | Value | TTL |
   |---|---|---|---|
   | A | `@` | `185.199.108.153` | 1 Hour |
   | A | `@` | `185.199.109.153` | 1 Hour |
   | A | `@` | `185.199.110.153` | 1 Hour |
   | A | `@` | `185.199.111.153` | 1 Hour |

5. *(Optional)* Add four AAAA records for IPv6:

   | Type | Name | Value |
   |---|---|---|
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |

6. **Update the `www` record.** It's currently a CNAME pointing to `memphisegypt.net`. Edit it to point to GitHub:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `www` | `tuckerlarrabee.github.io` |

7. **Leave everything else alone**, especially any MX or TXT records, which handle email and verification.

**Adding a record:** in GoDaddy's DNS page, click **Add New Record**, pick the type, fill in Name and Value, and save.

DNS changes usually take effect within minutes, but can take up to a few hours.

## Step 3: Set the custom domain on GitHub

1. Open the repo **TuckerLarrabee/live_music_app → Settings → Pages**.
2. Under **Build and deployment**, confirm the source is **Deploy from a branch**, branch **`gh-pages`**, folder **`/ (root)`**. This should already be set.
3. Under **Custom domain**, enter `memphisegypt.net` and click **Save**.
4. Wait for the **DNS check successful** message. If it says unsuccessful, wait for DNS to update and click **Check again**.
5. Once the certificate is issued, tick **Enforce HTTPS**. This can take anywhere from a few minutes to about 24 hours, and the checkbox stays greyed out until then.

GitHub automatically redirects `www.memphisegypt.net` to `memphisegypt.net`. It also redirects the old `tuckerlarrabee.github.io/live_music_app/` address to the new domain.

## Step 4: Update the code and deploy

The app currently expects to live at `/live_music_app/`. On the custom domain it lives at the root (`/`).

1. In [vite.config.js](vite.config.js), change:
   ```js
   base: "/live_music_app/",
   ```
   to:
   ```js
   base: "/",
   ```
2. Create a file at `public/CNAME`. It should contain this single line, with no `https://` and no trailing slash:
   ```
   memphisegypt.net
   ```
   **Why:** `npm run deploy` replaces the entire `gh-pages` branch on every deploy. GitHub stores the custom domain as a `CNAME` file in that branch, so without this file every deploy would silently remove the custom domain.
3. In [README.md](README.md), update the live link to `https://memphisegypt.net`.
4. Deploy:
   ```bash
   npm run deploy
   ```
5. Commit the changes.

## Step 5: Check that it works

- [ ] `https://memphisegypt.net` loads the app, and the URL bar still says `memphisegypt.net`.
- [ ] `http://memphisegypt.net` redirects to `https://memphisegypt.net`.
- [ ] `https://www.memphisegypt.net` redirects to `https://memphisegypt.net`.
- [ ] `https://tuckerlarrabee.github.io/live_music_app/` redirects to `https://memphisegypt.net`.
- [ ] On your phone, typing `memphisegypt.net` loads the app.
- [ ] A **Share** link from a recording starts with `https://memphisegypt.net/?band=…` and opens the right show.
- [ ] Audio plays.
- [ ] After a **second** `npm run deploy`, the custom domain is still set in Settings → Pages. This confirms `public/CNAME` is working.

To check DNS from a terminal:
```bash
nslookup memphisegypt.net 8.8.8.8          # should list the four 185.199.x.153 addresses
nslookup www.memphisegypt.net 8.8.8.8      # should show tuckerlarrabee.github.io
curl -I https://memphisegypt.net           # should return HTTP 200 from GitHub
```

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Site loads but is a **blank page** | The `base` in `vite.config.js` doesn't match where the site is served. On the custom domain it must be `"/"`. Rebuild and redeploy. |
| Custom domain **disappears** from Settings → Pages after a deploy | `public/CNAME` is missing or misspelled. |
| **Enforce HTTPS** is greyed out | The certificate hasn't been issued yet. Wait (up to ~24h), and make sure DNS shows only GitHub's IPs, with no leftover GoDaddy A records. |
| "Domain does not resolve to the GitHub Pages server" | Old A records are still present, or DNS hasn't updated yet. Re-check step 2. |
| Phone still goes to the old `github.io` address | The phone cached the old redirect. Try a private/incognito tab, or clear the browser's history for the site. |
| Old shared links (`tuckerlarrabee.github.io/live_music_app/?band=…`) | These should redirect to the custom domain with the query string kept. If one doesn't, the same link with `memphisegypt.net` in place of the old address works. |

## Rolling back

If something goes wrong and you need the old setup back:
1. In GitHub **Settings → Pages**, remove the custom domain.
2. Change `base` in `vite.config.js` back to `"/live_music_app/"`, delete `public/CNAME`, and run `npm run deploy`.
3. In GoDaddy, delete the GitHub A records and re-add forwarding to `https://tuckerlarrabee.github.io/live_music_app/`.
