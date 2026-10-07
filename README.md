# Agis Learning Games

Public playable releases from Agis Learning Lab, intended for educational use. Development source is maintained separately; this repository contains distribution files only.

- [RoboMorph Academy](https://kkougiou.github.io/agis-learning-games/robomorph/)
- [All games](https://kkougiou.github.io/agis-learning-games/)

Progress is stored locally in your browser. Clearing browser or site data may erase progress. Different browsers, devices, and Home Screen installations may have separate storage.

## Updating RoboMorph

1. Generate and test the new standalone release in the separate development repository.
2. Copy only the approved release HTML to `robomorph/index.html`.
3. Audit the public file allowlist and scan for secrets, local paths, and internal material; test the game and progress persistence.
4. Commit only the approved distribution files and push to `main`.
5. GitHub Pages publishes from `main`, repository root. Verify the live game after deployment.

Always update the same `/robomorph/` URL. Preserve the browser storage keys and compatible save format. Never sync development source, documentation, tests, or Git history into this repository.
