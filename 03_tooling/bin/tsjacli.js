#! /usr/bin/env node
const {program} = require("commander");

// 配置默认指令
const myhelp = require("../lib/core/help");
myhelp(program);

// 配置自定义指令
const mycommander = require("../lib/core/mycommander");
mycommander(program);

program.parse(process.argv);
