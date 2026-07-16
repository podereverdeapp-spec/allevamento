-- =====================================================================
-- Registrazione massiva parti - 3 scrofe Large White x LGWH01
-- Include lotti + unità + eventi riproduttivi (per KPI Selezione Genetica)
-- =====================================================================

-- --- Lotto 2310LL01: LGWHFEMM01 x LGWH01, parto 2023-10-15 (tot=12 vivi=10 morti=2) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM01'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2023-10-15', 'Large White', 'Large White', 12, 10, 2, '2310LL01', '2310LL01', 2023
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2310LL0101', 'F', 0.5),
    (2, '2310LL0102', 'F', 0.5),
    (3, '2310LL0103', 'F', 0.5),
    (4, '2310LL0104', 'F', 0.5),
    (5, '2310LL0105', 'F', 0.5),
    (6, '2310LL0106', 'F', 0.5),
    (7, '2310LL0107', 'M', 0.5),
    (8, '2310LL0108', 'M', 0.5),
    (9, '2310LL0109', 'M', 0.5),
    (10, '2310LL0110', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM01'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2023-10-15', 10, 2, 0,
  'Lotto 2310LL01 - importato in blocco'
);

-- --- Lotto 2311LL02: LGWHFEMM02 x LGWH01, parto 2023-11-03 (tot=12 vivi=7 morti=5) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM02'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2023-11-03', 'Large White', 'Large White', 12, 7, 5, '2311LL02', '2311LL02', 2023
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2311LL0201', 'F', 0.5),
    (2, '2311LL0202', 'F', 0.5),
    (3, '2311LL0203', 'F', 0.5),
    (4, '2311LL0204', 'F', 0.5),
    (5, '2311LL0205', 'M', 0.5),
    (6, '2311LL0206', 'M', 0.5),
    (7, '2311LL0207', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM02'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2023-11-03', 7, 5, 0,
  'Lotto 2311LL02 - importato in blocco'
);

-- --- Lotto 2311LL03: LGWHFEMM03 x LGWH01, parto 2023-11-22 (tot=12 vivi=8 morti=4) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM03'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2023-11-22', 'Large White', 'Large White', 12, 8, 4, '2311LL03', '2311LL03', 2023
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2311LL0301', 'F', 0.5),
    (2, '2311LL0302', 'F', 0.5),
    (3, '2311LL0303', 'F', 0.5),
    (4, '2311LL0304', 'F', 0.5),
    (5, '2311LL0305', 'F', 0.5),
    (6, '2311LL0306', 'M', 0.5),
    (7, '2311LL0307', 'M', 0.5),
    (8, '2311LL0308', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM03'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2023-11-22', 8, 4, 0,
  'Lotto 2311LL03 - importato in blocco'
);
