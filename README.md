# Agis Learning Games

Public playable releases from Agis Learning Lab, intended for educational use. Development source is maintained separately; this repository contains distribution files only.

- [ΜΠΙΠ v1.2 Adaptive](https://kkougiou.github.io/agis-learning-games/bip/)
- [RoboMorph Academy](https://kkougiou.github.io/agis-learning-games/robomorph/)
- [LEXIS — Το Αρχείο των Χαμένων Λέξεων](https://kkougiou.github.io/agis-learning-games/lexis/)
- [All games](https://kkougiou.github.io/agis-learning-games/)

Progress is stored locally in your browser. Clearing browser or site data may erase progress. Different browsers, devices, and Home Screen installations may have separate storage.

LEXIS supports Home Screen installation in Chrome. Open its stable URL, use Chrome’s **Install app** or **Add to Home screen** option, then load it once while online for offline access. On Android Chrome, the installed app and browser share LEXIS storage when using the same browser profile and origin; other browsers or profiles may store progress separately. LEXIS updates preserve its existing storage keys. Audio pronunciation and physical-device behavior still need human review.

## Updating a game

1. Generate and test the standalone release in the separate development repository.
2. Copy only the approved release HTML to the game’s stable public path (for example, `bip/index.html` or `robomorph/index.html`).
3. Audit the public file allowlist and scan for secrets, local paths, and internal material; test the game and progress persistence.
4. Commit only approved distribution files and push to `main`.
5. GitHub Pages publishes from `main`, repository root. Verify the live game after deployment.

Always update the same stable game URL. Preserve browser storage keys and compatible save formats. Never sync development source, documentation, tests, prompts, private project memory, or private Git history into this repository.
