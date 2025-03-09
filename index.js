const renderJson = (obj, renderer) => {
    const objRoot = document.createElement('ul');

    const renderNode = (root, node, key, level) => {
        if (node === null || node === undefined) return;

        const li = document.createElement('li');

        const defaultNode = () => {
            if (typeof node === 'object') {
                const nodeRoot = document.createElement('details');

                const summary = document.createElement('summary');
                summary.innerText = `${key}:`;
                nodeRoot.appendChild(summary);

                const ul = document.createElement('ul');
                Object.keys(node).forEach((key) => {
                    const childNode = node[key];
                    renderNode(ul, childNode, key, level + 1);
                });
                nodeRoot.appendChild(ul);

                return nodeRoot;
            }

            const p = document.createElement('p');
            p.innerHTML = `${key} = ${String(node)}`;

            return p;
        };

        let resultNode;
        if (renderer) {
            resultNode = renderer({
                node,
                level,
                defaultNode,
                parentNode: li,
                key,
            });
        } else {
            resultNode = defaultNode();
        }
        li.appendChild(resultNode);

        if (level > 0) {
            li.style.marginLeft = `var(--tab)`;
        }
        root.appendChild(li);
    };

    renderNode(objRoot, obj, 'root', 0);

    return objRoot;
};

const styles = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: monospace;
}

:host { 
    --tab: 16px;
    --space: 8px;
}

li {
    list-style: none;
}

summary {
    cursor: pointer;
    padding: var(--space);
    border-radius: var(--space);
}

summary:hover {
    background-color: #0001;
}

p {
    padding: var(--space);
}

.error {
    color: red;
}
`;

const stylesAttr = 'style';

export class JsonTree extends HTMLElement {
    static get observedAttributes() {
        return [stylesAttr];
    }

    #root = null;
    #data;
    #renderer;
    #customStylesRoot;

    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = styles;

        this.#root = document.createElement('div');
        this.#root.classList.add('root');

        this.#customStylesRoot = document.createElement('style');

        shadow.appendChild(style);
        shadow.appendChild(this.#customStylesRoot);
        shadow.appendChild(this.#root);
    }

    connectedCallback() {
        setTimeout(() => {
            if (!this.innerHTML) return;

            try {
                this.data = JSON.parse(this.innerHTML);
            } catch (e) {
                const p = document.createElement('p');
                p.classList.add('error');
                p.textContent = e.message;

                this.#root.innerHTML = '';
                this.#root.appendChild(p);
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === stylesAttr) {
            this.style = newValue;
        }
    }

    get data() {
        return this.#data;
    }

    set data(value) {
        this.#data = value;

        this.#root.innerHTML = '';
        this.#root.appendChild(renderJson(value, this.#renderer));
    }

    set renderer(value) {
        this.#renderer = value;
        this.data = this.#data;
    }

    set style(value) {
        this.#customStylesRoot.textContent = value;
    }
}

customElements.define('json-tree', JsonTree);
