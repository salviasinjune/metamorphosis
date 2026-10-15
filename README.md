# Metamorphosis portfolio

A one-page portfolio. As you scroll, a line-drawn caterpillar becomes a chrysalis, then a butterfly, and the page shifts from black to white (or white to black with the "Reverse colors" button).

Built with React and Vite. The finished site is plain files that GitHub Pages can host for free.

## Change the text

All the words live in four small files in `src/content/`. You never need to touch the design code to update them.

- `site.js`: your name, tagline, About text, email and links
- `projects.js`: your projects (the Arknights Event Calendar is already in)
- `coursework.js`: your classes
- `resume.js`: education, skills and experience

Anything marked `PLACEHOLDER` is sample text to replace. To add a project or class, copy one block, paste it below, and edit the words. It shows up on the page by itself.

## Try it on your computer

You need Node.js installed. Then, in this folder:

```
npm install
npm run dev
```

Open the address it prints. The page updates as you save changes.

## Put it on GitHub Pages

1. Create a new repository on GitHub and push this folder to it. Use the `main` branch.
2. In the repository, open Settings, then Pages, and set the source to **GitHub Actions**.
3. Push again (or open the Actions tab and run "Deploy to GitHub Pages").

After a minute or two the site is live at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`. Every push to `main` after that updates it automatically. If you name the repository `YOUR-USERNAME.github.io`, the site lives at `https://YOUR-USERNAME.github.io/` instead.

## Where things are

- `src/components/Creature.jsx`: the caterpillar, chrysalis and butterfly drawings
- `src/hooks/useMetamorphosis.js`: turns scrolling into the animation, and controls when the colors change
- `src/styles.css`: layout, type and spacing
- `src/App.jsx`: the page sections

The stages follow the sections: the caterpillar for the top and About, the chrysalis for Projects and Coursework, the butterfly for Résumé and Contact. The colors change while the butterfly emerges.

People who have "reduce motion" turned on in their device settings get the same stages without the smoothing, crawling and wing flapping.
