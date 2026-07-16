-- Verifica preventiva: controlla che tutti i 12 tatuaggi esistano prima di aggiornare
SELECT t.tatuaggio, (s.id IS NOT NULL) AS trovato
FROM (VALUES
  ('2005CC0304'),('2006CC0504'),('2006CC0505'),('2006CC0503'),
  ('2009CC3401'),('2009CC3402'),('2010CC0301'),('2010CC0302'),
  ('2010CC0303'),('2010CC0304'),('2102CC3104'),('2103CC3401')
) AS t(tatuaggio)
LEFT JOIN suini_lotto s ON s.codice_completo = t.tatuaggio;
-- =====================================================================
-- Scarico massivo unità di lotto (uscite) - 12 unità, 6 lotti
-- =====================================================================

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2021-03-15',
  peso_vivo_uscita = 206,
  peso_carcassa = 168,
  resa_percent = 81.6
WHERE codice_completo = '2005CC0304';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2021-03-15',
  peso_vivo_uscita = 201,
  peso_carcassa = 158,
  resa_percent = 78.6
WHERE codice_completo = '2006CC0504';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2021-11-26',
  peso_vivo_uscita = 300,
  peso_carcassa = 225,
  resa_percent = 75.0
WHERE codice_completo = '2006CC0505';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2021-11-26',
  peso_vivo_uscita = 300,
  peso_carcassa = 225,
  resa_percent = 75.0
WHERE codice_completo = '2006CC0503';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2021-11-26',
  peso_vivo_uscita = 280,
  peso_carcassa = 210,
  resa_percent = 75.0
WHERE codice_completo = '2009CC3401';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2021-11-26',
  peso_vivo_uscita = 280,
  peso_carcassa = 210,
  resa_percent = 75.0
WHERE codice_completo = '2009CC3402';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2021-11-26',
  peso_vivo_uscita = 250,
  peso_carcassa = 187.5,
  resa_percent = 75.0
WHERE codice_completo = '2010CC0301';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2021-11-26',
  peso_vivo_uscita = 220,
  peso_carcassa = 165,
  resa_percent = 75.0
WHERE codice_completo = '2010CC0302';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2021-11-26',
  peso_vivo_uscita = 210,
  peso_carcassa = 157.5,
  resa_percent = 75.0
WHERE codice_completo = '2010CC0303';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2021-11-26',
  peso_vivo_uscita = 215,
  peso_carcassa = 161.25,
  resa_percent = 75.0
WHERE codice_completo = '2010CC0304';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2021-11-26',
  peso_vivo_uscita = 200,
  peso_carcassa = 150,
  resa_percent = 75.0
WHERE codice_completo = '2102CC3104';

UPDATE suini_lotto SET
  stato = 'macellato',
  vivo = false,
  motivo_uscita = 'Macellato',
  data_uscita = '2021-11-26',
  peso_vivo_uscita = 205,
  peso_carcassa = 163,
  resa_percent = 79.5
WHERE codice_completo = '2103CC3401';
