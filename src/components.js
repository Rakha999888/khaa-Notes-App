// Custom Elements
class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    background-color: var(--primary-color);
                    color: white;
                    padding: 20px;
                    text-align: center;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 15px;
                }
                
                h1 {
                    font-size: 2rem;
                    font-weight: 500;
                    margin: 0;
                }
                
                .header-icon {
                    font-size: 1.8rem;
                }
            </style>
            <header>
                <i class="fas fa-book-open header-icon"></i>
                <h1>Notes App</h1>
            </header>
        `;
    }
}

customElements.define('app-header', AppHeader);

class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .form-group {
                    margin-bottom: 15px;
                }
                
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: var(--dark-color);
                }
                
                input[type="text"],
                textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
                    transition: border 0.3s;
                }
                
                input[type="text"]:focus,
                textarea:focus {
                    outline: none;
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
                }
                
                textarea {
                    min-height: 120px;
                    resize: vertical;
                }
                
                button {
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                
                button:hover {
                    background-color: var(--secondary-color);
                }
                
                .error-message {
                    color: var(--error-color);
                    font-size: 14px;
                    margin-top: 5px;
                    display: none;
                }
                
                .invalid {
                    border-color: var(--error-color);
                }
                
                .form-icon {
                    color: var(--primary-color);
                    width: 20px;
                }
            </style>
            <form id="noteForm">
                <div class="form-group">
                    <label for="title">
                        <i class="fas fa-heading form-icon"></i>Title
                    </label>
                    <input type="text" id="title" name="title" required minlength="3" maxlength="50">
                    <div class="error-message" id="titleError">Title must be between 3 and 50 characters</div>
                </div>
                <div class="form-group">
                    <label for="body">
                        <i class="fas fa-align-left form-icon"></i>Note Content
                    </label>
                    <textarea id="body" name="body" required minlength="10"></textarea>
                    <div class="error-message" id="bodyError">Note content must be at least 10 characters</div>
                </div>
                <button type="submit">
                    <i class="fas fa-plus-circle"></i> Add Note
                </button>
            </form>
        `;
    }
    
    connectedCallback() {
        this.shadowRoot.getElementById('noteForm').addEventListener('submit', this.handleSubmit.bind(this));
        
        // Realtime validation
        const titleInput = this.shadowRoot.getElementById('title');
        const bodyInput = this.shadowRoot.getElementById('body');
        
        titleInput.addEventListener('input', () => this.validateInput(titleInput, 'titleError', 3, 50));
        bodyInput.addEventListener('input', () => this.validateInput(bodyInput, 'bodyError', 10));
    }
    
    validateInput(input, errorId, minLength, maxLength = Infinity) {
        const errorElement = this.shadowRoot.getElementById(errorId);
        const value = input.value.trim();
        
        if (value.length < minLength || value.length > maxLength) {
            input.classList.add('invalid');
            errorElement.style.display = 'block';
            return false;
        } else {
            input.classList.remove('invalid');
            errorElement.style.display = 'none';
            return true;
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const titleInput = this.shadowRoot.getElementById('title');
        const bodyInput = this.shadowRoot.getElementById('body');
        
        const isTitleValid = this.validateInput(titleInput, 'titleError', 3, 50);
        const isBodyValid = this.validateInput(bodyInput, 'bodyError', 10);
        
        if (isTitleValid && isBodyValid) {
            const newNote = {
                id: `notes-${Math.random().toString(36).substr(2, 9)}`,
                title: titleInput.value.trim(),
                body: bodyInput.value.trim(),
                createdAt: new Date().toISOString(),
                archived: false
            };
            
            // Dispatch custom event with the new note data
            this.dispatchEvent(new CustomEvent('note-added', {
                detail: newNote,
                bubbles: true,
                composed: true
            }));
            
            // Reset form
            this.shadowRoot.getElementById('noteForm').reset();
        }
    }
}

customElements.define('note-form', NoteForm);

class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    static get observedAttributes() {
        return ['title', 'body', 'created', 'archived'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }
    
    connectedCallback() {
        this.render();
    }
    
    render() {
        const title = this.getAttribute('title') || '';
        const body = this.getAttribute('body') || '';
        const created = this.getAttribute('created') || '';
        const archived = this.getAttribute('archived') === 'true';
        
        this.shadowRoot.innerHTML = `
            <style>
                .note-card {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border-left: 4px solid ${archived ? 'var(--archive-color)' : 'var(--primary-color)'};
                }
                
                .note-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                .note-title {
                    font-size: 1.2rem;
                    margin-bottom: 10px;
                    color: ${archived ? 'var(--archive-color)' : 'var(--primary-color)'};
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .note-body {
                    flex-grow: 1;
                    margin-bottom: 15px;
                    color: var(--dark-color);
                }
                
                .note-date {
                    font-size: 0.8rem;
                    color: #666;
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .note-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 15px;
                }
                
                .action-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 0.9rem;
                    padding: 5px 10px;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .action-btn:hover {
                    background-color: rgba(72, 149, 239, 0.1);
                }
                
                .archive-btn {
                    color: ${archived ? 'var(--success-color)' : 'var(--accent-color)'};
                }
                
                .delete-btn {
                    color: var(--error-color);
                }
                
                .delete-btn:hover {
                    background-color: rgba(255, 51, 51, 0.1);
                }
                
                .restore-btn {
                    color: var(--success-color);
                }
            </style>
            <div class="note-card">
                <h3 class="note-title">
                    <i class="fas ${archived ? 'fa-archive' : 'fa-sticky-note'}"></i> ${title}
                </h3>
                <p class="note-body">${body}</p>
                <p class="note-date">
                    <i class="far fa-calendar-alt"></i> ${new Date(created).toLocaleString()}
                </p>
                <div class="note-actions">
                    ${archived ? 
                        `<button class="action-btn restore-btn">
                            <i class="fas fa-undo"></i> Restore
                        </button>` : 
                        `<button class="action-btn archive-btn">
                            <i class="fas fa-archive"></i> Archive
                        </button>`
                    }
                    <button class="action-btn delete-btn">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners for buttons
        if (archived) {
            this.shadowRoot.querySelector('.restore-btn').addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('restore-note', {
                    bubbles: true,
                    composed: true
                }));
            });
        } else {
            this.shadowRoot.querySelector('.archive-btn').addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('archive-note', {
                    bubbles: true,
                    composed: true
                }));
            });
        }
        
        this.shadowRoot.querySelector('.delete-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('delete-note', {
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define('note-item', NoteItem);