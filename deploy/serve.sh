#!/usr/bin/env bash
# serve.sh —— xskill.wiki 静态站点的生命周期管理
#
# 在 10.255.1.1:8009 伺服仓库根目录静态文件。10.255.1.1 是 docker bridge 网关，
# 即 patentdagger-nginx-1 容器看到的宿主地址，公网 IP 上不直接暴露该端口。
#
# GitHub webhook 监听 10.255.1.1:8029，由 nginx 把
# https://xskill.wiki/_github-deploy 反代过来。密钥在
# ~/.config/xskill-wiki/webhook.secret，不入库。
#
# 用法:
#   ./serve.sh up | down | status | restart | build
#   ./serve.sh webhook-up | webhook-down | webhook-status
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/.." && pwd)"
ROOT="$REPO"
ADDR=10.255.1.1
PORT=8009
WEBHOOK_PORT=8029
SECRET_FILE="${XSKILL_WIKI_WEBHOOK_SECRET:-/home/admin/.config/xskill-wiki/webhook.secret}"
CANONICAL_FILE="${XSKILL_WIKI_CANONICAL:-/home/admin/.config/xskill-wiki/canonical.path}"
# 绝对路径优先：PATH 上的 ~/.local/bin/python3.11 是坏的 uv 托管解释器。
# 需要 3.7+（http.server 的 --directory / --bind），系统 /usr/bin/python3 是 3.6。
for cand in /usr/bin/python3.11 /usr/bin/python3.8 "$(command -v python3)"; do
  if [[ -x "$cand" ]] && "$cand" -c 'import sys; sys.exit(0 if sys.version_info >= (3, 7) else 1)' 2>/dev/null; then
    PY="$cand"; break
  fi
done
: "${PY:?no usable python3.7+ found}"
PIDFILE="$HERE/.serve.pid"
LOG="$HERE/serve.log"
WEBHOOK_PIDFILE="$HERE/.webhook.pid"
WEBHOOK_LOG="$HERE/webhook.log"

mkdir -p "$(dirname "$CANONICAL_FILE")"
printf '%s\n' "$REPO" >"$CANONICAL_FILE"

alive() { [[ -f "$PIDFILE" ]] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; }
webhook_alive() { [[ -f "$WEBHOOK_PIDFILE" ]] && kill -0 "$(cat "$WEBHOOK_PIDFILE")" 2>/dev/null; }

port_pid() {
  local p
  p="$(ss -lptn "sport = :$PORT" 2>/dev/null | awk '/LISTEN/ {print $NF}' | sed -n 's/.*pid=\([0-9]*\).*/\1/p' | head -n1 || true)"
  if [[ -z "$p" ]]; then
    p="$(lsof -t -iTCP:$PORT -sTCP:LISTEN 2>/dev/null | head -n1 || true)"
  fi
  printf '%s' "$p"
}

start_static() {
  if alive; then
    echo "[xskill-wiki] already running, pid=$(cat "$PIDFILE")"
    return 0
  fi
  existing="$(port_pid || true)"
  if [[ -n "$existing" ]]; then
    echo "$existing" >"$PIDFILE"
    echo "[xskill-wiki] adopted existing listener pid=$existing http://${ADDR}:${PORT}/"
    return 0
  fi
  if [[ ! -f "$ROOT/index.html" ]]; then
    echo "[xskill-wiki] no index.html at $ROOT" >&2
    return 1
  fi
  setsid nohup "$PY" -m http.server "$PORT" --bind "$ADDR" --directory "$ROOT" \
    >>"$LOG" 2>&1 </dev/null &
  echo $! >"$PIDFILE"
  for _ in $(seq 1 20); do
    if curl -fsS -o /dev/null "http://${ADDR}:${PORT}/"; then
      echo "[xskill-wiki] up pid=$(cat "$PIDFILE") http://${ADDR}:${PORT}/"
      return 0
    fi
    sleep 0.5
  done
  echo "[xskill-wiki] FAILED to start, see $LOG" >&2
  tail -n 20 "$LOG" >&2 || true
  rm -f "$PIDFILE"
  return 1
}

stop_static() {
  if alive; then
    pid=$(cat "$PIDFILE")
    kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
    echo "[xskill-wiki] stopped pid=$pid"
  else
    echo "[xskill-wiki] not running via pidfile"
  fi
  rm -f "$PIDFILE"
}

start_webhook() {
  if webhook_alive; then
    echo "[webhook] already running, pid=$(cat "$WEBHOOK_PIDFILE")"
    return 0
  fi
  if [[ ! -f "$SECRET_FILE" ]]; then
    echo "[webhook] skip: no secret at $SECRET_FILE" >&2
    return 0
  fi
  export XSKILL_WIKI_WEBHOOK_SECRET="$SECRET_FILE"
  export XSKILL_WIKI_DEPLOY_SH="$HERE/pull_and_deploy.sh"
  export XSKILL_WIKI_WEBHOOK_HOST="$ADDR"
  export XSKILL_WIKI_WEBHOOK_PORT="$WEBHOOK_PORT"
  export XSKILL_WIKI_DEPLOY_BRANCH="${XSKILL_WIKI_DEPLOY_BRANCH:-main}"
  setsid nohup "$PY" "$HERE/webhook_server.py" \
    >>"$WEBHOOK_LOG" 2>&1 </dev/null &
  echo $! >"$WEBHOOK_PIDFILE"
  for _ in $(seq 1 20); do
    if curl -sS -o /dev/null -w '%{http_code}' "http://${ADDR}:${WEBHOOK_PORT}/_github-deploy" | grep -qE '404|401'; then
      echo "[webhook] up pid=$(cat "$WEBHOOK_PIDFILE") http://${ADDR}:${WEBHOOK_PORT}/_github-deploy"
      return 0
    fi
    sleep 0.5
  done
  echo "[webhook] FAILED to start, see $WEBHOOK_LOG" >&2
  tail -n 20 "$WEBHOOK_LOG" >&2 || true
  rm -f "$WEBHOOK_PIDFILE"
  return 1
}

stop_webhook() {
  if webhook_alive; then
    pid=$(cat "$WEBHOOK_PIDFILE")
    kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
    echo "[webhook] stopped pid=$pid"
  else
    echo "[webhook] not running"
  fi
  rm -f "$WEBHOOK_PIDFILE"
}

case "${1:-}" in
  build)
    echo "[xskill-wiki] static tree; nothing to build"
    ;;
  up)
    start_static
    start_webhook
    ;;
  down)
    stop_static
    ;;
  status)
    if alive; then
      echo "[xskill-wiki] RUNNING pid=$(cat "$PIDFILE") ${ADDR}:${PORT}"
      ss -ltn 2>/dev/null | grep ":$PORT " || echo "  (warning: no listener)"
    else
      existing="$(port_pid || true)"
      if [[ -n "$existing" ]]; then
        echo "[xskill-wiki] LISTENING pid=$existing ${ADDR}:${PORT} (no pidfile)"
      else
        echo "[xskill-wiki] STOPPED"
      fi
    fi
    if webhook_alive; then
      echo "[webhook] RUNNING pid=$(cat "$WEBHOOK_PIDFILE") ${ADDR}:${WEBHOOK_PORT}"
    else
      echo "[webhook] STOPPED"
    fi
    ;;
  restart)
    echo "[xskill-wiki] refuse restart while live site must stay up; use webhook-up" >&2
    start_webhook
    ;;
  webhook-up)
    start_webhook
    ;;
  webhook-down)
    stop_webhook
    ;;
  webhook-status)
    if webhook_alive; then
      echo "[webhook] RUNNING pid=$(cat "$WEBHOOK_PIDFILE") ${ADDR}:${WEBHOOK_PORT}"
    else
      echo "[webhook] STOPPED"
    fi
    ;;
  *)
    echo "usage: $0 {up|down|status|restart|build|webhook-up|webhook-down|webhook-status}" >&2
    exit 2
    ;;
esac
