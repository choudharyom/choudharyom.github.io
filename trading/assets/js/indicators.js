class IndicatorService {
    constructor(chart) {
        this.chart = chart;
        this.activeIndicators = new Map();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.querySelectorAll('.indicator-list li').forEach(item => {
            item.querySelector('.add-indicator-btn').addEventListener('click', () => {
                this.addIndicator(item.dataset.indicator);
            });
        });
    }

    addIndicator(type, params = {}) {
        if (this.activeIndicators.has(type)) {
            return;
        }

        let series;
        switch (type) {
            case 'sma':
                series = this.addSMA(params.period || 20);
                break;
            case 'ema':
                series = this.addEMA(params.period || 20);
                break;
            case 'bollinger':
                series = this.addBollingerBands(params.period || 20, params.stdDev || 2);
                break;
            case 'rsi':
                series = this.addRSI(params.period || 14);
                break;
            case 'macd':
                series = this.addMACD();
                break;
            case 'volume':
                series = this.addVolumeProfile();
                break;
        }

        if (series) {
            this.activeIndicators.set(type, {
                series: series,
                params: params
            });
            this.updateIndicatorsList();
        }
    }

    removeIndicator(type) {
        const indicator = this.activeIndicators.get(type);
        if (indicator) {
            if (Array.isArray(indicator.series)) {
                indicator.series.forEach(s => this.chart.removeSeries(s));
            } else {
                this.chart.removeSeries(indicator.series);
            }
            this.activeIndicators.delete(type);
            this.updateIndicatorsList();
        }
    }

    addSMA(period) {
        const sma = this.chart.addLineSeries({
            color: 'rgba(4, 111, 232, 1)',
            lineWidth: 1,
            title: `SMA ${period}`
        });
        
        const data = chartService.candlestickSeries.getData();
        const smaData = this.calculateSMA(data, period);
        sma.setData(smaData);
        
        return sma;
    }

    addEMA(period) {
        const ema = this.chart.addLineSeries({
            color: 'rgba(255, 182, 193, 1)',
            lineWidth: 1,
            title: `EMA ${period}`
        });
        
        const data = chartService.candlestickSeries.getData();
        const emaData = this.calculateEMA(data, period);
        ema.setData(emaData);
        
        return ema;
    }

    addBollingerBands(period, stdDev) {
        const upper = this.chart.addLineSeries({
            color: 'rgba(38, 166, 154, 0.5)',
            lineWidth: 1,
            title: 'Upper BB'
        });
        
        const middle = this.chart.addLineSeries({
            color: 'rgba(38, 166, 154, 1)',
            lineWidth: 1,
            title: 'Middle BB'
        });
        
        const lower = this.chart.addLineSeries({
            color: 'rgba(38, 166, 154, 0.5)',
            lineWidth: 1,
            title: 'Lower BB'
        });

        const data = chartService.candlestickSeries.getData();
        const bbands = this.calculateBollingerBands(data, period, stdDev);
        
        upper.setData(bbands.upper);
        middle.setData(bbands.middle);
        lower.setData(bbands.lower);

        return [upper, middle, lower];
    }

    addRSI(period) {
        const rsiPane = this.chart.addLineSeries({
            color: 'rgba(4, 111, 232, 1)',
            lineWidth: 1,
            title: `RSI (${period})`,
            priceFormat: {
                type: 'custom',
                minMove: 0.01,
                formatter: (price) => `${price.toFixed(2)}`
            },
            pane: 1,
            scaleMargins: {
                top: 0.1,
                bottom: 0.1
            }
        });

        const data = chartService.candlestickSeries.getData();
        const rsiData = this.calculateRSI(data, period);
        rsiPane.setData(rsiData);

        return rsiPane;
    }

    calculateSMA(data, period) {
        const sma = [];
        for (let i = period - 1; i < data.length; i++) {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            sma.push({
                time: data[i].time,
                value: sum / period
            });
        }
        return sma;
    }

    calculateEMA(data, period) {
        const ema = [];
        const multiplier = 2 / (period + 1);
        let initialSum = 0;

        // Calculate first SMA for initial EMA
        for (let i = 0; i < period; i++) {
            initialSum += data[i].close;
        }
        
        let prevEMA = initialSum / period;
        
        ema.push({
            time: data[period - 1].time,
            value: prevEMA
        });

        // Calculate EMA for remaining points
        for (let i = period; i < data.length; i++) {
            const currentEMA = (data[i].close - prevEMA) * multiplier + prevEMA;
            prevEMA = currentEMA;
            
            ema.push({
                time: data[i].time,
                value: currentEMA
            });
        }

        return ema;
    }

    calculateBollingerBands(data, period, stdDev) {
        const upper = [];
        const middle = [];
        const lower = [];

        for (let i = period - 1; i < data.length; i++) {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            const sma = sum / period;

            let sumSquaredDiff = 0;
            for (let j = 0; j < period; j++) {
                sumSquaredDiff += Math.pow(data[i - j].close - sma, 2);
            }
            const standardDeviation = Math.sqrt(sumSquaredDiff / period);

            const upperBand = sma + (standardDeviation * stdDev);
            const lowerBand = sma - (standardDeviation * stdDev);

            const point = {
                time: data[i].time
            };

            upper.push({ ...point, value: upperBand });
            middle.push({ ...point, value: sma });
            lower.push({ ...point, value: lowerBand });
        }

        return { upper, middle, lower };
    }

    calculateRSI(data, period) {
        const rsi = [];
        let gains = [];
        let losses = [];

        // Calculate price changes and initial gains/losses
        for (let i = 1; i < data.length; i++) {
            const change = data[i].close - data[i - 1].close;
            gains.push(Math.max(0, change));
            losses.push(Math.max(0, -change));

            if (i >= period) {
                const avgGain = gains.slice(-period).reduce((a, b) => a + b) / period;
                const avgLoss = losses.slice(-period).reduce((a, b) => a + b) / period;
                const rs = avgGain / avgLoss;
                const rsiValue = 100 - (100 / (1 + rs));

                rsi.push({
                    time: data[i].time,
                    value: rsiValue
                });
            }
        }

        return rsi;
    }

    updateIndicatorsList() {
        const list = document.getElementById('indicatorsList');
        list.innerHTML = '';

        this.activeIndicators.forEach((indicator, type) => {
            const item = document.createElement('li');
            item.className = 'applied-indicator';
            item.innerHTML = `
                <span>${type.toUpperCase()}</span>
                <button class="remove-indicator" data-type="${type}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            list.appendChild(item);

            item.querySelector('.remove-indicator').addEventListener('click', () => {
                this.removeIndicator(type);
            });
        });
    }
}

// Wait for chartService to be available
document.addEventListener('DOMContentLoaded', () => {
    const indicatorService = new IndicatorService(chartService.chart);
    window.indicatorService = indicatorService; // Make it globally available
});