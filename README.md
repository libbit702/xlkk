# Javascript 编码规范 #
## 1. Linting ##
Grunt provides a JSHint task to verify some basic, practical soundness of the codebase. The options are preset.

## 2. 代码间隔 ##
<ul>
<li>使用tab缩进</li>
<li>行结尾处不使用空格</li>
<li>空行中不使用空格</li>
<li>代码中多使用空格</li>
<li>if/else/for/while/try 前后必须使用括号，并且在代码中使用多行排列
</li>
</ul>

### 数组和对象 ###
空数组和对象定义中不使用空格
`
var object = {},
	array = [];
`
### 函数调用 ###
函数的参数定义必须使用空格隔开
`
foo( arg );
 
foo( "string", object );
 
foo( options, callback );
 
foo( node, "property", 2 );
`
## 3. 定义及声明 ##
变量定义时必须以分号结尾。

分号后必须启用新行

定义声明时必须独立占一行，变量声明时如果没有赋值，则这些变量应该放在变量定义的开头并居于同一行。

## 4. 定义及声明 ##
值比较时必须使用全等(===)而不是==，唯一的例外是用null检验值为undefined和null的变量时

## 5. 类型检测 ##
<ul>
<li>String: typeof object === "string"</li>
<li>Number: typeof object === "number"</li>
<li>Boolean: typeof object === "boolean"</li>
<li>Object: typeof object === "object"</li>
<li>Plain Object: jQuery.isPlainObject( object )</li>
<li>Function: jQuery.isFunction( object )</li>
<li>Array: jQuery.isArray( object )</li>
<li>Element: object.nodeType</li>
<li>null: object === null</li>
<li>null or undefined: object == null</li>
<li>undefined:
	<ul>
		<li>Global Variables: typeof variable === "undefined"</li>		
		<li>Local Variables: variable === undefined</li>
		<li>Properties: object.prop === undefined</li>
	</ul>
</li>
</ul>

## 6. 注释 ##
> 不多说了

## 7. 引用 ##
jQuery使用双引号，如果字符串中还要使用引号，则外面使用双引号，字符串中使用单引号

## 8. 注释 ##
尽量使用.nodeName而不是.tagName.
如果要判断节点的类型尽量使用.nodeType而不是.nodeName
