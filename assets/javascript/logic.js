$(document).ready(function () {

    //<script src="https://www.gstatic.com/firebasejs/4.2.0/firebase.js"></script>
    //

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAy_o7UX05hJucBrmww9zSR0Z-mljJPNdk",
        authDomain: "empdatamgmt.firebaseapp.com",
        databaseURL: "https://empdatamgmt.firebaseio.com",
        projectId: "empdatamgmt",
        storageBucket: "empdatamgmt.appspot.com",
        messagingSenderId: "788027534154"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // When user clicks "submit" button, add a new row to the HTML table on the page
    $("#add-user").on("click", function () {
        event.preventDefault();


        var name = $("#name-input").val().trim();
        var role = $("#role-input").val().trim();
        var date = $("#start-input").val().trim();
        var rate = $("#rate-input").val().trim();


        database.ref().push({
            name: name,
            role: role,
            date: date,
            rate: rate,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        // clear the on-screen fields
        $("#name-input").val('');
        $("#role-input").val('');
        $("#start-input").val('');
        $("#rate-input").val('');

    });


    database.ref().on("child_added", function (childSnapshot) {

        // calculate months worked
        var months = moment().diff(moment(childSnapshot.val().date, "DD/MM/YY"), "months");

        // add new row to on-screen table
        $("#emp-table").append("<tr><td>" + childSnapshot.val().name + "</td>" +
            "<td>" + childSnapshot.val().role + "</td>" +
            "<td>" + childSnapshot.val().date + "</td>" +
            "<td>" + months + "</td>" +
            "<td>" + childSnapshot.val().rate + "</td>" +
            "<td>" + Number(months) * Number(childSnapshot.val().rate) + "</td></tr>");

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });


});