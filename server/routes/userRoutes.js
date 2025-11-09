const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController');

// GET all users
router.get('/', getUsers);

// GET single user
router.get('/:id', getUser);

// POST create user
router.post('/', createUser);

// PUT update user
router.put('/:id', updateUser);

// DELETE user
router.delete('/:id', deleteUser);

module.exports = router;
