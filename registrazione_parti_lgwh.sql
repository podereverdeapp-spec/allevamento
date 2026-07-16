-- =====================================================================
-- Registrazione massiva parti Large White - 16 scrofe, 52 cucciolate
-- Include lotti + unità + eventi riproduttivi
-- =====================================================================

-- --- Lotto 2404LL01: LGWHFEMM01 x LGWH01, parto 2024-04-27 (tot=13 vivi=7 morti=6) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM01'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-04-27', 'Large White', 'Large White', 13, 7, 6, '2404LL01', '2404LL01', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2404LL0101', 'F', 0.5),
    (2, '2404LL0102', 'F', 0.5),
    (3, '2404LL0103', 'F', 0.5),
    (4, '2404LL0104', 'M', 0.5),
    (5, '2404LL0105', 'M', 0.5),
    (6, '2404LL0106', 'F', 0.5),
    (7, '2404LL0107', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM01'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-04-27', 7, 6, 0,
  'Lotto 2404LL01 - importato in blocco'
);

-- --- Lotto 2506LL01: LGWHFEMM01 x LGWH01, parto 2025-06-15 (tot=13 vivi=1 morti=12) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM01'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2025-06-15', 'Large White', 'Large White', 13, 1, 12, '2506LL01', '2506LL01', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2506LL0101', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM01'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2025-06-15', 1, 12, 0,
  'Lotto 2506LL01 - importato in blocco'
);

-- --- Lotto 2512LL01: LGWHFEMM01 x LGWH01, parto 2025-12-10 (tot=9 vivi=5 morti=4) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM01'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2025-12-10', 'Large White', 'Large White', 9, 5, 4, '2512LL01', '2512LL01', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2512LL0101', 'M', 0.5),
    (2, '2512LL0102', 'F', 0.5),
    (3, '2512LL0103', 'M', 0.5),
    (4, '2512LL0104', 'F', 0.5),
    (5, '2512LL0105', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM01'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2025-12-10', 5, 4, 0,
  'Lotto 2512LL01 - importato in blocco'
);

-- --- Lotto 2605LC01: LGWHFEMM01 x IT349388, parto 2026-05-12 (tot=12 vivi=10 morti=2) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM01'),
    (SELECT id FROM animali WHERE bdn='IT349388'),
    '2026-05-12', 'Large White', 'Cinta Senese', 12, 10, 2, '2605LC01', '2605LC01', 2026
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2605LC0101', 'F', 0.5),
    (2, '2605LC0102', 'M', 0.5),
    (3, '2605LC0103', 'M', 0.5),
    (4, '2605LC0104', 'F', 0.5),
    (5, '2605LC0105', 'F', 0.5),
    (6, '2605LC0106', 'F', 0.5),
    (7, '2605LC0107', 'M', 0.5),
    (8, '2605LC0108', 'M', 0.5),
    (9, '2605LC0109', 'M', 0.5),
    (10, '2605LC0110', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM01'),
  (SELECT id FROM animali WHERE bdn='IT349388'),
  'parto', '2026-05-12', 10, 2, 0,
  'Lotto 2605LC01 - importato in blocco'
);

-- --- Lotto 2404LL02: LGWHFEMM02 x LGWH01, parto 2024-04-17 (tot=12 vivi=5 morti=7) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM02'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-04-17', 'Large White', 'Large White', 12, 5, 7, '2404LL02', '2404LL02', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2404LL0201', 'F', 0.5),
    (2, '2404LL0202', 'F', 0.5),
    (3, '2404LL0203', 'F', 0.5),
    (4, '2404LL0204', 'F', 0.5),
    (5, '2404LL0205', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM02'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-04-17', 5, 7, 0,
  'Lotto 2404LL02 - importato in blocco'
);

-- --- Lotto 2410LC02: LGWHFEMM02 x IT310856, parto 2024-10-01 (tot=8 vivi=5 morti=3) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM02'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2024-10-01', 'Large White', 'Cinta Senese', 8, 5, 3, '2410LC02', '2410LC02', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2410LC0201', 'M', 0.5),
    (2, '2410LC0202', 'M', 0.5),
    (3, '2410LC0203', 'F', 0.5),
    (4, '2410LC0204', 'F', 0.5),
    (5, '2410LC0205', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM02'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2024-10-01', 5, 3, 0,
  'Lotto 2410LC02 - importato in blocco'
);

-- --- Lotto 2504LL02: LGWHFEMM02 x LGWH01, parto 2025-04-30 (tot=7 vivi=7 morti=0) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM02'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2025-04-30', 'Large White', 'Large White', 7, 7, 0, '2504LL02', '2504LL02', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2504LL0201', 'F', 0.5),
    (2, '2504LL0202', 'M', 0.5),
    (3, '2504LL0203', 'M', 0.5),
    (4, '2504LL0204', 'F', 0.5),
    (5, '2504LL0205', 'F', 0.5),
    (6, '2504LL0206', 'F', 0.5),
    (7, '2504LL0207', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM02'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2025-04-30', 7, 0, 0,
  'Lotto 2504LL02 - importato in blocco'
);

-- --- Lotto 2603LC02: LGWHFEMM02 x IT349388, parto 2026-03-20 (tot=17 vivi=9 morti=8) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM02'),
    (SELECT id FROM animali WHERE bdn='IT349388'),
    '2026-03-20', 'Large White', 'Cinta Senese', 17, 9, 8, '2603LC02', '2603LC02', 2026
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2603LC0201', 'M', 0.5),
    (2, '2603LC0202', 'M', 0.5),
    (3, '2603LC0203', 'F', 0.5),
    (4, '2603LC0204', 'F', 0.5),
    (5, '2603LC0205', 'F', 0.5),
    (6, '2603LC0206', 'F', 0.5),
    (7, '2603LC0207', 'F', 0.5),
    (8, '2603LC0208', 'M', 0.5),
    (9, '2603LC0209', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM02'),
  (SELECT id FROM animali WHERE bdn='IT349388'),
  'parto', '2026-03-20', 9, 8, 0,
  'Lotto 2603LC02 - importato in blocco'
);

-- --- Lotto 2510LL02: LGWHFEMM02 x LGWH01, parto 2025-10-10 (tot=10 vivi=6 morti=4) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM02'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2025-10-10', 'Large White', 'Large White', 10, 6, 4, '2510LL02', '2510LL02', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2510LL0201', 'M', 0.5),
    (2, '2510LL0202', 'F', 0.5),
    (3, '2510LL0203', 'M', 0.5),
    (4, '2510LL0204', 'F', 0.5),
    (5, '2510LL0205', 'F', 0.5),
    (6, '2510LL0206', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM02'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2025-10-10', 6, 4, 0,
  'Lotto 2510LL02 - importato in blocco'
);

-- --- Lotto 2404LL03: LGWHFEMM03 x LGWH01, parto 2024-04-30 (tot=14 vivi=9 morti=5) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM03'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-04-30', 'Large White', 'Large White', 14, 9, 5, '2404LL03', '2404LL03', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2404LL0301', 'M', 0.5),
    (2, '2404LL0302', 'M', 0.5),
    (3, '2404LL0303', 'F', 0.5),
    (4, '2404LL0304', 'F', 0.5),
    (5, '2404LL0305', 'F', 0.5),
    (6, '2404LL0306', 'M', 0.5),
    (7, '2404LL0307', 'M', 0.5),
    (8, '2404LL0308', 'M', 0.5),
    (9, '2404LL0309', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM03'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-04-30', 9, 5, 0,
  'Lotto 2404LL03 - importato in blocco'
);

-- --- Lotto 2506LL03: LGWHFEMM03 x LGWH01, parto 2025-06-15 (tot=10 vivi=3 morti=7) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM03'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2025-06-15', 'Large White', 'Large White', 10, 3, 7, '2506LL03', '2506LL03', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2506LL0301', 'F', 0.5),
    (2, '2506LL0302', 'F', 0.5),
    (3, '2506LL0303', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM03'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2025-06-15', 3, 7, 0,
  'Lotto 2506LL03 - importato in blocco'
);

-- --- Lotto 2512LM03: LGWHFEMM03 x MACULATO01, parto 2025-12-04 (tot=11 vivi=5 morti=6) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM03'),
    (SELECT id FROM animali WHERE bdn='MACULATO01'),
    '2025-12-04', 'Large White', 'Meticcio', 11, 5, 6, '2512LM03', '2512LM03', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2512LM0301', 'F', 0.5),
    (2, '2512LM0302', 'F', 0.5),
    (3, '2512LM0303', 'M', 0.5),
    (4, '2512LM0304', 'M', 0.5),
    (5, '2512LM0305', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM03'),
  (SELECT id FROM animali WHERE bdn='MACULATO01'),
  'parto', '2025-12-04', 5, 6, 0,
  'Lotto 2512LM03 - importato in blocco'
);

-- --- Lotto 2604LC03: LGWHFEMM03 x IT349388, parto 2026-04-03 (tot=14 vivi=10 morti=4) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM03'),
    (SELECT id FROM animali WHERE bdn='IT349388'),
    '2026-04-03', 'Large White', 'Cinta Senese', 14, 10, 4, '2604LC03', '2604LC03', 2026
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2604LC0301', 'F', 0.5),
    (2, '2604LC0302', 'F', 0.5),
    (3, '2604LC0303', 'M', 0.5),
    (4, '2604LC0304', 'F', 0.5),
    (5, '2604LC0305', 'M', 0.5),
    (6, '2604LC0306', 'F', 0.5),
    (7, '2604LC0307', 'F', 0.5),
    (8, '2604LC0308', 'F', 0.5),
    (9, '2604LC0309', 'M', 0.5),
    (10, '2604LC0310', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM03'),
  (SELECT id FROM animali WHERE bdn='IT349388'),
  'parto', '2026-04-03', 10, 4, 0,
  'Lotto 2604LC03 - importato in blocco'
);

-- --- Lotto 2401LL04: LGWHFEMM04 x LGWH01, parto 2024-01-02 (tot=11 vivi=8 morti=3) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM04'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-01-02', 'Large White', 'Large White', 11, 8, 3, '2401LL04', '2401LL04', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2401LL0401', 'F', 0.5),
    (2, '2401LL0402', 'F', 0.5),
    (3, '2401LL0403', 'F', 0.5),
    (4, '2401LL0404', 'M', 0.5),
    (5, '2401LL0405', 'M', 0.5),
    (6, '2401LL0406', 'M', 0.5),
    (7, '2401LL0407', 'F', 0.5),
    (8, '2401LL0408', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM04'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-01-02', 8, 3, 0,
  'Lotto 2401LL04 - importato in blocco'
);

-- --- Lotto 2405LC04: LGWHFEMM04 x IT334966, parto 2024-05-25 (tot=12 vivi=6 morti=6) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM04'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2024-05-25', 'Large White', 'Cinta Senese', 12, 6, 6, '2405LC04', '2405LC04', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2405LC0401', 'F', 0.5),
    (2, '2405LC0402', 'F', 0.5),
    (3, '2405LC0403', 'M', 0.5),
    (4, '2405LC0404', 'F', 0.5),
    (5, '2405LC0405', 'M', 0.5),
    (6, '2405LC0406', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM04'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2024-05-25', 6, 6, 0,
  'Lotto 2405LC04 - importato in blocco'
);

-- --- Lotto 2410LC04: LGWHFEMM04 x IT334966, parto 2024-10-27 (tot=12 vivi=0 morti=12) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM04'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2024-10-27', 'Large White', 'Cinta Senese', 12, 0, 12, '2410LC04', '2410LC04', 2024
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM04'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2024-10-27', 0, 12, 0,
  'Lotto 2410LC04 - importato in blocco'
);

-- --- Lotto 2506LC04: LGWHFEMM04 x IT334966, parto 2025-06-15 (tot=13 vivi=7 morti=6) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM04'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2025-06-15', 'Large White', 'Cinta Senese', 13, 7, 6, '2506LC04', '2506LC04', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2506LC0401', 'F', 0.5),
    (2, '2506LC0402', 'M', 0.5),
    (3, '2506LC0403', 'M', 0.5),
    (4, '2506LC0404', 'F', 0.5),
    (5, '2506LC0405', 'F', 0.5),
    (6, '2506LC0406', 'F', 0.5),
    (7, '2506LC0407', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM04'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2025-06-15', 7, 6, 0,
  'Lotto 2506LC04 - importato in blocco'
);

-- --- Lotto 2601LM04: LGWHFEMM04 x MACULATO01, parto 2026-01-11 (tot=13 vivi=8 morti=5) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM04'),
    (SELECT id FROM animali WHERE bdn='MACULATO01'),
    '2026-01-11', 'Large White', 'Meticcio', 13, 8, 5, '2601LM04', '2601LM04', 2026
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2601LM0401', 'F', 0.5),
    (2, '2601LM0402', 'F', 0.5),
    (3, '2601LM0403', 'M', 0.5),
    (4, '2601LM0404', 'M', 0.5),
    (5, '2601LM0405', 'F', 0.5),
    (6, '2601LM0406', 'F', 0.5),
    (7, '2601LM0407', 'F', 0.5),
    (8, '2601LM0408', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM04'),
  (SELECT id FROM animali WHERE bdn='MACULATO01'),
  'parto', '2026-01-11', 8, 5, 0,
  'Lotto 2601LM04 - importato in blocco'
);

-- --- Lotto 2401LL05: LGWHFEMM05 x LGWH01, parto 2024-01-13 (tot=10 vivi=4 morti=6) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM05'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-01-13', 'Large White', 'Large White', 10, 4, 6, '2401LL05', '2401LL05', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2401LL0501', 'M', 0.5),
    (2, '2401LL0502', 'F', 0.5),
    (3, '2401LL0503', 'F', 0.5),
    (4, '2401LL0504', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM05'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-01-13', 4, 6, 0,
  'Lotto 2401LL05 - importato in blocco'
);

-- --- Lotto 2406LL05: LGWHFEMM05 x LGWH01, parto 2024-06-10 (tot=10 vivi=8 morti=2) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM05'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-06-10', 'Large White', 'Large White', 10, 8, 2, '2406LL05', '2406LL05', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2406LL0501', 'F', 0.5),
    (2, '2406LL0502', 'F', 0.5),
    (3, '2406LL0503', 'M', 0.5),
    (4, '2406LL0504', 'M', 0.5),
    (5, '2406LL0505', 'M', 0.5),
    (6, '2406LL0506', 'F', 0.5),
    (7, '2406LL0507', 'F', 0.5),
    (8, '2406LL0508', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM05'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-06-10', 8, 2, 0,
  'Lotto 2406LL05 - importato in blocco'
);

-- --- Lotto 2505LL05: LGWHFEMM05 x LGWH01, parto 2025-05-14 (tot=8 vivi=0 morti=8) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM05'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2025-05-14', 'Large White', 'Large White', 8, 0, 8, '2505LL05', '2505LL05', 2025
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM05'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2025-05-14', 0, 8, 0,
  'Lotto 2505LL05 - importato in blocco'
);

-- --- Lotto 2601LL05: LGWHFEMM05 x LGWH01, parto 2026-01-11 (tot=8 vivi=0 morti=8) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM05'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2026-01-11', 'Large White', 'Large White', 8, 0, 8, '2601LL05', '2601LL05', 2026
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM05'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2026-01-11', 0, 8, 0,
  'Lotto 2601LL05 - importato in blocco'
);

-- --- Lotto 2401LL06: LGWHFEMM06 x LGWH01, parto 2024-01-31 (tot=7 vivi=7 morti=0) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM06'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-01-31', 'Large White', 'Large White', 7, 7, 0, '2401LL06', '2401LL06', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2401LL0601', 'F', 0.5),
    (2, '2401LL0602', 'M', 0.5),
    (3, '2401LL0603', 'F', 0.5),
    (4, '2401LL0604', 'F', 0.5),
    (5, '2401LL0605', 'F', 0.5),
    (6, '2401LL0606', 'M', 0.5),
    (7, '2401LL0607', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM06'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-01-31', 7, 0, 0,
  'Lotto 2401LL06 - importato in blocco'
);

-- --- Lotto 2504LM06: LGWHFEMM06 x MACULATO01, parto 2025-04-11 (tot=14 vivi=5 morti=9) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM06'),
    (SELECT id FROM animali WHERE bdn='MACULATO01'),
    '2025-04-11', 'Large White', 'Meticcio', 14, 5, 9, '2504LM06', '2504LM06', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2504LM0601', 'F', 0.5),
    (2, '2504LM0602', 'F', 0.5),
    (3, '2504LM0603', 'F', 0.5),
    (4, '2504LM0604', 'F', 0.5),
    (5, '2504LM0605', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM06'),
  (SELECT id FROM animali WHERE bdn='MACULATO01'),
  'parto', '2025-04-11', 5, 9, 0,
  'Lotto 2504LM06 - importato in blocco'
);

-- --- Lotto 2510LL06: LGWHFEMM06 x LGWH01, parto 2025-10-16 (tot=12 vivi=3 morti=9) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM06'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2025-10-16', 'Large White', 'Large White', 12, 3, 9, '2510LL06', '2510LL06', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2510LL0601', 'F', 0.5),
    (2, '2510LL0602', 'F', 0.5),
    (3, '2510LL0603', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM06'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2025-10-16', 3, 9, 0,
  'Lotto 2510LL06 - importato in blocco'
);

-- --- Lotto 2604LC06: LGWHFEMM06 x IT334966, parto 2026-04-07 (tot=12 vivi=10 morti=2) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM06'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2026-04-07', 'Large White', 'Cinta Senese', 12, 10, 2, '2604LC06', '2604LC06', 2026
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2604LC0601', 'M', 0.5),
    (2, '2604LC0602', 'M', 0.5),
    (3, '2604LC0603', 'F', 0.5),
    (4, '2604LC0604', 'F', 0.5),
    (5, '2604LC0605', 'F', 0.5),
    (6, '2604LC0606', 'F', 0.5),
    (7, '2604LC0607', 'M', 0.5),
    (8, '2604LC0608', 'F', 0.5),
    (9, '2604LC0609', 'M', 0.5),
    (10, '2604LC0610', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM06'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2026-04-07', 10, 2, 0,
  'Lotto 2604LC06 - importato in blocco'
);

-- --- Lotto 2401LL07: LGWHFEMM07 x LGWH01, parto 2024-01-28 (tot=16 vivi=9 morti=7) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM07'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-01-28', 'Large White', 'Large White', 16, 9, 7, '2401LL07', '2401LL07', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2401LL0701', 'F', 0.5),
    (2, '2401LL0702', 'F', 0.5),
    (3, '2401LL0703', 'M', 0.5),
    (4, '2401LL0704', 'M', 0.5),
    (5, '2401LL0705', 'F', 0.5),
    (6, '2401LL0706', 'F', 0.5),
    (7, '2401LL0707', 'F', 0.5),
    (8, '2401LL0708', 'F', 0.5),
    (9, '2401LL0709', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM07'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-01-28', 9, 7, 0,
  'Lotto 2401LL07 - importato in blocco'
);

-- --- Lotto 2409LL07: LGWHFEMM07 x LGWH01, parto 2024-09-09 (tot=10 vivi=9 morti=1) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM07'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-09-09', 'Large White', 'Large White', 10, 9, 1, '2409LL07', '2409LL07', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2409LL0701', 'F', 0.5),
    (2, '2409LL0702', 'F', 0.5),
    (3, '2409LL0703', 'M', 0.5),
    (4, '2409LL0704', 'M', 0.5),
    (5, '2409LL0705', 'M', 0.5),
    (6, '2409LL0706', 'F', 0.5),
    (7, '2409LL0707', 'F', 0.5),
    (8, '2409LL0708', 'F', 0.5),
    (9, '2409LL0709', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM07'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-09-09', 9, 1, 0,
  'Lotto 2409LL07 - importato in blocco'
);

-- --- Lotto 2504LC07: LGWHFEMM07 x IT310856, parto 2025-04-11 (tot=11 vivi=5 morti=6) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM07'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2025-04-11', 'Large White', 'Cinta Senese', 11, 5, 6, '2504LC07', '2504LC07', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2504LC0701', 'M', 0.5),
    (2, '2504LC0702', 'F', 0.5),
    (3, '2504LC0703', 'M', 0.5),
    (4, '2504LC0704', 'F', 0.5),
    (5, '2504LC0705', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM07'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2025-04-11', 5, 6, 0,
  'Lotto 2504LC07 - importato in blocco'
);

-- --- Lotto 2509LL07: LGWHFEMM07 x LGWH01, parto 2025-09-23 (tot=17 vivi=10 morti=7) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM07'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2025-09-23', 'Large White', 'Large White', 17, 10, 7, '2509LL07', '2509LL07', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2509LL0701', 'F', 0.5),
    (2, '2509LL0702', 'M', 0.5),
    (3, '2509LL0703', 'M', 0.5),
    (4, '2509LL0704', 'F', 0.5),
    (5, '2509LL0705', 'F', 0.5),
    (6, '2509LL0706', 'F', 0.5),
    (7, '2509LL0707', 'M', 0.5),
    (8, '2509LL0708', 'M', 0.5),
    (9, '2509LL0709', 'M', 0.5),
    (10, '2509LL0710', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM07'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2025-09-23', 10, 7, 0,
  'Lotto 2509LL07 - importato in blocco'
);

-- --- Lotto 2603LC07: LGWHFEMM07 x IT334966, parto 2026-03-24 (tot=12 vivi=6 morti=6) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM07'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2026-03-24', 'Large White', 'Cinta Senese', 12, 6, 6, '2603LC07', '2603LC07', 2026
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2603LC0701', 'F', 0.5),
    (2, '2603LC0702', 'F', 0.5),
    (3, '2603LC0703', 'F', 0.5),
    (4, '2603LC0704', 'M', 0.5),
    (5, '2603LC0705', 'F', 0.5),
    (6, '2603LC0706', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM07'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2026-03-24', 6, 6, 0,
  'Lotto 2603LC07 - importato in blocco'
);

-- --- Lotto 2401LL08: LGWHFEMM08 x LGWH01, parto 2024-01-26 (tot=14 vivi=9 morti=5) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM08'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-01-26', 'Large White', 'Large White', 14, 9, 5, '2401LL08', '2401LL08', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2401LL0801', 'F', 0.5),
    (2, '2401LL0802', 'F', 0.5),
    (3, '2401LL0803', 'F', 0.5),
    (4, '2401LL0804', 'M', 0.5),
    (5, '2401LL0805', 'M', 0.5),
    (6, '2401LL0806', 'F', 0.5),
    (7, '2401LL0807', 'F', 0.5),
    (8, '2401LL0808', 'F', 0.5),
    (9, '2401LL0809', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM08'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-01-26', 9, 5, 0,
  'Lotto 2401LL08 - importato in blocco'
);

-- --- Lotto 2408LC08: LGWHFEMM08 x IT310856, parto 2024-08-29 (tot=13 vivi=0 morti=13) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM08'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2024-08-29', 'Large White', 'Cinta Senese', 13, 0, 13, '2408LC08', '2408LC08', 2024
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM08'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2024-08-29', 0, 13, 0,
  'Lotto 2408LC08 - importato in blocco'
);

-- --- Lotto 2501LL08: LGWHFEMM08 x LGWH01, parto 2025-01-04 (tot=11 vivi=3 morti=8) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM08'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2025-01-04', 'Large White', 'Large White', 11, 3, 8, '2501LL08', '2501LL08', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2501LL0801', 'M', 0.5),
    (2, '2501LL0802', 'F', 0.5),
    (3, '2501LL0803', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM08'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2025-01-04', 3, 8, 0,
  'Lotto 2501LL08 - importato in blocco'
);

-- --- Lotto 2506LC08: LGWHFEMM08 x IT334966, parto 2025-06-22 (tot=10 vivi=4 morti=6) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM08'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2025-06-22', 'Large White', 'Cinta Senese', 10, 4, 6, '2506LC08', '2506LC08', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2506LC0801', 'F', 0.5),
    (2, '2506LC0802', 'F', 0.5),
    (3, '2506LC0803', 'M', 0.5),
    (4, '2506LC0804', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM08'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2025-06-22', 4, 6, 0,
  'Lotto 2506LC08 - importato in blocco'
);

-- --- Lotto 2402LL09: LGWHFEMM09 x LGWH01, parto 2024-02-03 (tot=9 vivi=0 morti=9) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM09'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-02-03', 'Large White', 'Large White', 9, 0, 9, '2402LL09', '2402LL09', 2024
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM09'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-02-03', 0, 9, 0,
  'Lotto 2402LL09 - importato in blocco'
);

-- --- Lotto 2406LL09: LGWHFEMM09 x LGWH01, parto 2024-06-12 (tot=11 vivi=6 morti=5) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM09'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-06-12', 'Large White', 'Large White', 11, 6, 5, '2406LL09', '2406LL09', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2406LL0901', 'F', 0.5),
    (2, '2406LL0902', 'F', 0.5),
    (3, '2406LL0903', 'F', 0.5),
    (4, '2406LL0904', 'M', 0.5),
    (5, '2406LL0905', 'M', 0.5),
    (6, '2406LL0906', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM09'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-06-12', 6, 5, 0,
  'Lotto 2406LL09 - importato in blocco'
);

-- --- Lotto 2505LC09: LGWHFEMM09 x IT334966, parto 2025-05-23 (tot=8 vivi=7 morti=1) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM09'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2025-05-23', 'Large White', 'Cinta Senese', 8, 7, 1, '2505LC09', '2505LC09', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2505LC0901', 'F', 0.5),
    (2, '2505LC0902', 'F', 0.5),
    (3, '2505LC0903', 'F', 0.5),
    (4, '2505LC0904', 'M', 0.5),
    (5, '2505LC0905', 'M', 0.5),
    (6, '2505LC0906', 'F', 0.5),
    (7, '2505LC0907', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM09'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2025-05-23', 7, 1, 0,
  'Lotto 2505LC09 - importato in blocco'
);

-- --- Lotto 2511LM09: LGWHFEMM09 x MACULATO01, parto 2025-11-03 (tot=9 vivi=5 morti=4) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM09'),
    (SELECT id FROM animali WHERE bdn='MACULATO01'),
    '2025-11-03', 'Large White', 'Meticcio', 9, 5, 4, '2511LM09', '2511LM09', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2511LM0901', 'F', 0.5),
    (2, '2511LM0902', 'M', 0.5),
    (3, '2511LM0903', 'M', 0.5),
    (4, '2511LM0904', 'M', 0.5),
    (5, '2511LM0905', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM09'),
  (SELECT id FROM animali WHERE bdn='MACULATO01'),
  'parto', '2025-11-03', 5, 4, 0,
  'Lotto 2511LM09 - importato in blocco'
);

-- --- Lotto 2402LL10: LGWHFEMM10 x LGWH01, parto 2024-02-21 (tot=12 vivi=7 morti=5) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM10'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-02-21', 'Large White', 'Large White', 12, 7, 5, '2402LL10', '2402LL10', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2402LL1001', 'F', 0.5),
    (2, '2402LL1002', 'F', 0.5),
    (3, '2402LL1003', 'F', 0.5),
    (4, '2402LL1004', 'M', 0.5),
    (5, '2402LL1005', 'F', 0.5),
    (6, '2402LL1006', 'M', 0.5),
    (7, '2402LL1007', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM10'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-02-21', 7, 5, 0,
  'Lotto 2402LL10 - importato in blocco'
);

-- --- Lotto 2409LL10: LGWHFEMM10 x LGWH01, parto 2024-09-04 (tot=15 vivi=6 morti=9) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM10'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-09-04', 'Large White', 'Large White', 15, 6, 9, '2409LL10', '2409LL10', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2409LL1001', 'F', 0.5),
    (2, '2409LL1002', 'F', 0.5),
    (3, '2409LL1003', 'M', 0.5),
    (4, '2409LL1004', 'M', 0.5),
    (5, '2409LL1005', 'F', 0.5),
    (6, '2409LL1006', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM10'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-09-04', 6, 9, 0,
  'Lotto 2409LL10 - importato in blocco'
);

-- --- Lotto 2505LC10: LGWHFEMM10 x IT310856, parto 2025-05-23 (tot=15 vivi=8 morti=7) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM10'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2025-05-23', 'Large White', 'Cinta Senese', 15, 8, 7, '2505LC10', '2505LC10', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2505LC1001', 'M', 0.5),
    (2, '2505LC1002', 'F', 0.5),
    (3, '2505LC1003', 'F', 0.5),
    (4, '2505LC1004', 'F', 0.5),
    (5, '2505LC1005', 'M', 0.5),
    (6, '2505LC1006', 'M', 0.5),
    (7, '2505LC1007', 'F', 0.5),
    (8, '2505LC1008', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM10'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2025-05-23', 8, 7, 0,
  'Lotto 2505LC10 - importato in blocco'
);

-- --- Lotto 2402LL11: LGWHFEMM11 x LGWH01, parto 2024-02-21 (tot=10 vivi=5 morti=5) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM11'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-02-21', 'Large White', 'Large White', 10, 5, 5, '2402LL11', '2402LL11', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2402LL1101', 'F', 0.5),
    (2, '2402LL1102', 'F', 0.5),
    (3, '2402LL1103', 'F', 0.5),
    (4, '2402LL1104', 'F', 0.5),
    (5, '2402LL1105', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM11'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-02-21', 5, 5, 0,
  'Lotto 2402LL11 - importato in blocco'
);

-- --- Lotto 2410LL11: LGWHFEMM11 x LGWH01, parto 2024-10-07 (tot=9 vivi=8 morti=1) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM11'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-10-07', 'Large White', 'Large White', 9, 8, 1, '2410LL11', '2410LL11', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2410LL1101', 'M', 0.5),
    (2, '2410LL1102', 'F', 0.5),
    (3, '2410LL1103', 'M', 0.5),
    (4, '2410LL1104', 'M', 0.5),
    (5, '2410LL1105', 'F', 0.5),
    (6, '2410LL1106', 'F', 0.5),
    (7, '2410LL1107', 'F', 0.5),
    (8, '2410LL1108', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM11'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-10-07', 8, 1, 0,
  'Lotto 2410LL11 - importato in blocco'
);

-- --- Lotto 2503LL11: LGWHFEMM11 x LGWH01, parto 2025-03-07 (tot=8 vivi=2 morti=6) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM11'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2025-03-07', 'Large White', 'Large White', 8, 2, 6, '2503LL11', '2503LL11', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2503LL1101', 'M', 0.5),
    (2, '2503LL1102', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM11'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2025-03-07', 2, 6, 0,
  'Lotto 2503LL11 - importato in blocco'
);

-- --- Lotto 2601LM11: LGWHFEMM11 x MACULATO01, parto 2026-01-07 (tot=12 vivi=8 morti=4) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM11'),
    (SELECT id FROM animali WHERE bdn='MACULATO01'),
    '2026-01-07', 'Large White', 'Meticcio', 12, 8, 4, '2601LM11', '2601LM11', 2026
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2601LM1101', 'F', 0.5),
    (2, '2601LM1102', 'F', 0.5),
    (3, '2601LM1103', 'F', 0.5),
    (4, '2601LM1104', 'F', 0.5),
    (5, '2601LM1105', 'M', 0.5),
    (6, '2601LM1106', 'F', 0.5),
    (7, '2601LM1107', 'M', 0.5),
    (8, '2601LM1108', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM11'),
  (SELECT id FROM animali WHERE bdn='MACULATO01'),
  'parto', '2026-01-07', 8, 4, 0,
  'Lotto 2601LM11 - importato in blocco'
);

-- --- Lotto 2404LL12: LGWHFEMM12 x LGWH01, parto 2024-04-16 (tot=11 vivi=9 morti=2) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM12'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-04-16', 'Large White', 'Large White', 11, 9, 2, '2404LL12', '2404LL12', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2404LL1201', 'M', 0.5),
    (2, '2404LL1202', 'F', 0.5),
    (3, '2404LL1203', 'F', 0.5),
    (4, '2404LL1204', 'F', 0.5),
    (5, '2404LL1205', 'F', 0.5),
    (6, '2404LL1206', 'M', 0.5),
    (7, '2404LL1207', 'F', 0.5),
    (8, '2404LL1208', 'F', 0.5),
    (9, '2404LL1209', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM12'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-04-16', 9, 2, 0,
  'Lotto 2404LL12 - importato in blocco'
);

-- --- Lotto 2507LC12: LGWHFEMM12 x IT334966, parto 2025-07-20 (tot=8 vivi=0 morti=8) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM12'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2025-07-20', 'Large White', 'Cinta Senese', 8, 0, 8, '2507LC12', '2507LC12', 2025
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM12'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2025-07-20', 0, 8, 0,
  'Lotto 2507LC12 - importato in blocco'
);

-- --- Lotto 2512LM12: LGWHFEMM12 x MACULATO01, parto 2025-12-30 (tot=9 vivi=0 morti=9) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM12'),
    (SELECT id FROM animali WHERE bdn='MACULATO01'),
    '2025-12-30', 'Large White', 'Meticcio', 9, 0, 9, '2512LM12', '2512LM12', 2025
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM12'),
  (SELECT id FROM animali WHERE bdn='MACULATO01'),
  'parto', '2025-12-30', 0, 9, 0,
  'Lotto 2512LM12 - importato in blocco'
);

-- --- Lotto 2507LM13: LGWHFEMM13 x MACULATO01, parto 2025-07-28 (tot=11 vivi=6 morti=5) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM13'),
    (SELECT id FROM animali WHERE bdn='MACULATO01'),
    '2025-07-28', 'Large White', 'Meticcio', 11, 6, 5, '2507LM13', '2507LM13', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2507LM1301', 'M', 0.5),
    (2, '2507LM1302', 'F', 0.5),
    (3, '2507LM1303', 'M', 0.5),
    (4, '2507LM1304', 'M', 0.5),
    (5, '2507LM1305', 'F', 0.5),
    (6, '2507LM1306', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM13'),
  (SELECT id FROM animali WHERE bdn='MACULATO01'),
  'parto', '2025-07-28', 6, 5, 0,
  'Lotto 2507LM13 - importato in blocco'
);

-- --- Lotto 2601LM13: LGWHFEMM13 x MACULATO01, parto 2026-01-14 (tot=10 vivi=9 morti=1) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM13'),
    (SELECT id FROM animali WHERE bdn='MACULATO01'),
    '2026-01-14', 'Large White', 'Meticcio', 10, 9, 1, '2601LM13', '2601LM13', 2026
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2601LM1301', 'F', 0.5),
    (2, '2601LM1302', 'M', 0.5),
    (3, '2601LM1303', 'M', 0.5),
    (4, '2601LM1304', 'M', 0.5),
    (5, '2601LM1305', 'F', 0.5),
    (6, '2601LM1306', 'F', 0.5),
    (7, '2601LM1307', 'F', 0.5),
    (8, '2601LM1308', 'F', 0.5),
    (9, '2601LM1309', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM13'),
  (SELECT id FROM animali WHERE bdn='MACULATO01'),
  'parto', '2026-01-14', 9, 1, 0,
  'Lotto 2601LM13 - importato in blocco'
);

-- --- Lotto 2605LM14: LGWHFEMM14 x MACULATO01, parto 2026-05-09 (tot=15 vivi=14 morti=1) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='LGWHFEMM14'),
    (SELECT id FROM animali WHERE bdn='MACULATO01'),
    '2026-05-09', 'Large White', 'Meticcio', 15, 14, 1, '2605LM14', '2605LM14', 2026
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2605LM1401', 'F', 0.5),
    (2, '2605LM1402', 'F', 0.5),
    (3, '2605LM1403', 'F', 0.5),
    (4, '2605LM1404', 'F', 0.5),
    (5, '2605LM1405', 'F', 0.5),
    (6, '2605LM1406', 'M', 0.5),
    (7, '2605LM1407', 'F', 0.5),
    (8, '2605LM1408', 'M', 0.5),
    (9, '2605LM1409', 'M', 0.5),
    (10, '2605LM1410', 'F', 0.5),
    (11, '2605LM1411', 'F', 0.5),
    (12, '2605LM1412', 'F', 0.5),
    (13, '2605LM1413', 'M', 0.5),
    (14, '2605LM1414', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='LGWHFEMM14'),
  (SELECT id FROM animali WHERE bdn='MACULATO01'),
  'parto', '2026-05-09', 14, 1, 0,
  'Lotto 2605LM14 - importato in blocco'
);
