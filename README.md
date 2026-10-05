# Trip Framer 🧳

A single-page trip planner that "frames" an area with one map panel for every kind of place you want to see, so you don't need a dozen browser tabs open to scope out a trip.

**Try it:** https://tbatchelder.github.io/Trip-Framer/

## What it does

1. Enter a location (a city, a town, or a zip code).
2. Pick the kinds of venues you're interested in from a dropdown, such as cafes, museums, parks, theaters, and restaurants. Press **+** to add another dropdown; venue types you've already chosen disappear from the next one.
3. Or type your own venue, such as "Jazz Bar". Custom venues are remembered for next time.
4. Watch the preview line update as you go, then press **Frame My Trip** to lay out a panel for each venue.
5. Switch between **Grid View** and **Stacked View**.

**Recent Trips** brings back trips you've framed before, and **Clear Trips** clears that history. Six themes are available (light, dark, retro, ocean, unicorn, and dragon), and the app remembers which one you picked.

Everything is stored in your browser's local storage. There's no account, no server, and nothing is sent anywhere.

## About the maps

The idea is for each panel to be a live map of the venue near your location. Google doesn't allow its normal search pages to be embedded in a frame, and its embeddable maps need an API key. I decided not to set one up for a simple demo, so this version shows screenshots from the `img/` folder in place of live maps. Each image is named after its venue (`cafe.jpg`, `jazz_bar.jpg`, and so on). A custom venue that doesn't have a matching image shows an empty frame.

The code is wired for the real thing. If you put a Google Maps API key in `GOOGLE_MAPS_API_KEY` at the top of the map section of `script.js`, each panel switches to a live embedded map with a zoom button. A key in a page like this is visible to anyone who views the source, so restrict it to your own domain.

## About this project

I designed this for a four-day, AI-assisted hackathon at my coding bootcamp, where the goal was to show students what you can build with AI in a few days. I came up with the concept and the interface, and I directed AI tools to write the code.

**Built with:** plain HTML, CSS, and JavaScript. There's no build step and no dependencies.

## Run it locally

Open `index.html` in a browser.

## Contributions

This repo is public so people can look at it. I'm not accepting contributions, issues, or pull requests.

## License

MIT. See `LICENSE`.
