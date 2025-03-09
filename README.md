# Web Component JsonTree

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

### Replacer and style for displaying array with square brackets

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

    tree.replacer = ({ key, node, level, defaultNode, parentNode }) => {
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
    tree.styles = `details.array:not(*[open]) summary::after { content: '...]' }`;
</script>
```