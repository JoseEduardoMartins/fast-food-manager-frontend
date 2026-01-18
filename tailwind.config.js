/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
          border: 'var(--border)',
          input: 'var(--input)',
          background: 'var(--background)',
          foreground: 'var(--foreground)',
          'scrollbar-track': 'var(--scrollbar-track)',
          'scrollbar-thumb': 'var(--scrollbar-thumb)',
          gray: {
            50: 'var(--gray-50)',
            100: 'var(--gray-100)',
            200: 'var(--gray-200)',
            300: 'var(--gray-300)',
            400: 'var(--gray-400)',
            500: 'var(--gray-500)',
            600: 'var(--gray-600)',
            700: 'var(--gray-700)',
            800: 'var(--gray-800)',
            900: 'var(--gray-900)',
            1000: 'var(--gray-1000)'
          },
          primary: 'var(--primary)',
          'primary-hover': 'var(--primary-hover)',
          secondary: 'var(--secondary)',
          'secondary-hover': 'var(--secondary-hover)',
          success: 'var(--success)',
          'success-hover': 'var(--success-hover)',
          error: 'var(--error)',
          'error-hover': 'var(--error-hover)',
          warning: 'var(--warning)',
          'warning-hover': 'var(--warning-hover)',
          info: 'var(--info)',
          'info-hover': 'var(--info-hover)'
        },
        spacing: {
          0: 'var(--space-0)',
          1: 'var(--space-1)',
          2: 'var(--space-2)',
          3: 'var(--space-3)',
          4: 'var(--space-4)',
          5: 'var(--space-5)',
          6: 'var(--space-6)',
          8: 'var(--space-8)',
          10: 'var(--space-10)',
          12: 'var(--space-12)',
          16: 'var(--space-16)',
          20: 'var(--space-20)',
          24: 'var(--space-24)',
          32: 'var(--space-32)'
        },
        fontFamily: {
          sans: ['var(--font-family-sans)'],
          mono: ['var(--font-family-mono)']
        },
        fontSize: {
          xs: 'var(--font-size-xs)',
          sm: 'var(--font-size-sm)',
          md: 'var(--font-size-md)',
          lg: 'var(--font-size-lg)',
          xl: 'var(--font-size-xl)',
          '2xl': 'var(--font-size-2xl)',
          '3xl': 'var(--font-size-3xl)'
        },
        fontWeight: {
          regular: 'var(--font-weight-regular)',
          medium: 'var(--font-weight-medium)',
          bold: 'var(--font-weight-bold)'
        },
        lineHeight: {
          xs: 'var(--line-height-xs)',
          sm: 'var(--line-height-sm)',
          md: 'var(--line-height-md)',
          lg: 'var(--line-height-lg)'
        }
      },
  },
  plugins: [],
}
