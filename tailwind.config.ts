import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
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
      editbar: {
        DEFAULT: "#fff",
        foreground: "#D4D4D8", // Text color
        primary: "#A78BFA", // Primary accent
        "primary-foreground": "#F9FAFB", // Primary text
        accent: "#60A5FA", // Accent color
        "accent-foreground": "#EFF6FF", // Accent text
        border: "#CCC5B9", // Border color
      },
      fontSize: {
        H1: ["64px", "75px"],
        H2: ["36px", "40px"],
        H3: ["24px", "30px"],
        H4: ["18px", "20px"],
        H5: ["16px", "20px"],
      },
      fontFamily: {
        lexend: ["Lexend", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
