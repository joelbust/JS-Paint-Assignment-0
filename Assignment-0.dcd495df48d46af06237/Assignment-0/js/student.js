var Student = {
    // please fill in your name and ID
    // your ID is the part of your email before @fsu.edu
    'name'  : 'Joel Bustamante',
    'ID' : 'jsb21j',
};

Student.updateHTML = function( ) {
    var studentInfo = this.name + ' &lt;' + this.ID + '&gt;';
    document.getElementById('student').innerHTML = studentInfo;
}
