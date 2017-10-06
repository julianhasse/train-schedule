
$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAbCOlYXpYjGaWIYXlusRQRJzRmu7wWRuk",
    authDomain: "trainscheduler-aa3bc.firebaseapp.com",
    databaseURL: "https://trainscheduler-aa3bc.firebaseio.com",
    projectId: "trainscheduler-aa3bc",
    storageBucket: "trainscheduler-aa3bc.appspot.com",
    messagingSenderId: "810609306899"
  };
  firebase.initializeApp(config);


    // Reference the database.
    var database = firebase.database();

    // Display user name
    $("#greeting").html('<i class="fa fa-user" aria-hidden="true"></i>' + " " + localStorage.getItem("name"));

    // Capture user entry
    $("#add").on("click", function(event) {
        event.preventDefault();

        // Grabbed user input from text boxes
        var name = $("#name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var startTime = $("#firstService-input").val().trim();
        var frequency = $("#frequency-input").val().trim();

        // Creates local object for new trains
        var newTrain = {
        	  name: name,
            destination: destination,
            startTime: startTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP	
        };

        // Push to the Database
        database.ref().push(newTrain);

        // Clears fields
  		$("#name-input").val("");
  		$("#destination-input").val("");
 		  $("#firstService-input").val("");
  		$("#frequency-input").val("");
    });

    // Adding train to DB and a row in timetable
	database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  	// Store everything into a variable.
  	var name = childSnapshot.val().name;
  	var destination = childSnapshot.val().destination;
  	var startTime = childSnapshot.val().startTime;
  	var frequency = childSnapshot.val().frequency;


    // Start Time (pushed back 1 year to make sure it comes before current time)
    var startTimeConverted = moment(startTime, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times -- minutes passed since first train left
    var totalMinPassed = moment().diff(moment(startTimeConverted), "minutes");

    // Time apart (remainder) -- minutes passed since the last train left
    var minFromLast = totalMinPassed % frequency;

    // Minutes Until Next Train Arrives
    var minToNext = frequency - minFromLast;

    // Next Train Arrival time
    var nextTrain = moment().add(minToNext, "minutes");

    // Next Train format
    var nextTrainTime = moment(nextTrain).format("LT");


  	// Populate the table
  	$("#train-table > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" +
  	frequency + " min." + "</td><td>" + nextTrainTime + "</td><td>" + minToNext + " min." + "</td></tr>");
});

}); // document.ready()