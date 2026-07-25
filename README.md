# Hoop Flick

Hoop Flick is a mobile-first HTML5 basketball game built around quick, skill-based physics. Aim your shot, release the ball, and keep climbing through increasingly challenging hoops.

## Play Now

No installation is required:

### [Play Hoop Flick in your browser](https://xaden-son.github.io/Hoop-Flick/)

The game works with mouse and touch controls. For the best experience on my experiences, playing with a mouse is more great. Even so, in a mobile web browser has a good experince. 
You can play both of them.

## How to Play

1. Select **Play** from the main menu.
2. Touch or click and drag to aim your shot.
3. Release to launch the ball.
4. Pass through each hoop and climb as high as you can.
5. Collect coins to unlock new balls and themes.

Clean shots and bank shots trigger special scoring feedback. As your score increases, the hoop layouts become more challenging.

## Features

- Physics-based drag-and-release gameplay
- Mobile, tablet, and desktop browser support
- Multiple hoop types and progressively harder layouts
- Collectible coins and persistent progression
- Unlockable ball skins and visual themes
- Light and dark modes
- Turkish and English language support
- High-score tracking and responsive sound effects
- YouTube Playables integration for cloud saves, score submission, platform lifecycle, and rewarded ads

## Run Locally

Clone the repository:

```bash
git clone https://github.com/xaden-son/Hoop-Flick.git
cd Hoop-Flick
```

Start a local server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Stop the server with `Ctrl+C`.

Hoop Flick uses plain HTML, CSS, and JavaScript, so there is no package installation or build step.

## Project Structure

```text
Hoop-Flick/
├── index.html            # Game interface and entry point
├── style.css             # Responsive UI and visual styles
├── game.js               # Gameplay, physics, rendering, and progression
├── playablesBridge.js    # YouTube Playables SDK integration and browser fallback
└── favicon.png           # Game icon
```

## YouTube Playables

YouTube-specific functionality is isolated in `playablesBridge.js`. When the game runs outside YouTube Playables—such as on GitHub Pages or a local server—it falls back safely to standard browser behavior.

Rewarded ads and other platform-only features are available only inside a supported YouTube Playables environment.
