/* xskill.wiki/v2 — EN / 中文 bilingual engine.
   Copy is sourced verbatim-in-spirit from the project's own README.md + README.zh-CN.md
   so nothing here is invented. Code, paths and CLI commands are NOT translated. */
(function () {
  "use strict";

  const I18N = {
    en: {
      /* ---- shared nav / chrome ---- */
      "nav.howitworks": "How it works",
      "nav.concepts": "Concepts",
      "nav.agents": "Agents",
      "nav.team": "Team mode",
      "nav.wiki": "Wiki",
      "nav.home": "Home",
      "nav.getstarted": "Get started",
      "lang.en": "EN",
      "lang.zh": "中",

      /* ---- index: hero ---- */
      "index.title": "xskill · One solves it. Everyone gets it. 🥥",
      "hero.eyebrow": "open-source · MIT · v0.6.2 on PyPI",
      "hero.title_a": "Trajectories in.",
      "hero.title_b": "Reusable skills out.",
      "hero.tagline": "One solves it. Everyone gets it.",
      "hero.lede": "Your coding agent re-derives the same solution every time it hits a familiar problem. <strong>xskill</strong> distills the patterns that actually worked into Skill files your agent loads automatically — and the library grows itself as you keep working.",
      "hero.cta_start": "🏖️ Get started",
      "hero.cta_hub": "🌐 Join public hub",
      "hero.cta_github": "★ GitHub",
      "hero.sub": "MIT-licensed · Python 3.9+ · no model weights touched.",
      "float.note": "example — a Skill is a versioned git dir, kept by its UX score",

      /* ---- index: stats (verifiable facts) ---- */
      "stats.version_l": "current release",
      "stats.agents_l": "agents supported",
      "stats.python_l": "Python",
      "stats.license_l": "open source",

      /* ---- index: latest release ---- */
      "rel.kicker": "latest release",
      "rel.title": "v0.6.2 adds identity-aware recommendations",
      "rel.sub": "The current README highlights user profiling, SkillHub retrieval, UX score APIs, and Windows scheduled-task persistence.",
      "rel.f1_t": "Stable user identity",
      "rel.f1_p": "<code>xskill connect --name &lt;userid&gt;</code> gives one user the same identity across devices and reinstalls.",
      "rel.f2_t": "Hybrid recommendations",
      "rel.f2_p": "The recommend bucket mixes quality and profile relevance, with staging prioritized until canary traffic is sufficient.",
      "rel.f3_t": "UX score queries",
      "rel.f3_p": "Dashboard APIs expose UX scores by skill version and associated Atom records, including SkillHub entries.",
      "rel.f4_t": "Windows daemon",
      "rel.f4_p": "<code>connect</code> installs a scheduled task on Windows; <code>status</code>, <code>stop</code>, and <code>start</code> manage it.",

      /* ---- index: pipeline ---- */
      "pipe.kicker": "how it works",
      "pipe.title": "A few narrow agents, one self-growing library",
      "pipe.sub": "Every Skill is its own git repository — every change versioned and reversible.",
      "pipe.s1_t": "Watch",
      "pipe.s1_p": "<code>xskill serve</code> auto-detects your agents (Claude Code, Codex, OpenCode, OpenClaw, Cursor, Trae) and watches their sessions.",
      "pipe.s2_t": "Split into Atoms",
      "pipe.s2_p": "One agent slices each trajectory into single-intent <b>Atoms</b> — the smallest reusable unit.",
      "pipe.s3_t": "Route to a Skill",
      "pipe.s3_p": "Another agent routes each Atom to the Skill it belongs to.",
      "pipe.s4_t": "Rewrite SKILL.md",
      "pipe.s4_p": "Once a Skill has enough material, an edit agent rewrites its <code>SKILL.md</code>.",
      "pipe.s5_t": "Canary A/B + UX score",
      "pipe.s5_p": "New versions are A/B-tested on live traffic; the higher <b>UX score</b> (1–10) wins.",

      /* ---- index: agents matrix ---- */
      "agents.kicker": "works with your agents",
      "agents.title": "Plug into the agent you already use",
      "agents.sub": "Trajectory ingest and Skill install are wired up per ecosystem.",
      "agents.h_agent": "Agent",
      "agents.h_status": "Status",
      "agents.h_ingest": "Trajectory ingest",
      "agents.h_install": "Skill install",
      "agents.st_verified": "verified",
      "agents.st_impl": "implemented",
      "agents.st_manual": "manual",
      "agents.any": "Any other agent",
      "agents.note": "Status as of v0.6.2 · 🟡 implemented, with Claude Code / Codex / OpenCode verified.",

      /* ---- index: concepts ---- */
      "concepts.kicker": "vocabulary",
      "concepts.title": "Five words and you've got it",
      "c.traj_t": "Trajectory",
      "c.traj_p": "One agent run — the transcript of a session, stored as <code>traj_*.md</code>.",
      "c.atom_t": "Atom",
      "c.atom_p": "The smallest single-intent slice of a trajectory. Routing happens at this level.",
      "c.skill_t": "Skill",
      "c.skill_p": "A <code>SKILL.md</code> plus optional scripts, in its own versioned git directory.",
      "c.canary_t": "Canary",
      "c.canary_p": "A live-traffic A/B test of the current Skill against a new candidate.",
      "c.ux_t": "UX score",
      "c.ux_p": "How well a Skill served the user, scored 1–10 from the interaction. The canary keeps the higher score.",

      /* ---- index: team mode ---- */
      "team.kicker": "the killer use case",
      "team.title": "Team mode: one library, the whole team",
      "team.sub": "One machine is the server; everyone else joins as a thin client and works against the same evolving Skill library.",
      "team.cmd_note": "Start a server, then join from any machine:",
      "team.b1_t": "Silently distill your top performers",
      "team.b1_p": "When one person solves something, the rest of the team gets that solution automatically — nobody has to write it down.",
      "team.b2_t": "Any workflow plugs in",
      "team.b2_p": "Codex, Claude Code, Cursor IDE, OpenCode, OpenClaw, Trae — everyone joins the same library, synced across tools.",
      "team.b3_t": "Trajectories stay private",
      "team.b3_p": "Sessions are redacted before upload; agent privacy built in.",
      "team.b4_t": "A/B-driven evolution",
      "team.b4_p": "A change is measured per person before it spreads — more people, faster and sharper evolution.",
      "team.b5_t": "Experts can teach by hand",
      "team.b5_p": "An expert's local edit is pulled into the server as <code>user-staging/&lt;client_id&gt;</code> and feeds the next round.",

      /* ---- index: public hub ---- */
      "nav.hub": "Public hub",
      "hub.kicker": "public demo hub",
      "hub.title": "Join our public instance in one paste",
      "hub.sub": "No need to stand up your own server. Install xskill, paste the connect command below, and use your own username.",
      "hub.term_title": "public hub",
      "hub.label_host": "Host",
      "hub.label_token": "Join token",
      "hub.label_dash": "Dashboard",
      "hub.copy": "Copy",
      "hub.copied": "Copied",
      "hub.cmd_html": "<span class=\"c-com\"># 1) install  2) replace YOUR_NAME</span>\n<span class=\"c-pmt\">$</span> pip install -U xskill\n<span class=\"c-pmt\">$</span> xskill connect https://hub.xskill.wiki --token dd7f641c16ced6d1db43e754055fd2c8 --name YOUR_NAME",

      /* ---- index: why ---- */
      "why.kicker": "why xskill",
      "why.title": "Stop hand-maintaining a prompt library that rots",
      "why.f1_t": "Distilled automatically",
      "why.f1_p": "Patterns that actually worked get distilled into Skill files your agent loads automatically.",
      "why.f2_t": "Grows itself",
      "why.f2_p": "The library grows as you keep using your agent — no review queue, no one curating “best practices.”",
      "why.f3_t": "Learns from your edits",
      "why.f3_p": "Edit a Skill by hand and xskill picks up your change immediately and learns from it.",
      "why.f4_t": "UX-driven evolution",
      "why.f4_p": "A new version only replaces the old one if it measurably serves users better — not naive LLM self-grading.",

      /* ---- index: CTA ---- */
      "cta.title": "Distill your first Skill in two lines.",
      "cta.c1": "# install — Python 3.9+",
      "cta.c2": "# writes ~/.xskill/config.yaml, then exits — add your model keys",
      "cta.c3": "# run again: auto-detects your agents and starts watching",
      "cta.read": "Read the quickstart",
      "cta.star": "★ Star on GitHub",

      /* ---- footer ---- */
      "foot.tagline": "One solves it. Everyone gets it. Sand everywhere.",
      "foot.product": "Product",
      "foot.docs": "Docs",
      "foot.community": "Community",
      "foot.copy": "MIT © 370025263 — brewed under a palm tree.",

      /* ---- wiki ---- */
      "wiki.title": "xskill Wiki · docs 🥥",
      "wiki.badge": "📖 the xskill wiki",
      "wiki.h": "xskill documentation",
      "wiki.sub": "Everything below is grounded in the project README and source — no fluff.",
      "wiki.toc": "On this page",
      "wiki.back": "← Back to home",
      "wiki.edit": "Source on GitHub →",
      "w.nav_overview": "Overview",
      "w.nav_quickstart": "Quickstart",
      "w.nav_concepts": "Concepts",
      "w.nav_how": "How it works",
      "w.nav_arch": "Architecture",
      "w.nav_agents": "Supported agents",
      "w.nav_team": "Team mode",
      "w.nav_cli": "CLI reference",
      "w.nav_config": "Configuration",
      "w.nav_roadmap": "Roadmap",
      "w.nav_news": "News",
      "w.nav_license": "License",

      "w.overview_h": "Overview",
      "w.overview_p1": "Your coding agent re-derives the same solution every time it bumps into a familiar problem. You either re-explain it, or hand-maintain a prompt library that quietly rots when no one is looking. <b>xskill</b> distills reusable Skills from your agent's own execution trajectories so that work goes away.",
      "w.overview_l1": "Patterns that actually worked get distilled into Skill files your agent loads automatically.",
      "w.overview_l2": "The library grows itself as you keep using your agent — no review queue, no curated “best practices.”",
      "w.overview_l3": "Edit a Skill by hand and xskill picks up the change immediately and learns from it.",
      "w.overview_l4": "A new Skill version only replaces the old one if it measurably serves users better (UX-driven, not naive LLM self-grading).",

      "w.quickstart_h": "Quickstart",
      "w.quickstart_p1": "Install from PyPI, then run <code>serve</code> once to drop a config template:",
      "w.quickstart_p2": "Open <code>~/.xskill/config.yaml</code> and fill in two model endpoints (LLM + embedding). DeepSeek is shown for the LLM; use DashScope / OpenAI / Ollama for embeddings:",
      "w.quickstart_p3": "Run <code>xskill serve</code> again — it auto-detects every supported agent on your machine and starts watching. To also index an archive of older trajectories:",

      "w.concepts_h": "Concepts",
      "w.concepts_p": "Five terms cover the whole system:",
      "w.th_term": "Term",
      "w.th_meaning": "Meaning",

      "w.how_h": "How it works",
      "w.how_p": "A few narrow LLM agents each do one job. One splits a trajectory into single-intent Atoms; one routes each Atom to a Skill; one rewrites the <code>SKILL.md</code> once a Skill has enough material; one A/B-tests new versions on live traffic and keeps the winner. Every Skill is its own git repository, so every change is versioned and reversible.",

      "w.arch_h": "Architecture",
      "w.arch_p": "The flow, end to end: agent ecosystems → trajectory watcher → atom splitter → skill router → skill edit agent → canary A/B → skill repository, with team mode layered on top. The diagram below is the project's own <code>docs/assets/architecture.svg</code>.",

      "w.agents_h": "Supported agents",
      "w.agents_p": "Trajectory ingest and Skill install are implemented per ecosystem:",

      "w.team_h": "Team mode",
      "w.team_p": "The way xskill really wants to be deployed in an organization: one machine is the server, everyone else joins as a thin client, and the whole team works against the same evolving Skill library. <code>--name</code> is the stable user identity used for cross-device profiles.",
      "w.team_daemon_h": "Persistent client",
      "w.team_daemon_p": "On Windows, <code>xskill connect</code> automatically installs itself as a scheduled task with login startup, crash recovery, and no run-time limit.",
      "w.team_proxy_p": "<code>xskill connect</code> defaults to direct server connections and bypasses system proxies. Add <code>--use-proxy</code> only when the local proxy is the only route and can reach the server.",

      "w.cli_h": "CLI reference",
      "w.cli_p": "The <code>xskill</code> entry point. Global flags: <code>-v/--version</code>, <code>--debug</code>, <code>--quiet</code>.",
      "w.cli_serve": "Start the daemon (FastAPI + watcher). Default port 8000. <code>--server</code> turns on team-server mode (accepts client uploads and serves <code>/api/v1/team/*</code>); without it, standalone / local-only.",
      "w.cli_registry": "Manage watched directories. <code>action</code> is one of <code>add</code> / <code>remove</code> / <code>list</code>; <code>--label</code> attaches a human-friendly name.",
      "w.cli_search": "Search across registered datasets. <code>target</code> is <code>traj</code> or <code>skill</code>; <code>-k/--top-k</code> sets how many hits to return.",
      "w.cli_connect": "Join a team server as a thin client. <code>--name</code> supplies a stable identity across devices; <code>--token</code> is printed by <code>xskill serve --server</code>. <code>--foreground</code> keeps the client in the current process; <code>--use-proxy</code> opts into system proxy use.",
      "w.cli_status": "Show the client daemon state, task name, pid, server and client id.",
      "w.cli_stop": "Stop the client and remove the background task.",
      "w.cli_start": "Restart the saved connection. It requires one previous successful <code>connect</code> with a token.",

      "w.config_h": "Configuration",
      "w.config_p": "Config lives at <code>~/.xskill/config.yaml</code>; logs at <code>~/.xskill/logs/xskill.&lt;component&gt;.log</code>. Cloud-plan users with RPM/TPM quotas can add a <code>rate_limit</code> block under <code>llm</code>:",
      "w.config_p2": "Buckets are shared per <code>base_url</code> so the same key is never double-debited. Self-hosted / high-tier accounts should leave <code>rate_limit</code> out and raise <code>watcher.max_concurrent</code> instead.",

      "w.roadmap_h": "Roadmap",
      "w.rm1": "More agent adapters — Goose, OpenHands, Aider",
      "w.rm2": "Native MCP server interface (Skills exposed as tools)",
      "w.rm3": "Web UI for browsing the library and viewing canary stats",
      "w.rm4": "Skill marketplace — import / export portable bundles",
      "w.rm5": "Multi-tenant libraries (per-team skill_dir)",

      "w.news_h": "News",
      "w.news1": "<b>2026-07-07</b> — <code>v0.6.2</code>: user profiling + skill recommend engine, <code>--name</code> stable identity, SkillHub retrieval, UX score REST APIs, and Windows scheduled-task daemon.",
      "w.news2": "<b>2026-05-29</b> — Trae IDE / Trae Agent adapter.",
      "w.news3": "<b>2026-05-23</b> — <code>v0.5.0</code>: team mode (client-server), trajectory redaction, Python 3.9 support, no <code>git</code> binary needed at runtime.",
      "w.news4": "<b>2026-05-20</b> — MIT-licensed open source; on PyPI: <code>pip install xskill</code>.",
      "w.news5": "<b>2026-05-12</b> — Claude Code, Codex, OpenCode supported; OpenClaw and Cursor connected.",

      "w.license_h": "License",
      "w.license_p": "MIT © 370025263. See the LICENSE file in the repository."
    },

    zh: {
      "nav.howitworks": "工作原理",
      "nav.concepts": "概念",
      "nav.agents": "支持的 Agent",
      "nav.team": "团队模式",
      "nav.wiki": "Wiki",
      "nav.home": "首页",
      "nav.getstarted": "快速上手",
      "lang.en": "EN",
      "lang.zh": "中",

      "index.title": "xskill · 一人解决，人人复用 🥥",
      "hero.eyebrow": "已开源 · MIT · PyPI v0.6.2",
      "hero.title_a": "喂进轨迹，",
      "hero.title_b": "长出可复用技能。",
      "hero.tagline": "一人解决，人人复用。",
      "hero.lede": "你的 coding agent 每次撞上同一个问题，都把同一套解法重推一遍。<strong>xskill</strong> 把真正跑通的套路自动沉淀成 Skill 文件，agent 自己加载——你照常干活，Skill 库自己长出来。",
      "hero.cta_start": "🏖️ 快速上手",
      "hero.cta_hub": "🌐 接入公网实例",
      "hero.cta_github": "★ GitHub",
      "hero.sub": "MIT 开源 · Python 3.9+ · 不碰模型权重。",
      "float.note": "示意 —— Skill 是带版本的 git 目录，按 UX 分数留存",

      "stats.version_l": "当前版本",
      "stats.agents_l": "支持的 agent",
      "stats.python_l": "Python 版本",
      "stats.license_l": "开源协议",

      "rel.kicker": "最新版本",
      "rel.title": "v0.6.2 加入用户画像推荐",
      "rel.sub": "最新 README 重点更新了用户画像、SkillHub 检索、UX 分查询 API 和 Windows 计划任务常驻。",
      "rel.f1_t": "稳定用户身份",
      "rel.f1_p": "<code>xskill connect --name &lt;userid&gt;</code> 让同一用户跨设备、重装后仍保留同一身份。",
      "rel.f2_t": "混合推荐",
      "rel.f2_p": "recommended 桶按质量与画像相关性混合分配，staging 优先达量以支撑灰度。",
      "rel.f3_t": "UX 分查询",
      "rel.f3_p": "Dashboard API 支持按 skill 版本聚合 UX 分，并查询关联 Atom，SkillHub 条目也纳入。",
      "rel.f4_t": "Windows 常驻",
      "rel.f4_p": "<code>connect</code> 在 Windows 自动创建计划任务；用 <code>status</code>、<code>stop</code>、<code>start</code> 管理。",

      "pipe.kicker": "工作原理",
      "pipe.title": "几个职责单一的 agent，一座自己生长的库",
      "pipe.sub": "每个 Skill 都是独立 git 仓库——改了什么、谁改的、能不能回退都有据可查。",
      "pipe.s1_t": "监听",
      "pipe.s1_p": "<code>xskill serve</code> 自动识别机器上的 agent（Claude Code、Codex、OpenCode、OpenClaw、Cursor、Trae）并监听其 session。",
      "pipe.s2_t": "切成 Atom",
      "pipe.s2_p": "一个 agent 把每条轨迹切成单一意图的 <b>Atom</b>——最小可复用单元。",
      "pipe.s3_t": "路由到 Skill",
      "pipe.s3_p": "另一个 agent 把每个 Atom 路由到它所属的 Skill。",
      "pipe.s4_t": "重写 SKILL.md",
      "pipe.s4_p": "等某个 Skill 攒够素材，编辑 agent 就重写它的 <code>SKILL.md</code>。",
      "pipe.s5_t": "灰度 A/B + UX 分",
      "pipe.s5_p": "新版本在真实流量上做 A/B；<b>UX 分</b>（1–10）更高的版本胜出。",

      "agents.kicker": "支持哪些 agent",
      "agents.title": "接入你已经在用的 agent",
      "agents.sub": "每个生态的轨迹采集与 Skill 安装都已对接。",
      "agents.h_agent": "Agent",
      "agents.h_status": "状态",
      "agents.h_ingest": "轨迹采集",
      "agents.h_install": "Skill 安装",
      "agents.st_verified": "已验证",
      "agents.st_impl": "已实现",
      "agents.st_manual": "手动",
      "agents.any": "其他 agent",
      "agents.note": "状态截至 v0.6.2 · 🟡 已实现，Claude Code / Codex / OpenCode 已验证。",

      "concepts.kicker": "几个名词",
      "concepts.title": "记住五个词就懂了",
      "c.traj_t": "Trajectory（轨迹）",
      "c.traj_p": "一次 agent 执行——一段 session 的完整记录，存成 <code>traj_*.md</code>。",
      "c.atom_t": "Atom",
      "c.atom_p": "轨迹里单一意图的最小片段。路由判断发生在这一级。",
      "c.skill_t": "Skill",
      "c.skill_p": "一个 <code>SKILL.md</code> 加可选脚本，住在自己带版本的 git 目录里。",
      "c.canary_t": "Canary（灰度）",
      "c.canary_p": "现有 Skill 与候选版本在真实流量上做 A/B。",
      "c.ux_t": "UX score",
      "c.ux_p": "某个 Skill 服务用户的好坏，从交互本身打 1–10 分。灰度按这个分数选赢家。",

      "team.kicker": "真正的杀手场景",
      "team.title": "团队模式：一座库，全团队共用",
      "team.sub": "一台机器当 server，其他人作为瘦客户端接入，共用同一份自己生长的 Skill 库。",
      "team.cmd_note": "起一个 server，任意机器接入：",
      "team.b1_t": "无感蒸馏大佬员工",
      "team.b1_p": "一个人在自己工作里跑通的解法，自动让全团队复用，不需要任何人做任何事。",
      "team.b2_t": "兼容各种 coding 方式",
      "team.b2_p": "Codex、Claude Code、Cursor IDE、OpenCode、OpenClaw、Trae——都能加入同一份库，多端同步。",
      "team.b3_t": "轨迹隐私",
      "team.b3_p": "轨迹上传前先脱敏；agent 隐私内建。",
      "team.b4_t": "灰度驱动的进化",
      "team.b4_p": "一个改动先在每个人身上分别衡量，赢了再扩散——人越多，进化越准越快。",
      "team.b5_t": "专家手动指导",
      "team.b5_p": "专家本地的修改会作为 <code>user-staging/&lt;client_id&gt;</code> 拉进服务器，喂给下一轮进化。",

      "nav.hub": "公网实例",
      "hub.kicker": "公网演示实例",
      "hub.title": "一键粘贴，接入我们的公网实例",
      "hub.sub": "不用自己搭服务端。装好 xskill，粘贴下面这条连接命令，再填上你自己的用户名即可。",
      "hub.term_title": "公网实例",
      "hub.label_host": "地址",
      "hub.label_token": "连接令牌",
      "hub.label_dash": "控制台",
      "hub.copy": "复制",
      "hub.copied": "已复制",
      "hub.cmd_html": "<span class=\"c-com\"># 1）安装　2）把 YOUR_NAME 换成你的用户名</span>\n<span class=\"c-pmt\">$</span> pip install -U xskill\n<span class=\"c-pmt\">$</span> xskill connect https://hub.xskill.wiki --token dd7f641c16ced6d1db43e754055fd2c8 --name YOUR_NAME",

      "why.kicker": "为什么用 xskill",
      "why.title": "别再手动维护一份会腐烂的 prompt 库",
      "why.f1_t": "自动蒸馏",
      "why.f1_p": "跑通过的解题套路自动沉淀成 Skill 文件，agent 自己加载。",
      "why.f2_t": "自己生长",
      "why.f2_p": "你照常用 agent 干活，Skill 库自己长出来——没有审核队列，没人需要去“挑选最佳实践”。",
      "why.f3_t": "向你的手改学习",
      "why.f3_p": "你手改某个 Skill，xskill 会立即借鉴、重点学习。",
      "why.f4_t": "UX 驱动进化",
      "why.f4_p": "新版本只有真把用户服务得更好才会顶掉老版本——而非简单的 LLM 开环自评。",

      "cta.title": "两行命令，蒸出第一个 Skill。",
      "cta.c1": "# 安装 —— 需要 Python 3.9+",
      "cta.c2": "# 生成 ~/.xskill/config.yaml 模板后退出 —— 填上你的模型 key",
      "cta.c3": "# 再跑一次：自动识别 agent 并开始监听",
      "cta.read": "阅读快速上手",
      "cta.star": "★ 去 GitHub 点星",

      "foot.tagline": "一人解决，人人复用。满地是沙。",
      "foot.product": "产品",
      "foot.docs": "文档",
      "foot.community": "社区",
      "foot.copy": "MIT © 370025263 —— 椰树下手作。",

      "wiki.title": "xskill Wiki · 文档 🥥",
      "wiki.badge": "📖 xskill wiki",
      "wiki.h": "xskill 文档",
      "wiki.sub": "下面每一条都源自项目 README 与源码——不掺水。",
      "wiki.toc": "本页目录",
      "wiki.back": "← 回首页",
      "wiki.edit": "在 GitHub 查看源 →",
      "w.nav_overview": "概览",
      "w.nav_quickstart": "快速上手",
      "w.nav_concepts": "概念",
      "w.nav_how": "工作原理",
      "w.nav_arch": "架构",
      "w.nav_agents": "支持的 agent",
      "w.nav_team": "团队模式",
      "w.nav_cli": "CLI 参考",
      "w.nav_config": "配置",
      "w.nav_roadmap": "Roadmap",
      "w.nav_news": "动态",
      "w.nav_license": "License",

      "w.overview_h": "概览",
      "w.overview_p1": "agent 每次撞上同一个问题，都会把同一套解法重推一遍。你要么再讲一遍，要么自己维护一份 prompt 库——而这份库没人看的时候就慢慢腐烂。<b>xskill</b> 从 agent 自己的执行轨迹里蒸馏出可复用的 Skill，把这件事接管掉。",
      "w.overview_l1": "跑通过的解题套路自动沉淀成 Skill 文件，agent 自己加载。",
      "w.overview_l2": "你照常用 agent 干活，Skill 库自己长出来——没有审核队列，没人挑选“最佳实践”。",
      "w.overview_l3": "你手改某个 Skill，xskill 会立即借鉴、重点学习。",
      "w.overview_l4": "新版本只有真把用户服务得更好，才会顶掉老版本（UX 驱动，而非简单 LLM 自评）。",

      "w.quickstart_h": "快速上手",
      "w.quickstart_p1": "从 PyPI 安装，先跑一次 <code>serve</code> 生成配置模板：",
      "w.quickstart_p2": "打开 <code>~/.xskill/config.yaml</code>，填好两个模型 endpoint（LLM + embedding）。LLM 示例用 DeepSeek；DeepSeek 没有 embedding，可用 DashScope / OpenAI / Ollama：",
      "w.quickstart_p3": "再跑一次 <code>xskill serve</code>，它会自动扫机器上装好的所有 agent 并开始监听。若还有历史轨迹归档想一起吃进来：",

      "w.concepts_h": "概念",
      "w.concepts_p": "五个术语覆盖整个系统：",
      "w.th_term": "术语",
      "w.th_meaning": "含义",

      "w.how_h": "工作原理",
      "w.how_p": "几个职责单一的 LLM agent 各管一摊：一个把轨迹切成单一意图的 Atom；一个把每个 Atom 路由到对应 Skill；一个等某个 Skill 攒够素材了就重写它的 <code>SKILL.md</code>；一个在真实流量上 A/B 测试新版本，留下赢家。每个 Skill 本身就是一个独立 git 仓库，改了什么、能不能回退都有据可查。",

      "w.arch_h": "架构",
      "w.arch_p": "端到端的流程：agent 生态 → 轨迹监听 → Atom 切分 → Skill 路由 → Skill 编辑 agent → Canary A/B → Skill 仓库，团队模式叠在最上层。下图就是项目自带的 <code>docs/assets/architecture.svg</code>。",

      "w.agents_h": "支持的 agent",
      "w.agents_p": "每个生态的轨迹采集与 Skill 安装都已分别实现：",

      "w.team_h": "团队模式",
      "w.team_p": "xskill 真正想在组织里铺开的形态：一台机器当 server，其他人作为瘦客户端接入，全团队共用同一份自己生长的 Skill 库。<code>--name</code> 是跨设备画像使用的稳定用户身份。",
      "w.team_daemon_h": "常驻运行",
      "w.team_daemon_p": "Windows 下 <code>xskill connect</code> 会自动把自己装成计划任务，支持登录自启、崩溃自愈、不限运行时长。",
      "w.team_proxy_p": "<code>xskill connect</code> 默认直连 server、绕开系统代理。只有本机唯一出网路径就是代理，且代理能到 server 时，才加 <code>--use-proxy</code>。",

      "w.cli_h": "CLI 参考",
      "w.cli_p": "<code>xskill</code> 入口。全局参数：<code>-v/--version</code>、<code>--debug</code>、<code>--quiet</code>。",
      "w.cli_serve": "启动守护进程（FastAPI + watcher），默认端口 8000。<code>--server</code> 开启团队 server 模式（收 client 上传、提供 <code>/api/v1/team/*</code>）；不加则 standalone / 仅本机。",
      "w.cli_registry": "管理被监听的目录。<code>action</code> 取 <code>add</code> / <code>remove</code> / <code>list</code>；<code>--label</code> 附一个可读名字。",
      "w.cli_search": "跨已注册数据集检索。<code>target</code> 取 <code>traj</code> 或 <code>skill</code>；<code>-k/--top-k</code> 控制返回条数。",
      "w.cli_connect": "作为瘦客户端加入团队 server。<code>--name</code> 提供跨设备稳定身份；<code>--token</code> 由 <code>xskill serve --server</code> 打印。<code>--foreground</code> 让 client 留在当前进程；<code>--use-proxy</code> 显式走系统代理。",
      "w.cli_status": "查看 client 常驻状态、任务名、pid、server 和 client id。",
      "w.cli_stop": "停止 client，并撤销后台任务。",
      "w.cli_start": "重新启动已保存的连接。必须先成功执行过一次带 token 的 <code>connect</code>。",

      "w.config_h": "配置",
      "w.config_p": "配置在 <code>~/.xskill/config.yaml</code>；日志在 <code>~/.xskill/logs/xskill.&lt;component&gt;.log</code>。有 RPM/TPM 配额的云账号可在 <code>llm</code> 下加 <code>rate_limit</code>：",
      "w.config_p2": "令牌桶按 <code>base_url</code> 共享，同一个 key 不会被重复扣减。自建 / 高配额账号应不写 <code>rate_limit</code>，转而调高 <code>watcher.max_concurrent</code>。",

      "w.roadmap_h": "Roadmap",
      "w.rm1": "更多 agent adapter：Goose、OpenHands、Aider",
      "w.rm2": "原生 MCP server 接口（把 Skill 暴露成 tool）",
      "w.rm3": "Web UI：浏览 Skill 库、看灰度数据",
      "w.rm4": "Skill marketplace：导入 / 导出可移植 bundle",
      "w.rm5": "多租户 Skill 库（每个团队独立 skill_dir）",

      "w.news_h": "动态",
      "w.news1": "<b>2026-07-07</b> — <code>v0.6.2</code>：用户画像 + skill 推荐引擎、<code>--name</code> 稳定身份、SkillHub 检索、UX 分 REST API、Windows 计划任务后台常驻。",
      "w.news2": "<b>2026-05-29</b> — 新增 Trae IDE / Trae Agent 适配。",
      "w.news3": "<b>2026-05-23</b> — <code>v0.5.0</code>：团队模式（client-server）、轨迹脱敏、Python 3.9 支持、运行时无需 <code>git</code> 二进制。",
      "w.news4": "<b>2026-05-20</b> — MIT 开源，PyPI 上架：<code>pip install xskill</code>。",
      "w.news5": "<b>2026-05-12</b> — Claude Code、Codex、OpenCode 支持；OpenClaw、Cursor 对接。",

      "w.license_h": "License",
      "w.license_p": "MIT © 370025263。详见仓库内的 LICENSE 文件。"
    }
  };

  function detect() {
    const saved = localStorage.getItem("xskill_lang");
    if (saved === "en" || saved === "zh") return saved;
    return (navigator.language || "").toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
  }

  function apply(lang) {
    const dict = I18N[lang] || I18N.en;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const v = dict[el.getAttribute("data-i18n")];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      const v = dict[el.getAttribute("data-i18n-html")];
      if (v != null) el.innerHTML = v;
    });
    const titleKey = document.body.getAttribute("data-title-key");
    if (titleKey && dict[titleKey]) document.title = dict[titleKey];
    document.querySelectorAll("[data-set-lang]").forEach(function (b) {
      b.classList.toggle("is-on", b.getAttribute("data-set-lang") === lang);
    });
    localStorage.setItem("xskill_lang", lang);
    window.__xskillLang = lang;
  }

  window.xskillApplyLang = apply;
  window.xskillLang = detect;

  document.addEventListener("click", function (e) {
    const b = e.target.closest && e.target.closest("[data-set-lang]");
    if (b) { e.preventDefault(); apply(b.getAttribute("data-set-lang")); }
  });

  // apply ASAP (script is loaded at end of <body>, DOM is ready)
  apply(detect());
})();
