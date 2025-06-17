// src/utils/Counter.js

/**
 * 帧率计数器类
 */
export class FPSCounter {
  constructor(options = {}) {
      // 默认配置
      this.config = {
          container: document.body,
          position: 'top-right',
          updateInterval: 1000, // 更新间隔(ms)
          showGraph: true,
          graphHeight: 50,
          graphWidth: 100,
          graphColor: '#00ff00',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          textColor: '#ffffff',
          fontSize: '14px',
          ...options
      };
      
      // 状态变量
      this.frames = 0;
      this.lastTime = 0;
      this.fps = 0;
      this.minFPS = Infinity;
      this.maxFPS = 0;
      this.history = [];
      this.maxHistory = 60;
      
      // 创建UI
      this.createUI();
      
      // 开始计数
      this.start();
  }
  
  // 创建计数器UI
  createUI() {
      // 创建容器
      this.container = document.createElement('div');
      this.container.style.cssText = `
          position: fixed;
          padding: 8px 12px;
          background: ${this.config.backgroundColor};
          color: ${this.config.textColor};
          font-family: monospace;
          font-size: ${this.config.fontSize};
          z-index: 10000;
          border-radius: 4px;
          user-select: none;
      `;
      
      // 设置位置
      this.setPosition(this.config.position);
      
      // 创建文本显示
      this.textElement = document.createElement('div');
      this.textElement.textContent = 'FPS: 0 (Min: 0, Max: 0)';
      this.container.appendChild(this.textElement);
      
      // 创建图表
      if (this.config.showGraph) {
          this.canvas = document.createElement('canvas');
          this.canvas.width = this.config.graphWidth;
          this.canvas.height = this.config.graphHeight;
          this.canvas.style.display = 'block';
          this.canvas.style.marginTop = '5px';
          this.container.appendChild(this.canvas);
          
          this.ctx = this.canvas.getContext('2d');
      }
      
      // 添加到容器
      this.config.container.appendChild(this.container);
  }
  
  // 设置位置
  setPosition(position) {
      const positions = {
          'top-left': { top: '10px', left: '10px' },
          'top-right': { top: '10px', right: '10px' },
          'bottom-left': { bottom: '10px', left: '10px' },
          'bottom-right': { bottom: '10px', right: '10px' }
      };
      
      if (positions[position]) {
          Object.assign(this.container.style, positions[position]);
      }
  }
  
  // 开始计数器
  start() {
      this.lastTime = performance.now();
      this.animate();
  }
  
  // 动画循环
  animate() {
      requestAnimationFrame(() => this.animate());
      
      // 计数帧数
      this.frames++;
      
      // 计算时间差
      const now = performance.now();
      const delta = now - this.lastTime;
      
      // 定期更新显示
      if (delta >= this.config.updateInterval) {
          // 计算FPS
          this.fps = Math.round((this.frames * 1000) / delta);
          
          // 更新最小/最大FPS
          this.minFPS = Math.min(this.minFPS, this.fps);
          this.maxFPS = Math.max(this.maxFPS, this.fps);
          
          // 更新历史记录
          this.history.push(this.fps);
          if (this.history.length > this.maxHistory) {
              this.history.shift();
          }
          
          // 更新显示
          this.updateDisplay();
          
          // 重置计数器
          this.frames = 0;
          this.lastTime = now;
      }
  }
  
  // 更新显示
  updateDisplay() {
      // 更新文本
      this.textElement.textContent = `FPS: ${this.fps} (Min: ${this.minFPS}, Max: ${this.maxFPS})`;
      
      // 更新图表
      if (this.config.showGraph && this.ctx && this.history.length > 1) {
          const ctx = this.ctx;
          const width = this.canvas.width;
          const height = this.canvas.height;
          
          // 清除画布
          ctx.clearRect(0, 0, width, height);
          
          // 绘制背景
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(0, 0, width, height);
          
          // 绘制图表
          ctx.beginPath();
          ctx.strokeStyle = this.config.graphColor;
          ctx.lineWidth = 2;
          
          const maxValue = Math.max(...this.history, 60);
          const stepX = width / (this.maxHistory - 1);
          
          for (let i = 0; i < this.history.length; i++) {
              const x = i * stepX;
              const y = height - (this.history[i] / maxValue) * height;
              
              if (i === 0) {
                  ctx.moveTo(x, y);
              } else {
                  ctx.lineTo(x, y);
              }
          }
          
          ctx.stroke();
          
          // 绘制参考线 (60 FPS)
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1;
          const refY = height - (60 / maxValue) * height;
          ctx.moveTo(0, refY);
          ctx.lineTo(width, refY);
          ctx.stroke();
          
          // 绘制参考文本
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.font = '10px monospace';
          ctx.fillText('60 FPS', 5, refY - 5);
      }
  }
  
  // 重置计数器
  reset() {
      this.frames = 0;
      this.lastTime = performance.now();
      this.fps = 0;
      this.minFPS = Infinity;
      this.maxFPS = 0;
      this.history = [];
      this.updateDisplay();
  }
  
  // 移除计数器
  destroy() {
      if (this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
      }
  }
}

/**
* 通用计数器类
*/
export class Counter {
  constructor(options = {}) {
      // 默认配置
      this.config = {
          container: document.body,
          position: 'top-left',
          title: 'Counter',
          initialValue: 0,
          step: 1,
          min: -Infinity,
          max: Infinity,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          textColor: '#ffffff',
          fontSize: '14px',
          showControls: true,
          ...options
      };
      
      // 状态变量
      this.value = this.config.initialValue;
      
      // 创建UI
      this.createUI();
  }
  
  // 创建UI
  createUI() {
      // 创建容器
      this.container = document.createElement('div');
      this.container.style.cssText = `
          position: fixed;
          padding: 8px 12px;
          background: ${this.config.backgroundColor};
          color: ${this.config.textColor};
          font-family: monospace;
          font-size: ${this.config.fontSize};
          z-index: 10000;
          border-radius: 4px;
          user-select: none;
          display: flex;
          flex-direction: column;
          gap: 5px;
      `;
      
      // 设置位置
      this.setPosition(this.config.position);
      
      // 创建标题
      this.titleElement = document.createElement('div');
      this.titleElement.textContent = this.config.title;
      this.titleElement.style.fontWeight = 'bold';
      this.container.appendChild(this.titleElement);
      
      // 创建值显示
      this.valueElement = document.createElement('div');
      this.valueElement.textContent = this.value;
      this.container.appendChild(this.valueElement);
      
      // 创建控制按钮
      if (this.config.showControls) {
          const controls = document.createElement('div');
          controls.style.display = 'flex';
          controls.style.gap = '5px';
          
          // 增加按钮
          this.incrementButton = document.createElement('button');
          this.incrementButton.textContent = '+';
          this.incrementButton.addEventListener('click', () => this.increment());
          controls.appendChild(this.incrementButton);
          
          // 减少按钮
          this.decrementButton = document.createElement('button');
          this.decrementButton.textContent = '-';
          this.decrementButton.addEventListener('click', () => this.decrement());
          controls.appendChild(this.decrementButton);
          
          // 重置按钮
          this.resetButton = document.createElement('button');
          this.resetButton.textContent = 'Reset';
          this.resetButton.addEventListener('click', () => this.reset());
          controls.appendChild(this.resetButton);
          
          this.container.appendChild(controls);
      }
      
      // 添加到容器
      this.config.container.appendChild(this.container);
  }
  
  // 设置位置
  setPosition(position) {
      const positions = {
          'top-left': { top: '10px', left: '10px' },
          'top-right': { top: '10px', right: '10px' },
          'bottom-left': { bottom: '10px', left: '10px' },
          'bottom-right': { bottom: '10px', right: '10px' }
      };
      
      if (positions[position]) {
          Object.assign(this.container.style, positions[position]);
      }
  }
  
  // 增加计数
  increment() {
      this.setValue(this.value + this.config.step);
  }
  
  // 减少计数
  decrement() {
      this.setValue(this.value - this.config.step);
  }
  
  // 设置值
  setValue(newValue) {
      this.value = Math.max(this.config.min, Math.min(this.config.max, newValue));
      this.valueElement.textContent = this.value;
  }
  
  // 重置计数器
  reset() {
      this.setValue(this.config.initialValue);
  }
  
  // 获取当前值
  getValue() {
      return this.value;
  }
  
  // 移除计数器
  destroy() {
      if (this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
      }
  }
}

/**
* 时间计数器类
*/
export class Timer {
  constructor(options = {}) {
      // 默认配置
      this.config = {
          container: document.body,
          position: 'top-left',
          initialTime: 0,
          direction: 'up', // 'up' or 'down'
          format: 'mm:ss', // 'hh:mm:ss', 'mm:ss', 'ss'
          updateInterval: 1000, // ms
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          textColor: '#ffffff',
          fontSize: '14px',
          showControls: true,
          ...options
      };
      
      // 状态变量
      this.time = this.config.initialTime;
      this.isRunning = false;
      this.lastUpdate = 0;
      
      // 创建UI
      this.createUI();
  }
  
  // 创建UI
  createUI() {
      // 创建容器
      this.container = document.createElement('div');
      this.container.style.cssText = `
          position: fixed;
          padding: 8px 12px;
          background: ${this.config.backgroundColor};
          color: ${this.config.textColor};
          font-family: monospace;
          font-size: ${this.config.fontSize};
          z-index: 10000;
          border-radius: 4px;
          user-select: none;
          display: flex;
          flex-direction: column;
          gap: 5px;
      `;
      
      // 设置位置
      this.setPosition(this.config.position);
      
      // 创建时间显示
      this.timeElement = document.createElement('div');
      this.timeElement.textContent = this.formatTime(this.time);
      this.container.appendChild(this.timeElement);
      
      // 创建控制按钮
      if (this.config.showControls) {
          const controls = document.createElement('div');
          controls.style.display = 'flex';
          controls.style.gap = '5px';
          
          // 开始/暂停按钮
          this.toggleButton = document.createElement('button');
          this.toggleButton.textContent = 'Start';
          this.toggleButton.addEventListener('click', () => this.toggle());
          controls.appendChild(this.toggleButton);
          
          // 重置按钮
          this.resetButton = document.createElement('button');
          this.resetButton.textContent = 'Reset';
          this.resetButton.addEventListener('click', () => this.reset());
          controls.appendChild(this.resetButton);
          
          this.container.appendChild(controls);
      }
      
      // 添加到容器
      this.config.container.appendChild(this.container);
  }
  
  // 设置位置
  setPosition(position) {
      const positions = {
          'top-left': { top: '10px', left: '10px' },
          'top-right': { top: '10px', right: '10px' },
          'bottom-left': { bottom: '10px', left: '10px' },
          'bottom-right': { bottom: '10px', right: '10px' }
      };
      
      if (positions[position]) {
          Object.assign(this.container.style, positions[position]);
      }
  }
  
  // 开始计时
  start() {
      if (!this.isRunning) {
          this.isRunning = true;
          this.lastUpdate = Date.now();
          this.toggleButton.textContent = 'Pause';
          this.update();
      }
  }
  
  // 暂停计时
  pause() {
      this.isRunning = false;
      this.toggleButton.textContent = 'Resume';
  }
  
  // 切换计时状态
  toggle() {
      if (this.isRunning) {
          this.pause();
      } else {
          this.start();
      }
  }
  
  // 重置计时器
  reset() {
      this.pause();
      this.time = this.config.initialTime;
      this.timeElement.textContent = this.formatTime(this.time);
  }
  
  // 更新时间
  update() {
      if (!this.isRunning) return;
      
      const now = Date.now();
      const delta = now - this.lastUpdate;
      this.lastUpdate = now;
      
      if (this.config.direction === 'up') {
          this.time += delta;
      } else {
          this.time -= delta;
          
          // 检查是否达到0
          if (this.time <= 0) {
              this.time = 0;
              this.pause();
          }
      }
      
      this.timeElement.textContent = this.formatTime(this.time);
      
      // 继续更新
      setTimeout(() => this.update(), this.config.updateInterval);
  }
  
  // 格式化时间
  formatTime(milliseconds) {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const ms = Math.floor((milliseconds % 1000) / 10);
      
      switch (this.config.format) {
          case 'hh:mm:ss':
              return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
          case 'mm:ss':
              return `${this.pad(minutes)}:${this.pad(seconds)}`;
          case 'mm:ss:ms':
              return `${this.pad(minutes)}:${this.pad(seconds)}.${this.pad(ms, 2)}`;
          default: // 'ss'
              return `${this.pad(seconds)}`;
      }
  }
  
  // 数字填充
  pad(number, digits = 2) {
      return number.toString().padStart(digits, '0');
  }
  
  // 获取当前时间
  getTime() {
      return this.time;
  }
  
  // 移除计时器
  destroy() {
      this.pause();
      if (this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
      }
  }
}