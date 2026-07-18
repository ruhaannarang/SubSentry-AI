const { duplicateService } = require('../services/duplicate.service');

exports.getDuplicates = async (req, res) => {
  try {
    const result = await duplicateService.findDuplicates();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
