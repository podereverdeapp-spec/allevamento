-- =====================================================================
-- Recupero eventi riproduttivi mancanti (15 cucciolate già create come lotti)
-- Necessario perché la sezione Selezione Genetica legge da questa tabella
-- =====================================================================

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314331'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2020-09-25', 0, 5, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314331'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2021-02-12', 4, 1, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314331'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2021-07-26', 6, 0, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT334334'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2020-09-28', 2, 4, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT334334'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2021-03-27', 10, 1, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT334334'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2021-09-28', 7, 5, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314344'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2020-12-02', 0, 1, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT314344'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2021-04-18', 3, 0, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341382'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2021-07-31', 4, 1, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341382'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2022-01-12', 0, 1, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341378'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2021-08-05', 6, 0, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341383'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2021-08-06', 4, 2, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341381'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2021-09-03', 0, 8, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341381'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2022-01-12', 4, 0, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);

INSERT INTO eventi_riproduttivi (animale_id, padre_id, tipo_evento, data_evento, nati_vivi, nati_morti, nati_mummificati, note)
VALUES (
  (SELECT id FROM animali WHERE bdn='IT341380'),
  (SELECT id FROM animali WHERE bdn='IT370856'),
  'parto', '2021-10-08', 1, 3, 0,
  'Importato in blocco insieme al lotto suini corrispondente'
);
