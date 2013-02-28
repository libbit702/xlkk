# 迅雷看看前端开发JS库模块开发 #

## 1. 为什么 ##

<ul>
	<li>全局变量污染，例如Minisite定义导致的各种冲突，涛哥，松林应该有印象</li>
	<li>代码重用，如果能将这些平时积累起来的JS重用的话会省很多事(每次开发专题都要copy minisite getcookie vip_index)</li>
</ul>


## 2. 怎么做 ##
模块化分割和整合全部使用RequireJS，原因如下：
<ul>
	<li>看看首页开发的时候已经使用了RequireJS，但是有一些不太理想的地方，很多require到的代码依然使用的是全局变量，如LAZY，Search，Minisite等</li>
	<li>RequireJS是AMD规范实现的最好者之一</li>
	<li>RequireJS提供了一个JS压缩工具，开发完成后可以利用它最小化require引用到的所有JS</li>
</ul>

### 准备工作 ###
[RequireJS](http://requirejs.org/ "requireJS") 

[JSLINT for Sublime](https://github.com/fbzhong/sublime-jslint "Sublime JSLINT") 或者最原始的 [JSLINT](https://github.com/douglascrockford/JSLint "JSLINT")

[QUnit](https://github.com/jquery/qunit "QUnit") JS单元测试工具，为jQuery所使用

[R.JS](https://github.com/jrburke/r.js "r.js") RequireJS提供的用于Node和Rhino的适配器及JS压缩工具

[Node](http://nodejs.org/download/ "NodeJS") 这里主要是为R.js提供基本环境，要配合NodeJS才能进行压缩

### 目录结构 ###

 -- appDir | 根目录

 	-- build | 压缩文件的输出目录，供index.html调用

 	-- src | 我们根据RequireJS规范自己编写的JS模块文件目录，包括RequireJS本身

 	-- tests | 测试用例目录

 	-- index.html | 调用RequireJS的入口文件，用于RequireJS的使用示例 

 	-- r.js | 主要用于实际项目中，完成开发后将所有涉及到的JS压缩到同一个文件中，减少HTTP请求数，需要[配合Node使用](http://requirejs.org/docs/optimization.html "使用方法说明页")

 	-- READ.md | 就是现在读到的这个文件啦！

 	-- 编码规范 | 自己胡乱从[jQuery](http://contribute.jquery.org/style-guide/ "Style Guide")翻译的，主要还是靠JSLINT


我想重点提到的是RequireJS中[如何定义模块](http://requirejs.org/docs/api.html#define)，这样每个模块的实例化都会在RequireJS的callback中作为一个参数传入，避免了一开始提到的全局变量污染

## 3. 结束语 ##
希望将来能够让大家有机会看到这个东东
