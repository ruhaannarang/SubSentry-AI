const { gemmaService } = require('../services/gemma.service');

exports.getInsight = async (req, res) => {
  try {
    const result = await gemmaService.generateInsight();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
