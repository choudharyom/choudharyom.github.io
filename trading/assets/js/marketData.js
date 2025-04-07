class MarketDataService {
    constructor() {
        this.baseUrl = 'https://finnhub.io/api/v1';
        this.apiKey = 'YOUR_FINNHUB_API_KEY'; // Replace with your Finnhub API key
        this.socket = null;
        this.subscribers = new Map();
    }

    async getStockQuote(symbol) {
        try {
            const response = await fetch(`${this.baseUrl}/quote?symbol=${symbol}&token=${this.apiKey}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching quote:', error);
            throw error;
        }
    }

    async getCandles(symbol, resolution, from, to) {
        try {
            const response = await fetch(
                `${this.baseUrl}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${this.apiKey}`
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching candles:', error);
            throw error;
        }
    }

    async searchSymbol(query) {
        try {
            const response = await fetch(`${this.baseUrl}/search?q=${query}&token=${this.apiKey}`);
            return await response.json();
        } catch (error) {
            console.error('Error searching symbol:', error);
            throw error;
        }
    }

    connectWebSocket(symbols) {
        this.socket = new WebSocket('wss://ws.finnhub.io?token=' + this.apiKey);

        this.socket.addEventListener('open', () => {
            console.log('WebSocket Connected');
            symbols.forEach(symbol => {
                this.socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': symbol }));
            });
        });

        this.socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'trade') {
                this.notifySubscribers(data);
            }
        });

        this.socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    subscribe(symbol, callback) {
        if (!this.subscribers.has(symbol)) {
            this.subscribers.set(symbol, new Set());
        }
        this.subscribers.get(symbol).add(callback);
    }

    unsubscribe(symbol, callback) {
        if (this.subscribers.has(symbol)) {
            this.subscribers.get(symbol).delete(callback);
        }
    }

    notifySubscribers(data) {
        const symbol = data.data[0].s;
        if (this.subscribers.has(symbol)) {
            this.subscribers.get(symbol).forEach(callback => callback(data));
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

// Create a singleton instance
const marketData = new MarketDataService();
export default marketData;