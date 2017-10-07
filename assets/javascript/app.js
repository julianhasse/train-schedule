
$(document).ready(function() {

  var config = {
    apiKey: "AIzaSyAbCOlYXpYjGaWIYXlusRQRJzRmu7wWRuk",
    authDomain: "trainscheduler-aa3bc.firebaseapp.com",
    databaseURL: "https://trainscheduler-aa3bc.firebaseio.com",
    projectId: "trainscheduler-aa3bc",
    storageBucket: "trainscheduler-aa3bc.appspot.com",
    messagingSenderId: "810609306899"
  };
  firebase.initializeApp(config);

    var database = firebase.database();

    $("#greeting").html('<i class="fa fa-user" aria-hidden="true"></i>' + "  " + localStorage.getItem("name"));

    $("#add").on("click", function(event) {
        event.preventDefault();

        var name = $("#name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var startTime = $("#firstService-input").val().trim();
        var frequency = $("#frequency-input").val().trim();

        var newTrain = {
        	  name: name,
            destination: destination,
            startTime: startTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP	
        };

        database.ref().push(newTrain);

  		$("#name-input").val("");
  		$("#destination-input").val("");
 		  $("#firstService-input").val("");
  		$("#frequency-input").val("");
    });

	database.ref().on("child_added", function(dataSnapshot, prevChildKey) {

  	var name = dataSnapshot.val().name;
  	var destination = dataSnapshot.val().destination;
  	var startTime = dataSnapshot.val().startTime;
  	var frequency = dataSnapshot.val().frequency;


    var startTimeConverted = moment(startTime, "hh:mm").subtract(1, "years");
    var currentTime = moment();
    var totalMinPassed = moment().diff(moment(startTimeConverted), "minutes");
    var minFromLast = totalMinPassed % frequency;
    var minToNext = frequency - minFromLast;
    var nextTrain = moment().add(minToNext, "minutes");
    var nextTrainTime = moment(nextTrain).format("LT");


  	$("#train-table > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" +
  	frequency + " min." + "</td><td>" + nextTrainTime + "</td><td>" + minToNext + " min." + "</td></tr>");
});

}); // document.ready()