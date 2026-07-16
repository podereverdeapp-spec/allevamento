-- =====================================================================
-- Registrazione massiva parti - Cinta Senese, 10 scrofe, 38 cucciolate
-- Include lotti + unità + eventi riproduttivi
-- =====================================================================

-- --- Lotto 2402CC19: IT302019 x IT310856, parto 2024-02-09 (tot=6 vivi=3 morti=3) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT302019'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2024-02-09', 'Cinta Senese', 'Cinta Senese', 6, 3, 3, '2402CC19', '2402CC19', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2402CC1901', 'F', 0.5),
    (2, '2402CC1902', 'F', 0.5),
    (3, '2402CC1903', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT302019'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2024-02-09', 3, 3, 0,
  'Lotto 2402CC19 - importato in blocco'
);

-- --- Lotto 2408CL19: IT302019 x LGWH01, parto 2024-08-19 (tot=7 vivi=4 morti=3) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT302019'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-08-19', 'Cinta Senese', 'Large White', 7, 4, 3, '2408CL19', '2408CL19', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2408CL1901', 'F', 0.5),
    (2, '2408CL1902', 'F', 0.5),
    (3, '2408CL1903', 'F', 0.5),
    (4, '2408CL1904', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT302019'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-08-19', 4, 3, 0,
  'Lotto 2408CL19 - importato in blocco'
);

-- --- Lotto 2501CC19: IT302019 x IT334966, parto 2025-01-28 (tot=3 vivi=3 morti=0) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT302019'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2025-01-28', 'Cinta Senese', 'Cinta Senese', 3, 3, 0, '2501CC19', '2501CC19', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2501CC1901', 'M', 0.5),
    (2, '2501CC1902', 'M', 0.5),
    (3, '2501CC1903', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT302019'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2025-01-28', 3, 0, 0,
  'Lotto 2501CC19 - importato in blocco'
);

-- --- Lotto 2507CC19: IT302019 x IT334966, parto 2025-07-21 (tot=6 vivi=2 morti=4) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT302019'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2025-07-21', 'Cinta Senese', 'Cinta Senese', 6, 2, 4, '2507CC19', '2507CC19', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2507CC1901', 'F', 0.5),
    (2, '2507CC1902', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT302019'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2025-07-21', 2, 4, 0,
  'Lotto 2507CC19 - importato in blocco'
);

-- --- Lotto 2512CM19: IT302019 x MACULATO01, parto 2025-12-28 (tot=6 vivi=0 morti=6) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT302019'),
    (SELECT id FROM animali WHERE bdn='MACULATO01'),
    '2025-12-28', 'Cinta Senese', 'Meticcio', 6, 0, 6, '2512CM19', '2512CM19', 2025
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT302019'),
  (SELECT id FROM animali WHERE bdn='MACULATO01'),
  'parto', '2025-12-28', 0, 6, 0,
  'Lotto 2512CM19 - importato in blocco'
);

-- --- Lotto 2606CC19: IT302019 x IT349388, parto 2026-06-10 (tot=6 vivi=5 morti=1) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT302019'),
    (SELECT id FROM animali WHERE bdn='IT349388'),
    '2026-06-10', 'Cinta Senese', 'Cinta Senese', 6, 5, 1, '2606CC19', '2606CC19', 2026
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2606CC1901', 'F', 0.5),
    (2, '2606CC1902', 'F', 0.5),
    (3, '2606CC1903', 'F', 0.5),
    (4, '2606CC1904', 'F', 0.5),
    (5, '2606CC1905', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT302019'),
  (SELECT id FROM animali WHERE bdn='IT349388'),
  'parto', '2026-06-10', 5, 1, 0,
  'Lotto 2606CC19 - importato in blocco'
);

-- --- Lotto 2403CC78: IT341378 x IT310856, parto 2024-03-21 (tot=9 vivi=9 morti=0) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341378'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2024-03-21', 'Cinta Senese', 'Cinta Senese', 9, 9, 0, '2403CC78', '2403CC78', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2403CC7801', 'M', 0.5),
    (2, '2403CC7802', 'M', 0.5),
    (3, '2403CC7803', 'F', 0.5),
    (4, '2403CC7804', 'F', 0.5),
    (5, '2403CC7805', 'F', 0.5),
    (6, '2403CC7806', 'F', 0.5),
    (7, '2403CC7807', 'F', 0.5),
    (8, '2403CC7808', 'F', 0.5),
    (9, '2403CC7809', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341378'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2024-03-21', 9, 0, 0,
  'Lotto 2403CC78 - importato in blocco'
);

-- --- Lotto 2408CC78: IT341378 x IT334966, parto 2024-08-06 (tot=9 vivi=4 morti=5) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341378'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2024-08-06', 'Cinta Senese', 'Cinta Senese', 9, 4, 5, '2408CC78', '2408CC78', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2408CC7801', 'M', 0.5),
    (2, '2408CC7802', 'M', 0.5),
    (3, '2408CC7803', 'M', 0.5),
    (4, '2408CC7804', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341378'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2024-08-06', 4, 5, 0,
  'Lotto 2408CC78 - importato in blocco'
);

-- --- Lotto 2404CL82: IT341382 x LGWH01, parto 2024-04-08 (tot=1 vivi=0 morti=1) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341382'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-04-08', 'Cinta Senese', 'Large White', 1, 0, 1, '2404CL82', '2404CL82', 2024
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341382'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-04-08', 0, 1, 0,
  'Lotto 2404CL82 - importato in blocco'
);

-- --- Lotto 2509CC82: IT341382 x IT310856, parto 2025-09-30 (tot=5 vivi=3 morti=2) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341382'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2025-09-30', 'Cinta Senese', 'Cinta Senese', 5, 3, 2, '2509CC82', '2509CC82', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2509CC8201', 'F', 0.5),
    (2, '2509CC8202', 'F', 0.5),
    (3, '2509CC8203', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341382'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2025-09-30', 3, 2, 0,
  'Lotto 2509CC82 - importato in blocco'
);

-- --- Lotto 2604CC82: IT341382 x IT349388, parto 2026-04-10 (tot=3 vivi=2 morti=1) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341382'),
    (SELECT id FROM animali WHERE bdn='IT349388'),
    '2026-04-10', 'Cinta Senese', 'Cinta Senese', 3, 2, 1, '2604CC82', '2604CC82', 2026
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2604CC8201', 'F', 0.5),
    (2, '2604CC8202', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341382'),
  (SELECT id FROM animali WHERE bdn='IT349388'),
  'parto', '2026-04-10', 2, 1, 0,
  'Lotto 2604CC82 - importato in blocco'
);

-- --- Lotto 2301CC05: IT294505 x IT310856, parto 2023-01-01 (tot=1 vivi=1 morti=0) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT294505'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2023-01-01', 'Cinta Senese', 'Cinta Senese', 1, 1, 0, '2301CC05', '2301CC05', 2023
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2301CC0501', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT294505'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2023-01-01', 1, 0, 0,
  'Lotto 2301CC05 - importato in blocco'
);

-- --- Lotto 2309CC31: IT314331 x IT310856, parto 2023-09-30 (tot=5 vivi=4 morti=1) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT314331'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2023-09-30', 'Cinta Senese', 'Cinta Senese', 5, 4, 1, '2309CC31', '2309CC31', 2023
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2309CC3101', 'M', 0.5),
    (2, '2309CC3102', 'M', 0.5),
    (3, '2309CC3103', 'M', 0.5),
    (4, '2309CC3104', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314331'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2023-09-30', 4, 1, 0,
  'Lotto 2309CC31 - importato in blocco'
);

-- --- Lotto 2403CC31: IT314331 x IT310856, parto 2024-03-11 (tot=9 vivi=6 morti=3) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT314331'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2024-03-11', 'Cinta Senese', 'Cinta Senese', 9, 6, 3, '2403CC31', '2403CC31', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2403CC3101', 'F', 0.5),
    (2, '2403CC3102', 'F', 0.5),
    (3, '2403CC3103', 'F', 0.5),
    (4, '2403CC3104', 'F', 0.5),
    (5, '2403CC3105', 'F', 0.5),
    (6, '2403CC3106', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314331'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2024-03-11', 6, 3, 0,
  'Lotto 2403CC31 - importato in blocco'
);

-- --- Lotto 2412CL31: IT314331 x LGWH01, parto 2024-12-19 (tot=12 vivi=0 morti=12) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314331'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-12-19', 'Cinta Senese', 'Large White', 12, 0, 12, '2412CL31', '2412CL31', 2024
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314331'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-12-19', 0, 12, 0,
  'Lotto 2412CL31 - importato in blocco'
);

-- --- Lotto 2504CL31: IT314331 x LGWH01, parto 2025-04-25 (tot=4 vivi=4 morti=0) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT314331'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2025-04-25', 'Cinta Senese', 'Large White', 4, 4, 0, '2504CL31', '2504CL31', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2504CL3101', 'M', 0.5),
    (2, '2504CL3102', 'F', 0.5),
    (3, '2504CL3103', 'M', 0.5),
    (4, '2504CL3104', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314331'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2025-04-25', 4, 0, 0,
  'Lotto 2504CL31 - importato in blocco'
);

-- --- Lotto 2309CC34: IT314334 x IT310856, parto 2023-09-01 (tot=9 vivi=8 morti=1) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT314334'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2023-09-01', 'Cinta Senese', 'Cinta Senese', 9, 8, 1, '2309CC34', '2309CC34', 2023
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2309CC3401', 'F', 0.5),
    (2, '2309CC3402', 'F', 0.5),
    (3, '2309CC3403', 'F', 0.5),
    (4, '2309CC3404', 'F', 0.5),
    (5, '2309CC3405', 'F', 0.5),
    (6, '2309CC3406', 'M', 0.5),
    (7, '2309CC3407', 'M', 0.5),
    (8, '2309CC3408', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314334'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2023-09-01', 8, 1, 0,
  'Lotto 2309CC34 - importato in blocco'
);

-- --- Lotto 2403CL34: IT314334 x LGWH01, parto 2024-03-09 (tot=9 vivi=7 morti=2) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT314334'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-03-09', 'Cinta Senese', 'Large White', 9, 7, 2, '2403CL34', '2403CL34', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2403CL3401', 'M', 0.5),
    (2, '2403CL3402', 'M', 0.5),
    (3, '2403CL3403', 'M', 0.5),
    (4, '2403CL3404', 'F', 0.5),
    (5, '2403CL3405', 'F', 0.5),
    (6, '2403CL3406', 'F', 0.5),
    (7, '2403CL3407', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314334'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-03-09', 7, 2, 0,
  'Lotto 2403CL34 - importato in blocco'
);

-- --- Lotto 2408CL34: IT314334 x LGWH01, parto 2024-08-18 (tot=8 vivi=3 morti=5) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT314334'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-08-18', 'Cinta Senese', 'Large White', 8, 3, 5, '2408CL34', '2408CL34', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2408CL3401', 'F', 0.5),
    (2, '2408CL3402', 'M', 0.5),
    (3, '2408CL3403', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314334'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-08-18', 3, 5, 0,
  'Lotto 2408CL34 - importato in blocco'
);

-- --- Lotto 2501CC34: IT314334 x IT310856, parto 2025-01-20 (tot=10 vivi=3 morti=7) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT314334'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2025-01-20', 'Cinta Senese', 'Cinta Senese', 10, 3, 7, '2501CC34', '2501CC34', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2501CC3401', 'F', 0.5),
    (2, '2501CC3402', 'M', 0.5),
    (3, '2501CC3403', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314334'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2025-01-20', 3, 7, 0,
  'Lotto 2501CC34 - importato in blocco'
);

-- --- Lotto 2508CL34: IT314334 x LGWH01, parto 2025-08-12 (tot=6 vivi=3 morti=3) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT314334'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2025-08-12', 'Cinta Senese', 'Large White', 6, 3, 3, '2508CL34', '2508CL34', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2508CL3401', 'M', 0.5),
    (2, '2508CL3402', 'F', 0.5),
    (3, '2508CL3403', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314334'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2025-08-12', 3, 3, 0,
  'Lotto 2508CL34 - importato in blocco'
);

-- --- Lotto 2312CC80: IT341380 x IT310856, parto 2023-12-10 (tot=10 vivi=0 morti=10) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341380'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2023-12-10', 'Cinta Senese', 'Cinta Senese', 10, 0, 10, '2312CC80', '2312CC80', 2023
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341380'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2023-12-10', 0, 10, 0,
  'Lotto 2312CC80 - importato in blocco'
);

-- --- Lotto 2404CL80: IT341380 x LGWH01, parto 2024-04-07 (tot=10 vivi=4 morti=6) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341380'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-04-07', 'Cinta Senese', 'Large White', 10, 4, 6, '2404CL80', '2404CL80', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2404CL8001', 'F', 0.5),
    (2, '2404CL8002', 'F', 0.5),
    (3, '2404CL8003', 'M', 0.5),
    (4, '2404CL8004', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341380'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-04-07', 4, 6, 0,
  'Lotto 2404CL80 - importato in blocco'
);

-- --- Lotto 2412CC80: IT341380 x IT334966, parto 2024-12-30 (tot=7 vivi=5 morti=2) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341380'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2024-12-30', 'Cinta Senese', 'Cinta Senese', 7, 5, 2, '2412CC80', '2412CC80', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2412CC8001', 'F', 0.5),
    (2, '2412CC8002', 'M', 0.5),
    (3, '2412CC8003', 'F', 0.5),
    (4, '2412CC8004', 'M', 0.5),
    (5, '2412CC8005', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341380'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2024-12-30', 5, 2, 0,
  'Lotto 2412CC80 - importato in blocco'
);

-- --- Lotto 2507CC80: IT341380 x IT334966, parto 2025-07-08 (tot=10 vivi=0 morti=10) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341380'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2025-07-08', 'Cinta Senese', 'Cinta Senese', 10, 0, 10, '2507CC80', '2507CC80', 2025
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341380'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2025-07-08', 0, 10, 0,
  'Lotto 2507CC80 - importato in blocco'
);

-- --- Lotto 2601CM80: IT341380 x NERO0001, parto 2026-01-22 (tot=4 vivi=0 morti=4) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341380'),
    (SELECT id FROM animali WHERE bdn='NERO0001'),
    '2026-01-22', 'Cinta Senese', 'Meticcio', 4, 0, 4, '2601CM80', '2601CM80', 2026
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341380'),
  (SELECT id FROM animali WHERE bdn='NERO0001'),
  'parto', '2026-01-22', 0, 4, 0,
  'Lotto 2601CM80 - importato in blocco'
);

-- --- Lotto 2606CC80: IT341380 x IT349388, parto 2026-06-21 (tot=6 vivi=4 morti=2) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341380'),
    (SELECT id FROM animali WHERE bdn='IT349388'),
    '2026-06-21', 'Cinta Senese', 'Cinta Senese', 6, 4, 2, '2606CC80', '2606CC80', 2026
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2606CC8001', 'M', 0.5),
    (2, '2606CC8002', 'M', 0.5),
    (3, '2606CC8003', 'F', 0.5),
    (4, '2606CC8004', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341380'),
  (SELECT id FROM animali WHERE bdn='IT349388'),
  'parto', '2026-06-21', 4, 2, 0,
  'Lotto 2606CC80 - importato in blocco'
);

-- --- Lotto 2311CC93: IT341393 x IT310856, parto 2023-11-25 (tot=5 vivi=3 morti=2) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341393'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2023-11-25', 'Cinta Senese', 'Cinta Senese', 5, 3, 2, '2311CC93', '2311CC93', 2023
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2311CC9301', 'F', 0.5),
    (2, '2311CC9302', 'F', 0.5),
    (3, '2311CC9303', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341393'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2023-11-25', 3, 2, 0,
  'Lotto 2311CC93 - importato in blocco'
);

-- --- Lotto 2407CC93: IT341393 x IT310856, parto 2024-07-07 (tot=2 vivi=1 morti=1) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341393'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2024-07-07', 'Cinta Senese', 'Cinta Senese', 2, 1, 1, '2407CC93', '2407CC93', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2407CC9301', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341393'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2024-07-07', 1, 1, 0,
  'Lotto 2407CC93 - importato in blocco'
);

-- --- Lotto 2312CL14: IT341414 x LGWH01, parto 2023-12-24 (tot=5 vivi=1 morti=4) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341414'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2023-12-24', 'Cinta Senese', 'Large White', 5, 1, 4, '2312CL14', '2312CL14', 2023
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2312CL1401', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341414'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2023-12-24', 1, 4, 0,
  'Lotto 2312CL14 - importato in blocco'
);

-- --- Lotto 2405CC14: IT341414 x IT334966, parto 2024-05-25 (tot=5 vivi=2 morti=3) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341414'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2024-05-25', 'Cinta Senese', 'Cinta Senese', 5, 2, 3, '2405CC14', '2405CC14', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2405CC1401', 'F', 0.5),
    (2, '2405CC1402', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341414'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2024-05-25', 2, 3, 0,
  'Lotto 2405CC14 - importato in blocco'
);

-- --- Lotto 2504CC14: IT341414 x IT334966, parto 2025-04-19 (tot=6 vivi=0 morti=6) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341414'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2025-04-19', 'Cinta Senese', 'Cinta Senese', 6, 0, 6, '2504CC14', '2504CC14', 2025
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341414'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2025-04-19', 0, 6, 0,
  'Lotto 2504CC14 - importato in blocco'
);

-- --- Lotto 2512CC14: IT341414 x IT334966, parto 2025-12-19 (tot=5 vivi=3 morti=2) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341414'),
    (SELECT id FROM animali WHERE bdn='IT334966'),
    '2025-12-19', 'Cinta Senese', 'Cinta Senese', 5, 3, 2, '2512CC14', '2512CC14', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2512CC1401', 'F', 0.5),
    (2, '2512CC1402', 'M', 0.5),
    (3, '2512CC1403', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341414'),
  (SELECT id FROM animali WHERE bdn='IT334966'),
  'parto', '2025-12-19', 3, 2, 0,
  'Lotto 2512CC14 - importato in blocco'
);

-- --- Lotto 2606CM14: IT341414 x NERO0001, parto 2026-06-18 (tot=4 vivi=3 morti=1) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341414'),
    (SELECT id FROM animali WHERE bdn='NERO0001'),
    '2026-06-18', 'Cinta Senese', 'Meticcio', 4, 3, 1, '2606CM14', '2606CM14', 2026
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2606CM1401', 'M', 0.5),
    (2, '2606CM1402', 'M', 0.5),
    (3, '2606CM1403', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341414'),
  (SELECT id FROM animali WHERE bdn='NERO0001'),
  'parto', '2026-06-18', 3, 1, 0,
  'Lotto 2606CM14 - importato in blocco'
);

-- --- Lotto 2407CL11: IT392011 x LGWH01, parto 2024-07-07 (tot=10 vivi=6 morti=4) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT392011'),
    (SELECT id FROM animali WHERE bdn='LGWH01'),
    '2024-07-07', 'Cinta Senese', 'Large White', 10, 6, 4, '2407CL11', '2407CL11', 2024
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2407CL1101', 'M', 0.5),
    (2, '2407CL1102', 'M', 0.5),
    (3, '2407CL1103', 'M', 0.5),
    (4, '2407CL1104', 'F', 0.5),
    (5, '2407CL1105', 'F', 0.5),
    (6, '2407CL1106', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT392011'),
  (SELECT id FROM animali WHERE bdn='LGWH01'),
  'parto', '2024-07-07', 6, 4, 0,
  'Lotto 2407CL11 - importato in blocco'
);

-- --- Lotto 2501CC11: IT392011 x IT310856, parto 2025-01-11 (tot=11 vivi=3 morti=8) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT392011'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2025-01-11', 'Cinta Senese', 'Cinta Senese', 11, 3, 8, '2501CC11', '2501CC11', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2501CC1101', 'M', 0.5),
    (2, '2501CC1102', 'M', 0.5),
    (3, '2501CC1103', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT392011'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2025-01-11', 3, 8, 0,
  'Lotto 2501CC11 - importato in blocco'
);

-- --- Lotto 2507CC11: IT392011 x IT310856, parto 2025-07-21 (tot=7 vivi=5 morti=2) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT392011'),
    (SELECT id FROM animali WHERE bdn='IT310856'),
    '2025-07-21', 'Cinta Senese', 'Cinta Senese', 7, 5, 2, '2507CC11', '2507CC11', 2025
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2507CC1101', 'F', 0.5),
    (2, '2507CC1102', 'F', 0.5),
    (3, '2507CC1103', 'F', 0.5),
    (4, '2507CC1104', 'M', 0.5),
    (5, '2507CC1105', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT392011'),
  (SELECT id FROM animali WHERE bdn='IT310856'),
  'parto', '2025-07-21', 5, 2, 0,
  'Lotto 2507CC11 - importato in blocco'
);

-- --- Lotto 2601CM11: IT392011 x NERO0001, parto 2026-01-20 (tot=10 vivi=7 morti=3) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT392011'),
    (SELECT id FROM animali WHERE bdn='NERO0001'),
    '2026-01-20', 'Cinta Senese', 'Meticcio', 10, 7, 3, '2601CM11', '2601CM11', 2026
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2601CM1101', 'M', 0.5),
    (2, '2601CM1102', 'F', 0.5),
    (3, '2601CM1103', 'F', 0.5),
    (4, '2601CM1104', 'F', 0.5),
    (5, '2601CM1105', 'M', 0.5),
    (6, '2601CM1106', 'M', 0.5),
    (7, '2601CM1107', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT392011'),
  (SELECT id FROM animali WHERE bdn='NERO0001'),
  'parto', '2026-01-20', 7, 3, 0,
  'Lotto 2601CM11 - importato in blocco'
);
