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
        'product-bg': "url('/product-bg.jpg')",
        'login-bg': "url('/login-page-bg.jpg')",
        'sign-up-bg': "url('/sign-up-bg.jpg')",
        'order-bg': "url('/order-management-bg.jpg')",
        'profile-bg': "url('/profie-bg.jpg')",
        'shipping-bg': "url('/shipping-bg.jpg')",
        'payment-cashier-bg': "url('/payment-cashier-bg.jpg')",
      },
    },
  },
  plugins: [],
} satisfies Config;
