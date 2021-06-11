const form = document.getElementById("taskform");
const button = document.querySelector("#taskform > button");
var taskInput = document.getElementById("taskInput");
var tasklist = document.querySelector( "#tasklist > ul");

var tasklistundo = document.querySelector( "#undolist");

var tasklistdoing = document.querySelector( "#doinglist");
var tasklistdone = document.querySelector( "#donelist");

var dueDateInput = document.getElementById("dueDateInput");
var completionTimeInput = document.getElementById("completionTimeInput");
var estimatedTimeInput = document.getElementById("estimatedTimeInput");
var priorityInput = document.getElementById("priorityInput");


var clockTime;
form.addEventListener( "submit", function(event) {
    event.preventDefault();
    let task = taskInput.value;
    let dueDate = dueDateInput.value;
    let completionTime = completionTimeInput.value;
    let estimatedTime = estimatedTimeInput.value;
    let priorityRating = priorityInput.options[priorityInput.selectedIndex].value;
    if(task){
        addTask(task, dueDate, estimatedTime, priorityRating, completionTime,0);
    }
})

var taskListArray = []; 
function addTask(taskDescription, dueDate, estimatedTime, priorityRating, completionTime,completionStatus){
    let d = new Date();
    let dateCreated = d.getFullYear();
    let elapsedTime = 0; // Total elapsed time: initialized as zero with the unit second 
    let beginningElapsedTime = 0; // Beginning elapsed time: initialized as zero with the unit second, used for updating doing tasks
    let task = {
        id: Date.now(),
        taskDescription,
        dueDate,
        dateCreated,
        estimatedTime,
        completionTime,
        priorityRating,
        estimatedTime,
        completionStatus,
        elapsedTime,
        beginningElapsedTime
    };
    taskListArray.push(task);
    renderTask(task);

}

function renderTask(task) {
    // Create HTML elements 

    // <div class="item">
    //                         <img src="images/icon.png">
    //                         <div class="taskcont"> 
    //                             <span>TaskB</span>
    //                             <div class="tasksubcont">
    //                                 <p>sjlkjgewsjlkjgewsjlkjgews</p>
    //                             </div>
    //                         </div>
    //                     </div>

    let item=document.createElement("div");  
    item.setAttribute('data-id',task.id);
    item.setAttribute('class','item');   
    item.innerHTML="<button class='"+task.priorityRating+"'>"+task.priorityRating+"</button>"+
                "<div class='taskcont'> "+
                "<span style='display:none'>"+task.id+"</span>"+
                "<div class='tasksubcont'>"+
                "<p>" + getElapsedTime(task) + "</p>"+
                "<p>"+task.taskDescription+"</p>"+
                "</div>"+
                "</div>";  
    
    tasklistundo.appendChild(item);     
            
    // let item = document.createElement("li");
    // item.setAttribute('data-id',task.id);
    // item.innerHTML = "<p>" + task.taskDescription + "</p>";
    // tasklist.appendChild(item);

    // Extra Task DOM elements
    let delButton = document.createElement ("button" );
    delButton.setAttribute('class','deletebtn');
    let delButtonText = document.createTextNode( "Delete" );
    delButton.appendChild(delButtonText); 
    item.appendChild(delButton);

    let startButton = document.createElement ("button" );
    startButton.setAttribute('class','startbtn');
    let startButtonText = document.createTextNode( "Start" );
    startButton.appendChild(startButtonText); 
    item.appendChild(startButton);

    let restartButton = document.createElement ("button" );
    restartButton.setAttribute('class','startbtn');
    let restartButtonText = document.createTextNode( "Restart" );
    restartButton.appendChild(restartButtonText); 
    item.appendChild(restartButton);

    // Event Listeners for DOM elements
    delButton.addEventListener("click", function(event) {
        event.preventDefault();
        let id = event.target.parentElement.getAttribute('data-id');
        let index = taskListArray.findIndex(task => task.id === Number(id));
        removeItemFromArray(taskListArray,index);
        console.log(taskListArray);
        
        item.remove();
        updateEmpty();
    })
    //delete from taskListArray to 
    startButton.addEventListener("click", function(event) {
        event.preventDefault();
        let id = event.target.parentElement.getAttribute('data-id');
        task.status=2;
        // let index = taskListArray.findIndex(task => task.id === Number(id));
        // updateItemFromArray(taskListArray,index);
        console.log(taskListArray);
        item.remove();
        updateEmpty();
        addItemForDoing(task);
    })

    restartButton.addEventListener("click", function(event) {
        event.preventDefault();
        let id = event.target.parentElement.getAttribute('data-id');
        task.elapsedTime = 0;
        task.beginningElapsedTime = 0;
        // let index = taskListArray.findIndex(task => task.id === Number(id));
        // updateItemFromArray(taskListArray,index);
        console.log(taskListArray);
        item.remove();
        addItemForDoing(task);
        updateEmpty();        
    })

    // Clear the input form
    form.reset();
    updateEmpty();
}

/*
*
*/
function addItemForDoing(task){
    // Create HTML elements 
    let item=document.createElement("div");  
    item.setAttribute('data-id',task.id);
    item.setAttribute('class','item');  

    item.innerHTML="<button class='"+task.priorityRating+"'>"+task.priorityRating+"</button>"+
    "<p class='djs' id='djs_"+task.priorityRating+"'>00:00:00</p>"+
                "<div class='taskcont'> "+
                "<span style='display:none'> "+task.id+"</span>"+
                "<div class='tasksubcont'>"+
                "<p id = 'djs_elapsedTime'>" + getElapsedTime(task) + "</p>"+
                "<p>"+task.taskDescription+"</p>"+
                "</div>"+
                "</div>";  
    tasklistdoing.appendChild(item);     
    let delButton = document.createElement ("button" );
    delButton.setAttribute('class','deletebtn');
    let delButtonText = document.createTextNode( "Delete" );
    delButton.appendChild(delButtonText); 
    item.appendChild(delButton);

    let endButton = document.createElement ("button" );
    endButton.setAttribute('class','startbtn');
    let endButtonText = document.createTextNode( "Complete" );
    endButton.appendChild(endButtonText); 
    item.appendChild(endButton);

    let stopButton = document.createElement ("button" );
    stopButton.setAttribute('class','startbtn');
    let stopButtonText = document.createTextNode( "Stop" );
    stopButton.appendChild(stopButtonText); 
    item.appendChild(stopButton);

    let restartButton = document.createElement ("button" );
    restartButton.setAttribute('class','startbtn');
    let restartButtonText = document.createTextNode( "Restart" );
    restartButton.appendChild(restartButtonText); 
    item.appendChild(restartButton);
    
    updateTime(new Date(),"djs_"+task.priorityRating, task);
    

    restartButton.addEventListener("click", function(event) {
        event.preventDefault();
        clearInterval(clockTime);
        task.elapsedTime = 0;
        task.beginningElapsedTime = 0;
        updateTime(new Date(),"djs_"+task.priorityRating, task);
        
    })

    
    stopButton.addEventListener("click", function(event) {
        event.preventDefault();
        task.beginningElapsedTime = task.elapsedTime;
        clearInterval(clockTime);
        item.remove();
        addItemForNotDone(task);
        updateEmpty();
    })


    
    // Event Listeners for DOM elements
    delButton.addEventListener("click", function(event) {
        event.preventDefault();
        let id = event.target.parentElement.getAttribute('data-id');
        let index = taskListArray.findIndex(task => task.id === Number(id));

        removeItemFromArray(taskListArray,index);
        console.log(taskListArray);
        item.remove();
        updateEmpty();
    })
    //delete from taskListArray to 
    endButton.addEventListener("click", function(event) {
        event.preventDefault();
        let id = event.target.parentElement.getAttribute('data-id');
        task.status=3;
        
        // let index = taskListArray.findIndex(task => task.id === Number(id));
        // updateItemFromArray(taskListArray,index,status);
        
        item.remove();
        addItemForDone(task);
        updateEmpty();
    })
    updateEmpty();
}

function addItemForNotDone(task){
    renderTask(task);  
}

function addItemForDone(task){
    updateEmpty();
    // Create HTML elements 
    let item=document.createElement("div");  
    item.setAttribute('data-id',task.id);
    item.setAttribute('class','item');   
    item.innerHTML="<button class='"+task.priorityRating+"'>"+task.priorityRating+"</button>"+
                "<div class='taskcont'> "+
                "<span style='display:none'>"+task.id+"</span>"+
                "<div class='tasksubcont'>"+
                "<p>" + getElapsedTime(task) + "</p>"+
                "<p>"+task.taskDescription+"</p>"+
                "</div>"+
                "</div>";
                
     
    tasklistdone.appendChild(item);     
}


function removeItemFromArray(arr,index){
    if(index > -1){
        arr.splice(index,1);
    }
    return arr;
}

function updateEmpty(){
    if(document.getElementById('donelist').getElementsByClassName("item").length>0){
        document.getElementById('donelistp').style.display = 'none';
    }else{
        document.getElementById('donelistp').style.display = 'block';
    }

    if(document.getElementById('undolist').getElementsByClassName("item").length>0){
        document.getElementById('undolistp').style.display = 'none';
    }else{
        document.getElementById('undolistp').style.display = 'block';
    }

    // if(document.getElementById('nextuplistp').getElementsByClassName("item").length>0){
    //     document.getElementById('nextuplistp').style.display = 'none';
    // }else{
    //     document.getElementById('nextuplistp').style.display = 'block';
    // }

    if(document.getElementById('doinglist').getElementsByClassName("item").length>0){
        document.getElementById('doinglistp').style.display = 'none';
    }else{
        document.getElementById('doinglistp').style.display = 'block';
    }

    // if(taskListArray.length > 0){
    //     document.getElementById('emptyList').style.display = 'none';
    // }else{
    //     document.getElementById('emptyList').style.display = 'block';
    // }
}


function updateTime(timestr,id, task) {
    clockTime=setInterval(function(){
        var nowTime = new Date();//now time
        //create time
       // var endTime = new Date(timestr);
       // var seconds = parseInt((endTime.getTime() - nowTime.getTime()) / 1000);//sub
        var seconds = parseInt((nowTime.getTime()-timestr.getTime()) / 1000);//sub(s)
        // var d = parseInt(seconds / 3600 / 24);//d
        var h = parseInt(seconds / 3600);//h
        var m = parseInt(seconds / 60 % 60);//m
        var s = parseInt(seconds % 60);//s
        if(h<10) h="0"+h;
        if(m<10) m="0"+m
        if(s<10) s="0"+s;
    
        document.getElementById(id).innerHTML =   h + ":" + m + ":" + s ;

        // Elapsed Time
        task.elapsedTime = task.beginningElapsedTime + seconds;
        document.getElementById('djs_elapsedTime').innerHTML = getElapsedTime(task);
    }, 1000);
}

//Get String of Elapsed Time for displaying
function getElapsedTime(task){
    var seconds = task.elapsedTime;
    var h = parseInt(seconds / 3600);//h
    var m = parseInt(seconds / 60 % 60);//m
    var s = parseInt(seconds % 60);//s
    if(h<10) h="0"+h;
    if(m<10) m="0"+m
    if(s<10) s="0"+s;

    return "Total Time  Consumption: " + h + ":" + m + ":" + s ;
} 

