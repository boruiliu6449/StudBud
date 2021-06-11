var searchbtn = document.getElementById("searchbtn");
var searchInput = document.getElementById("searchInput");
var getAnswer = document.querySelector("#getAnswer");
const Http = new XMLHttpRequest();
const url="https://api.dictionaryapi.dev/api/v2/entries/en_US/";

searchbtn.addEventListener("click", function(event) {
    event.preventDefault();
    var getAnswerP = document.getElementById("getAnswer");
    getAnswerP.innerHTML="";
    // var child=document.getElementById('getAnswerCont');
    // getAnswerP.removeChild(child);

    searchForApi(searchInput.value);
})


function searchForApi(searchWord){
    Http.open("GET",url+searchWord);
    Http.send();   
    Http.onreadystatechange=function(){
        if( this.readyState === 4 && this.status === 200){
            var data = JSON.parse(Http.responseText);
            for(var i=0;i<data.length;i++){
                var datason=data[i].meanings;
                for(var j=0;j<datason.length;j++){
                    var datasonson=datason[j].definitions;
                    for(var m=0;m<datasonson.length;m++){
                        let item=document.createElement("div"); 
                        item.setAttribute('id','getAnswerCont');   
                        item.innerHTML="<span class='defintion'>"+datasonson[m].definition+"</span>";
                        console.log("=====");
                        if(datasonson[m].synonyms){
                            item.innerHTML+="<span class='synonyms'>["+datasonson[m].synonyms+"]</span>"; 
                        }
                        getAnswer.appendChild(item);
                    }
                }
            }
        }
    } 
}
