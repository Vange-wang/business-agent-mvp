# Dify 发布链接获取与生产修复清单

日期：2026-07-07

适用场景：生产网站出现 `App with code ... not found`

## 1. 问题结论

当前截图中的错误：

```text
App with code ae0d0725-c989-4e0c-b8ab-941e8deefccd not found
```

说明生产环境配置的不是 Dify WebApp 发布 token，而是 Dify 应用后台 ID 或工作流 ID。

两类 ID 必须区分：

| 类型 | 用途 | 示例 |
| --- | --- | --- |
| Dify 后台应用 ID | 进入 Dify 后台编辑、Workflow、配置页面 | `https://cloud.dify.ai/app/{APP_ID}/workflow` |
| Dify WebApp 发布 token | 给客户访问、iframe 嵌入、网站上线 | `https://udify.app/chatbot/{WEBAPP_TOKEN}` |

生产网站 iframe 必须使用 WebApp 发布 token 组成的 URL，不能使用后台应用 ID。

## 2. 正确获取方式

在 Dify 后台执行：

1. 打开对应应用。
2. 点击 `Publish`。
3. 进入 `Embed` 或 WebApp 发布区域。
4. 找到 iframe 代码或 WebApp URL。
5. 复制 iframe 的 `src`，格式应类似：

```text
https://udify.app/chatbot/{WEBAPP_TOKEN}
```

如果复制的是下面这种后台地址，则不能填入生产网站：

```text
https://cloud.dify.ai/app/{APP_ID}/workflow
```

如果复制的是下面这种旧格式或错误格式，也不能作为当前验收通过依据：

```text
https://udify.app/chat/{APP_ID}
```

## 3. 腾讯云 CloudBase 环境变量修复

需要修复的变量：

```text
NEXT_PUBLIC_DIFY_CUSTOMER_SERVICE_URL=https://udify.app/chatbot/{WEBAPP_TOKEN}
```

修复步骤：

1. 在腾讯云 CloudBase 当前环境中打开环境变量配置。
2. 找到 `NEXT_PUBLIC_DIFY_CUSTOMER_SERVICE_URL`。
3. 将值替换为 Dify 发布页复制到的 `https://udify.app/chatbot/{WEBAPP_TOKEN}`。
4. 保存配置。
5. 重新部署或重启当前服务，确保运行时读取到新值。

注意：

- WebApp URL 可以进入前端环境变量。
- Dify API Key 不能进入 `NEXT_PUBLIC_` 变量。
- 若后续使用 API Key，必须改为服务端环境变量和 API 中转。

## 4. 修复后验收命令

### 4.1 验证 Dify WebApp

```powershell
$url = "https://udify.app/chatbot/{WEBAPP_TOKEN}"
$r = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 20
$r.StatusCode
$r.Content -match "App with code"
```

通过标准：

```text
StatusCode = 200
App with code = False
```

### 4.2 验证客户网站

```powershell
$page = Invoke-WebRequest -Uri "https://ungradu-edu-prod-275285-6-1445807473.sh.run.tcloudbase.com/customer-service" -UseBasicParsing -TimeoutSec 20
$page.StatusCode
$page.Content -match "https://udify.app/chatbot/"
$page.Content -match "App with code"
```

通过标准：

```text
StatusCode = 200
包含 https://udify.app/chatbot/
不包含 App with code
```

## 5. 当前项目处理状态

当前商业化复制 v1 已通过线上复验。

修复结果：

```text
NEXT_PUBLIC_DIFY_CUSTOMER_SERVICE_URL=https://udify.app/chatbot/aFMxKMpMSFNm6ItV
```

已关闭 Issue：

```text
CS-ISSUE-20260707-001
```

关闭依据：

- Dify WebApp 返回 200，且未出现 `App with code`。
- 客户网站 `/customer-service` 返回 200。
- 客户网站页面包含 `https://udify.app/chatbot/aFMxKMpMSFNm6ItV`。
- 客户网站页面不再包含旧错误地址 `https://udify.app/chat/ae0d0725-c989-4e0c-b8ab-941e8deefccd`。
- 客户网站页面保留 `/feedback` 入口。
