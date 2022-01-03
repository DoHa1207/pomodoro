//抓取插入標籤
const minutes = document.querySelector("h2.minutes");
const seconds = document.querySelector("h2.seconds");

//尚未跑的初始值
let duration_minutes = "25";
let duration_seconds = "0" + 0;

minutes.innerHTML = duration_minutes;
seconds.innerHTML = duration_seconds;

let minutes_interval;
let seconds_interval;
let set_second = duration_minutes * 60;

//開始按鈕
document.querySelector('#startbutton').addEventListener('click', function starttimer() {
    if (duration_seconds == 0) {
        duration_seconds = "59";
        duration_minutes = duration_minutes - 1;
        minutes.innerHTML = duration_minutes;
        seconds.innerHTML = duration_seconds;
    }
    else {
        duration_seconds = duration_seconds - 1;
        if (duration_seconds < 10) {
            minutes.innerHTML = duration_minutes;
            seconds.innerHTML = "0" + duration_seconds;
        }
        else {
            minutes.innerHTML = duration_minutes;
            seconds.innerHTML = duration_seconds;
        }
    }
    minutes_interval = setInterval(minutesCountdown, 60000);
    seconds_interval = setInterval(secondsCountdown, 1000);
})


//暫停按鈕
document.querySelector('#stopbutton').addEventListener('click', function () {
    clearInterval(minutes_interval);
    clearInterval(seconds_interval);
})

//停止案紐
document.querySelector('#pausebutton').addEventListener('click', function () {
    clearInterval(minutes_interval);
    clearInterval(seconds_interval);
    let reset_minutes = set_second / 60;
    let reset_seconds = set_second % 60;
    duration_seconds = reset_seconds;
    duration_minutes = reset_minutes;

    document.querySelector("h2.minutes").innerHTML = reset_minutes;
    if (reset_seconds < 10)
        document.querySelector("h2.seconds").innerHTML = "0" + reset_seconds;
    else
        document.querySelector("h2.seconds").innerHTML = reset_seconds;
})


// 工作時長調整

document.querySelector(".storevalue").addEventListener("click", function () {
    let inputValue = document.querySelector(".setup").value * 60;
    set_second = inputValue;
    duration_minutes = Math.floor(inputValue / 60);
    duration_seconds = Math.round(inputValue % 60);

    document.querySelector("h2.minutes").innerHTML = duration_minutes;
    if (duration_seconds < 10)
        document.querySelector("h2.seconds").innerHTML = "0" + duration_seconds;
    else
        document.querySelector("h2.seconds").innerHTML = duration_seconds;

});






//秒倒數
function secondsCountdown() {
    let now_seconds = set_second;
    now_seconds--;
    if (duration_seconds > 10) {
        duration_seconds--;
        document.querySelector("h2.seconds").innerHTML = duration_seconds;
    } else if (duration_seconds <= 10 && duration_seconds > 0) {
        duration_seconds--;
        document.querySelector("h2.seconds").innerHTML = "0" + duration_seconds;

    } else if (now_seconds == 0) {
        clearInterval(minutes_interval);
        clearInterval(seconds_interval);
        document.querySelector("h2.minutes").innerHTML = duration_minutes;
        document.querySelector("h2.seconds").innerHTML = "0" + duration_seconds;
    }
    else {
        duration_seconds = "59";
        document.querySelector("h2.seconds").innerHTML = duration_seconds;

    }

}

//分倒數
function minutesCountdown() {

    if (duration_minutes > 0) {
        duration_minutes--;
        document.querySelector("h2.minutes").innerHTML = duration_minutes;
    } else if (duration_minutes == 0 && duration_seconds == 0) {
        duration_minutes = set_second / 60;
        duration_seconds = set_second % 60;
        if (duration_seconds < 10) {
            document.querySelector("h2.minutes").innerHTML = duration_minutes;
            document.querySelector("h2.seconds").innerHTML = "0" + duration_seconds;
        } else {
            document.querySelector("h2.minutes").innerHTML = duration_minutes;
            document.querySelector("h2.seconds").innerHTML = duration_seconds;
        }
        clearInterval(minutes_interval);
        clearInterval(seconds_interval);
    } else {
        document.querySelector("h2.minutes").innerHTML = "0" + duration_minutes;
    }

}


//指定DOM
let send = document.querySelector('.send');
let list = document.querySelector('.list');
let finishList = document.getElementById('finishlist');

//資料：設定計畫邀請名單「listData」的localStorage資料，轉為陣列物件
let data = JSON.parse(localStorage.getItem('listData')) || [];
//資料：設定寄出名單「listFinish」的localStorage資料，轉為陣列物件
let finishData = JSON.parse(localStorage.getItem('listFinish')) || [];


//事件綁定，監聽與更新
send.addEventListener('click', addData);
list.addEventListener('click', toggleDone);
finishList.addEventListener('click', deleDone);

//更新畫面上的資料
updateList(data);
updateFinish(finishData);

//按下「新增待辦事項」，把資料新增到data中，並叫用updateList
function addData(e) {
    var txt = document.querySelector('.text');
    if (txt.value == "") {
        alert('必須輸入待辦事項');
        return;
    }
    var toInvite =
    {
        content: txt.value
    }

    data.push(toInvite);
    updateList(data);
    localStorage.setItem('listData', JSON.stringify(data));
    txt.value = '';
}
//更新待辦事項
function updateList(items) {
    str = '';
    let len = items.length;
    for (let i = 0; len > i; i++) {
        console.log(items[i])
        str += `<li><a href="#" data-index=${i}>移到已完成</a><span>${items[i].content}</span></li>`;
    }
    list.innerHTML = str;
    let noneNum = document.querySelector('.noneNum');
    noneNum.textContent = len;
}

//將待辦事項由未完成移至已完成
function toggleDone(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') {
        return;
    }
    let index = e.target.dataset.index;
    console.log(index);
    finishData.push(data[index]);
    console.log(data[index]);
    data.splice(index, 1);
    localStorage.setItem('listData', JSON.stringify(data));
    updateList(data);
    localStorage.setItem('listFinish', JSON.stringify(finishData));
    updateFinish(finishData);
}

//更新已完成之待辦事項
function updateFinish(finishItems) {
    let mailStr = '';
    let len = finishItems.length;
    console.log(finishItems);
    console.log(len);
    for (let i = 0; i < len; i++) {
        console.log(finishItems[i]);
        mailStr += `<li><a href="#" data-num=${i}>移除</a><span>${finishItems[i].content}</span></li>`
    }
    finishList.innerHTML = mailStr;
    var doneNum = document.querySelector('.doneNum');
    doneNum.textContent = len;
}

//刪除已完成之待辦事項
function deleDone(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') {
        return;
    }
    let num = e.target.num;
    finishData.splice(num, 1);
    localStorage.setItem('listFinish', JSON.stringify(finishData));
    updateFinish(finishData);
}




