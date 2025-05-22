const express = require('express');
const router = express.Router();
const { poolConnect, sql } = require('../db');

router.get('/', async (req, res) => {
  await poolConnect;
  try {
    const request = await poolConnect.then(pool => pool.request());
    const result = await request.query('SELECT * FROM tasks');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title } = req.body;
  await poolConnect;
  try {
    const request = await poolConnect.then(pool => pool.request());
    await request.input('title', sql.NVarChar, title)
                .query('INSERT INTO tasks (title) VALUES (@title)');
    res.status(201).json({ title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await poolConnect;
  try {
    const request = await poolConnect.then(pool => pool.request());
    await request.input('id', sql.Int, id)
                .query('DELETE FROM tasks WHERE id = @id');
    res.status(200).json({ deleted: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;