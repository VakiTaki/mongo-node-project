const express = require('express');
const router = express.Router();
const {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  patchPlan,
  deletePlan
} = require('../controllers/plans.controller');

router.get('/', getPlans);
router.get('/:id', getPlan);
router.post('/', createPlan);
router.put('/:id', updatePlan);
router.patch('/:id', patchPlan);
router.delete('/:id', deletePlan);

module.exports = router;
