#!/usr/bin/env bash
# Antes de publicar: põe ?v=<commit> em todo js e css das páginas e o mesmo carimbo no sw.js.
# Assim cada publicação tem endereços novos, o service worker guarda tudo sem medo e apaga a versão velha.
# Só mexe na cópia da Action (nada disso volta para o repositório).
set -euo pipefail
carimbo="${GITHUB_SHA:-$(git rev-parse HEAD)}"
carimbo="${carimbo:0:10}"
for pagina in *.html; do
  sed -E -i "s#(src|href)=\"((js|estilos)/[^\"?]+\.(js|css))(\?v=[^\"]*)?\"#\1=\"\2?v=${carimbo}\"#g" "$pagina"
done
sed -i "s/const CARIMBO = \"DEV\";/const CARIMBO = \"${carimbo}\";/" sw.js
grep -q "const CARIMBO = \"${carimbo}\";" sw.js || { echo "::error::não consegui carimbar o sw.js"; exit 1; }
echo "Carimbo ${carimbo}: $(grep -o "?v=${carimbo}" index.html | wc -l) arquivos no index.html"
if [ -f .github/minificar.js ]; then
  node .github/minificar.js
fi
