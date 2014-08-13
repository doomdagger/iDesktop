iDesktop
========
[![Build Status](https://travis-ci.org/doomdagger/iDesktop.svg?branch=ext5)](https://travis-ci.org/doomdagger/iDesktop)
[![Code Climate](https://codeclimate.com/github/doomdagger/iDesktop/badges/gpa.svg)](https://codeclimate.com/github/doomdagger/iDesktop)
[![Test Coverage](https://codeclimate.com/github/doomdagger/iDesktop/badges/coverage.svg)](https://codeclimate.com/github/doomdagger/iDesktop)

iDesktop - Based on ExtJS, use the basic Ext.ux.Desktop, extend it, refine it.

Overview
--------

iDesktop是一个基于Ext JS 5的web桌面应用，为了最大限度的强调前端框架的魅力，忽略后台开发所带来的
冗余，项目基于NodeJS平台搭建，并集成了Mocha测试框架，Bower前端包管理器，GruntJS构建框架等等。

项目的代码组织结构如下： The following folders are all needed to load the application.

 - `"client"` - 前端代码，内包含了基于ext5的标准部署结构，以及来自第三方vendor的JavaScript Framework.
 - `"server"` - 服务器端代码，内包含了基于expressjs的web app，其中有路由规则定义及中间件依赖。
 - `"test"` - 测试代码，基于shouldJs以及Mocha测试框架的测试模块，额外提供了代码的coverage报告功能.
 - `"index.js"` - 项目入口文件.
 - `"bower.json"` - bower package manager descriptor.
 - `"package.json"` - npm package manager descriptor.

Requirement
-----------

如果想要将iDesktop部署到自己的PC或Mac上，你应该确保有以下依赖：

 - `Node JS` - NodeJS平台，点击[这里](http://nodejs.org)查看详情.
 - `Grunt CLI` - NodeJS依赖，需要使用npm包管理器安装 `npm install -g grunt-cli`。
 - `Sencha CMD` - Sencha Command, 请前往Sencha官网下载最新版本的SenchaCMD.


How to Start
------------

按照以下步骤，初始化项目：

* `grunt init` -- download ext5 framework
* use `grunt dev` while you develop iDesktop

Other Grunt Tasks
-------------------

* `grunt docs` -- 根据markdown注释生成项目文档
* `grunt validate` -- 使用jshint测试JavaScript代码质量，并执行全部的测试case
* `grunt test-unit` -- 仅仅执行单元测试case
* 更多Grunt Task参考`Gruntfile.js`

Screen Cast
-----------

![1](http://git-cache.oss-cn-qingdao.aliyuncs.com/doomdagger/iDesktop/1.jpg)

Who are we
----------

**CodeHolic Team.**

License
-------

MIT
