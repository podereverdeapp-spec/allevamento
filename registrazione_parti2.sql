-- =====================================================================
-- Registrazione massiva parti IT334334 x IT370856 (3 cucciolate)
-- =====================================================================

-- --- Lotto 2009CC34: IT334334 x IT370856, parto 2020-09-28 ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT334334'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2020-09-28', 'Cinta Senese', 'Cinta Senese', 6, 2, 4, '2009CC34', '2009CC34', 2020
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2009CC3401', 'F', 0.5),
    (2, '2009CC3402', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);

-- --- Lotto 2103CC34: IT334334 x IT370856, parto 2021-03-27 ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT334334'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2021-03-27', 'Cinta Senese', 'Cinta Senese', 11, 10, 1, '2103CC34', '2103CC34', 2021
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2103CC3401', 'F', 0.5),
    (2, '2103CC3402', 'F', 0.5),
    (3, '2103CC3403', 'F', 0.5),
    (4, '2103CC3404', 'F', 0.5),
    (5, '2103CC3405', 'F', 0.5),
    (6, '2103CC3406', 'M', 0.5),
    (7, '2103CC3407', 'M', 0.5),
    (8, '2103CC3408', 'M', 0.5),
    (9, '2103CC3409', 'M', 0.5),
    (10, '2103CC3410', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

-- --- Lotto 2109CC34: IT334334 x IT370856, parto 2021-09-28 ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT334334'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2021-09-28', 'Cinta Senese', 'Cinta Senese', 12, 7, 5, '2109CC34', '2109CC34', 2021
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2109CC3401', 'M', 0.5),
    (2, '2109CC3402', 'M', 0.5),
    (3, '2109CC3403', 'M', 0.5),
    (4, '2109CC3404', 'F', 0.5),
    (5, '2109CC3405', 'F', 0.5),
    (6, '2109CC3406', 'F', 0.5),
    (7, '2109CC3407', 'F', 0.5)
  ) AS u(nr, codice, sesso, peso);
