-- Verifica preventiva: controlla che tutti i 167 tatuaggi esistano
SELECT count(*) AS totale, count(s.id) AS trovati, count(*)-count(s.id) AS NON_trovati
FROM (VALUES
  ('2404LL0307'),
  ('2404LL0308'),
  ('2404LL0309'),
  ('2402LL1102'),
  ('2401LL0607'),
  ('2402LL1103'),
  ('2402LL1104'),
  ('2402LL1105'),
  ('2504LC0701'),
  ('2504LC0702'),
  ('2504LM0605'),
  ('2404LL0305'),
  ('2406LL0505'),
  ('2406LL0506'),
  ('2406LL0507'),
  ('2406LL0508'),
  ('2406LL0901'),
  ('2111AQ15'),
  ('2401LL0401'),
  ('2401LL0402'),
  ('2401LL0403'),
  ('2401LL0404'),
  ('2401LL0405'),
  ('2401LL0406'),
  ('2401LL0407'),
  ('2401LL0408'),
  ('2401LL0501'),
  ('2401LL0502'),
  ('2406LL0904'),
  ('2406LL0905'),
  ('2406LL0902'),
  ('2406LL0903'),
  ('2404LL0306'),
  ('2402LL1101'),
  ('2409LL1004'),
  ('2409LL1006'),
  ('2409LL0701'),
  ('2409LL1005'),
  ('2409LL0704'),
  ('2409LL0705'),
  ('2409LL0706'),
  ('2409LL0707'),
  ('2409LL0702'),
  ('2409LL0703'),
  ('2409LL0708'),
  ('2409LL0709'),
  ('2410LC0201'),
  ('2409LL1003'),
  ('2406LL0504'),
  ('2409LL1002'),
  ('2406LL0906'),
  ('2407CL1104'),
  ('2407CL1105'),
  ('2410LC0202'),
  ('2410LC0203'),
  ('2505LC0902'),
  ('2406LL0502'),
  ('2406LL0503'),
  ('2309CC3103'),
  ('2309CC3104'),
  ('2311CC9302'),
  ('2311CC9303'),
  ('2402CC1901'),
  ('2402CC1902'),
  ('2401LL0503'),
  ('2401LL0504'),
  ('2401LL0801'),
  ('2401LL0802'),
  ('2401LL0803'),
  ('2401LL0804'),
  ('2401LL0805'),
  ('2401LL0806'),
  ('2401LL0807'),
  ('2401LL0808'),
  ('2401LL0709'),
  ('2401LL0601'),
  ('2401LL0602'),
  ('2401LL0603'),
  ('2401LL0604'),
  ('2401LL0605'),
  ('2401LL0606'),
  ('2402LL1001'),
  ('2402LL1002'),
  ('2402LL1003'),
  ('2409LL1001'),
  ('2410LC0204'),
  ('2410LC0205'),
  ('2410LL1101'),
  ('2404LL1201'),
  ('2504LM0602'),
  ('2504LM0603'),
  ('2504AQ38'),
  ('2505LC1006'),
  ('2505LC1007'),
  ('2505LC1005'),
  ('2410LL1104'),
  ('2410LL1105'),
  ('2504LM0601'),
  ('2505LC1008'),
  ('2410LL1106'),
  ('2410LL1107'),
  ('2506LL0303'),
  ('2506LC0401'),
  ('2506LC0402'),
  ('2506LC0403'),
  ('2506LC0404'),
  ('2506LC0405'),
  ('2506LC0406'),
  ('2501LL0802'),
  ('2401LL0809'),
  ('2410LL1108'),
  ('2506LC0407'),
  ('2501LL0803'),
  ('2503LL1102'),
  ('2506LC0801'),
  ('2506LC0802'),
  ('2504AQ45'),
  ('2504AQ46'),
  ('2506LC0803'),
  ('2506LC0804'),
  ('2507CC1104'),
  ('2507LM1303'),
  ('2511LM0901'),
  ('2507LM1304'),
  ('2507LM1305'),
  ('2507LM1306'),
  ('2508CL3401'),
  ('2507LM1302'),
  ('2508CL3402'),
  ('2504AQ47'),
  ('2507LM1301'),
  ('2510LL0603'),
  ('2503LL1101'),
  ('2504LL0206'),
  ('2501CC3403'),
  ('2509LL0701'),
  ('2506LL0101'),
  ('2509LL0702'),
  ('2601CM1106'),
  ('2401LL0701'),
  ('2401LL0702'),
  ('2401LL0703'),
  ('2401LL0704'),
  ('2401LL0705'),
  ('2401LL0706'),
  ('2401LL0707'),
  ('2401LL0708'),
  ('2402LL1004'),
  ('2508CL3403'),
  ('2507CC1105'),
  ('2509LL0705'),
  ('2509LL0706'),
  ('2509LL0703'),
  ('2510LL0602'),
  ('2509LL0704'),
  ('2509LL0707'),
  ('2509LL0708'),
  ('2509LL0709'),
  ('2509LL0710'),
  ('2509CC8203'),
  ('2510LL0201'),
  ('2510LL0202'),
  ('2510LL0203'),
  ('2510LL0204'),
  ('2510LL0205'),
  ('2510LL0206'),
  ('2510LL0601')
) AS t(tatuaggio)
LEFT JOIN suini_lotto s ON s.codice_completo = t.tatuaggio;


-- ==== AGGIORNAMENTI (167 uscite) ====

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-01-10',
  peso_vivo_uscita = 94,
  peso_carcassa = 77.6,
  resa_percent = 82.6
WHERE codice_completo = '2404LL0307';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-01-08',
  peso_vivo_uscita = 98,
  peso_carcassa = 80.82,
  resa_percent = 82.5
WHERE codice_completo = '2404LL0308';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-01-08',
  peso_vivo_uscita = 101,
  peso_carcassa = 83.38,
  resa_percent = 82.6
WHERE codice_completo = '2404LL0309';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-01-08',
  peso_vivo_uscita = 107,
  peso_carcassa = 88.4,
  resa_percent = 82.6
WHERE codice_completo = '2402LL1102';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-01-08',
  peso_vivo_uscita = 127.5,
  peso_carcassa = 105.35,
  resa_percent = 82.6
WHERE codice_completo = '2401LL0607';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-01-28',
  peso_vivo_uscita = 116,
  peso_carcassa = 95.4,
  resa_percent = 82.2
WHERE codice_completo = '2402LL1103';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-01-28',
  peso_vivo_uscita = 116,
  peso_carcassa = 95.5,
  resa_percent = 82.3
WHERE codice_completo = '2402LL1104';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-01-28',
  peso_vivo_uscita = 131,
  peso_carcassa = 109,
  resa_percent = 83.2
WHERE codice_completo = '2402LL1105';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-01-28',
  peso_vivo_uscita = 117,
  peso_carcassa = 97.9,
  resa_percent = 83.7
WHERE codice_completo = '2504LC0701';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-10',
  peso_vivo_uscita = 101.65,
  peso_carcassa = 83.35,
  resa_percent = 82.0
WHERE codice_completo = '2504LC0702';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-10',
  peso_vivo_uscita = 131,
  peso_carcassa = 101.2,
  resa_percent = 77.3
WHERE codice_completo = '2504LM0605';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-10',
  peso_vivo_uscita = 115.6,
  peso_carcassa = 95.55,
  resa_percent = 82.7
WHERE codice_completo = '2404LL0305';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-10',
  peso_vivo_uscita = 131,
  peso_carcassa = 102.45,
  resa_percent = 78.2
WHERE codice_completo = '2406LL0505';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-16',
  peso_vivo_uscita = 350,
  peso_carcassa = 242,
  resa_percent = 69.1
WHERE codice_completo = '2406LL0506';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-16',
  peso_vivo_uscita = 160,
  peso_carcassa = 127,
  resa_percent = 79.4
WHERE codice_completo = '2406LL0507';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-16',
  peso_vivo_uscita = 115,
  peso_carcassa = 92.3,
  resa_percent = 80.3
WHERE codice_completo = '2406LL0508';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-16',
  peso_vivo_uscita = 130,
  peso_carcassa = 102.75,
  resa_percent = 79.0
WHERE codice_completo = '2406LL0901';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2111AQ15';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0401';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0402';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0403';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0404';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0405';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0406';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0407';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0408';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0501';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-02-19',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0502';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-03-13',
  peso_vivo_uscita = 125,
  peso_carcassa = 98.15,
  resa_percent = 78.5
WHERE codice_completo = '2406LL0904';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-03-14',
  peso_vivo_uscita = 127,
  peso_carcassa = 101.1,
  resa_percent = 79.6
WHERE codice_completo = '2406LL0905';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-03-14',
  peso_vivo_uscita = 131,
  peso_carcassa = 104.7,
  resa_percent = 79.9
WHERE codice_completo = '2406LL0902';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-03-16',
  peso_vivo_uscita = 108,
  peso_carcassa = 86.4,
  resa_percent = 80.0
WHERE codice_completo = '2406LL0903';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-03-16',
  peso_vivo_uscita = 139,
  peso_carcassa = 111.1,
  resa_percent = 79.9
WHERE codice_completo = '2404LL0306';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2024-03-28',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2402LL1101';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-03-31',
  peso_vivo_uscita = 140,
  peso_carcassa = 112,
  resa_percent = 80.0
WHERE codice_completo = '2409LL1004';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-04-01',
  peso_vivo_uscita = 140,
  peso_carcassa = 112.7,
  resa_percent = 80.5
WHERE codice_completo = '2409LL1006';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-04-01',
  peso_vivo_uscita = 136,
  peso_carcassa = 108.3,
  resa_percent = 79.6
WHERE codice_completo = '2409LL0701';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-04-01',
  peso_vivo_uscita = 150,
  peso_carcassa = 120,
  resa_percent = 80.0
WHERE codice_completo = '2409LL1005';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-04-01',
  peso_vivo_uscita = 140,
  peso_carcassa = 112.5,
  resa_percent = 80.4
WHERE codice_completo = '2409LL0704';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-04-06',
  peso_vivo_uscita = 128,
  peso_carcassa = 106.45,
  resa_percent = 83.2
WHERE codice_completo = '2409LL0705';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-04-06',
  peso_vivo_uscita = 150,
  peso_carcassa = 120.5,
  resa_percent = 80.3
WHERE codice_completo = '2409LL0706';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-04-06',
  peso_vivo_uscita = 156,
  peso_carcassa = 123.5,
  resa_percent = 79.2
WHERE codice_completo = '2409LL0707';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-04-06',
  peso_vivo_uscita = 140,
  peso_carcassa = 110,
  resa_percent = 78.6
WHERE codice_completo = '2409LL0702';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-04-18',
  peso_vivo_uscita = 126,
  peso_carcassa = 101,
  resa_percent = 80.2
WHERE codice_completo = '2409LL0703';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-04-18',
  peso_vivo_uscita = 173,
  peso_carcassa = 136,
  resa_percent = 78.6
WHERE codice_completo = '2409LL0708';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-04-18',
  peso_vivo_uscita = 134,
  peso_carcassa = 107,
  resa_percent = 79.9
WHERE codice_completo = '2409LL0709';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-04-18',
  peso_vivo_uscita = 145,
  peso_carcassa = 114.5,
  resa_percent = 79.0
WHERE codice_completo = '2410LC0201';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-04-18',
  peso_vivo_uscita = 136,
  peso_carcassa = 108.5,
  resa_percent = 79.8
WHERE codice_completo = '2409LL1003';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-05-05',
  peso_vivo_uscita = 227,
  peso_carcassa = 181.65,
  resa_percent = 80.0
WHERE codice_completo = '2406LL0504';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-05-05',
  peso_vivo_uscita = 172,
  peso_carcassa = 137.35,
  resa_percent = 79.9
WHERE codice_completo = '2409LL1002';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-05-05',
  peso_vivo_uscita = 204.5,
  peso_carcassa = 163,
  resa_percent = 79.7
WHERE codice_completo = '2406LL0906';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-05-05',
  peso_vivo_uscita = 150,
  peso_carcassa = 120.2,
  resa_percent = 80.1
WHERE codice_completo = '2407CL1104';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-05-05',
  peso_vivo_uscita = 188,
  peso_carcassa = 150.5,
  resa_percent = 80.1
WHERE codice_completo = '2407CL1105';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-05-15',
  peso_vivo_uscita = 155,
  peso_carcassa = 124.55,
  resa_percent = 80.4
WHERE codice_completo = '2410LC0202';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-05-15',
  peso_vivo_uscita = 154,
  peso_carcassa = 123.45,
  resa_percent = 80.2
WHERE codice_completo = '2410LC0203';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-05-15',
  peso_vivo_uscita = 184.5,
  peso_carcassa = 147.4,
  resa_percent = 79.9
WHERE codice_completo = '2505LC0902';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-05-15',
  peso_vivo_uscita = 134.5,
  peso_carcassa = 107.35,
  resa_percent = 79.8
WHERE codice_completo = '2406LL0502';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-05-15',
  peso_vivo_uscita = 134.5,
  peso_carcassa = 107.6,
  resa_percent = 80.0
WHERE codice_completo = '2406LL0503';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-06-15',
  peso_vivo_uscita = 280,
  peso_carcassa = 212.8,
  resa_percent = 76.0
WHERE codice_completo = '2309CC3103';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-06-15',
  peso_vivo_uscita = 280,
  peso_carcassa = 212.8,
  resa_percent = 76.0
WHERE codice_completo = '2309CC3104';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-06-15',
  peso_vivo_uscita = 280,
  peso_carcassa = 212.8,
  resa_percent = 76.0
WHERE codice_completo = '2311CC9302';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-06-15',
  peso_vivo_uscita = 280,
  peso_carcassa = 212.8,
  resa_percent = 76.0
WHERE codice_completo = '2311CC9303';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-06-15',
  peso_vivo_uscita = 280,
  peso_carcassa = 212.8,
  resa_percent = 76.0
WHERE codice_completo = '2402CC1901';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-06-15',
  peso_vivo_uscita = 280,
  peso_carcassa = 212.8,
  resa_percent = 76.0
WHERE codice_completo = '2402CC1902';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0503';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0504';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0801';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0802';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0803';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0804';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0805';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0806';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0807';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0808';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0709';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0601';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0602';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0603';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0604';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0605';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0606';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2402LL1001';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2402LL1002';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-07-03',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2402LL1003';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-07',
  peso_vivo_uscita = 280,
  peso_carcassa = 196,
  resa_percent = 70.0
WHERE codice_completo = '2409LL1001';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-22',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2410LC0204';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-22',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2410LC0205';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-22',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2410LL1101';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-22',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2404LL1201';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-25',
  peso_vivo_uscita = 125.28571428571429,
  peso_carcassa = 87.7,
  resa_percent = 70.0
WHERE codice_completo = '2504LM0602';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-25',
  peso_vivo_uscita = 147.21428571428572,
  peso_carcassa = 103.05,
  resa_percent = 70.0
WHERE codice_completo = '2504LM0603';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-25',
  peso_vivo_uscita = 124.21428571428572,
  peso_carcassa = 86.95,
  resa_percent = 70.0
WHERE codice_completo = '2504AQ38';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-09-25',
  peso_vivo_uscita = 353,
  peso_carcassa = 247.1,
  resa_percent = 70.0
WHERE codice_completo = '2505LC1006';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-10-06',
  peso_vivo_uscita = 103.78571428571429,
  peso_carcassa = 72.65,
  resa_percent = 70.0
WHERE codice_completo = '2505LC1007';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-10-06',
  peso_vivo_uscita = 103.71428571428571,
  peso_carcassa = 72.6,
  resa_percent = 70.0
WHERE codice_completo = '2505LC1005';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-10-06',
  peso_vivo_uscita = 206.2857142857143,
  peso_carcassa = 144.4,
  resa_percent = 70.0
WHERE codice_completo = '2410LL1104';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-10-06',
  peso_vivo_uscita = 230.35714285714286,
  peso_carcassa = 161.25,
  resa_percent = 70.0
WHERE codice_completo = '2410LL1105';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-10-06',
  peso_vivo_uscita = 177.57142857142858,
  peso_carcassa = 124.3,
  resa_percent = 70.0
WHERE codice_completo = '2504LM0601';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-10-06',
  peso_vivo_uscita = 103.78571428571429,
  peso_carcassa = 72.65,
  resa_percent = 70.0
WHERE codice_completo = '2505LC1008';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-10-23',
  peso_vivo_uscita = 216.78571428571428,
  peso_carcassa = 151.75,
  resa_percent = 70.0
WHERE codice_completo = '2410LL1106';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-10-23',
  peso_vivo_uscita = 211.42857142857144,
  peso_carcassa = 148,
  resa_percent = 70.0
WHERE codice_completo = '2410LL1107';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-06',
  peso_vivo_uscita = 85.64285714285715,
  peso_carcassa = 59.95,
  resa_percent = 70.0
WHERE codice_completo = '2506LL0303';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-06',
  peso_vivo_uscita = 98.28571428571428,
  peso_carcassa = 68.8,
  resa_percent = 70.0
WHERE codice_completo = '2506LC0401';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-06',
  peso_vivo_uscita = 71.42857142857143,
  peso_carcassa = 50,
  resa_percent = 70.0
WHERE codice_completo = '2506LC0402';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-19',
  peso_vivo_uscita = 71,
  peso_carcassa = 49.7,
  resa_percent = 70.0
WHERE codice_completo = '2506LC0403';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-19',
  peso_vivo_uscita = 79.5,
  peso_carcassa = 55.65,
  resa_percent = 70.0
WHERE codice_completo = '2506LC0404';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-19',
  peso_vivo_uscita = 118.42857142857144,
  peso_carcassa = 82.9,
  resa_percent = 70.0
WHERE codice_completo = '2506LC0405';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-19',
  peso_vivo_uscita = 94.21428571428572,
  peso_carcassa = 65.95,
  resa_percent = 70.0
WHERE codice_completo = '2506LC0406';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-19',
  peso_vivo_uscita = 196.07142857142858,
  peso_carcassa = 137.25,
  resa_percent = 70.0
WHERE codice_completo = '2501LL0802';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-19',
  peso_vivo_uscita = 217.14285714285714,
  peso_carcassa = 152,
  resa_percent = 70.0
WHERE codice_completo = '2401LL0809';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-27',
  peso_vivo_uscita = 281.07142857142856,
  peso_carcassa = 196.75,
  resa_percent = 70.0
WHERE codice_completo = '2410LL1108';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-27',
  peso_vivo_uscita = 109.92857142857143,
  peso_carcassa = 76.95,
  resa_percent = 70.0
WHERE codice_completo = '2506LC0407';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-27',
  peso_vivo_uscita = 220.85714285714286,
  peso_carcassa = 154.6,
  resa_percent = 70.0
WHERE codice_completo = '2501LL0803';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-27',
  peso_vivo_uscita = 184.25714285714284,
  peso_carcassa = 128.98,
  resa_percent = 70.0
WHERE codice_completo = '2503LL1102';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-27',
  peso_vivo_uscita = 127.92857142857143,
  peso_carcassa = 89.55,
  resa_percent = 70.0
WHERE codice_completo = '2506LC0801';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-11-27',
  peso_vivo_uscita = 107.07142857142858,
  peso_carcassa = 74.95,
  resa_percent = 70.0
WHERE codice_completo = '2506LC0802';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-12-10',
  peso_vivo_uscita = 175.85714285714286,
  peso_carcassa = 123.1,
  resa_percent = 70.0
WHERE codice_completo = '2504AQ45';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-12-10',
  peso_vivo_uscita = 178.14285714285714,
  peso_carcassa = 124.7,
  resa_percent = 70.0
WHERE codice_completo = '2504AQ46';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-12-19',
  peso_vivo_uscita = 113.5,
  peso_carcassa = 79.45,
  resa_percent = 70.0
WHERE codice_completo = '2506LC0803';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-12-19',
  peso_vivo_uscita = 112.28571428571428,
  peso_carcassa = 78.6,
  resa_percent = 70.0
WHERE codice_completo = '2506LC0804';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-12-19',
  peso_vivo_uscita = 111.28571428571429,
  peso_carcassa = 77.9,
  resa_percent = 70.0
WHERE codice_completo = '2507CC1104';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2025-12-19',
  peso_vivo_uscita = 113.21428571428572,
  peso_carcassa = 79.25,
  resa_percent = 70.0
WHERE codice_completo = '2507LM1303';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-01-14',
  peso_vivo_uscita = 39.72857142857143,
  peso_carcassa = 27.81,
  resa_percent = 70.0
WHERE codice_completo = '2511LM0901';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-01-14',
  peso_vivo_uscita = 110.71428571428572,
  peso_carcassa = 77.5,
  resa_percent = 70.0
WHERE codice_completo = '2507LM1304';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-01-14',
  peso_vivo_uscita = 114.50000000000001,
  peso_carcassa = 80.15,
  resa_percent = 70.0
WHERE codice_completo = '2507LM1305';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-01-14',
  peso_vivo_uscita = 101.64285714285715,
  peso_carcassa = 71.15,
  resa_percent = 70.0
WHERE codice_completo = '2507LM1306';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-01-20',
  peso_vivo_uscita = 100.28571428571429,
  peso_carcassa = 70.2,
  resa_percent = 70.0
WHERE codice_completo = '2508CL3401';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-01-28',
  peso_vivo_uscita = 133.35714285714286,
  peso_carcassa = 93.35,
  resa_percent = 70.0
WHERE codice_completo = '2507LM1302';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-01-28',
  peso_vivo_uscita = 97.00000000000001,
  peso_carcassa = 67.9,
  resa_percent = 70.0
WHERE codice_completo = '2508CL3402';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-01-28',
  peso_vivo_uscita = 205.07142857142858,
  peso_carcassa = 143.55,
  resa_percent = 70.0
WHERE codice_completo = '2504AQ47';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-01-28',
  peso_vivo_uscita = 130.85714285714286,
  peso_carcassa = 91.6,
  resa_percent = 70.0
WHERE codice_completo = '2507LM1301';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-02-04',
  peso_vivo_uscita = 77.28571428571429,
  peso_carcassa = 54.1,
  resa_percent = 70.0
WHERE codice_completo = '2510LL0603';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-02-26',
  peso_vivo_uscita = 239.85714285714286,
  peso_carcassa = 167.9,
  resa_percent = 70.0
WHERE codice_completo = '2503LL1101';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-02-26',
  peso_vivo_uscita = 211.7142857142857,
  peso_carcassa = 148.2,
  resa_percent = 70.0
WHERE codice_completo = '2504LL0206';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-02-26',
  peso_vivo_uscita = 269.92857142857144,
  peso_carcassa = 188.95,
  resa_percent = 70.0
WHERE codice_completo = '2501CC3403';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-11',
  peso_vivo_uscita = 116.92857142857142,
  peso_carcassa = 81.85,
  resa_percent = 70.0
WHERE codice_completo = '2509LL0701';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-11',
  peso_vivo_uscita = 201.92857142857142,
  peso_carcassa = 141.35,
  resa_percent = 70.0
WHERE codice_completo = '2506LL0101';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-11',
  peso_vivo_uscita = 136.35714285714286,
  peso_carcassa = 95.45,
  resa_percent = 70.0
WHERE codice_completo = '2509LL0702';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-11',
  peso_vivo_uscita = 10,
  peso_carcassa = 7,
  resa_percent = 70.0
WHERE codice_completo = '2601CM1106';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-11',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0701';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-11',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0702';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-11',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0703';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-11',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0704';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-11',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0705';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-11',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0706';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-11',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0707';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-11',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2401LL0708';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-11',
  peso_vivo_uscita = NULL,
  peso_carcassa = NULL,
  resa_percent = NULL
WHERE codice_completo = '2402LL1004';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-26',
  peso_vivo_uscita = 163.5,
  peso_carcassa = 114.45,
  resa_percent = 70.0
WHERE codice_completo = '2508CL3403';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-26',
  peso_vivo_uscita = 174.71428571428572,
  peso_carcassa = 122.3,
  resa_percent = 70.0
WHERE codice_completo = '2507CC1105';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-03-26',
  peso_vivo_uscita = 166.2857142857143,
  peso_carcassa = 116.4,
  resa_percent = 70.0
WHERE codice_completo = '2509LL0705';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-04-16',
  peso_vivo_uscita = 143.07142857142858,
  peso_carcassa = 100.15,
  resa_percent = 70.0
WHERE codice_completo = '2509LL0706';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-04-16',
  peso_vivo_uscita = 167.07142857142858,
  peso_carcassa = 116.95,
  resa_percent = 70.0
WHERE codice_completo = '2509LL0703';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-04-16',
  peso_vivo_uscita = 135.14285714285714,
  peso_carcassa = 94.6,
  resa_percent = 70.0
WHERE codice_completo = '2510LL0602';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-04-16',
  peso_vivo_uscita = 147.28571428571428,
  peso_carcassa = 103.1,
  resa_percent = 70.0
WHERE codice_completo = '2509LL0704';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-05-07',
  peso_vivo_uscita = 145.55714285714285,
  peso_carcassa = 101.89,
  resa_percent = 70.0
WHERE codice_completo = '2509LL0707';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-05-07',
  peso_vivo_uscita = 151.12857142857143,
  peso_carcassa = 105.79,
  resa_percent = 70.0
WHERE codice_completo = '2509LL0708';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-05-07',
  peso_vivo_uscita = 157.70000000000002,
  peso_carcassa = 110.39,
  resa_percent = 70.0
WHERE codice_completo = '2509LL0709';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-05-07',
  peso_vivo_uscita = 151.4857142857143,
  peso_carcassa = 106.04,
  resa_percent = 70.0
WHERE codice_completo = '2509LL0710';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-06-04',
  peso_vivo_uscita = 205,
  peso_carcassa = 143.5,
  resa_percent = 70.0
WHERE codice_completo = '2509CC8203';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-06-04',
  peso_vivo_uscita = 173.57142857142858,
  peso_carcassa = 121.5,
  resa_percent = 70.0
WHERE codice_completo = '2510LL0201';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-06-04',
  peso_vivo_uscita = 160.71428571428572,
  peso_carcassa = 112.5,
  resa_percent = 70.0
WHERE codice_completo = '2510LL0202';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-06-04',
  peso_vivo_uscita = 183.57142857142858,
  peso_carcassa = 128.5,
  resa_percent = 70.0
WHERE codice_completo = '2510LL0203';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-06-19',
  peso_vivo_uscita = 185.35714285714286,
  peso_carcassa = 129.75,
  resa_percent = 70.0
WHERE codice_completo = '2510LL0204';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-06-19',
  peso_vivo_uscita = 208.21428571428572,
  peso_carcassa = 145.75,
  resa_percent = 70.0
WHERE codice_completo = '2510LL0205';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-06-19',
  peso_vivo_uscita = 186.78571428571428,
  peso_carcassa = 130.75,
  resa_percent = 70.0
WHERE codice_completo = '2510LL0206';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2026-06-19',
  peso_vivo_uscita = 183.92857142857144,
  peso_carcassa = 128.75,
  resa_percent = 70.0
WHERE codice_completo = '2510LL0601';
