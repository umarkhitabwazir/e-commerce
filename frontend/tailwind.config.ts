import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bgGray:"#f9fafb",
        'sky':'#2bb0ec',
        'address-form-bg':"#10999d"
      },
          backgroundImage: {
        'seller-form-bg': "url('/seller-req-bg.jpg')",
        
        
      },
    },
  },
  plugins: [],
} satisfies Config;
