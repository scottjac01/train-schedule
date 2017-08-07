$(document).ready(function () {

    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCmlmJW42diueofP4l2lnKeWlG7bL06s0U",
    authDomain: "train-schedule-34742.firebaseapp.com",
    databaseURL: "https://train-schedule-34742.firebaseio.com",
    projectId: "train-schedule-34742",
    storageBucket: "train-schedule-34742.appspot.com",
    messagingSenderId: "87598233427"

    };

    firebase.initializeApp(config);

    var database = firebase.database();
    displayTime();
    // When user clicks "submit" button, add a new row to the HTML table on the page
    $("#add-train").on("click", function () {
        event.preventDefault();


        var name = $("#name-input").val().trim();
        var des = $("#des-input").val().trim();
        var ftt = $("#ftt-input").val().trim();
        var freq = $("#freq-input").val().trim();

        //if time format is not meeet show user a message and clear the field
        if(moment(ftt, "HH:mm",true).isValid() === true){
          console.log(moment(ftt, "HH:mm").isValid());
          database.ref().push({
            name: name,
            destination: des,
            firstTrainTime: ftt,
            frequency: freq,
            });

            // clear the on-screen fields
            $("#name-input").val('');
            $("#des-input").val('');
            $("#ftt-input").val('');
            $("#freq-input").val('');
         }
         else{
          console.log(moment(ftt, "HH:mm").isValid());
          $("#ftt-input").val('');
          alert("The time format entered is invalid.  Time must be entered as \"HH:mm\"");
         }

      });


    database.ref().on("child_added", function (childSnapshot) {

  // calculate the next arrival time an d the minutes away    
    var tFrequency = childSnapshot.val().frequency;

    // Set the firstTime
    var firstTime = childSnapshot.val().firstTrainTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

// add new row to on-screen table
        $("#emp-table").append("<tr><td>" + childSnapshot.val().name + "</td>" +
            "<td>" + childSnapshot.val().destination + "</td>" +
            "<td>" + childSnapshot.val().frequency + "</td>" +
            "<td>" + moment(nextTrain).format("HH:mm a") + "</td>" +
            "<td>" + tMinutesTillTrain + "</td></tr>");
      // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    //Show the current time
    //$("#currTime").append("<b>" + "Current Time: " +
      //moment().format("dddd, MMMM Do YYYY, h:mm:ss a") + "</b>");
        //setTimeout(displayTime, 1000);
    function displayTime() {
        var time = moment().format("HH:mm:ss");
        $("#currTime").html(time);
        setTimeout(displayTime, 1000);
        }

});
