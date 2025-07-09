# 使用官方 Node.js 运行时作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 创建日志目录
RUN mkdir -p logs

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# 更改文件所有者
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# 暴露端口
EXPOSE 5173

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5173/ || exit 1

# 启动应用
CMD ["npm", "start"]
