const assert = require('assert');
const { paymentRiskService } = require('../services/payment-risk.service');

const highRiskResult = paymentRiskService.assess('paytm-help-fast.in');
assert.strictEqual(highRiskResult.level, 'High');
assert.ok(highRiskResult.score >= 60);

const lowRiskResult = paymentRiskService.assess('name@upi');
assert.strictEqual(lowRiskResult.level, 'Low');
assert.ok(lowRiskResult.score < 30);

console.log('payment-risk.service test passed');
