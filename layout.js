// Layout and theme management
class LayoutManager {
    constructor() {
        this.container = document.querySelector('.theme-container');
        this.initializeLayoutControls();
        this.initializeThemeControls();
    }

    initializeLayoutControls() {
        const layoutOptions = document.querySelectorAll('.layout-option');
        layoutOptions.forEach(option => {
            option.addEventListener('click', () => {
                const layout = option.dataset.layout;
                this.setLayout(layout);
                this.updateActiveLayout(option, layoutOptions);
            });
        });
    }

    initializeThemeControls() {
        const themeOptions = document.querySelectorAll('.color-swatch');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.setTheme(theme);
                this.updateActiveTheme(option, themeOptions);
            });
        });
    }

    setLayout(layout) {
        if (this.container) {
            // Remove existing layout classes
            this.container.classList.remove(
                'layout-single-column',
                'layout-two-column',
                'layout-sidebar'
            );
            // Add new layout class
            this.container.classList.add(`layout-${layout}`);
            // Save preference
            localStorage.setItem('preferred-layout', layout);
        }
    }

    setTheme(theme) {
        if (this.container) {
            // Remove existing theme classes
            this.container.classList.remove(
                'theme-blue',
                'theme-pink',
                'theme-mint',
                'theme-lavender'
            );
            // Add new theme class
            this.container.classList.add(`theme-${theme}`);
            // Save preference
            localStorage.setItem('preferred-theme', theme);
        }
    }

    updateActiveLayout(selectedOption, allOptions) {
        allOptions.forEach(opt => opt.classList.remove('active'));
        selectedOption.classList.add('active');
    }

    updateActiveTheme(selectedOption, allOptions) {
        allOptions.forEach(opt => opt.classList.remove('active'));
        selectedOption.classList.add('active');
    }

    loadSavedPreferences() {
        const savedLayout = localStorage.getItem('preferred-layout');
        const savedTheme = localStorage.getItem('preferred-theme');

        if (savedLayout) {
            const layoutOption = document.querySelector(`[data-layout="${savedLayout}"]`);
            if (layoutOption) {
                this.setLayout(savedLayout);
                this.updateActiveLayout(layoutOption, document.querySelectorAll('.layout-option'));
            }
        }

        if (savedTheme) {
            const themeOption = document.querySelector(`[data-theme="${savedTheme}"]`);
            if (themeOption) {
                this.setTheme(savedTheme);
                this.updateActiveTheme(themeOption, document.querySelectorAll('.color-swatch'));
            }
        }
    }

    // Initialize responsive behavior
    initializeResponsive() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const sidebar = document.querySelector('.sidebar');

        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('hidden');
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && sidebar) {
                sidebar.classList.remove('hidden');
            }
        });
    }
}

// Initialize layout manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const layoutManager = new LayoutManager();
    layoutManager.loadSavedPreferences();
    layoutManager.initializeResponsive();
});

