# xskill Skill 生命周期

> 一句话：xskill 先把 Agent 对话拆成可复用的 `AtomTask`，再把它们整理进 Skill，最后用真实使用结果决定新版本是否进入 `main`。

## 这条链路在做什么

```text
Agent 轨迹
  -> TaskAgent：拆成 AtomTask
  -> Embedding：建立检索索引
  -> TaskClusterAgent：匹配已有 Skill，或创建 baby Skill
  -> candidates：累计候选贡献分
  -> SkillEditAgent：重写 SKILL.md
  -> baby/main/staging：保存版本
  -> Canary：用 UX 分数比较 main 和 staging
```

Watcher 会周期性扫描轨迹目录，并把拆分、索引、聚类、编辑和灰度任务放进不同工作池。因此它是一条异步流水线，不是一次函数调用从头执行到尾。

这里要先分清两个对象：

- `AtomTask` 是从一段轨迹中切出的单个意图，是检索和评分的基本单位。
- `Skill` 是独立的 Git 仓库，至少包含 `SKILL.md`，也可以带 `scripts/` 和 `references/`。

## 三个分数不要混用

- `weightscore`：聚类阶段给 AtomTask 的贡献分，通常为 0 到 10。候选累计达到默认阈值 10 后，才会触发 SkillEdit；这不等于已经发布。
- `ux_score`：TaskAgent 拆分时就可能给 Atom 标注的体验分；灰度裁决使用 `.ux_scores.jsonl` 中按 `(atom_id, skill_name, side)` 去重后的记录。

## baby、main、staging

每个 Skill 都是独立 Git 仓库，分支就是版本推进状态：

| 分支 | 含义 | 常见去向 |
| --- | --- | --- |
| `baby` | 新 Skill 的草稿阶段 | 首次有效提交后进入 `main` |
| `main` | 当前正式版本 | 新一轮编辑先进入 `staging` |
| `staging` | 等待灰度比较的候选版本 | promote 合并，或 reject/discard |

新 Skill 刚建出来时先放在 `baby`。SkillEditAgent 每处理一批材料，会用
`commit_baby` 做一次 checkpoint；候选材料消化完后，框架再用
`graduate_baby_to_main`（底层操作是 `commit_baby_to_main_branch`）让它正式进入
`main`。以后再有新的整理结果，就从 `main` 生成 `staging`，交给真实流量试一轮。
这个版本只在 `staging` 暂住：表现够好就 `promote` 回 `main`，表现不好就
`reject/discard`。

创建 `staging` 前，`main` 至少要有一条真实使用的 `side=main` UX 记录。否则没有基线，灰度比较没有意义。
`staging` 存在时，普通 SkillEdit 会先 hold；只有 jam 的三个条件同时满足（候选版本已存在至少 30 分钟、最近一次 UX 分数已 plateau 至少 10 分钟、候选 `weightscore` 累计至少 50）才会强制推进。

## 灰度如何裁决

默认目标约 20% 的轨迹进入 `staging`。Team 模式下，普通 client 主路径由
`CanaryRouter.assign` 按当前实际比例与目标比例的差值选择更需要补样本的一侧，
并保持 sticky；两侧误差打平时才使用 `_balanced_side` / `pick_side()` 的稳定哈希
兜底。单机或高基数路径仍可能直接使用 `pick_side()`，因此同一条轨迹在同一 Skill
上不会在对话中途换边。

默认规则如下：

| 条件 | 结果 |
| --- | --- |
| 当前这对 `main/staging` `commit_sha` 两侧各至少 5 条有效 UX 分数，且 `staging_avg >= main_avg` | promote，合并到 `main` |
| 两侧样本齐全，但 `staging_avg < main_avg` | reject，丢弃候选版本 |
| `staging` 保留 14 天仍未凑齐样本 | `timeout_discarded` |

UX 记录写在 Skill 的 `.ux_scores.jsonl` 中，至少包含 `atom_id`、`side`、`commit_sha`、`score` 和时间。相同的 `(atom_id, skill_name, side)` 只记一次。上表是未开启模型分桶时的默认规则；开启模型分桶后，样本门槛和均值算法会随分桶配置变化。

## 一个实际例子

Alice 用 Codex 排查数据库迁移失败：

1. Watcher 发现新轨迹，TaskAgent 拆出“定位版本”“清理失败状态”“重新执行迁移”等 AtomTask。
2. ClusterAgent 找到 `database-migration` Skill，并把这些 Atom 写入 `.candidates.yml`。
3. 候选 `weightscore` 累计达到阈值后，SkillEditAgent 读取原始片段和现有 `SKILL.md`，整理出可复用步骤。
4. 如果是新 Skill，先做 `baby` checkpoint，候选消化完后再毕业到 `main`；如果已有正式版本，走 `main -> staging`。
5. 灰度期间分别记录两侧 UX 分数，样本和均值满足规则后再决定是否 promote。

## 两个容易混淆的入口

### `xskill generate`

这是用户主动发起的生成命令，例如：

```bash
xskill generate "创建一个排查 Python 内存泄漏的 Skill"
```

它会直接调用 `commit_generate_main` 写入 `main`，不经过轨迹自动流水线的 `staging` 规则。两条路径共享 Skill 仓库，但触发条件和提交入口不同。

### `user-staging/<client_id>`

这是 Team 客户端上传用户手工修改的隔离分支，不是系统用于灰度比较的 `staging`。它不会直接覆盖 `main`，服务端也不会替客户端安装 Skill。

## 出问题时先看哪里

| 想确认的事情 | 代码入口 |
| --- | --- |
| Watcher 如何调度 | `src/xskill/pipeline/runner.py` 的 `DirectoryWatcher._scan_once` |
| AtomTask 如何保存 | `src/xskill/pipeline/atom.py` |
| 聚类和候选如何写入 | `src/xskill/agents/task_cluster_agent.py`、`src/xskill/skill/candidates.py` |
| 何时触发 SkillEdit | `src/xskill/agents/skill_edit_agent.py` 的 `maybe_run` |
| 分支如何推进 | `src/xskill/skill/git.py` 的 `commit_baby`、`graduate_baby_to_main`、`commit_baby_to_main_branch`、`commit_to_staging_branch` |
| 灰度如何分流和裁决 | `src/xskill/canary.py` 的 `CanaryRouter.assign`、`_balanced_side`、`pick_side`、`check_and_decide` |

排查时最常见的三个误区：不要把 `weightscore` 当成 UX 分数；不要把达到候选阈值当成发布；不要把系统 `staging` 和 `user-staging/<client_id>` 当成同一条分支。
