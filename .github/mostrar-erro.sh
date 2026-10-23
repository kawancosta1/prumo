#!/usr/bin/env bash
# Roda um comando e, se falhar, mostra o fim da saída como aviso no resumo da Action.
# Uso: bash .github/mostrar-erro.sh "Título" comando args...
set -o pipefail
titulo="$1"
shift
log="$(mktemp)"
if ! "$@" 2>&1 | tee "$log"; then
  resumo=$(sed 's/\x1b\[[0-9;]*m//g' "$log" | grep -v -e '^\s*$' -e 'npm warn' -e '^::' | tail -n 25 | sed 's/%/%25/g' | sed ':a;N;$!ba;s/\n/%0A/g')
  echo "::error title=${titulo}::${resumo}"
  exit 1
fi
