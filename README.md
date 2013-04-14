# 迅雷看看前端开发JS库模块开发 #

## 1. 为什么 ##

<ul>
	<li>全局变量污染，例如Minisite定义导致的各种冲突</li>
	<li>代码重用，如果能将这些平时积累起来的JS重用的话会省很多事(每次开发专题都要copy minisite getcookie vip_index)</li>	
	<li>看看首页开发的时候已经使用了RequireJS，但是有一些不太理想的地方，仅仅用到了require的异步加载功能，而没有把它作为将js模块化的基础</li>
	<li>RequireJS是AMD规范(https://github.com/amdjs/amdjs-api/wiki/AMD AMD Definition)实现的最好者之一</li>
	<li>RequireJS提供了一个JS压缩工具，开发完成后可以利用它在解决js依赖性关系的同时压缩所有JS文件，明显减少http请求数，减轻服务器及带宽压力</li>
</ul>

当然，RequireJS为我们提供便利之处的同时也要求我们付出一定的代价，就是要在代码中引入额外15KB的JS文件(minified)


## 2. 怎么做 ##

### 准备工作 ###
[RequireJS](http://requirejs.org/ "requireJS") - 基本教程

[JSLINT for Sublime](https://github.com/fbzhong/sublime-jslint "Sublime JSLINT") 或者最原始的 [JSLINT](https://github.com/douglascrockford/JSLint "JSLINT") - 检测代码写法是否规范

[QUnit](https://github.com/jquery/qunit "QUnit") JS单元测试工具，为jQuery所使用 - 测试用例

[R.JS](https://github.com/jrburke/r.js "r.js") RequireJS提供的用于Node和Rhino的适配器及JS压缩工具 - 配合Node压缩生成生产环境使用的JS文件

[Node](http://nodejs.org/download/ "NodeJS") 这里主要是为R.js提供基本环境，要配合NodeJS才能进行压缩 - 命令行工具

[JSDOC](http://code.google.com/p/jsdoc-toolkit/ "JSDOC Toolkits") 生成JS文档注释 - 为后来的模块使用者提供文档帮助

### 目录结构 ###

 -- appDir | 根目录

 	-- doc | 模块代码帮助文档输出位置

 	-- jsdoc | JSDOC3源文件位置，用于输出JS文件中的注释成为文档 	

 	-- src | 我们根据RequireJS规范自己编写的JS模块文件目录，包括RequireJS本身

 	-- tests | 测试用例目录

 	-- r.js | 主要用于实际项目中，完成开发后将所有涉及到的JS压缩到同一个文件中，减少HTTP请求数，需要[配合Node使用](http://requirejs.org/docs/optimization.html "使用方法说明页")

    -- require.js | 供test中的测试用例本地调用

    -- rundoc.bat | 生成JS帮助文档的简易批处理命令工具

 	-- READ.md | 就是现在读到的这个文件啦！

 	-- 编码规范 | 自己胡乱从[jQuery](http://contribute.jquery.org/style-guide/ "Style Guide")翻译的，主要还是靠JSLINT


我想重点提到的是RequireJS中[如何定义模块](http://requirejs.org/docs/api.html#define)，这样每个模块的实例化都会在RequireJS的callback中作为一个参数传入，避免了一开始提到的全局变量污染

JS文件压缩命令行调用方式(http://requirejs.org/docs/optimization.html#onejs)

node pathto/r.js -o baseUrl=pathtobase paths.jquery=pathtojquery(empty if no need): name=relativepathtobase/srcjsfilename(without extension ".js") out=relativepathtobase/buildjsfilename(full name with ".js")

## 3. 应用示例 ##
1. [迅雷影院](http://yy.xunlei.com/ "迅雷影院") - 压缩
2. [女人公敌](http://vip.kankan.com/topics/nrgd/ "女人公敌") - 压缩
3. [2013金像奖专题](http://topics.kankan.com/2013jxj/ "2013金像奖专题") - 没有压缩JS文件，请求数也会很多
4. ToDo:[付费首页改版](http://vip.kankan.com/ "付费首页改版")