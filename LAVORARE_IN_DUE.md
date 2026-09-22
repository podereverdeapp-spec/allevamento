# Lavorare in due sull'app — regole e cautele

_Da leggere prima di toccare il codice. Vale per chiunque lavori su podereverdeapp.it, con o senza Claude._

## Il principio, in una riga

**L'originale dell'app è su GitHub. La cartella sul tuo computer è solo una tua copia di lavoro.**

Non esiste "la cartella buona" su un disco condiviso: se due persone salvassero lo stesso file su un disco di rete, l'ultimo che salva cancella il lavoro dell'altro, senza avviso e senza modo di recuperarlo. Git è nato per evitare esattamente questo.

---

## PARTE 1 — Preparazione (Filippo, una volta sola)

### 1.1 Rendere privato il repository

Oggi `podereverdeapp-spec/allevamento` è **pubblico**: chiunque lo trova può leggerlo, e dentro `src/supabase.js` c'è la chiave di accesso al database.

- GitHub → repository → **Settings** → in fondo **Danger Zone** → *Change repository visibility* → **Private**
- Non cambia niente per Vercel: il collegamento resta e i deploy continuano

### 1.2 Invitare il collaboratore

- GitHub → repository → **Settings** → **Collaborators** → *Add people*
- Serve il suo username o la sua email GitHub
- Ruolo **Write**: può leggere e pushare, non può cancellare il repository

### 1.3 Proteggere il ramo principale

Serve a impedire l'unico comando che può davvero distruggere il lavoro altrui.

- GitHub → **Settings** → **Rules** → *Rulesets* → *New branch ruleset*
- Target: `main`
- Attivare: **Restrict deletions** e **Block force pushes**

Da quel momento nessuno dei due può cancellare il ramo principale o riscriverne la storia, nemmeno per sbaglio.

---

## PARTE 2 — Il collaboratore (una volta sola)

Servono **Git** (git-scm.com) e **Node.js** (nodejs.org) installati.

```
cd %USERPROFILE%\Downloads
git clone https://github.com/podereverdeapp-spec/allevamento.git
cd allevamento
npm install
```

La prima volta GitHub chiede di autenticarsi: si accede col proprio account.

Poi legga `STATO_PROGETTO.md` — è il documento che spiega com'è fatta l'app, chi fa cosa fra Aruba, GitHub, Vercel e Supabase, e dove sono le trappole note.

---

## PARTE 3 — Il ciclo di lavoro (ogni volta, sempre uguale)

**Prima di cominciare**, sempre:

```
git pull
```

Porta sul tuo computer quello che l'altro ha fatto nel frattempo. Se lo salti, lavori su una versione vecchia e ti troverai un conflitto dopo.

**Poi lavori** — a mano o con Claude.

**Prima di mandare**, verifica che compili come farà Vercel:

```
CI=true npm run build
```

Deve rispondere `Compiled successfully`. Se fallisce, Vercel fallirà allo stesso modo e il deploy non arriverà agli operatori.

**Infine mandi:**

```
git add src public package.json *.md
git commit -m "una frase su cosa hai cambiato"
git pull --rebase
git push
```

### Le tre regole che evitano quasi tutti i guai

1. **`git pull` prima di iniziare.** Sempre. Costa due secondi.
2. **Non tenere lavoro non salvato per giorni.** Chiudi la giornata con un push. Quello che è su GitHub è al sicuro per sempre; quello che è solo sul tuo PC può perdersi con un disco rotto o una cartella cancellata.
3. **Ditevi cosa state toccando.** Se uno lavora sulla Coltivazione e l'altro sul Pedigree, non vi incontrerete mai. Se entrambi mettete mano ad `allevamento_app.jsx` nello stesso pomeriggio, avvisatevi.

---

## PARTE 4 — Cosa succede quando qualcosa va storto

### "Il push è stato rifiutato"

```
! [rejected] main -> main (fetch first)
```

**Non è un errore: è la protezione che funziona.** Significa che l'altro ha pushato mentre lavoravi, e git si rifiuta di sovrascriverlo. Si risolve così:

```
git pull --rebase
git push
```

Git rimette il tuo lavoro sopra il suo. Nessuno perde niente.

### "Ci sono dei CONFLICT"

Succede solo se avete modificato **le stesse righe dello stesso file**. Git segna i due punti nel file così:

```
<<<<<<< HEAD
la versione dell'altro
=======
la tua versione
>>>>>>>
```

Si apre il file, si decide cosa tenere, si cancellano le righe con `<<<`, `===` e `>>>`, poi:

```
git add <file>
git rebase --continue
```

Nel dubbio, fermatevi e chiedete a Claude passando il contenuto del file: è una situazione che si risolve in un minuto, ma va fatta con calma e non a caso.

### "Ho fatto un disastro, voglio tornare indietro"

Tutto quello che è stato pushato è recuperabile, sempre. Niente di ciò che sta su GitHub va perso, nemmeno i file cancellati.

```
git log --oneline          vedi la storia
git checkout <codice> -- <file>    recupera un singolo file da una versione passata
git revert <codice>        annulla un commit creandone uno che lo disfa
```

**Da non usare mai in due:** `git push --force` e `git reset --hard` su lavoro già pushato. Il primo riscrive la storia comune, il secondo butta via il lavoro locale senza rete di sicurezza. La protezione della PARTE 1.3 blocca il primo.

---

## PARTE 5 — I due rischi che git NON copre

Git protegge il **codice**. Non protegge queste due cose.

### 5.1 Il database — i dati non sono versionati

C'è **un solo database**, quello di produzione: non esiste un ambiente di prova. Chi sviluppa lavora sui dati veri di Sborchia. Una SQL sbagliata cancella dati veri, e git non c'entra niente: non può recuperarli.

Cautele:

- **Mai una `delete` o una `update` senza `where`.** Prima si esegue la `select` corrispondente e si guarda quante righe tornano.
- **Le migrazioni si applicano subito alla produzione.** Non c'è un "push" separato per il database: quando si crea una tabella, esiste da quel momento per tutti.
- **Verificare i backup di Supabase** (Project Settings → Database → Backups) e sapere quanti giorni indietro si può tornare.
- Esiste già un backup `.sql` inviato per email il 1° di ogni mese. Una volta al mese è poco se si lavora in due: conviene alzarne la frequenza o scaricarne uno a mano prima di interventi importanti.

### 5.2 Il deploy — chi pusha manda in produzione

Ogni push su `main` fa partire il deploy automatico su podereverdeapp.it, che gli operatori usano ogni giorno. Non c'è un passaggio di approvazione.

Cautele:

- `CI=true npm run build` **prima** di ogni push. Non è formalità: è l'unico comando che riproduce quello che fa Vercel.
- Dopo il push, controllare **Vercel → Deployments**: il primo della lista deve essere **verde**. Se è rosso, il deploy non è avvenuto e gli operatori stanno ancora usando la versione precedente.
- Poi aprire l'app e controllare il **numero di versione nel menu utente**: se non è quello che hai appena mandato, o il deploy non è arrivato o il browser mostra una copia vecchia (Ctrl+F5).
- Evitare di pushare a fine giornata o durante le ore in cui gli operatori registrano.

### Se volete un passaggio di controllo

Si può lavorare a **rami separati**: ognuno sviluppa sul suo, Vercel ne pubblica un'anteprima a un indirizzo dedicato, e la modifica arriva in produzione solo quando viene approvata e unita a `main`. Costa qualche comando in più a testa, ma nessuno manda niente agli operatori per sbaglio. Da valutare se capita di lavorare su cose grosse in parallelo.
