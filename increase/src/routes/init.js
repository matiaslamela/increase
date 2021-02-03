const { Router } = require('express');
const router = Router();
const {init, clearIntervalFunc } = require('../controllers/initFetch');

router.post('/fetch-end', (req, res) => {
  clearIntervalFunc().then((response) => {
    res.send(response)
  })
})

router.post('/fetch-file', (req, res) => {
    init()
    .then((e) => {
      return res.send(e)
    })
    .catch((e) => {
      return res.send(e)
  })
})

module.exports = router;