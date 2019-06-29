var searchTerm;
var searches = [];
var database = firebase.database();
var favs = [];


favs = JSON.parse(Cookies.get('favs'));
cookieReader(favs);

$("#bigOlButton").on("click", function(event){
    event.preventDefault();
    searchTerm = $("#whatAreWeLookingFor").val().trim().toUpperCase().split(',').join(' ');
    
    // console.log(searchTerm);
    gifIt(searchTerm);
    if (!searches.includes(searchTerm)){
        searches.push(searchTerm);
        database.ref().set({
            searches: searches.toString()
          });
          $("#coolbtns").empty();
          for (a in searches){
              
              var newBtn = $("<button type='button' class='btn btn-success my-1 mx-1'>");
              newBtn.text(searches[a]);
              $("#coolbtns").append(newBtn);
          }
    } 
});

function gifIt(a) {
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/search",
        method: "GET",
        data: {"api_key" : "BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9",
        "q": a,
        "limit" : "10",
        "lang" : "en"}
    }).then(function(response) {
        var results = response.data;
        // console.log(response.data.length);
        for (var i = 0; i < results.length; i++) {
            var imageUrl = results[i].images.original_still.url;
            console.log(imageUrl);
            var cardDiv = $("<div clas='card border-primary mb-3'>");
            var newImage = $("<img>");
            newImage.attr({"src": imageUrl, "data-still": imageUrl, "data-animate": results[i].images.original.url, "data-state": "still"});
            newImage.attr("class", "card-img-top gif");
            var cardDivBody = $("<div class='card-body'>");
            var cardText = $("<p class='card-text'>").text("Rating: " + results[i].rating);
            $(cardDivBody).append(cardText);
            $(cardDiv).append(newImage);
            $(cardDiv).append(cardDivBody);
            $("#gif-go-here").prepend(cardDiv);

            // gifDiv.append(newImage);
            // $("#gif-go-here").prepend(newImage);
        }});
};

$(document).on("click", ".gif", function() {
    // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
    var state = $(this).attr("data-state");
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }
  });

function cookieReader(cookie){
 
    
    for (a in cookie){
        carousel(cookie[a]);
    }
}

function carousel(button){
    var favCarousel = $("<div>");
    favCarousel.attr("class", "carousel-item" );
    // var whatever = $(this).attr("data-animate");
    // console.log(whatever);
    var imgInCarousel = $("<img>");
    imgInCarousel.attr({"src": button, "class":"d-block w-100"});
    console.log(imgInCarousel);
    $(favCarousel).append(imgInCarousel);
    $(".carousel-inner").append(favCarousel);

}

$(document).on("dblclick", ".gif", function(){
    
    favs.push($(this).attr("data-animate"));

    
    Cookies.set('favs', favs);

    carousel($(this).attr("data-animate"));

});

$(document).on("click", ".btn", function(){
    console.log('wowowo');
    console.log($(this).text());
    gifIt($(this).text());
});


database.ref().on("value", function(snapshot) {
    console.log(snapshot.val());
    dbitems = snapshot.val().searches;
    searches = dbitems.split(",");
    $("#coolbtns").empty();
    for (a in searches){
        
        var newBtn = $("<button type='button' class='btn btn-success my-1 mx-1'>");
        newBtn.text(searches[a]);
        $("#coolbtns").append(newBtn);
    }
  });