# 邮件发送功能使用说明

## 环境变量配置

在 `.env` 文件中配置邮件服务器信息：

```
PORT=5173

# 邮件配置
MAIL_HOST=smtp.qq.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your-email@qq.com
MAIL_PASS=your-app-password
MAIL_FROM=your-email@qq.com
```

## API 接口

### 1. 发送邮件

**POST** `/send-email`

**请求体：**

```json
{
  "to": "recipient@example.com",
  "subject": "邮件主题",
  "text": "纯文本邮件内容",
  "html": "<h1>HTML邮件内容</h1>"
}
```

**响应：**

```json
{
  "success": true,
  "message": "邮件发送成功",
  "messageId": "<message-id>",
  "to": "recipient@example.com",
  "subject": "邮件主题",
  "logId": "2025-07-09T13:30:00.000Z"
}
```

### 2. 验证邮件配置

**GET** `/verify-mail`

**响应：**

```json
{
  "success": true,
  "message": "邮件服务配置正确"
}
```

### 3. 获取邮件发送记录

**GET** `/mail-logs`

**查询参数：**

- `limit`: 返回记录数量限制（默认 100）
- `type`: 记录类型（all/success/error，默认 all）

**响应：**

```json
{
  "success": true,
  "logs": [
    {
      "timestamp": "2025-07-09T13:30:00.000Z",
      "to": "recipient@example.com",
      "subject": "邮件主题",
      "status": "success",
      "messageId": "<message-id>",
      "duration": 1500,
      "size": 1024
    }
  ],
  "total": 1,
  "message": "获取到 1 条邮件记录"
}
```

### 4. 获取邮件统计信息

**GET** `/mail-stats`

**响应：**

```json
{
  "success": true,
  "stats": {
    "total": 100,
    "success": 95,
    "error": 5,
    "today": 10,
    "thisWeek": 50,
    "thisMonth": 100
  },
  "message": "邮件统计信息获取成功"
}
```

## 使用示例

### 使用 curl 发送邮件

```bash
curl -X POST http://localhost:5173/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "测试邮件",
    "text": "这是一封测试邮件",
    "html": "<h1>测试邮件</h1><p>这是一封测试邮件</p>"
  }'
```

### 验证邮件配置

```bash
curl http://localhost:5173/verify-mail
```

### 获取邮件发送记录

```bash
# 获取所有邮件记录
curl http://localhost:5173/mail-logs

# 获取最近50条成功记录
curl http://localhost:5173/mail-logs?limit=50&type=success

# 获取错误记录
curl http://localhost:5173/mail-logs?type=error
```

### 获取邮件统计信息

```bash
curl http://localhost:5173/mail-stats
```

## 日志系统

### 日志文件位置

邮件发送记录会自动保存在以下位置：

- `logs/mail.log` - 所有邮件记录
- `logs/mail-success.log` - 成功发送记录
- `logs/mail-error.log` - 发送失败记录

### 日志内容

每条日志包含以下信息：

- `timestamp` - 发送时间
- `to` - 收件人
- `subject` - 邮件主题
- `status` - 发送状态（success/error）
- `messageId` - 邮件 ID（成功时）
- `error` - 错误信息（失败时）
- `duration` - 发送耗时（毫秒）
- `size` - 邮件大小（字节）

### 日志轮转

- 每个日志文件最大 5MB
- 保留最近 10 个日志文件
- 自动清理旧文件

## 常见邮件服务器配置

### QQ 邮箱

```
MAIL_HOST=smtp.qq.com
MAIL_PORT=587
MAIL_SECURE=false
```

### 163 邮箱

```
MAIL_HOST=smtp.163.com
MAIL_PORT=465
MAIL_SECURE=true
```

### Gmail

```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
```

## 部署和运行

### 开发环境

```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 普通启动
npm start
```

### 生产环境

#### 1. 传统部署

```bash
# 构建项目
./build.sh

# 启动服务
npm start
```

#### 2. PM2 部署

```bash
# 全局安装 PM2
npm install -g pm2

# 启动服务
npm run pm2:start

# 查看状态
npm run status

# 查看日志
npm run logs

# 重启服务
npm run pm2:restart

# 停止服务
npm run pm2:stop
```

#### 3. Docker 部署

```bash
# 构建镜像
docker build -t node-message .

# 运行容器
docker run -d -p 5173:5173 --env-file .env node-message

# 或使用 docker-compose
docker-compose up -d
```

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 部署检查清单

- [ ] 配置 `.env` 文件
- [ ] 确保邮件服务器配置正确
- [ ] 检查端口是否可用
- [ ] 确保日志目录权限正确
- [ ] 配置防火墙规则
- [ ] 设置进程管理器（PM2）
- [ ] 配置反向代理（如 Nginx）
- [ ] 设置 SSL 证书（生产环境）
