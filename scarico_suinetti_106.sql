-- Verifica preventiva: controlla che tutti i 106 tatuaggi esistano
SELECT t.tatuaggio, (s.id IS NOT NULL) AS trovato
FROM (VALUES
  ('2103CC3403'),
  ('2103CC3404'),
  ('2103CC3405'),
  ('2103CC3407'),
  ('2103CC3408'),
  ('2103CC3409'),
  ('2103CC3410'),
  ('2104CC0301'),
  ('2104CC0303'),
  ('2104CC0304'),
  ('2104CC0305'),
  ('2104CC4401'),
  ('2104CC4402'),
  ('2104CC4403'),
  ('2104CC0501'),
  ('2104CC0506'),
  ('2104CC0507'),
  ('2104CC0508'),
  ('2104CC0509'),
  ('2104CC0510'),
  ('2107CC3101'),
  ('2107CC3102'),
  ('2107CC3103'),
  ('2107CC3104'),
  ('2107CC3105'),
  ('2107CC3106'),
  ('2107CC8201'),
  ('2107CC8202'),
  ('2107CC8203'),
  ('2107CC8204'),
  ('2108CC7803'),
  ('2108CC7804'),
  ('2108CC7805'),
  ('2108CC7806'),
  ('2108CC8301'),
  ('2108CC8302'),
  ('2108CC8303'),
  ('2108CC8304'),
  ('2109CC0503'),
  ('2109CC0504'),
  ('2109CC0505'),
  ('2109CC0506'),
  ('2109CC0507'),
  ('2109CC0508'),
  ('2109CC0509'),
  ('2109CC3403'),
  ('2109CC3404'),
  ('2109CC3405'),
  ('2109CC3406'),
  ('2109CC3407'),
  ('2110CC8001'),
  ('2110CC0302'),
  ('2110CC0303'),
  ('2110CC0304'),
  ('2110CC0305'),
  ('2110CC0306'),
  ('2110CC0307'),
  ('2110CC0308'),
  ('2110CC0309'),
  ('2201CC8101'),
  ('2201CC8102'),
  ('2201CC8103'),
  ('2201CC8104'),
  ('2301CC0501'),
  ('2309CC3401'),
  ('2309CC3402'),
  ('2309CC3403'),
  ('2309CC3404'),
  ('2309CC3405'),
  ('2309CC3406'),
  ('2309CC3407'),
  ('2111AQ16'),
  ('2111AQ17'),
  ('2111AQ18'),
  ('2111AQ19'),
  ('2111AQ20'),
  ('2111AQ21'),
  ('2111AQ22'),
  ('2111AQ23'),
  ('2309CC3408'),
  ('2309CC3101'),
  ('2309CC3102'),
  ('2312CL1401'),
  ('2504AQ01'),
  ('2504AQ02'),
  ('2504AQ03'),
  ('2504AQ04'),
  ('2504AQ05'),
  ('2504AQ06'),
  ('2504AQ07'),
  ('2504AQ08'),
  ('2504AQ09'),
  ('2504AQ10'),
  ('2504AQ11'),
  ('2504AQ12'),
  ('2504AQ13'),
  ('2504AQ14'),
  ('2504AQ15'),
  ('2504AQ16'),
  ('2504AQ17'),
  ('2504AQ18'),
  ('2504AQ19'),
  ('2504AQ20'),
  ('2504AQ21'),
  ('2504AQ22'),
  ('2504AQ23')
) AS t(tatuaggio)
LEFT JOIN suini_lotto s ON s.codice_completo = t.tatuaggio;

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2022-05-13',
  peso_vivo_uscita = 268,
  peso_carcassa = 200,
  resa_percent = 74.6
WHERE codice_completo = '2103CC3403';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2022-05-13',
  peso_vivo_uscita = 268,
  peso_carcassa = 200,
  resa_percent = 74.6
WHERE codice_completo = '2103CC3404';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2022-05-13',
  peso_vivo_uscita = 268,
  peso_carcassa = 200,
  resa_percent = 74.6
WHERE codice_completo = '2103CC3405';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2022-05-13',
  peso_vivo_uscita = 268,
  peso_carcassa = 200,
  resa_percent = 74.6
WHERE codice_completo = '2103CC3407';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2022-05-13',
  peso_vivo_uscita = 268,
  peso_carcassa = 200,
  resa_percent = 74.6
WHERE codice_completo = '2103CC3408';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2022-05-13',
  peso_vivo_uscita = 268,
  peso_carcassa = 200,
  resa_percent = 74.6
WHERE codice_completo = '2103CC3409';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2022-05-13',
  peso_vivo_uscita = 268,
  peso_carcassa = 200,
  resa_percent = 74.6
WHERE codice_completo = '2103CC3410';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2022-05-13',
  peso_vivo_uscita = 265,
  peso_carcassa = 198,
  resa_percent = 74.7
WHERE codice_completo = '2104CC0301';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2022-05-13',
  peso_vivo_uscita = 265,
  peso_carcassa = 198,
  resa_percent = 74.7
WHERE codice_completo = '2104CC0303';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2022-05-13',
  peso_vivo_uscita = 265,
  peso_carcassa = 198,
  resa_percent = 74.7
WHERE codice_completo = '2104CC0304';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2022-12-12',
  peso_vivo_uscita = 268,
  peso_carcassa = 201,
  resa_percent = 75.0
WHERE codice_completo = '2104CC0305';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2022-12-12',
  peso_vivo_uscita = 250,
  peso_carcassa = 186,
  resa_percent = 74.4
WHERE codice_completo = '2104CC4401';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2022-12-18',
  peso_vivo_uscita = 260,
  peso_carcassa = 188,
  resa_percent = 72.3
WHERE codice_completo = '2104CC4402';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-01-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2104CC4403';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-01-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2104CC0501';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-02-24',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2104CC0506';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-03-05',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2104CC0507';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-03-18',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2104CC0508';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-04-02',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2104CC0509';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-04-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2104CC0510';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-04-22',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2107CC3101';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-08',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2107CC3102';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-08',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2107CC3103';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2107CC3104';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2107CC3105';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2107CC3106';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2107CC8201';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2107CC8202';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2107CC8203';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2107CC8204';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2108CC7803';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2108CC7804';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2108CC7805';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2108CC7806';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2108CC8301';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2108CC8302';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2108CC8303';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2108CC8304';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-12',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2109CC0503';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-15',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2109CC0504';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-15',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2109CC0505';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-25',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2109CC0506';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-05-25',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2109CC0507';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-06-01',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2109CC0508';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-06-01',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2109CC0509';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-06-17',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2109CC3403';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-06-17',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2109CC3404';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-08-29',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2109CC3405';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-08-29',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2109CC3406';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-09-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2109CC3407';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-09-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2110CC8001';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-09-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2110CC0302';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-11-21',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2110CC0303';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-11-21',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2110CC0304';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-12-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2110CC0305';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2023-12-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2110CC0306';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-01-15',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2110CC0307';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-01-15',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2110CC0308';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-01-15',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2110CC0309';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-01-15',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2201CC8101';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-01-15',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2201CC8102';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-01-15',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2201CC8103';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-01-15',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2201CC8104';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-01-15',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2301CC0501';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-01-15',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2309CC3401';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-01-15',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2309CC3402';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-01-16',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2309CC3403';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-01-16',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2309CC3404';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-02-06',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2309CC3405';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-02-06',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2309CC3406';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-02-13',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2309CC3407';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-02-27',
  peso_vivo_uscita = NULL,
  peso_carcassa = 130,
  resa_percent = NULL
WHERE codice_completo = '2111AQ16';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-02-27',
  peso_vivo_uscita = NULL,
  peso_carcassa = 130,
  resa_percent = NULL
WHERE codice_completo = '2111AQ17';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-02-13',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2111AQ18';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-02-20',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2111AQ19';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-02-27',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2111AQ20';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-03-08',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2111AQ21';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-03-15',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2111AQ22';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-03-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2111AQ23';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-03-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2309CC3408';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-03-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2309CC3101';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-03-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2309CC3102';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-03-28',
  peso_vivo_uscita = 70,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2312CL1401';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-05-26',
  peso_vivo_uscita = 77,
  peso_carcassa = 60.6,
  resa_percent = 78.7
WHERE codice_completo = '2504AQ01';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-05-26',
  peso_vivo_uscita = 86.5,
  peso_carcassa = 68.4,
  resa_percent = 79.1
WHERE codice_completo = '2504AQ02';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-06-11',
  peso_vivo_uscita = 82,
  peso_carcassa = 64.3,
  resa_percent = 78.4
WHERE codice_completo = '2504AQ03';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-06-11',
  peso_vivo_uscita = 78,
  peso_carcassa = 61.5,
  resa_percent = 78.8
WHERE codice_completo = '2504AQ04';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-06-11',
  peso_vivo_uscita = 83,
  peso_carcassa = 65.1,
  resa_percent = 78.4
WHERE codice_completo = '2504AQ05';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-06-11',
  peso_vivo_uscita = 74,
  peso_carcassa = 58.1,
  resa_percent = 78.5
WHERE codice_completo = '2504AQ06';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-06-11',
  peso_vivo_uscita = 73,
  peso_carcassa = 57,
  resa_percent = 78.1
WHERE codice_completo = '2504AQ07';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-06-11',
  peso_vivo_uscita = 74,
  peso_carcassa = 58.7,
  resa_percent = 79.3
WHERE codice_completo = '2504AQ08';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-29',
  peso_vivo_uscita = 113,
  peso_carcassa = 89.1,
  resa_percent = 78.8
WHERE codice_completo = '2504AQ09';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-29',
  peso_vivo_uscita = 120,
  peso_carcassa = 94.75,
  resa_percent = 79.0
WHERE codice_completo = '2504AQ10';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-29',
  peso_vivo_uscita = 120,
  peso_carcassa = 93.95,
  resa_percent = 78.3
WHERE codice_completo = '2504AQ11';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-08-25',
  peso_vivo_uscita = 108,
  peso_carcassa = 84.9,
  resa_percent = 78.6
WHERE codice_completo = '2504AQ12';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-08-25',
  peso_vivo_uscita = 108,
  peso_carcassa = 85.1,
  resa_percent = 78.8
WHERE codice_completo = '2504AQ13';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-08-25',
  peso_vivo_uscita = 100,
  peso_carcassa = 78.95,
  resa_percent = 79.0
WHERE codice_completo = '2504AQ14';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-08-25',
  peso_vivo_uscita = 106,
  peso_carcassa = 83,
  resa_percent = 78.3
WHERE codice_completo = '2504AQ15';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-08-25',
  peso_vivo_uscita = 126,
  peso_carcassa = 99.25,
  resa_percent = 78.8
WHERE codice_completo = '2504AQ16';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-08-25',
  peso_vivo_uscita = 89,
  peso_carcassa = 70.2,
  resa_percent = 78.9
WHERE codice_completo = '2504AQ17';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-08',
  peso_vivo_uscita = 270,
  peso_carcassa = 215.9,
  resa_percent = 80.0
WHERE codice_completo = '2504AQ18';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-08',
  peso_vivo_uscita = 210,
  peso_carcassa = 167.9,
  resa_percent = 80.0
WHERE codice_completo = '2504AQ19';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-08',
  peso_vivo_uscita = 107,
  peso_carcassa = 84.3,
  resa_percent = 78.8
WHERE codice_completo = '2504AQ20';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-08',
  peso_vivo_uscita = 126,
  peso_carcassa = 99.25,
  resa_percent = 78.8
WHERE codice_completo = '2504AQ21';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-08',
  peso_vivo_uscita = 110,
  peso_carcassa = 86.3,
  resa_percent = 78.5
WHERE codice_completo = '2504AQ22';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-08',
  peso_vivo_uscita = 122,
  peso_carcassa = 96.15,
  resa_percent = 78.8
WHERE codice_completo = '2504AQ23';
