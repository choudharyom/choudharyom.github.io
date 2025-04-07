class App {
    constructor() {
        this.initializeTheme();
        this.initializeEventListeners();
        this.initializeMarketOverview();
    }

    initializeTheme() {
        const isDarkMode = localStorage.getItem('darkMode') !== 'false';
        document.body.classList.toggle('theme-dark', isDarkMode);
        document.getElementById('darkMode').checked = isDarkMode;
    }

    initializeEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            document.body.classList.toggle('theme-dark');
            localStorage.setItem('darkMode', document.body.classList.contains('theme-dark'));
        });

        // Dark mode setting
        document.getElementById('darkMode').addEventListener('change', (e) => {
            document.body.classList.toggle('theme-dark', e.target.checked);
            localStorage.setItem('darkMode', e.target.checked);
        });

        // Symbol search
        const searchInput = document.getElementById('symbolSearch');
        const searchResults = document.getElementById('searchResults');
        
        searchInput.addEventListener('input', debounce(async (e) => {
            if (e.target.value.length < 2) {
                searchResults.innerHTML = '';
                return;
            }

            try {
                const results = await marketData.searchSymbol(e.target.value);
                this.renderSearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
            }
        }, 300));

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.symbol-search')) {
                searchResults.innerHTML = '';
            }
        });

        // Fullscreen button
        document.getElementById('fullscreenBtn').addEventListener('click', () => {
            const chartContainer = document.querySelector('.chart-wrapper');
            if (!document.fullscreenElement) {
                chartContainer.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });

        // Screenshot button
        document.getElementById('screenshotBtn').addEventListener('click', () => {
            const chart = document.getElementById('chart');
            html2canvas(chart).then(canvas => {
                const link = document.createElement('a');
                link.download = 'chart-screenshot.png';
                link.href = canvas.toDataURL();
                link.click();
            });
        });

        // Bottom panel tabs
        document.querySelectorAll('.panel-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelector('.panel-tab.active').classList.remove('active');
                tab.classList.add('active');
                
                document.querySelector('.panel-item.active').classList.remove('active');
                document.getElementById(`${tab.dataset.panel}Panel`).classList.add('active');
            });
        });
    }

    renderSearchResults(results) {
        const container = document.getElementById('searchResults');
        container.innerHTML = '';

        if (!results.count) {
            container.innerHTML = '<div class="no-results">No results found</div>';
            return;
        }

        results.result.slice(0, 5).forEach(item => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `
                <div class="symbol">${item.symbol}</div>
                <div class="description">${item.description}</div>
            `;

            div.addEventListener('click', () => {
                chartService.loadData(item.symbol);
                document.getElementById('symbolSearch').value = '';
                container.innerHTML = '';
            });

            container.appendChild(div);
        });
    }

    async initializeMarketOverview() {
        const majorIndices = ['^GSPC', '^DJI', '^IXIC', '^FTSE'];
        const mostActive = ['AAPL', 'MSFT', 'TSLA', 'AMZN'];
        const crypto = ['BTCUSD', 'ETHUSD', 'BNBUSD'];

        await this.updateMarketSection('majorIndices', majorIndices);
        await this.updateMarketSection('mostActive', mostActive);
        await this.updateMarketSection('cryptoMarket', crypto);

        // Update market overview every minute
        setInterval(() => {
            this.updateMarketSection('majorIndices', majorIndices);
            this.updateMarketSection('mostActive', mostActive);
            this.updateMarketSection('cryptoMarket', crypto);
        }, 60000);
    }

    async updateMarketSection(sectionId, symbols) {
        const container = document.getElementById(sectionId);
        
        for (const symbol of symbols) {
            try {
                const quote = await marketData.getStockQuote(symbol);
                const priceChange = quote.c - quote.pc;
                const percentChange = (priceChange / quote.pc) * 100;

                let existingItem = container.querySelector(`[data-symbol="${symbol}"]`);
                
                if (!existingItem) {
                    existingItem = document.createElement('div');
                    existingItem.className = 'market-item';
                    existingItem.dataset.symbol = symbol;
                    container.appendChild(existingItem);
                }

                existingItem.innerHTML = `
                    <div class="symbol">${symbol}</div>
                    <div class="price">${formatPrice(quote.c)}</div>
                    <div class="change ${priceChange >= 0 ? 'positive' : 'negative'}">
                        ${formatPercentage(percentChange)}
                    </div>
                `;

                existingItem.addEventListener('click', () => {
                    chartService.loadData(symbol);
                });
            } catch (error) {
                console.error(`Error updating ${symbol}:`, error);
            }
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    window.app = app; // Make it globally available
});