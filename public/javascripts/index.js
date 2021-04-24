//pet object
function Pet(pName, pAge, pBreed, pGender, pStatus) {
    //this.id = pId;
    this.id = 0;
    this.name = pName;
    this.age = pAge;
    this.breed = pBreed;
    this.gender = pGender;
    this.status = pStatus;
}

//our local copy of the cloud data
var PetNotes = [];

document.addEventListener("DOMContentLoaded", function (event) {

    //add a pet to database
    document.getElementById("submit").addEventListener("click", function () {
        //var tId = document.getElementById("addID").value
        var tName = document.getElementById("addName").value;
        var tAge = document.getElementById("addAge").value;
        var tBreed = document.getElementById("addBreed").value;
        var tGender = document.getElementById("addGender").value;
        var tStatus = document.getElementById("addStatus").value;
        var onePet = new Pet(tName, tAge, tBreed, tGender, tStatus);
        //var onePet = new Pet(pId, tName, tAge, tBreed, tGender, tStatus);

        $.ajax({
            url: '/NewPet' ,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(onePet),
            success: function (result) {
                console.log("added new pet")
            }
        });
    });

    //get pet from database
    document.getElementById("get").addEventListener("click", function () {
        
        var ul = document.getElementById('listUl');
        ul.innerHTML = "";  // clears existing list so we don't duplicate old ones
        
        //var ul = document.createElement('ul')

        $.get("/Pets", function(data, status){  // AJAX get
            PetNotes = data;  // put the returned server json data into our local array

            // sort array by one property
            PetNotes.sort(compare);  // see compare method below
            console.log(data);
            //listDiv.appendChild(ul);
            PetNotes.forEach(ProcessOnePet); // build one li for each item in array
            function ProcessOnePet(item, index) {
                var li = document.createElement('li');
                ul.appendChild(li);
                li.innerHTML=li.innerHTML + index + ", Name: " + item.name + "," + 
                " Age:  " + item.age + ", Breed:  " + item.breed + ", Gender: "+ item.gender +
                ", Adoption Status: " + item.status;
            }
        });

        function compare(a,b) {
            if (a.completed == false && b.completed== true) {
                return -1;
            }
            if (a.completed == false && b.completed== true) {
                return 1;
            }
            return 0;
        }
    });
  
    //delete pet from database
    document.getElementById("delete").addEventListener("click", function () {
        
        var whichPet = document.getElementById('deleteName').value;
        var idToDelete = "";
        for(i=0; i< PetNotes.length; i++){
            if(PetNotes[i].name === whichPet) {
                idToDelete = PetNotes[i]._id;
           }
        }
        
        if(idToDelete != "")
        {
                     $.ajax({
                    url: 'DeletePet/'+ idToDelete,
                    type: 'DELETE',
                    contentType: 'application/json',
                    success: function (response) {
                        console.log(response);
                    },
                    error: function () {
                        console.log('Error in Operation');
                    }
                });
        }
        else {
            console.log("No match found");
        }
    });

    //find pet to modify in the database
    document.getElementById("find").addEventListener("click", function () {
        var pId = document.getElementById("modPet").value;
        var idToFind = "";
        for(i=0; i< PetNotes.length; i++){
            if(PetNotes[i].name === pId) {
                idToFind = PetNotes[i]._id;
           }
        }
        console.log(idToFind);

        $.get("/FindPet/"+ idToFind, function(data, status){
            //console.log(data[0].id + " " + data[0].name);
            console.log(data[0].name);
            document.getElementById("modName").value = data[0].name;
            document.getElementById("modAge").value= data[0].age;
            document.getElementById("modBreed").value = data[0].breed;
            document.getElementById("modGender").value = data[0].gender;
            document.getElementById("modAdopted").value = data[0].status;
        });
    });

    //modify pet in the database
    document.getElementById("modSubmit").addEventListener("click", function () {
        var whichPet = document.getElementById('modPet').value;
        var idToChange = "";

        var eName = document.getElementById("modName").value;
        var eAge = document.getElementById("modAge").value;
        var eBreed = document.getElementById("modBreed").value;
        var eGender = document.getElementById("modGender").value;
        var eStatus = document.getElementById("modAdopted").value;

        for(i=0; i< PetNotes.length; i++){
            if(PetNotes[i].name === whichPet) {
                idToChange = PetNotes[i]._id
           }
        }

        if(idToChange != "")
        {
            $.ajax({
                url: '/UpdatePet',
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    id: idToChange,
                    name: eName,
                    age: eAge,
                    breed: eBreed,
                    gender: eGender,
                    status: eStatus
                }),
                success: function (response) {
                    console.log(response);
                },
                error: function () {
                    console.log('Error in Operation');
                }
            });
            
        }
        else {
            console.log("no matching Subject");
        } 
    });
});