/* ===================================================================
   calcados-calcas.js - Catálogo Oficial de Calçados e Calças para os 17 Mundos
   Implementa calçados e calças anatômicos de alta definição, com sombreamento
   volumétrico 2.5D, texturas e pespontos sem truncar o mascote.
   =================================================================== */
"use strict";

(function () {
  const NOVOS_ITENS = [
    // 1. ROCK
    {
      id: "rock_coturno_rebites",
      p: "rock",
      slot: "shoes",
      name: "Coturno com spikes",
      price: 110,
      svg: () => shoesBoots("#18181B", "#DC2626")
    },
    {
      id: "rock_jeans_rasgado",
      p: "rock",
      slot: "waist",
      name: "Jeans destroyed",
      price: 120,
      svg: () => pantsJeans("#1E293B", "#94A3B8")
    },

    // 2. EMO
    {
      id: "emo_allstar_cano_alto",
      p: "emo",
      slot: "shoes",
      name: "All-Star clássico",
      price: 100,
      svg: () => shoesAllStar("#09090B")
    },
    {
      id: "emo_skinny_preta",
      p: "emo",
      slot: "waist",
      name: "Calça skinny com correntes",
      price: 115,
      svg: () => pantsJeans("#0F172A", "#64748B")
    },

    // 3. OTAKU
    {
      id: "otaku_sneaker_anime",
      p: "otaku",
      slot: "shoes",
      name: "Sneaker mecha anime",
      price: 120,
      svg: () => shoesSneaker("#F8FAFC", "#0284C7", "#EA580C")
    },
    {
      id: "otaku_calca_cargo",
      p: "otaku",
      slot: "waist",
      name: "Calça cargo shonen",
      price: 110,
      svg: () => pantsJeans("#334155", "#F59E0B")
    },

    // 4. GAMER
    {
      id: "gamer_sneaker_rgb",
      p: "gamer",
      slot: "shoes",
      name: "Tênis com LED RGB",
      price: 130,
      svg: () => shoesSneaker("#09090B", "#10B981", "#8B5CF6")
    },
    {
      id: "gamer_jogger_tech",
      p: "gamer",
      slot: "waist",
      name: "Jogger techwear refletiva",
      price: 125,
      svg: () => pantsTactel("#18181B", "#10B981")
    },

    // 5. CLEANBOY
    {
      id: "clean_tenis_minimal",
      p: "cleanboy",
      slot: "shoes",
      name: "Tênis couro premium",
      price: 120,
      svg: () => shoesSneaker("#FFFFFF", "#F1F5F9", "#94A3B8")
    },
    {
      id: "clean_chino_bege",
      p: "cleanboy",
      slot: "waist",
      name: "Calça chino alfaiataria",
      price: 115,
      svg: () => pantsSocial("#D7CCC8", "#A1887F")
    },

    // 6. PROGRAMADOR
    {
      id: "prog_sneaker_slipon",
      p: "programador",
      slot: "shoes",
      name: "Tênis slip-on ergonômico",
      price: 95,
      svg: () => shoesSneaker("#334155", "#1E293B", "#38BDF8")
    },
    {
      id: "prog_calca_confort",
      p: "programador",
      slot: "waist",
      name: "Calça moletom dev",
      price: 90,
      svg: () => pantsTactel("#475569", "#38BDF8")
    },

    // 7. BRUXO
    {
      id: "bru_calca_mistica",
      p: "bruxo",
      slot: "waist",
      name: "Calça de veludo mística",
      price: 110,
      svg: () => pantsSocial("#2E1065", "#A855F7")
    },

    // 8. FEITICEIRO
    {
      id: "feit_botas_arcanas",
      p: "feiticeiro",
      slot: "shoes",
      name: "Botas de couro arcano",
      price: 115,
      svg: () => shoesBoots("#3B0764", "#EAB308")
    },
    {
      id: "feit_tunica_calca",
      p: "feiticeiro",
      slot: "waist",
      name: "Manto e calça astral",
      price: 120,
      svg: () => pantsSocial("#1E1B4B", "#6366F1")
    },

    // 9. COACH
    {
      id: "coach_tenis_running",
      p: "coach",
      slot: "shoes",
      name: "Tênis alta performance",
      price: 130,
      svg: () => shoesSneaker("#0F172A", "#EF4444", "#F97316")
    },
    {
      id: "coach_calca_compressao",
      p: "coach",
      slot: "waist",
      name: "Calça compressão pro",
      price: 110,
      svg: () => pantsTactel("#0F172A", "#EF4444")
    },

    // 10. FORROZEIRO
    {
      id: "forro_botas_couro",
      p: "forrozeiro",
      slot: "shoes",
      name: "Botas de couro artesanal",
      price: 105,
      svg: () => shoesBoots("#78350F", "#F59E0B")
    },
    {
      id: "forro_calca_brim",
      p: "forrozeiro",
      slot: "waist",
      name: "Calça de brim batido",
      price: 95,
      svg: () => pantsJeans("#92400E", "#FBBF24")
    },

    // 11. FUNKEIRO
    {
      id: "funk_tenis_mola",
      p: "funkeiro",
      slot: "shoes",
      name: "Tênis de 4 molas",
      price: 140,
      svg: () => shoesSneaker("#FFFFFF", "#E11D48", "#1E40AF")
    },

    // 12. PAGODEIRO
    {
      id: "pago_mocassim_branco",
      p: "pagodeiro",
      slot: "shoes",
      name: "Mocassim branco da roda",
      price: 110,
      svg: () => shoesSneaker("#F8FAFC", "#E2E8F0", "#D97706")
    },
    {
      id: "pago_calca_linho",
      p: "pagodeiro",
      slot: "waist",
      name: "Calça de linho fino",
      price: 105,
      svg: () => pantsSocial("#FEF3C7", "#D97706")
    },

    // 13. RAPPER
    {
      id: "rap_sneaker_chunky",
      p: "rapper",
      slot: "shoes",
      name: "Sneaker retrô anos 90",
      price: 135,
      svg: () => shoesSneaker("#111827", "#F59E0B", "#DC2626")
    },
    {
      id: "rap_calca_baggy",
      p: "rapper",
      slot: "waist",
      name: "Calça baggy oversized",
      price: 125,
      svg: () => pantsJeans("#1E3A8A", "#E0B23A")
    },

    // 14. SERTANEJO
    {
      id: "sert_botas_texanas",
      p: "sertanejo",
      slot: "shoes",
      name: "Botas texanas de rodeio",
      price: 120,
      svg: () => shoesBoots("#451A03", "#D97706")
    },
    {
      id: "sert_jeans_bruto",
      p: "sertanejo",
      slot: "waist",
      name: "Calça jeans cowboy",
      price: 110,
      svg: () => pantsJeans("#172554", "#D97706")
    },

    // 15. TRAPPER
    {
      id: "trap_sneaker_designer",
      p: "trapper",
      slot: "shoes",
      name: "Sneaker de grife tratorado",
      price: 145,
      svg: () => shoesSneaker("#000000", "#7C3AED", "#EC4899")
    },
    {
      id: "trap_calca_resinada",
      p: "trapper",
      slot: "waist",
      name: "Calça resinada com zíper",
      price: 130,
      svg: () => pantsJeans("#020617", "#A855F7")
    },

    // 16. VOVO
    {
      id: "vovo_pantufas_nuvem",
      p: "vovo",
      slot: "shoes",
      name: "Pantufas quentinhas",
      price: 80,
      svg: () => shoesFluffy("#FBCFE8")
    },
    {
      id: "vovo_calca_flanela",
      p: "vovo",
      slot: "waist",
      name: "Calça de flanela xadrez",
      price: 85,
      svg: () => pantsTactel("#FDA4AF", "#BE123C")
    },

    // 17. ZEN
    {
      id: "zen_sandalias_bambu",
      p: "zen",
      slot: "shoes",
      name: "Sandálias de bambu",
      price: 85,
      svg: () => shoesFluffy("#D1FAE5")
    },
    {
      id: "zen_calca_pescador",
      p: "zen",
      slot: "waist",
      name: "Calça pescador fluida",
      price: 90,
      svg: () => pantsSocial("#CCFBF1", "#0D9488")
    }
  ];

  // Injetar no catálogo oficial ITEMS
  if (typeof ITEMS !== "undefined") {
    NOVOS_ITENS.forEach(it => {
      if (!ITEMS.some(existente => existente.id === it.id)) {
        ITEMS.push(it);
      }
    });
  }

  // Se ITEM já tiver sido gerado, atualiza o mapa
  if (typeof ITEM !== "undefined") {
    NOVOS_ITENS.forEach(it => {
      ITEM[it.id] = it;
    });
  }
})();
