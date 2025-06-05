import React, { useState } from 'react';
import './App.css';

function App() {
  const [ucenikId, setUcenikId] = useState('');
  const [nastavnikId, setNastavnikId] = useState('');
  const [rezultati, setRezultati] = useState([]);
  const [rezultatiNastavnik, setRezultatiNastavnik] = useState([]);
  const [statistika, setStatistika] = useState([]);
  const [sveBiljeske, setSveBiljeske] = useState([]);

  const [prikaziFormu, setPrikaziFormu] = useState(false);
  const [prikaziPretragu, setPrikaziPretragu] = useState(false);
  const [prikaziPretraguNastavnik, setPrikaziPretraguNastavnik] = useState(false);
  const [prikaziStatistiku, setPrikaziStatistiku] = useState(false);
  const [prikaziBrisanje, setPrikaziBrisanje] = useState(false);

  const [pretrazeno, setPretrazeno] = useState(false);
  const [pretrazenoNastavnik, setPretrazenoNastavnik] = useState(false);

  const [biljeska, setBiljeska] = useState({
    ucenik_id: '',
    nastavnik_id: '',
    predmet: '',
    tekst: '',
    datum: ''
  });

  const handleChange = (e) => {
    setBiljeska({ ...biljeska, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const odgovor = await fetch('/api/biljeske', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(biljeska)
    });

    if (odgovor.ok) {
      alert('✅ Bilješka je uspješno dodana!');
      setBiljeska({ ucenik_id: '', nastavnik_id: '', predmet: '', tekst: '', datum: '' });
      setPrikaziFormu(false);
    } else {
      alert('❌ Greška pri dodavanju bilješke.');
    }
  };

  const handlePretraziBiljeske = async () => {
    if (!ucenikId) return alert("Unesi ID učenika!");
    try {
      const res = await fetch(`/api/biljeske/${ucenikId}`);
      const data = await res.json();
      setRezultati(data);
      setPretrazeno(true);
    } catch (err) {
      alert("Greška pri dohvaćanju bilješki.");
    }
  };

  const handlePretraziPoNastavniku = async () => {
    if (!nastavnikId) return alert("Unesi ID nastavnika!");
    try {
      const res = await fetch(`/api/biljeske/nastavnik/${nastavnikId}`);
      const data = await res.json();
      setRezultatiNastavnik(data);
      setPretrazenoNastavnik(true);
    } catch (err) {
      alert("Greška pri dohvaćanju bilješki za nastavnika.");
    }
  };

  const handlePrikaziStatistiku = async () => {
    try {
      const res = await fetch('/api/statistika');
      const data = await res.json();
      setStatistika(data);
      setPrikaziStatistiku(true);
    } catch (err) {
      alert("Greška pri dohvaćanju statistike.");
    }
  };

  const handlePrikaziZaBrisanje = async () => {
    try {
      const res = await fetch('/api/biljeske');
      const data = await res.json();
      setSveBiljeske(data);
      setPrikaziBrisanje(true);
    } catch (err) {
      alert("Greška pri dohvaćanju bilješki za brisanje.");
    }
  };

  const obrisiBiljesku = async (id) => {
    if (!id || id === 'undefined') {
      alert("❌ Neispravan ID bilješke.");
      return;
    }
    const potvrda = window.confirm("Jeste li sigurni da želite obrisati ovu bilješku?");
    if (!potvrda) return;

    try {
      const res = await fetch(`/api/biljeske/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Brisanje nije uspjelo.");
      alert("Bilješka obrisana!");
      setSveBiljeske(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      alert("❌ Brisanje nije uspjelo.");
    }
  };

  return (
    <div className="App">
      <h1>📚 Školska aplikacija za bilješke</h1>

      <div className="gumbi">
        <button onClick={() => setPrikaziFormu(true)}>Dodaj novu bilješku</button>
        <button onClick={() => setPrikaziPretragu(true)}>Pretraži bilješke po učeniku</button>
        <button onClick={() => setPrikaziPretraguNastavnik(true)}>Pretraži bilješke po nastavniku</button>
        <button onClick={handlePrikaziStatistiku}>Prikaži statistiku bilješki</button>
        <button onClick={handlePrikaziZaBrisanje}>Obriši bilješku</button>
      </div>

      {prikaziFormu && (
        <div className="modal">
          <form onSubmit={handleSubmit} className="forma">
            <h3>Nova bilješka</h3>
            <input name="ucenik_id" placeholder="ID učenika" value={biljeska.ucenik_id} onChange={handleChange} required />
            <input name="nastavnik_id" placeholder="ID nastavnika" value={biljeska.nastavnik_id} onChange={handleChange} required />
            <input name="predmet" placeholder="Predmet" value={biljeska.predmet} onChange={handleChange} required />
            <input name="tekst" placeholder="Tekst bilješke" value={biljeska.tekst} onChange={handleChange} required />
            <input name="datum" placeholder="Datum (YYYY-MM-DD)" value={biljeska.datum} onChange={handleChange} required />
            <div className="form-gumbi">
              <button type="submit">Spremi</button>
              <button type="button" onClick={() => setPrikaziFormu(false)}>Odustani</button>
            </div>
          </form>
        </div>
      )}

      {prikaziPretragu && (
        <div style={{ marginTop: '30px' }}>
          <h3>Unesi ID učenika</h3>
          <input type="text" value={ucenikId} onChange={(e) => setUcenikId(e.target.value)} placeholder="Unesi ID učenika" />
          <button onClick={handlePretraziBiljeske}>Prikaži bilješke</button>

          <div style={{ marginTop: '20px' }}>
            {pretrazeno && (rezultati.length > 0 ? (
              <ul>
                {rezultati.map((b, i) => (
                  <li key={i}> 📌 <strong>{b.predmet}</strong>: {b.tekst} ({b.datum}) </li>
                ))}
              </ul>
            ) : (<p>Nema bilješki za odabranog učenika.</p>))}
          </div>
        </div>
      )}

      {prikaziPretraguNastavnik && (
        <div style={{ marginTop: '30px' }}>
          <h3>Unesi ID nastavnika</h3>
          <input type="text" value={nastavnikId} onChange={(e) => setNastavnikId(e.target.value)} placeholder="Unesi ID nastavnika" />
          <button onClick={handlePretraziPoNastavniku}>Prikaži bilješke</button>

          <div style={{ marginTop: '20px' }}>
            {pretrazenoNastavnik && (rezultatiNastavnik.length > 0 ? (
              <ul>
                {rezultatiNastavnik.map((b, i) => (
                  <li key={i}> 👩‍🏫 <strong>{b.predmet}</strong>: {b.tekst} ({b.datum}) </li>
                ))}
              </ul>
            ) : (<p>Nema bilješki za odabranog nastavnika.</p>))}
          </div>
        </div>
      )}

      {prikaziStatistiku && (
        <div style={{ marginTop: '30px' }}>
          <h3>📊 Statistika bilješki po predmetima</h3>
          <ul>
            {statistika.map((s, i) => (
              <li key={i}>
                📚 <strong>{s._id}</strong>: {s.broj} bilješk{(s.broj === 1) ? 'a' : (s.broj < 5 ? 'e' : 'i')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {prikaziBrisanje && (
        <div style={{ marginTop: '30px' }}>
          <h3>🗑️ Obriši bilješke</h3>
          <ul>
            {sveBiljeske.map((b) => (
              <li key={b._id}>
                <strong>{b.predmet}</strong>: {b.tekst} ({b.datum})
                <button onClick={() => obrisiBiljesku(b._id)} style={{ marginLeft: '10px' }}>
                  Obriši
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
