const { subscriptionService } = require('../services/subscription.service');

exports.getSubscriptions = async (req, res) => {
  try {
    const result = await subscriptionService.checkSubscriptions();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
