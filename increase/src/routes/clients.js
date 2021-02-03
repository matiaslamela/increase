const { Router } = require('express');
const router = Router();
const {getClientInfo} = require('../controllers/clients');

router.get('/:clientId', (req, res) => {
  let clientId = req.params.clientId
  getClientInfo(clientId)
  .then(e => {
    return res.send(e.data)
  }).catch((e) => {
    return res.sendStatus(402)
  });
});



module.exports = router;