/*
 * @Author: superRice
 * @Date: 2025-07-09 12:47:58
 * @LastEditors: superRice 1246333567// 邮件配置验证路由
app.ge    if (result.success) {
      res.json({
        success: true,
        message: "邮件发送成功",
        messageId: result.messageId,
        to: to,
        subject: subject,
        logId: result.logId
      });
    } else {
      res.status(500).json({
        success: false,
        error: "邮件发送失败: " + result.error,
        logId: result.logId
      });
    }l", async (req, res) => {
  try {
    const result = await mailService.verifyConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "验证邮件配置失败: " + error.message
    });
  }
});

// 获取邮件发送记录
app.get("/mail-logs", async (req, res) => {
  try {
    const { limit = 100, type = 'all' } = req.query;
    const result = await mailService.getMailLogs({ 
      limit: parseInt(limit), 
      type 
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "获取邮件记录失败: " + error.message
    });
  }
});

// 获取邮件统计信息
app.get("/mail-stats", async (req, res) => {
  try {
    const result = await mailService.getMailStats();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "获取邮件统计失败: " + error.message
    });
  }
});LastEditTime: 2025-07-09 12:48:53
 * @FilePath: /nodeMessage/server/app.js
 * @Description:
 * Do your best to be yourself
 * Copyright (c) 2025 by superRice, All Rights Reserved.
 */

// 加载环境变量
require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mailService = require("./services/mailService");

const app = express();

// 设置视图引擎
app.set("view engine", "jade");

// 中间件
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 静态文件服务
app.use(express.static(path.join(__dirname, "..", "public")));

// 基本路由
app.get("/", (req, res) => {
  res.json({ message: "Hello World! Express服务器已启动" });
});

// 邮件发送路由
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    // 验证必需参数
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        success: false,
        error:
          "缺少必需参数：to (收件人), subject (主题), text 或 html (邮件内容)",
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        error: "收件人邮箱格式不正确",
      });
    }

    // 发送邮件
    const result = await mailService.sendMail({
      to,
      subject,
      text,
      html,
    });

    if (result.success) {
      res.json({
        success: true,
        message: "邮件发送成功",
        messageId: result.messageId,
        to: to,
        subject: subject,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "邮件发送失败: " + result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "服务器错误: " + error.message,
    });
  }
});

// 邮件配置验证路由
app.get("/verify-mail", async (req, res) => {
  try {
    const result = await mailService.verifyConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "验证邮件配置失败: " + error.message,
    });
  }
});

// 错误处理中间件
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      status: error.status || 500,
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app;
