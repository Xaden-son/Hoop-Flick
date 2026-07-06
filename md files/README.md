# Hoop Flick

HTML5 Canvas basketball arcade prototype.

## Run Locally

Open a terminal and run:

```bash
cd "/home/xaden/Desktop/Youtube playables proje"
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/index.html
```

Stop the server from the same terminal with:

```text
Ctrl+C
```

If you want to test your game with your phone:

start the server like that 
python3 -m http.server 8000 --bind 0.0.0.0

Then check your computer IP with: hostname -I

Then enter that IP in your mobile phone like: 192.168.1.?:8000


## If Changes Do Not Appear

Use a cache-busting URL:

```text
http://127.0.0.1:8000/index.html?v=dev
```

Or hard refresh the browser:

```text
Ctrl+Shift+R
```

On mobile, close the tab and reopen the URL, or clear site data for `127.0.0.1`.

## YouTube Playables

`index.html` loads the YouTube Playables SDK before `playablesBridge.js` and
`game.js`. The bridge keeps SDK calls isolated and falls back safely when the
game runs outside the Playables environment.

After uploading a bundle, rerun the Developer Portal checks for SDK ordering,
`firstFrameReady`/`gameReady`, cloud save, integer score submission, audio,
pause/resume, and initial bundle size.
