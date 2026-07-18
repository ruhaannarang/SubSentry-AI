const { spendingService } = require('../services/spending.service');

exports.getSpendingSummary = async (req, res) => {
  try {
    const result = await spendingService.analyze();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
