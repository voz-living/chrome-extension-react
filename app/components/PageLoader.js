class VOZLivingLoader {
  constructor() {
    this.isLoading = false;
    this.element = null;
  }

  init() {
    if (!this.element) {
      this.element = document.createElement('div');
      this.element.id = 'voz-living-loader-wrapper';

      const loader = document.createElement('div');
      loader.id = 'voz-living-loader';

      this.element.appendChild(loader);
      document.body.appendChild(this.element);
    }
    return this;
  }

  start() {
    if (this.element) {
      this.element.className = 'loading';
    }
    return this;
  }

  stop() {
    if (this.element) {
      this.element.className = '';
    }
  }
}

module.exports = new VOZLivingLoader();
