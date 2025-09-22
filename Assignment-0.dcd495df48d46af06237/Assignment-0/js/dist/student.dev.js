"use strict";

var Student = {
  // please fill in your name and ID
  // your ID is the part of your email before @fsu.edu
  'name': 'Student Name',
  'ID': 'ID'
};

Student.updateHTML = function () {
  var studentInfo = this.name + ' &lt;' + this.netID + '&gt;';
  document.getElementById('student').innerHTML = studentInfo;
};
//# sourceMappingURL=student.dev.js.map
