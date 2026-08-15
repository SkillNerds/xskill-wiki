# xskill.wiki deploy

Live site is static HTML at repo root, served on `10.255.1.1:8009`.

- `serve.sh webhook-up` — GitHub webhook on `:8029`
- `pull_and_deploy.sh` — `git fetch` + ff-only to `origin/main` (no restart)

Webhook URL: `https://xskill.wiki/_github-deploy`
Secret file (not in git): `/home/admin/.config/xskill-wiki/webhook.secret`
