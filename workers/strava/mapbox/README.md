# Activity map styles

Mapbox styles for the activity maps on [iwader.co.uk/now](https://iwader.co.uk/now/), in the site's palette.

- `iwader-light.json`: lavender-grey land, soft lilac water, muted green parks, white roads, dashed footpaths
- `iwader-dark.json`: the same layout in the site's dark-mode colours

The route itself is drawn by the Strava worker as a Static Images API overlay: `#7C3AED` with a white halo on light, `#A78BFA` with a dark halo on dark (see `src/activities.ts`).

## Published styles

| Style | Mapbox URL | Worker secret |
| --- | --- | --- |
| iwader Light | `mapbox://styles/iwader/cmwjude5a00zl01s818ck903e` | `MAPBOX_STYLE_ID` |
| iwader Dark | `mapbox://styles/iwader/cmwjucuci00me01s5dl1q3kb3` | `MAPBOX_STYLE_ID_DARK` |

## Changing the colours

Edit the `palettes` object in `build-styles.mjs`, then run:

```sh
node build-styles.mjs
```

## Publishing

1. In [Mapbox Studio](https://studio.mapbox.com/), go to **Styles → New style → Upload** and upload `iwader-light.json`. Publish it.
2. Do the same for `iwader-dark.json`.
3. Copy each style's ID (the last part of its `mapbox://styles/<username>/<id>` URL) and set the worker secrets:

```sh
npx wrangler secret put MAPBOX_STYLE_ID        # light style ID
npx wrangler secret put MAPBOX_STYLE_ID_DARK   # dark style ID (optional)
npx wrangler deploy
```

If `MAPBOX_STYLE_ID_DARK` isn't set, the worker only returns the light image and the Now page uses it in both modes.

Uploading a changed JSON creates a new style with a new ID, so update the secret afterwards. Image URLs are rebuilt whenever the worker serves activities, so the site picks up the new style on its next nightly build.
