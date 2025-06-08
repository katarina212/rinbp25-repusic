// ===== server.js =====
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/edukacija', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
  console.log('✅ MongoDB povezan.');
});

// ===== SCHEMAS =====
const BiljeskaSchema = new mongoose.Schema({
  _id: String, // UUID kao string
  ucenik_id: String,
  nastavnik_id: String,
  predmet: String,
  tekst: String,
  datum: String
}, { _id: false }); // Da koristiš svoj _id

const Biljeska = mongoose.model('Biljeska', BiljeskaSchema, 'biljeske');

const Ucenik = mongoose.model('Ucenik', new mongoose.Schema({
  ime: String,
  prezime: String,
  razred: String,
  datum_rodjenja: String,
}), 'ucenici');

// ===== ROUTES =====

// Dodaj bilješku (POST)
app.post('/api/biljeske', async (req, res) => {
  try {
    const nova = new Biljeska({ _id: req.body._id, ...req.body }); // koristiš svoj _id iz frontenda
    await nova.save();
    res.status(201).json({ poruka: 'Bilješka dodana!' });
  } catch (err) {
    console.error('❌ Greška POST:', err);
    res.status(500).json({ greska: 'Greška pri spremanju bilješke.' });
  }
});

// Dohvati sve bilješke (GET)
app.get('/api/biljeske', async (req, res) => {
  try {
    const sve = await Biljeska.find();
    res.json(sve);
  } catch (err) {
    res.status(500).json({ greska: 'Greška pri dohvaćanju bilješki.' });
  }
});

// Dohvati bilješke po učeniku
app.get('/api/biljeske/:ucenik_id', async (req, res) => {
  try {
    const biljeske = await Biljeska.find({ ucenik_id: req.params.ucenik_id });
    res.json(biljeske);
  } catch (err) {
    res.status(500).json({ greska: 'Greška pri dohvaćanju bilješki za učenika.' });
  }
});

// Dohvati bilješke po nastavniku
app.get('/api/biljeske/nastavnik/:nastavnik_id', async (req, res) => {
  try {
    const biljeske = await Biljeska.find({ nastavnik_id: req.params.nastavnik_id });
    res.json(biljeske);
  } catch (err) {
    res.status(500).json({ greska: 'Greška pri dohvaćanju bilješki za nastavnika.' });
  }
});

// Statistika bilješki po predmetima
app.get('/api/statistika', async (req, res) => {
  try {
    const statistika = await Biljeska.aggregate([
      { $group: { _id: "$predmet", broj: { $sum: 1 } } },
      { $sort: { broj: -1 } }
    ]);
    res.json(statistika);
  } catch (err) {
    res.status(500).json({ greska: 'Greška pri dohvaćanju statistike.' });
  }
});

// Brisanje bilješke (DELETE)
app.delete('/api/biljeske/:id', async (req, res) => {
  try {
    const obrisana = await Biljeska.findOneAndDelete({ _id: req.params.id });
    if (!obrisana) {
      return res.status(404).json({ greska: 'Bilješka nije pronađena.' });
    }
    res.json({ poruka: '✅ Bilješka obrisana.' });
  } catch (err) {
    console.error("❌ Greška pri brisanju:", err);
    res.status(500).json({ greska: 'Greška pri brisanju bilješke.' });
  }
});

// Pokreni server
app.listen(PORT, () => {
  console.log(`🚀 Server radi na portu ${PORT}`);
});
