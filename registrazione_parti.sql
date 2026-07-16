-- =====================================================================
-- Registrazione massiva parti IT314331 x IT370856 (3 cucciolate)
-- Corretto: valorizzate anche le colonne legacy "codice" e "anno" (NOT NULL)
-- =====================================================================

-- --- Lotto 2009CC31: IT314331 x IT370856, parto 2020-09-25 ---
INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314331'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2020-09-25', 'Cinta Senese', 'Cinta Senese', 5, 0, 5, '2009CC31', '2009CC31', 2020
);

-- --- Lotto 2102CC31: IT314331 x IT370856, parto 2021-02-12 ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT314331'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2021-02-12', 'Cinta Senese', 'Cinta Senese', 5, 4, 1, '2102CC31', '2102CC31', 2021
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2102CC3101', 'F', 0.5),
    (2, '2102CC3102', 'F', 0.5),
    (3, '2102CC3103', 'M', 0.5),
    (4, '2102CC3104', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);

-- --- Lotto 2107CC31: IT314331 x IT370856, parto 2021-07-26 ---
WITH nuovo_lotto AS (
  INSERT INTO lotti_suini (madre_id, padre_id, data_parto, razza_madre, razza_padre, nati_totali, nati_vivi, nati_morti, codice_lotto, codice, anno)
  VALUES (
    (SELECT id FROM animali WHERE bdn='IT314331'),
    (SELECT id FROM animali WHERE bdn='IT370856'),
    '2021-07-26', 'Cinta Senese', 'Cinta Senese', 6, 6, 0, '2107CC31', '2107CC31', 2021
  )
  RETURNING id
)
INSERT INTO suini_lotto (lotto_id, nr, codice_completo, sesso, peso_nascita, vivo, stato, destinazione)
SELECT nuovo_lotto.id, u.nr, u.codice, u.sesso, u.peso, true, 'attivo', 'ingrasso'
FROM nuovo_lotto, (VALUES
    (1, '2107CC3101', 'F', 0.5),
    (2, '2107CC3102', 'F', 0.5),
    (3, '2107CC3103', 'F', 0.5),
    (4, '2107CC3104', 'M', 0.5),
    (5, '2107CC3105', 'M', 0.5),
    (6, '2107CC3106', 'M', 0.5)
  ) AS u(nr, codice, sesso, peso);
