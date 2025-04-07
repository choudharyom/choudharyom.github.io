class WatchlistService {
    constructor() {
        this.watchlists = new Map();
        this.currentWatchlist = 'default';
        this.initializeWatchlists();
        this.initializeEventListeners();
    }

    initializeWatchlists() {
        // Load watchlists from localStorage or create default ones
        const savedWatchlists = JSON.parse(localStorage.getItem('watchlists')) || {
            default: ['AAPL', 'MSFT', 'GOOGL', 'AMZN'],
            crypto: ['BTCUSD', 'ETHUSD', 'BNBUSD'],
            forex: ['EURUSD', 'GBPUSD', 'USDJPY']
        };

        Object.entries(savedWatchlists).forEach(([name, symbols]) => {
            this.watchlists.set(name, symbols);
        });

        this.renderWatchlist();
    }

    initializeEventListeners() {
        // Watchlist selector change
        document.getElementById('watchlistSelect').addEventListener('change', (e) => {
            this.currentWatchlist = e.target.value;
            this.renderWatchlist();
        });

        // Add to watchlist button
        document.getElementById('addWatchlistBtn').addEventListener('click', () => {
            const symbol = prompt('Enter symbol to add:');
            if (symbol) {
                this.addSymbol(symbol.toUpperCase());
            }
        });

        // Symbol click in watchlist
        document.getElementById('watchlistItems').addEventListener('click', (e) => {
            if (e.target.closest('.watchlist-item')) {
                const symbol = e.target.closest('.watchlist-item').dataset.symbol;
                chartService.loadData(symbol);
            }
        });
    }

    addSymbol(symbol) {
        if (!this.watchlists.get(this.currentWatchlist).includes(symbol)) {
            this.watchlists.get(this.currentWatchlist).push(symbol);
            this.saveWatchlists();
            this.renderWatchlist();
            this.subscribeToSymbol(symbol);
        }
    }

    removeSymbol(symbol) {
        const symbols = this.watchlists.get(this.currentWatchlist);
        const index = symbols.indexOf(symbol);
        if (index > -1) {
            symbols.splice(index, 1);
            this.saveWatchlists();
            this.renderWatchlist();
        }
    }

    async renderWatchlist() {
        const container = document.getElementById('watchlistItems');
        container.innerHTML = '';

        const symbols = this.watchlists.get(this.currentWatchlist) || [];
        
        for (const symbol of symbols) {
            try {
                const quote = await marketData.getStockQuote(symbol);
                const priceChange = quote.c - quote.pc;
                const percentChange = (priceChange / quote.pc) * 100;
                
                const itemDiv = document.createElement('div');
                itemDiv.className = 'watchlist-item';
                itemDiv.dataset.symbol = symbol;
                
                itemDiv.innerHTML = `
                    <div class="col symbol">${symbol}</div>
                    <div class="col price">${formatPrice(quote.c)}</div>
                    <div class="col change ${priceChange >= 0 ? 'positive' : 'negative'}">
                        ${formatPercentage(percentChange)}
                    </div>
                    <button class="remove-symbol" data-symbol="${symbol}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                container.appendChild(itemDiv);

                // Add remove button listener
                itemDiv.querySelector('.remove-symbol').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeSymbol(symbol);
                });
            } catch (error) {
                console.error(`Error fetching quote for ${symbol}:`, error);
            }
        }
    }

    subscribeToSymbol(symbol) {
        marketData.subscribe(symbol, (data) => {
            this.updateSymbolPrice(symbol, data);
        });
    }

    updateSymbolPrice(symbol, data) {
        const itemDiv = document.querySelector(`.watchlist-item[data-symbol="${symbol}"]`);
        if (!itemDiv) return;

        const price = data.data[0].p;
        const previousPrice = parseFloat(itemDiv.querySelector('.price').textContent.replace('$', ''));
        const priceChange = price - previousPrice;
        const percentChange = (priceChange / previousPrice) * 100;

        itemDiv.querySelector('.price').textContent = formatPrice(price);
        const changeDiv = itemDiv.querySelector('.change');
        changeDiv.textContent = formatPercentage(percentChange);
        changeDiv.className = `col change ${percentChange >= 0 ? 'positive' : 'negative'}`;
    }

    saveWatchlists() {
        const watchlistsObj = {};
        this.watchlists.forEach((symbols, name) => {
            watchlistsObj[name] = symbols;
        });
        localStorage.setItem('watchlists', JSON.stringify(watchlistsObj));
    }
}

// Initialize watchlist service
document.addEventListener('DOMContentLoaded', () => {
    const watchlistService = new WatchlistService();
    window.watchlistService = watchlistService; // Make it globally available
});