#!/usr/bin/env bash
# GitHub webhook 触发：fast-forward 到 origin/main。
# 本站是静态 HTML，python http.server 每次请求读盘，ff 后无需 rebuild/restart。
# 工作区有未提交改动时拒绝拉取，避免把本机正在改的东西冲掉。
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/.." && pwd)"
LOCK="$HERE/.deploy.lock"
LOG="$HERE/deploy.log"
BRANCH="${XSKILL_WIKI_DEPLOY_BRANCH:-main}"
NODE_BIN="${XSKILL_WIKI_NODE_BIN:-/home/admin/.nvm/versions/node/v24.14.1/bin}"

export HOME="${HOME:-/home/admin}"
export PATH="${NODE_BIN}:/home/admin/.local/bin:/home/admin/bin:/usr/local/bin:/usr/bin:${PATH:-}"
export GIT_SSH_COMMAND="${GIT_SSH_COMMAND:-ssh -i /home/admin/.ssh/id_rsa -o StrictHostKeyChecking=yes -o IdentitiesOnly=yes}"

exec 9>"$LOCK"
if ! flock -n 9; then
  echo "$(date -Is) skip: another deploy is running" >>"$LOG"
  exit 0
fi

{
  echo "==== $(date -Is) ===="
  cd "$REPO"

  git fetch origin "$BRANCH"

  local_head="$(git rev-parse HEAD)"
  remote_head="$(git rev-parse "origin/${BRANCH}")"
  if [[ "$local_head" == "$remote_head" ]]; then
    echo "already at origin/${BRANCH} ${remote_head:0:12}; nothing to deploy"
    exit 0
  fi

  if [[ -n "$(git status --porcelain)" ]]; then
    echo "REFUSE: working tree dirty, will not merge origin/${BRANCH}" >&2
    git status --porcelain | head -n 40 >&2
    exit 1
  fi

  git merge --ff-only "origin/${BRANCH}"
  new_head="$(git rev-parse HEAD)"
  echo "fast-forward ${local_head:0:12} -> ${new_head:0:12}"
  echo "deploy ok ${new_head:0:12} (static; no restart of :8009)"
} >>"$LOG" 2>&1
