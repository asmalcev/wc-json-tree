# Web Component JsonTree

<a href="https://pkg-size.dev/@asmalcev/wc-json-tree"><img src="https://pkg-size.dev/badge/install/8004" title="Install size for @asmalcev/wc-json-tree"></a> <a href="https://pkg-size.dev/@asmalcev/wc-json-tree"><img src="https://pkg-size.dev/badge/bundle/2348" title="Bundle size for @asmalcev/wc-json-tree"></a>

A small web component for rendering json in the form of a tree

## Reference
| Attribute | Purpose                           | Example values     |
| --------- | --------------------------------- | ------------------ |
| `style`   | Pass custom styles into component | `p { color: red }` |


| Property   | Purpose                            | Example value                         |
| ---------- | ---------------------------------- | ------------------------------------- |
| `data`     | Pass data into component           | `{ a: 1, b: 2, c: { c1: 3, c2: 4 } }` |
| `style`    | Pass custom styles into component  | `p { color: red }`                    |
| `replacer` | Replace any default node rendering | `({ defaultNode }) => defaultNode()`  |

| CSS Property | Purpose                                          | Example value |
| ------------ | ------------------------------------------------ | ------------- |
| `--tab`      | Indentation from the left edge to create nesting | `10px`, `5%`  |
| `--space`    | Padding of rows                                  | `10px`, `5%`  |

### `replacer`

Props:
- `key: string` — name of key from passed object
- `node: any` — value of node from passed object
- `level: number` — level of nesting
- `defaultNode: function` — function, that returns default node
- `parentNode: HTMLLiElement` — parent inside which the node will be rendered

Returns:
- `HTMLElement` — node to render

## Examples

### Valid JSON as child

```html
<json-tree>{ "a": 1, "b": 2, "c": { "c1": 3, "c2": 4 }}</json-tree>
```

### js-object as property

```html
<json-tree></json-tree>

<script>
    const tree = document.querySelector('json-tree');
    tree.data = { a: 1, b: 2, c: { c1: 3, c2: 4 } };
</script>
```

### Properties with `color: red`

```html
<json-tree style="p { color: red }"></json-tree>

<script>
    const tree = document.querySelector('json-tree');
    tree.data = {
        a: 1,
        b: 2,
        c: { c1: 3, c2: 4 },
    };
</script>
```

### Renderer and style for displaying array with square brackets

```html
<json-tree></json-tree>

<script>
    const tree = document.querySelector('json-tree');
    tree.data = {
        a: 1,
        b: 2,
        c: { c1: 3, c2: 4 },
        arr: [1, 2, { el: 3 }],
    };

    tree.renderer = ({ key, node, level, defaultNode, parentNode }) => {
        const _node = defaultNode();

        if (!Array.isArray(node)) return _node;

        const openBracket = document.createElement('span');
        openBracket.textContent = ' [';

        const closeBracket = document.createElement('p');
        closeBracket.textContent = ']';

        _node.querySelector('summary').appendChild(openBracket);
        _node.appendChild(closeBracket);

        _node.classList.add('array');

        return _node;
    };

    // this will result in displaying [...] after the closed details with an array inside
    tree.style = `details.array:not(*[open]) summary::after { content: '...]' }`;
</script>
```