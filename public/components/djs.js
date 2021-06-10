function cccc(day) {
    // setInterval(function() {
        var nowTime = new Date();//get current time
        //get specified time
        var endTime = new Date(day);
        var seconds = parseInt((endTime.getTime() - nowTime.getTime()) / 1000);//get elapsed seconds from starting timestamp to ending timestamp
        var d = parseInt(seconds / 3600 / 24);//get days
        var h = parseInt(seconds / 3600 % 24);//get hours
        var m = parseInt(seconds / 60 % 60);//get minutes
        var s = parseInt(seconds % 60);//get seconds
        document.getElementById("djs").innerHTML = "" + d +"d" + h + ":" + m + ":" + s ;
    // }, 1000);
}