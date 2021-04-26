//order object
function Order(pStoreID, pSalesPersonID, pCdID, pPricePaid) {
    //this.id = 0;
    this.StoreID = pStoreID;
    this.SalesPersonID = pSalesPersonID;
    this.CdID = pCdID;
    this.PricePaid = pPricePaid;
    this.HourPurch = 0;
    this.DayPurch = 0;
}
var orderToSend;

//our local copy of the cloud data
var OrderArray = [];
//contains StoreID and related SalesPersonID data
var StoreArray = [
    [98053, 1, 2, 3, 4],
    [98007, 5, 6, 7, 8],
    [98077, 9, 10, 11, 12],
    [98055, 13, 14, 15, 16],
    [98011, 17, 18, 19, 20],
    [98046, 21, 22, 23, 24]
];
//contains sales person names corresponding to SalesPersonID
var SalesPersonArray = [];
//contains CdIds
var CdArray = [123456, 123654, 321456, 321654, 654123, 654321, 543216, 354126, 621453, 623451];

//generates random number between 0 and (max parameter - 1)
function random(max) {
    return Math.floor(Math.random() * max);
}

//generates order for submit 500
function generateOrder(){
    var storeIndex = random(6); //selects store index
    randomStoreID = StoreArray[storeIndex][0];
    randomSalesPersonID = StoreArray[storeIndex][random(4) + 1]; //selects random sales person from the selected store
    randomCdID = CdArray[random(10)];
    randomPricePaid = random(11) + 5; //selects random number between 5 and 15
    // creates order from random data to submit for button #2
    orderToSend = new Order(randomStoreID, randomSalesPersonID, randomCdID, randomPricePaid);
    return(orderToSend);
}

document.addEventListener("DOMContentLoaded", function (event) {

    //generates new values and displays them on the page
    document.getElementById("create").addEventListener("click", function () {
        //gets elements on page to display information
        var tStoreID = document.getElementById("displayStoreID");
        var tSalesPersonID = document.getElementById("displaySalesPersonID");
        var tCdID = document.getElementById("displayCdID");
        var tPricePaid = document.getElementById("displayPricePaid");

        //randomly select data from the corresponding arrays to generate a new random order
        var storeIndex = random(6); //selects store index
        randomStoreID = StoreArray[storeIndex][0];
        randomSalesPersonID = StoreArray[storeIndex][random(4) + 1]; //selects random sales person from the selected store
        randomCdID = CdArray[random(10)];
        randomPricePaid = random(11) + 5; //selects random number between 5 and 15
        // creates order from random data to submit for button #2
        orderToSend = new Order(randomStoreID, randomSalesPersonID, randomCdID, randomPricePaid)

        //displays randomly generated information to the page
        tStoreID.innerHTML = "StoreID: " + randomStoreID;
        tSalesPersonID.innerHTML = "SalesPersonID: " + randomSalesPersonID;
        tCdID.innerHTML = "CdID: " + randomCdID;
        tPricePaid.innerHTML = "PricePaid: " + randomPricePaid;
    });


    /************************************
     * Everything below is from the pets project
     * I renamed all the variables and functions and left them for reference or if you need to use them
     ************************************
    */
    
    //add an order to database
    document.getElementById("submit").addEventListener("click", function () {
        //var tId = document.getElementById("addID").value
        //var tStoreID = document.getElementById("addStoreID").value;
        //var tSalesPersonID = document.getElementById("addSalesPersonID").value;
        //var tCdID = document.getElementById("addCdID").value;
        //var tPricePaid = document.getElementById("addPricePaid").value;
        //var oneOrder = new Order(randomStoreID, tSalesPersonID, tCdID, tPricePaid);

        $.ajax({
            url: '/' ,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(orderToSend),
            success: function (result) {
                console.log("added new order")
            }
        });
    });

    document.getElementById("submit500").addEventListener("click", function () {
        //var tId = document.getElementById("addID").value
        //var tStoreID = document.getElementById("addStoreID").value;
        //var tSalesPersonID = document.getElementById("addSalesPersonID").value;
        //var tCdID = document.getElementById("addCdID").value;
        //var tPricePaid = document.getElementById("addPricePaid").value;
        //var oneOrder = new Order(randomStoreID, tSalesPersonID, tCdID, tPricePaid);
        var orderCounter = 0;
        while(orderCounter < 500)
        {
            orderCounter += 1;
            orderToSend = generateOrder();
            $.ajax({
                url: '/SubmitManyOrders' ,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(orderToSend),
                success: function (result) {
                    console.log("added new order")
                }
            });
        }

    });

    
    //get order from database
    document.getElementById("get").addEventListener("click", function () {
        
        var ul = document.getElementById('listUl');
        ul.innerHTML = "";  // clears existing list so we don't duplicate old ones
        
        //var ul = document.createElement('ul')

        $.get("/Orders", function(data, status){  // AJAX get
            OrderArray = data;  // put the returned server json data into our local array

            // sort array by one property
            OrderArray.sort(compare);  // see compare method below
            console.log(data);
            //listDiv.appendChild(ul);
            OrderArray.forEach(ProcessOneOrder); // build one li for each item in array
            function ProcessOneOrder(item, index) {
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
  
    //delete oder from database
    document.getElementById("delete").addEventListener("click", function () {
        
        var whichOrder = document.getElementById('deleteName').value;
        var idToDelete = "";
        for(i=0; i< OrderArray.length; i++){
            if(OrderArray[i].name === whichOrder) {
                idToDelete = OrderArray[i]._id;
           }
        }
        
        if(idToDelete != "")
        {
                     $.ajax({
                    url: 'DeleteOrder/'+ idToDelete,
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

    //find order to modify in the database
    document.getElementById("find").addEventListener("click", function () {
        var pId = document.getElementById("modOrder").value;
        var idToFind = "";
        for(i=0; i< OrderArray.length; i++){
            if(OrderArray[i].name === pId) {
                idToFind = OrderArray[i]._id;
           }
        }
        console.log(idToFind);

        $.get("/FindOrder/"+ idToFind, function(data, status){
            //console.log(data[0].id + " " + data[0].name);
            console.log(data[0].name);
            document.getElementById("modName").value = data[0].name;
            document.getElementById("modAge").value= data[0].age;
            document.getElementById("modBreed").value = data[0].breed;
            document.getElementById("modGender").value = data[0].gender;
            document.getElementById("modAdopted").value = data[0].status;
        });
    });

    //modify order in the database
    document.getElementById("modSubmit").addEventListener("click", function () {
        var whichOrder = document.getElementById('modOrder').value;
        var idToChange = "";

        var eName = document.getElementById("modName").value;
        var eAge = document.getElementById("modAge").value;
        var eBreed = document.getElementById("modBreed").value;
        var eGender = document.getElementById("modGender").value;
        var eStatus = document.getElementById("modAdopted").value;

        for(i=0; i< OrderArray.length; i++){
            if(OrderArray[i].name === whichOrder) {
                idToChange = OrderArray[i]._id
           }
        }

        if(idToChange != "")
        {
            $.ajax({
                url: '/UpdateOrder',
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