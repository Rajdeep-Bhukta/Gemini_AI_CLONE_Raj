const sideNavigation = document.querySelector(".sideNavigation"),
sideBarToggle = document.querySelector(".fa-bars"),
startContentUl=document.querySelector(".startContent ul"),
inputArea=document.querySelector(".inputArea input"),
sendRequest=document.querySelector(".fa-paper-plane"),
chatHistory=document.querySelector(".chatHistory ul");
startContent=document.querySelector(".startContent"),
chatContent=document.querySelector(".chatContent"),
results=document.querySelector(".results");

promptQuestions =[
    {
        question:"Write a thank you note to my subscribers",
        icon:"fa-solid fa-wand-magic-sparkles",
    },
    {
        question:"Write a Sample Code to learn javascript",
        icon:"fa-solid fa-code",
    },
    {
        question:"How to became a Full Stack Developer?",
        icon:"fa-solid fa-laptop-code",
    },
    {
        question:"How to became a Front-end Developer?",
        icon:"fa-solid fa-database",
    },
];

window.addEventListener("load", () => {
    promptQuestions.forEach((data) => {
        let item=document.createElement("li");
        item.addEventListener("click",()=>{
            getGeminiResponse(data.question, true);
        });


        item.innerHTML=`<div class="promptSuggestion">
        <p>${data.question}</p>
        <div class="icon"><i class="${data.icon}"></i></div>
        </div>`;

        startContentUl.append(item);
    });
});

sideBarToggle.addEventListener("click", ()=>{
    sideNavigation.classList.toggle("expandClose");
})

inputArea.addEventListener("keyup",(e)=>{
    if(e.target.value.length>0){
        sendRequest.style.display="inline";
    }else{
        sendRequest.style.display="none";
    }
});

sendRequest.addEventListener("click",()=>{
    getGeminiResponse(inputArea.value, true);
});



function getGeminiResponse(question, appendHistory){
    console.log(question);

if(appendHistory){
    let historyLi= document.createElement("li");
    historyLi.addEventListener("click",()=>{
        getGeminiResponse(question,false);
    });


    historyLi.innerHTML=`<i class="fa-regular fa-message"></i>${question}`;
    chatHistory.append(historyLi);
}


    results.innerHTML="";
    inputArea.value="";

    startContent.style.display="none";
    chatContent.style.display="block";

    let resultTitle =`
    <div class="resultTitle">
    <img src="	https://tse3.mm.bing.net/th?id=OIP.pTVGCZw-Zc2bwi7TZnfgNwAAAA&pid=Api&P=0&h=180"/>
    <p>${question}</p>
    </div>
    `;


    let resultData=`
    <div class="resultData">
    <img src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/gemini-color.png"/>
    <div class="loader">
        <div class="animatedBG"></div>
        <div class="animatedBG"></div>
        <div class="animatedBG"></div>
        </div>
    </div>
    `;

    results.innerHTML+=resultTitle;
    results.innerHTML+=resultData;




    const AIURL =`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBqyRetIg4DiGLESkf1FuT3xWdBuJCPSfs`;
    fetch(AIURL,{
        method:"POST",
        body: JSON.stringify({
            contents: [{parts: [{text:  question }] }],
        }),
    }).then((response)=>response.json()).then((data)=>{
        document.querySelector(".results .resultData").remove();
        
    
    let responseData=jsonEscape(data.candidates[0].content.parts[0].text);
    console.log(responseData);


    let responseArray= responseData.split("**");
    let newResponse="";
    for(let i=0;i<responseArray.length;i++){
        if(i==0 || i%2!==1){
            newResponse+=responseArray[i];
        }else{
            newResponse+="<strong>"+responseArray[i].split(" ").join("&nbsp")+
            "</strong>";
        }
    }


    let newResponse2=newResponse.split("*").join(" ");


    let textArea= document.createElement("textarea");
    textArea.innerHTML=newResponse2;


        results.innerHTML += `
            <div class=""resultResponse">
            <p id="typeEffect">
            <img 
            src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/gemini-color.png"
            style="width: 30px; height: auto;vertical-align: middle; margin-right: 8px;"
            />
            </p>
            </div>
        `;

        let newResponseData= newResponse2.split(" ");
        for(let j=0;j<newResponseData.length;j++){
            timeOut(j,newResponseData[j]+" ");

        }

    });
}


const timeOut=(index,nextWord)=>{
    setTimeout(function(){
        document.getElementById("typeEffect").innerHTML+=nextWord;
    },75 * index);
};


function newChat(){
    startContent.style.display="block";
    chatContent.style.display="none";
}

function jsonEscape(str){
    return str
    .replace(new RegExp("\r?\n\n","g"),"<br>")
    .replace(new RegExp("\r?\n","g"),"<br>");
}