const { Op } = require('sequelize');
const db = require('../models');

exports.createBoard = async (req, res) => {
  const { name, author } = req.body;
  try {
    const board = await db.Board.create({ name, author });
    res.status(200).json(board);
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ error: 'Error creating board' });
  }
};

exports.getAllBoards = async (req, res) => {
  const { page = 1 } = req.query;
  const offset = (page - 1) * 5;
  try {
    const boards = await db.Board.findAll({
      offset: parseInt(offset),
      limit: 5,
      order: [["createdAt", "DESC"]]
    });
    res.status(200).json(boards);
  } catch (error) {
    console.error("Error getting boards:", error);
    res.status(500).json({ error: 'Error getting boards' });
  }
};

exports.updateBoard = async (req, res) => {
  const { id } = req.params;
  const { canvasData } = req.body;
  const imageUrl = req.file ? req.file.location : null;
  console.log(canvasData, id, imageUrl)
  
  try {
    const board = await db.Board.findByPk(id);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    if (canvasData) board.data = canvasData;
    if (imageUrl) board.thumbnail = imageUrl;

    await board.save();
    res.status(200).json(board);
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ error: 'Error updating board' });
  }
};

exports.getBoard = async (req, res) => {
  const { id } = req.params;
  try {
    const board = await db.Board.findByPk(id);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    res.status(200).json(board);
  } catch (error) {
    console.error("Error getting board:", error);
    res.status(500).json({ error: 'Error getting board' });
  }
};

exports.search = async (req, res) => {
  const { query } = req.query;

  try {
    const sanitizedQuery = query
      .replace(/'/g, "''") 
      .split(/\s+/)
      .filter(word => word.length > 0) 
      .map(word => `${word}:*`) 
      .join(' & ');

    if (!sanitizedQuery) {
      return res.status(400).json({ error: 'Invalid query' });
    }

    const searchQuery = `(${sanitizedQuery})`;

    const boards = await db.Board.findAll({
      where: db.Sequelize.literal(`search_vector @@ to_tsquery('${searchQuery}')`)
    });
    res.json(boards);
  } catch (error) {
    console.error('Error while searching:', error);
    res.status(500).json({ error: 'An error occurred while searching' });
  }
};
