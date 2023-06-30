const express = require('express');
const router = express.Router();
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  topCheapTours,
  // checkID,
  // checkBody,
} = require(`${__dirname}/../controllers/tourController`);

router.route('/top-cheap-5').get(topCheapTours, getAllTours); 
// router.param('id', checkID);
router.route(`/`).get(getAllTours).post(createTour);
router.route(`/:id`).get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
