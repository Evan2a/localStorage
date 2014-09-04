# localStorage
============
> 使用userData模拟localStorage对IE6/7进行支持

```js
var ls = toolkit.localStorage;

if( ls.getItem('test') != null ){
    ls.setItem('test', 'Hello, Evan!');
}

ls.getItem('test');
```

## API

> getItem( key )

> setItem( key, value )

> removeItem( key )

> key( index )

> clear()