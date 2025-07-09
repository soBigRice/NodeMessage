/*
 * @Author: superRice
 * @Date: 2025-07-09 13:20:00
 * @LastEditors: superRice 1246333567@qq.com
 * @LastEditTime: 2025-07-09 13:20:00
 * @FilePath: /nodeMessage/server/utils/logger.js
 * @Description: 日志配置
 * Do your best to be yourself
 * Copyright (c) 2025 by superRice, All Rights Reserved.
 */

const winston = require('winston');
const path = require('path');

// 创建logs目录
const logsDir = path.join(__dirname, '..', '..', 'logs');

// 日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// 邮件日志记录器
const mailLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    // 所有邮件记录
    new winston.transports.File({
      filename: path.join(logsDir, 'mail.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    }),
    // 成功发送记录
    new winston.transports.File({
      filename: path.join(logsDir, 'mail-success.log'),
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    }),
    // 错误记录
    new winston.transports.File({
      filename: path.join(logsDir, 'mail-error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    })
  ]
});

// 在开发环境中也输出到控制台
if (process.env.NODE_ENV !== 'production') {
  mailLogger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = {
  mailLogger
};
