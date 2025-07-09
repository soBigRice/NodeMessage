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
- `limit`: 返回记录数量限制（默认100）
- `type`: 记录类型（all/success/error，默认all）

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
- `messageId` - 邮件ID（成功时）
- `error` - 错误信息（失败时）
- `duration` - 发送耗时（毫秒）
- `size` - 邮件大小（字节）

### 日志轮转

- 每个日志文件最大5MB
- 保留最近10个日志文件
- 自动清理旧文件

## 常见邮件服务器配置

### QQ邮箱
```
MAIL_HOST=smtp.qq.com
MAIL_PORT=587
MAIL_SECURE=false
```

### 163邮箱
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

## 注意事项

1. **QQ邮箱**：需要在QQ邮箱设置中开启SMTP服务，并使用应用专用密码
2. **163邮箱**：需要在邮箱设置中开启SMTP服务，并使用应用专用密码
3. **Gmail**：需要使用应用专用密码或OAuth2认证
4. **请确保 `.env` 文件中的邮件配置正确**
5. **建议在生产环境中使用更安全的认证方式**
