#!/usr/bin/env bash
# Publica uma parte do Prumo no Firebase (hosting ou firestore:rules).
# Se der erro, o fim do log vira um aviso no resumo da Action (dá para ler sem abrir o log).
set -o pipefail
log="$RUNNER_TEMP/publicar-${1//[^a-z]/}.log"
if ! npx --yes firebase-tools@15 deploy --only "$1" --project prumo-66d76 --non-interactive 2>&1 | tee "$log"; then
  resumo=$(sed 's/\x1b\[[0-9;]*m//g' "$log" | grep -v -e '^\s*$' -e 'npm warn' | tail -n 15 | sed 's/%/%25/g' | sed ':a;N;$!ba;s/\n/%0A/g')
  echo "::error title=Falha ao publicar $1::$resumo"
  exit 1
fi
