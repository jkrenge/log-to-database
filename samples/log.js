const WrittenInStone = require('../index.js');
const stonePlate = new WrittenInStone('mongodb', {
  path: 'mongodb://localhost/pl_tracking'
});

stonePlate.engraveRequest(0, '127.0.0.1', '/service/showall', {
  test: true
}, function (err) {
  console.log(err);

  stonePlate.engraveStatus(1, 'queue-waiting-jobs', '500', {
    test: true
  }, function (err) {
    console.log(err);

    stonePlate.engraveActivity('sent-email', {
      test: true
    }, function (err) {
      console.log(err);

      stonePlate.engraveCycle('processing-queue', 'job-77346324', 0, {
        test: true
      }, function (err) {

        console.log(err);

        process.exit();

      });

    });

  });

});
