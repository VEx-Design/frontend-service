import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        C1: "#252422",
        O1: "#EB5E28",
        Btn: "#3A86FF",
        HV: "#C4C4C4",
        B1: "#F1F0EA",
        B2: "#CCC5B9",
        G1: "#A7C957",
        M1: "#FFFCF2",
      },
      fontSize: {
        H1: ["64px", "75px"],
        H2: ["36px", "40px"],
        H3: ["24px", "30px"],
        H4: ["18px", "20px"],
        H5: ["16px", "20px"],
      },
      fontFamily: {
        lexend: ['Lexend', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
