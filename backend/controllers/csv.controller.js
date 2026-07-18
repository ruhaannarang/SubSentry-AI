const { csvService } = require('../services/csv.service');

exports.processFile = async (req, res) => {
  try {
    const result = await csvService.processFile();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
