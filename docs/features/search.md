# xskill search

## 一句话

连上团队（或公网实例）之后，按关键词查找共享目录里的技能，拿到技能编号或直接安装。

## 什么时候用

- 你要做某项任务，想看看团队或社区有没有现成可用的技能
- 想先看有哪些相关技能，拿到编号再决定要不要装
- 刚上传了技能，想验证大家能不能正常搜到

## 怎么用

完整命令格式：

```bash
xskill search QUERY [--download] [--team | --local]
```

### 常用示例

```bash
# 1. 基础搜索（默认搜共享库，查看匹配技能与 ID）
xskill search docker

# 2. 显式指定搜索团队/公网共享库
xskill search "docker compose" --team

# 3. 搜索并自动下载安装到 10 槽滚动缓存位（方便临时试用）
xskill search docker --download

# 4. 只搜当前电脑上已有的技能，不联网
xskill search git --local
```

### 参数解释

- `QUERY`：搜索关键词或任务描述（例如 `docker`、`"发布流程"`）。
- `--download`：搜索并将命中结果临时装入 10 槽滚动淘汰位（LRU），方便快速试用。
- `--team`：强制在团队/公网共享技能库中检索（已 `xskill connect` 时的默认行为）。
- `--local`：只在当前本机已有的技能库中检索，不向远端服务器发送请求。

### 持久安装到助手

搜索默认输出精简元信息与技能 ID。若需持久安装到指定编程助手（如 Claude Code、Codex 等），结合 `xskill download` 使用：

```bash
xskill download <skill-id> --agent claude-code --agent codex -y
```

## 和相近命令的差别

| 命令 | 差别 |
| --- | --- |
| `xskill download` | download 是已知技能编号后持久装进助手。search 是按关键词找技能。 |
| `xskill upload` | upload 是把本机写好的技能发到共享目录给人搜。search 是从中查询。 |
| `xskill import` | import 是把本地技能目录收编进带版本的正式库。search 是远端检索。 |

## 注意

- 搜索团队共享库必须先 `xskill connect`。不连且不加 `--local` 会提示未连接。
- 加 `--download` 只是把命中技能放进 10 槽滚动淘汰缓存位，适合临时试用；需要持久留存在助手里请用 `xskill download`。
- 搜索采用关键词（BM25）与语义向量混合；如果 embedding 服务未配置或离线，会自动平滑降级为纯 BM25 关键词匹配。
