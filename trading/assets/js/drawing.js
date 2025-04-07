class DrawingService {
    constructor(chart) {
        this.chart = chart;
        this.currentTool = null;
        this.drawingState = {
            isDrawing: false,
            startPoint: null,
            currentLine: null,
            color: '#1E88E5',
            lineWidth: 2
        };
        this.drawings = new Map();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Drawing tool selection
        document.querySelectorAll('.drawing-tool').forEach(button => {
            button.addEventListener('click', (e) => {
                this.selectTool(e.currentTarget.dataset.tool);
            });
        });

        // Color picker
        const colorPicker = document.getElementById('drawingColor');
        colorPicker.addEventListener('change', (e) => {
            this.drawingState.color = e.target.value;
        });

        // Line width
        const lineWidth = document.getElementById('lineWidth');
        lineWidth.addEventListener('input', (e) => {
            this.drawingState.lineWidth = parseInt(e.target.value);
        });

        // Clear drawings
        document.getElementById('clearDrawings').addEventListener('click', () => {
            this.clearAllDrawings();
        });

        // Chart container mouse events
        const chartContainer = document.querySelector('.chart-wrapper');
        chartContainer.addEventListener('mousedown', this.handleMouseDown.bind(this));
        chartContainer.addEventListener('mousemove', this.handleMouseMove.bind(this));
        chartContainer.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    selectTool(tool) {
        document.querySelectorAll('.drawing-tool').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tool="${tool}"]`).classList.add('active');
        this.currentTool = tool;
    }

    handleMouseDown(e) {
        if (!this.currentTool) return;

        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const coords = this.chart.timeScale().coordinateToTime(x);

        this.drawingState.isDrawing = true;
        this.drawingState.startPoint = { x: coords, y: this.chart.priceScale().coordinateToPrice(y) };

        switch (this.currentTool) {
            case 'line':
            case 'horizontalLine':
            case 'verticalLine':
                this.startLineDraw();
                break;
            case 'rectangle':
                this.startRectangleDraw();
                break;
            case 'fibonacci':
                this.startFibonacciDraw();
                break;
            case 'text':
                this.addText(coords, y);
                break;
        }
    }

    handleMouseMove(e) {
        if (!this.drawingState.isDrawing) return;

        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const coords = this.chart.timeScale().coordinateToTime(x);

        switch (this.currentTool) {
            case 'line':
                this.updateLineDraw(coords, this.chart.priceScale().coordinateToPrice(y));
                break;
            case 'horizontalLine':
                this.updateLineDraw(coords, this.drawingState.startPoint.y);
                break;
            case 'verticalLine':
                this.updateLineDraw(this.drawingState.startPoint.x, this.chart.priceScale().coordinateToPrice(y));
                break;
            case 'rectangle':
                this.updateRectangleDraw(coords, this.chart.priceScale().coordinateToPrice(y));
                break;
            case 'fibonacci':
                this.updateFibonacciDraw(coords, this.chart.priceScale().coordinateToPrice(y));
                break;
        }
    }

    handleMouseUp() {
        if (!this.drawingState.isDrawing) return;
        
        this.drawingState.isDrawing = false;
        this.drawingState.startPoint = null;
        this.currentLine = null;
    }

    startLineDraw() {
        this.drawingState.currentLine = this.chart.addLineSeries({
            color: this.drawingState.color,
            lineWidth: this.drawingState.lineWidth,
            lastPriceAnimation: 0
        });
        this.drawings.set(this.drawingState.currentLine, 'line');
    }

    updateLineDraw(x, y) {
        if (!this.drawingState.currentLine) return;

        this.drawingState.currentLine.setData([
            { time: this.drawingState.startPoint.x, value: this.drawingState.startPoint.y },
            { time: x, value: y }
        ]);
    }

    startRectangleDraw() {
        this.drawingState.currentRect = {
            top: this.chart.addLineSeries({ color: this.drawingState.color, lineWidth: this.drawingState.lineWidth }),
            right: this.chart.addLineSeries({ color: this.drawingState.color, lineWidth: this.drawingState.lineWidth }),
            bottom: this.chart.addLineSeries({ color: this.drawingState.color, lineWidth: this.drawingState.lineWidth }),
            left: this.chart.addLineSeries({ color: this.drawingState.color, lineWidth: this.drawingState.lineWidth })
        };
    }

    updateRectangleDraw(x, y) {
        if (!this.drawingState.currentRect) return;

        const { top, right, bottom, left } = this.drawingState.currentRect;
        const startX = this.drawingState.startPoint.x;
        const startY = this.drawingState.startPoint.y;

        top.setData([
            { time: startX, value: startY },
            { time: x, value: startY }
        ]);

        right.setData([
            { time: x, value: startY },
            { time: x, value: y }
        ]);

        bottom.setData([
            { time: x, value: y },
            { time: startX, value: y }
        ]);

        left.setData([
            { time: startX, value: y },
            { time: startX, value: startY }
        ]);
    }

    startFibonacciDraw() {
        const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
        this.drawingState.currentFib = fibLevels.map(level => ({
            level,
            series: this.chart.addLineSeries({
                color: this.drawingState.color,
                lineWidth: 1,
                lastPriceAnimation: 0
            })
        }));
    }

    updateFibonacciDraw(x, y) {
        if (!this.drawingState.currentFib) return;

        const startY = this.drawingState.startPoint.y;
        const diff = y - startY;

        this.drawingState.currentFib.forEach(({ level, series }) => {
            const levelY = startY + (diff * level);
            series.setData([
                { time: this.drawingState.startPoint.x, value: levelY },
                { time: x, value: levelY }
            ]);
        });
    }

    addText(x, y) {
        const text = prompt('Enter text:', '');
        if (!text) return;

        const textSeries = this.chart.addLineSeries({
            color: this.drawingState.color,
            lastPriceAnimation: 0
        });

        textSeries.setMarkers([{
            time: x,
            position: 'aboveBar',
            color: this.drawingState.color,
            shape: 'text',
            text: text
        }]);

        this.drawings.set(textSeries, 'text');
    }

    clearAllDrawings() {
        this.drawings.forEach((type, series) => {
            if (Array.isArray(series)) {
                series.forEach(s => this.chart.removeSeries(s));
            } else {
                this.chart.removeSeries(series);
            }
        });
        this.drawings.clear();
    }
}

// Initialize drawing service when chart is ready
document.addEventListener('DOMContentLoaded', () => {
    const drawingService = new DrawingService(chartService.chart);
    window.drawingService = drawingService; // Make it globally available
});