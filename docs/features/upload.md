# xskill upload

## 一句话

把本机一份已经写好的技能文件夹打包发给团队。同事用 `xskill search` 就能搜到。

## 什么时候用

- 你手头有一份现成的技能目录（里面有 `SKILL.md`）
- 想马上分享给同事，而不是等系统从会话里慢慢整理
- 更新同一份技能：再 upload 一次会覆盖你之前传的那份

## 怎么用

```bash
xskill upload ./my-skill
```

`./my-skill` 必须是技能目录本身，且其中有 `SKILL.md`。成功后会打印技能名和编号，并提示同事可以：

```bash
xskill search 技能名
```

搜到之后用 `xskill download` 装到自己的编程助手里。

## 和相近命令的差别

| 命令 | 差别 |
| --- | --- |
| `xskill import` | import 收进 xskill 自己的正式技能库（带版本，并装到助手里）。upload 放进共享目录给人搜，不走那条「收编」路径。 |
| `xskill generate` | generate 是让服务器按你的一句话来写。upload 是你已经写好了。 |

## 注意

- 必须先 `xskill connect`。
- 目录里没有 `SKILL.md`，或文件头不合法，会直接拒绝。
- 打包后不能超过 20MB。大文件请先清掉。
- `.git` 不会被传上去。
- 这不会立刻改写全队正在用的正式技能；同事需要搜索并下载才会装上。
