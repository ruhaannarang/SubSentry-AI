const { healthService } = require('../services/health.service');

exports.getHealth = async (req, res) => {
  try {
    const result = await healthService.check();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
