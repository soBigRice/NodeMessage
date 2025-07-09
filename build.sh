#!/bin/bash
###
 # @Author: superRice
 # @Date: 2025-07-09 13:18:00
 # @LastEditors: superRice 1246333567@qq.com
 # @LastEditTime: 2025-07-09 13:19:47
 # @FilePath: /nodeMessage/build.sh
 # @Description: 
 # Do your best to be yourself
 # Copyright (c) 2025 by superRice, All Rights Reserved. 
### 

# 构建和部署脚本
echo "🚀 开始构建 Node Message 服务..."

# 检查 Node.js 版本
echo "📦 检查 Node.js 版本..."
node --version
npm --version

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf node_modules
rm -rf logs/*

# 安装依赖
echo "📦 安装依赖..."
npm ci --only=production

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p logs
mkdir -p public

# 验证环境变量
echo "🔍 验证环境变量..."
if [ ! -f .env ]; then
    echo "❌ .env 文件不存在，请创建并配置环境变量"
    exit 1
fi

# 检查必要的环境变量
if ! grep -q "MAIL_USER" .env; then
    echo "❌ 缺少 MAIL_USER 环境变量"
    exit 1
fi

if ! grep -q "MAIL_PASS" .env; then
    echo "❌ 缺少 MAIL_PASS 环境变量"
    exit 1
fi

echo "✅ 构建完成！"

# 运行测试（如果有）
echo "🧪 运行测试..."
npm test

echo "🎉 构建和测试完成！"
echo "💡 使用以下命令启动服务："
echo "   npm start          # 普通启动"
echo "   npm run dev        # 开发模式"
echo "   npm run pm2:start  # PM2 启动"
echo "   docker-compose up  # Docker 启动"
