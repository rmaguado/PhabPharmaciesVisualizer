# Project Outline

## DataHandler

A python backend using FastAPI and SQLite to manage the purchase history data and handle request from the data visualizer.

## PhabNetworkVisualizer

A React App for visualizing the purchase history data.

Created using Vite

```
npm create vite@latest
    name: phabnetworkvisualizer
    framework: React
    variant: TypeScript

cd phabnetworkvisualizer
npm i
```

Then configure [tailwind](https://tailwindcss.com/docs/guides/vite) for vite.

```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Install axios for handling http requests

```
npm install axios
```

https://fastapi.tiangolo.com/tutorial/first-steps/

https://docs.pydantic.dev/latest/
