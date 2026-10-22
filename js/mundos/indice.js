/*
  Depois que todos os mundos adicionaram seus itens, cria o índice ITEM[id] -> item.
*/
"use strict";

const ITEM = Object.fromEntries(ITEMS.map(i => [i.id, i]));
