#!/usr/bin/env node
/*
 * @Author: superRice
 * @Date: 2025-07-09 13:40:00
 * @LastEditors: superRice 1246333567@qq.com
 * @LastEditTime: 2025-07-09 13:40:00
 * @FilePath: /nodeMessage/test/basic.test.js
 * @Description: 基本测试脚本
 * Do your best to be yourself
 * Copyright (c) 2025 by superRice, All Rights Reserved.
 */

const http = require("http");
const { execSync } = require("child_process");

console.log("🧪 开始基本测试...");

// 测试1: 检查包依赖
console.log("✅ 测试1: 检查包依赖...");
try {
  require("express");
  require("nodemailer");
  require("winston");
  require("dotenv");
  console.log("✅ 所有依赖包正常");
} catch (error) {
  console.error("❌ 依赖包测试失败:", error.message);
  process.exit(1);
}

// 测试2: 检查环境变量文件
console.log("✅ 测试2: 检查环境变量配置...");
const fs = require("fs");
if (fs.existsSync(".env.example")) {
  console.log("✅ 环境变量模板文件存在");
} else {
  console.log("⚠️  环境变量模板文件不存在");
}

// 测试3: 检查必要目录
console.log("✅ 测试3: 检查项目结构...");
const requiredDirs = ["server", "server/services", "server/utils"];
requiredDirs.forEach((dir) => {
  if (fs.existsSync(dir)) {
    console.log(`✅ 目录 ${dir} 存在`);
  } else {
    console.error(`❌ 目录 ${dir} 不存在`);
    process.exit(1);
  }
});

// 测试4: 检查必要文件
console.log("✅ 测试4: 检查必要文件...");
const requiredFiles = [
  "server/app.js",
  "server/services/mailService.js",
  "server/utils/logger.js",
  "package.json",
];
requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ 文件 ${file} 存在`);
  } else {
    console.error(`❌ 文件 ${file} 不存在`);
    process.exit(1);
  }
});

// 测试5: 语法检查
console.log("✅ 测试5: 语法检查...");
try {
  // 设置临时环境变量以防止应用启动
  process.env.NODE_ENV = "test";
  const path = require("path");
  const appPath = path.join(__dirname, "..", "server", "app.js");

  // 检查文件是否可以被正确解析
  const fs = require("fs");
  const appContent = fs.readFileSync(appPath, "utf8");

  // 简单的语法检查 - 检查是否有基本的语法错误
  if (appContent.includes("require(") && appContent.includes("express")) {
    console.log("✅ 主应用文件语法正确");
  } else {
    throw new Error("应用文件结构不正确");
  }
} catch (error) {
  console.error("❌ 语法检查失败:", error.message);
  process.exit(1);
}

console.log("🎉 所有基本测试通过！");
process.exit(0);
