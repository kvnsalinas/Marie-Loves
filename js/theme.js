/* Shared Tailwind theme for every page.
 *
 * INVARIANT: this file MUST be the <script> immediately after the
 * https://cdn.tailwindcss.com tag, and MUST NOT have defer / async /
 * type="module". The Play CDN reads `tailwind.config` synchronously; any of
 * those three breaks the ordering and the custom rose/warm/charcoal palette
 * silently falls back to stock Tailwind (looks "slightly off", not broken).
 */
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                'serif': ['Cormorant Garamond', 'serif'],
                'sans': ['Inter', 'sans-serif'],
                'handwriting': ['Caveat', 'cursive'],
            },
            colors: {
                'rose': {
                    50: '#FDF6F6',
                    100: '#FCE8E8',
                    200: '#F8D4D4',
                    300: '#E8B4B8',
                    400: '#D4949A',
                    500: '#C27480',
                    600: '#A85A66',
                    700: '#8A4652',
                },
                'warm': {
                    50: '#FDFBF7',
                    100: '#F8F4ED',
                    200: '#EDE5D8',
                    300: '#D4A574',
                    400: '#C4956A',
                    500: '#B08050',
                },
                'charcoal': {
                    700: '#374151',
                    800: '#2D3436',
                    900: '#1a1a2e',
                }
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
                'scale-in': 'scaleIn 0.6s ease-out forwards',
                'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
                'slide-in-right': 'slideInRight 0.8s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
                'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
                'ken-burns': 'kenBurns 20s ease-in-out infinite alternate',
            }
        }
    }
}
