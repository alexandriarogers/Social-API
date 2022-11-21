const router = require('express').Router();
const apiRoutes = require('./api/index.js');

router.use('/api', apiRoutes);

router.get('*',(req, res) => {
  res.status(404).send('<h1> 404 Error </h1>');
});

module.exports = router;