const WrittenInStone = require('../index.js');
const stoneLog = new WrittenInStone('mongodb', {
  path: 'mongodb://localhost/pl_tracking'
});

stoneLog.request('requester', 'requested', {
  test: true
}, function (err) {
  process.exit();
});
