const express = require('express');
const { requireAuth, requireFreshRole } = require('../middleware/auth');
const userRepository = require('../models/userRepository');
const { revokeAllUserSessions } = require('../utils/tokens');
const pool = require('../db/pool');

const router = express.Router();

// Every route below requires a valid session AND a fresh (DB-checked) admin role.
router.use(requireAuth, requireFreshRole('admin'));

/** List users (paginated), decrypted for admin display. */
router.get('/users', async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 25, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const { rows } = await pool.query(
      `SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const { rows: countRows } = await pool.query(`SELECT COUNT(*)::int AS count FROM users`);

    return res.json({
      users: rows.map(userRepository.toPublicUser),
      total: countRows[0].count,
      limit,
      offset,
    });
  } catch (err) {
    return next(err);
  }
});

/** Promote/demote a user's role. */
router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body || {};
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'invalid_role', message: "role must be 'user' or 'admin'." });
    }
    if (req.params.id === req.user.id && role !== 'admin') {
      return res.status(400).json({ error: 'cannot_demote_self', message: 'You cannot remove your own admin role.' });
    }

    const updated = await userRepository.setRole(req.params.id, role);
    if (!updated) return res.status(404).json({ error: 'not_found' });

    return res.json({ user: userRepository.toPublicUser(updated) });
  } catch (err) {
    return next(err);
  }
});

/** Force-logout a user everywhere (revoke all refresh tokens). */
router.post('/users/:id/revoke-sessions', async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'not_found' });
    await revokeAllUserSessions(user.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
