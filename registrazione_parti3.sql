-- =====================================================================
-- Registrazione massiva parti - 6 scrofe, 9 cucciolate
-- =====================================================================

-- --- Lotto 2012CC44: IT314344 x IT370856, parto 2020-12-02 (tot=1 vivi=0 morti=1) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314344'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2020-12-02', 'Cinta Senese', 'Cinta Senese', 1, 0, 1, '2012CC44', '2012CC44', 2020
);

-- --- Lotto 2104CC44: IT314344 x IT370856, parto 2021-04-18 (tot=3 vivi=3 morti=0) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT314344'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2021-04-18', 'Cinta Senese', 'Cinta Senese', 3, 3, 0, '2104CC44', '2104CC44', 2021
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2104CC4401', 'F', 0.5),
    (2, '2104CC4402', 'F', 0.5),
    (3, '2104CC4403', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

-- --- Lotto 2107CC82: IT341382 x IT370856, parto 2021-07-31 (tot=5 vivi=4 morti=1) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341382'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2021-07-31', 'Cinta Senese', 'Cinta Senese', 5, 4, 1, '2107CC82', '2107CC82', 2021
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2107CC8201', 'F', 0.5),
    (2, '2107CC8202', 'F', 0.5),
    (3, '2107CC8203', 'M', 0.5),
    (4, '2107CC8204', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

-- --- Lotto 2201CC82: IT341382 x IT370856, parto 2022-01-12 (tot=1 vivi=0 morti=1) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341382'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2022-01-12', 'Cinta Senese', 'Cinta Senese', 1, 0, 1, '2201CC82', '2201CC82', 2022
);

-- --- Lotto 2108CC78: IT341378 x IT370856, parto 2021-08-05 (tot=6 vivi=6 morti=0) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341378'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2021-08-05', 'Cinta Senese', 'Cinta Senese', 6, 6, 0, '2108CC78', '2108CC78', 2021
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2108CC7801', 'F', 0.5),
    (2, '2108CC7802', 'F', 0.5),
    (3, '2108CC7803', 'F', 0.5),
    (4, '2108CC7804', 'F', 0.5),
    (5, '2108CC7805', 'M', 0.5),
    (6, '2108CC7806', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

-- --- Lotto 2108CC83: IT341383 x IT370856, parto 2021-08-06 (tot=6 vivi=4 morti=2) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341383'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2021-08-06', 'Cinta Senese', 'Cinta Senese', 6, 4, 2, '2108CC83', '2108CC83', 2021
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2108CC8301', 'M', 0.5),
    (2, '2108CC8302', 'F', 0.5),
    (3, '2108CC8303', 'F', 0.5),
    (4, '2108CC8304', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

-- --- Lotto 2109CC81: IT341381 x IT370856, parto 2021-09-03 (tot=8 vivi=0 morti=8) ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341381'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2021-09-03', 'Cinta Senese', 'Cinta Senese', 8, 0, 8, '2109CC81', '2109CC81', 2021
);

-- --- Lotto 2201CC81: IT341381 x IT370856, parto 2022-01-12 (tot=4 vivi=4 morti=0) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341381'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2022-01-12', 'Cinta Senese', 'Cinta Senese', 4, 4, 0, '2201CC81', '2201CC81', 2022
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2201CC8101', 'F', 0.5),
    (2, '2201CC8102', 'F', 0.5),
    (3, '2201CC8103', 'M', 0.5),
    (4, '2201CC8104', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

-- --- Lotto 2110CC80: IT341380 x IT370856, parto 2021-10-08 (tot=4 vivi=1 morti=3) ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT341380'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2021-10-08', 'Cinta Senese', 'Cinta Senese', 4, 1, 3, '2110CC80', '2110CC80', 2021
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2110CC8001', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);
