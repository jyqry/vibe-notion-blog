/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)",
        primary: "hsl(221.2 83.2% 53.3%)",
        "primary-foreground": "hsl(210 40% 98%)",
        secondary: "hsl(210 40% 96%)",
        "secondary-foreground": "hsl(222.2 84% 4.9%)",
        muted: "hsl(210 40% 96%)",
        "muted-foreground": "hsl(215.4 16.3% 46.9%)",
        border: "hsl(214.3 31.8% 91.4%)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#374151",
            a: {
              color: "#3b82f6",
              "&:hover": {
                color: "#1d4ed8",
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
