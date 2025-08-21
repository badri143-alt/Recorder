let video  = document.querySelector("video");
let recordBtncount = document.querySelector(".record-button-container");    
let recordBtn = document.querySelector(".record-btn"); 
let captureBtncontainer = document.querySelector(".capture-button-container");
let captureBtn = document.querySelector(".capture-btn");
let transparentColor  = "transparent"


let recordFlag = false;
let recorder;
let chunks =[];
let constraints = {
    audio:true,
    video:true,
}

navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);                   
    recorder.addEventListener("start",(e)=>{
            chunks=[];
    });
    recorder.addEventListener("dataavailable",(e)=>{
            chunks.push(e.data);
    });
    recorder.addEventListener("stop",(e)=>{
        let blob = new Blob(chunks,{ type:"video/mp4"});
        let videoUrl = URL.createObjectURL(blob)
        let a = document.createElement("a");
        a.href = videoUrl;
        a.download = "stream.mp4";
        a.click();
    })
    recordBtncount.addEventListener("click",(e)=>{
        if(!recorder) return;              

        recordFlag = !recordFlag;
        if(recordFlag){
            recorder.start();
            recordBtn.classList.add("scale-record");
            startTimer();
        }else{
            recorder.stop();
            recordBtn.classList.remove("scale-record")
            stopTimer();
        }
    })
})
let timerId;
let counter = 0;
let timer = document.querySelector(".timer")
function startTimer(){
    timer.style.display = "block";
    function displayTimer(){
        
            let totalSeconds = counter;
            let hours  = Number.parseInt(totalSeconds / 3600);
            totalSeconds = totalSeconds % 3600
            let minutes = Number.parseInt(totalSeconds / 60)
            totalSeconds = totalSeconds % 60
            let seconds = totalSeconds

            hours = (hours < 10) ? `0${hours}`:hours
            minutes = (minutes < 10) ? `0${minutes}`:minutes
            seconds    = (seconds < 10) ? `0${seconds}`:seconds

            timer.innerText = `${hours}:${minutes}:${seconds}`;
             
            counter++;

    }
    timerId = setInterval(displayTimer,1000)
}
function stopTimer(){
    clearInterval(timerId);
    timer.innerText = "00:00:00";
    timer.style.display = "none"
}

captureBtncontainer.addEventListener("click",(e)=>{
    captureBtn.classList.add("scale-capture"); 

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    tool.fillStyle = transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height)

    let imageUrl = canvas.toDataURL("image/jpg");
    let a = document.createElement("a");
    a.href = imageUrl;
    a.download = "Image.jpg";
    a.click();

    setTimeout(()=>{
        captureBtn.classList.remove("scale-capture");
    }, 1000);
});
 let filter = document.querySelector(".filter-layer");
 let allFilter = document.querySelectorAll(".filter");
 allFilter.forEach((filterElem)=>{
    filterElem.addEventListener("click",(e)=>{
        transparentColor =getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor = transparentColor;
    })
 })