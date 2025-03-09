const renderJson = (obj, replacer) => {
    const objRoot = document.createElement('ul');

    const renderNode = (root, node, key, level) => {
        if (node === null || node === undefined) return;

        const li = document.createElement('li');

        const defaultNode = () => {
            if (typeof node === 'string' || typeof node === 'number') {
                const p = document.createElement('p');

                p.innerHTML = `${key} = ${String(node)}`;

                return p;
            } else if (typeof node === 'object') {
                const nodeRoot = document.createElement('details');

                const summary = document.createElement('summary');
                summary.innerText = key;
                nodeRoot.appendChild(summary);

                const ul = document.createElement('ul');
                Object.keys(node).forEach((key) => {
                    const childNode = node[key];
                    renderNode(ul, childNode, key, level + 1);
                });
                nodeRoot.appendChild(ul);

                return nodeRoot;
            }
        };

        let resultNode;
        if (replacer) {
            resultNode = replacer({
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

.root {
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

const tabSizeAttr = 'tab-size';
const spaceSizeAttr = 'space-size';
const stylesAttr = 'style';

class JsonTree extends HTMLElement {
    static get observedAttributes() {
        return [tabSizeAttr, spaceSizeAttr, stylesAttr];
    }

    #root = null;
    #data;
    #replacer;
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
        if (name === tabSizeAttr) {
            this.#root.style.setProperty('--tab', newValue);
        } else if (name === spaceSizeAttr) {
            this.#root.style.setProperty('--space', newValue);
        } else if (name === stylesAttr) {
            this.styles = newValue;
        }
    }

    get data() {
        return this.#data;
    }

    set data(value) {
        this.#data = value;

        this.#root.innerHTML = '';
        this.#root.appendChild(renderJson(value, this.#replacer));
    }

    set replacer(value) {
        this.#replacer = value;
        this.data = this.#data;
    }

    set styles(value) {
        this.#customStylesRoot.textContent = value;
    }
}

customElements.define('json-tree', JsonTree);
