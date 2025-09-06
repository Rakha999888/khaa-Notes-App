class LoadingSpinner extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          .spinner {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }
          .loader {
            border: 5px solid #f3f3f3;
            border-top: 5px solid var(--primary-color);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
        <div class="spinner">
          <div class="loader"></div>
        </div>
      `;
    }
  }
  customElements.define('loading-spinner', LoadingSpinner);
  