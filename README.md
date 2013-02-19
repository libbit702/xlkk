# 迅雷看看前端开发JS库模块开发 #

## 1. 为什么 ##
<ul>
	<li>全局变量污染，例如Minisite定义导致的各种冲突，涛哥，松林应该有印象</li>
	<li>代码重用，国鹏上次的演讲有提到不一定用大型框架，另一种方案是根据自己需求写轻量级的JS。如果能重用的话会省很多事</li>
</ul>

## 2. 怎么做 ##
模块化分割和整合全部使用RequireJS，原因如下：
<ul>
	<li>看看首页开发的时候金华已经率先用RequireJS这么处理了，但是有一些不太理想的地方，很多require到的代码依然使用的是全局变量，如LAZY，Research，Minisite等</li>
	<li>RequireJS是AMD规范实现的最好者之一</li>
	<li>RequireJS提供了一个JS压缩工具，开发完成后可以利用它最小化require引用到的所有JS（还没有使用过，要装java或者Node，反正我之前开发JS是从不压缩的……）</li>
</ul>
requireJS的具体使用方法可以参考[http://requirejs.org/](http://requirejs.org/ "requireJS")，我在index.html中也有使用

我想重点提到的是RequireJS中Module的定义方法[如何定义模块](http://requirejs.org/docs/api.html#define)（大家重点做的是这部分工作，把日常用到的JS写成模块），这样每个模块的实例化都会在RequireJS的callback中作为一个参数传入，避免了一开始提到的全局变量污染，我在src文件夹中的js中有使用，但不太明确是否是标准写法

## 3. 做好没 ##
为了检测开发的模块是否可以工作，我引入了QUnit作为测试工具，具体使用方法可以参考[http://qunitjs.com/](http://qunitjs.com/)，也可以参考在tests文件夹下对Vip模块的简单测试（写测试用例这块还没怎么看懂，不过例子倒是跑起来了）
