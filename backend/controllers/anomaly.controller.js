const { anomalyService } = require('../services/anomaly.service');

exports.getAnomalies = async (req, res) => {
  try {
    const result = await anomalyService.detect();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
