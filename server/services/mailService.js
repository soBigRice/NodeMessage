/*
 * @Author: superRice
 * @Date: 2025-07-09 13:00:00
 * @LastEditors: superRice 1246333567@qq.com
 * @LastEditTime: 2025-07-09 13:03:50
 * @FilePath: /nodeMessage/server/services/mailService.js
 * @Description: 邮件发送服务
 * Do your best to be yourself
 * Copyright (c) 2025 by superRice, All Rights Reserved.
 */

const nodemailer = require("nodemailer");
const { mailLogger } = require("../utils/logger");
const fs = require("fs");
const path = require("path");

class MailService {
  constructor() {
    this.transporter = this.createTransporter();
    this.ensureLogsDirectory();
  }

  // 确保日志目录存在
  ensureLogsDirectory() {
    const logsDir = path.join(__dirname, "..", "..", "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  // 创建邮件传输器
  createTransporter() {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_SECURE === "true",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  // 发送邮件
  async sendMail(options) {
    const startTime = new Date();
    const logData = {
      timestamp: startTime.toISOString(),
      to: options.to,
      subject: options.subject,
      hasText: !!options.text,
      hasHtml: !!options.html,
      from: process.env.MAIL_FROM,
    };

    try {
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      const endTime = new Date();

      // 记录成功日志
      const successLog = {
        ...logData,
        status: "success",
        messageId: result.messageId,
        response: result.response,
        duration: endTime - startTime,
        size: this.calculateEmailSize(mailOptions),
      };

      mailLogger.info("邮件发送成功", successLog);

      return {
        success: true,
        messageId: result.messageId,
        response: result.response,
        logId: successLog.timestamp,
      };
    } catch (error) {
      const endTime = new Date();

      // 记录错误日志
      const errorLog = {
        ...logData,
        status: "error",
        error: error.message,
        errorCode: error.code,
        duration: endTime - startTime,
      };

      mailLogger.error("邮件发送失败", errorLog);

      return {
        success: false,
        error: error.message,
        logId: errorLog.timestamp,
      };
    }
  }

  // 计算邮件大小
  calculateEmailSize(mailOptions) {
    let size = 0;
    if (mailOptions.text) size += Buffer.byteLength(mailOptions.text, "utf8");
    if (mailOptions.html) size += Buffer.byteLength(mailOptions.html, "utf8");
    if (mailOptions.subject)
      size += Buffer.byteLength(mailOptions.subject, "utf8");
    return size;
  }

  // 验证邮件配置
  async verifyConnection() {
    try {
      await this.transporter.verify();
      mailLogger.info("邮件配置验证成功");
      return { success: true, message: "邮件服务配置正确" };
    } catch (error) {
      mailLogger.error("邮件配置验证失败", { error: error.message });
      return { success: false, error: error.message };
    }
  }

  // 获取邮件发送记录
  async getMailLogs(options = {}) {
    const { limit = 100, type = "all" } = options;
    const logsDir = path.join(__dirname, "..", "..", "logs");

    try {
      let logFile;
      switch (type) {
        case "success":
          logFile = path.join(logsDir, "mail-success.log");
          break;
        case "error":
          logFile = path.join(logsDir, "mail-error.log");
          break;
        default:
          logFile = path.join(logsDir, "mail.log");
      }

      if (!fs.existsSync(logFile)) {
        return { success: true, logs: [], message: "暂无邮件记录" };
      }

      const logContent = fs.readFileSync(logFile, "utf8");
      const logLines = logContent
        .trim()
        .split("\n")
        .filter((line) => line.trim());

      const logs = logLines
        .slice(-limit)
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch (e) {
            return null;
          }
        })
        .filter((log) => log !== null)
        .reverse(); // 最新的记录在前

      return {
        success: true,
        logs,
        total: logs.length,
        message: `获取到 ${logs.length} 条邮件记录`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // 获取邮件统计信息
  async getMailStats() {
    const logsDir = path.join(__dirname, "..", "..", "logs");

    try {
      const stats = {
        total: 0,
        success: 0,
        error: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
      };

      const logFile = path.join(logsDir, "mail.log");
      if (!fs.existsSync(logFile)) {
        return { success: true, stats };
      }

      const logContent = fs.readFileSync(logFile, "utf8");
      const logLines = logContent
        .trim()
        .split("\n")
        .filter((line) => line.trim());

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      logLines.forEach((line) => {
        try {
          const log = JSON.parse(line);
          const logDate = new Date(log.timestamp);

          stats.total++;
          if (log.status === "success") stats.success++;
          if (log.status === "error") stats.error++;
          if (logDate >= today) stats.today++;
          if (logDate >= weekAgo) stats.thisWeek++;
          if (logDate >= monthAgo) stats.thisMonth++;
        } catch (e) {
          // 忽略解析错误的行
        }
      });

      return {
        success: true,
        stats,
        message: "邮件统计信息获取成功",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new MailService();
