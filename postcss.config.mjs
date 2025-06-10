const config = {
  plugins: ["@tailwindcss/postcss"],
  //esto es lo nuevo para el tailwindcss
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  }
};

export default config;
