
//抽奖人员名单
let list = sessionStorage.getItem('list') ? JSON.parse(sessionStorage.getItem('list')) : []
var allPerson = '';
if (list && list.length) {
    allPerson = list.join(';')
} else {
    let arr = new Array(385).fill(0).map((item, ind) => addZero(ind + 1))
    let filearr = [320, 137, 135, 172, 383]
    arr = arr.filter(v => filearr.indexOf(v) == -1)
    sessionStorage.setItem('list', JSON.stringify(arr))
    allPerson = arr.join(';')
}

function addZero(ind) {
    if (ind < 10) {
        return '00' + ind
    } else if (ind >= 10 && ind < 100) {
        return '0' + ind
    }
    return ind
}

document.onkeydown = function (e) {    //对整个页面监听  
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if ($("#txtNum").val()) {
            stopLuckDraw()
        }
    }
}

//未中奖人员名单
var remainPerson = allPerson.toString().split(";");
//中奖人员名单
var luckyMan = [];
var timer;//定时器
$(function () {
    iconAnimation();
    //开始抽奖
    $("#btnStart").on("click", function () {
        stopLuckDraw()
    });
    $("#btnReset").on("click", function () {
        if (flag) {
            showDialog("正在抽奖中，请先点击停止");
        } else {
            //中奖人数框置空
            $("#txtNum").val("").attr("placeholder", "请输入抽奖人数");
            $("#showName").val("");
            //隐藏中奖名单,然后显示抽奖框
            $("#result").fadeOut();
            $("#bgLuckyDrawEnd").removeClass("bg");//移除背景光辉
        }
    });
});

function stopLuckDraw() {
    //判断是开始还是结束
    if ($("#btnStart").text() === "开始") {
        if (!$("#txtNum").val()) {
            showDialog("请输入中奖人数");
            return false;
        }
        if (Number($("#txtNum").val()) < 1) {
            showDialog("输入有误");
            return false;
        }
        if ($("#txtNum").val() > remainPerson.length) {
            showDialog("当前抽奖人数大于奖池总人数<br>当前抽奖人数：<b>" + $("#txtNum").val() + "</b>人,奖池人数：<b>" + remainPerson.length + "</b>人");
            return false;
        }
        if ($("#txtNum").val() > 5) {
            showDialog("当前抽奖总人数不能大于5人");
            return false;
        }
        $("#result").fadeOut();
        //显示动画框，隐藏中奖框
        $("#luckyDrawing").show().next().addClass("hide");
        move();
        $("#btnStart").text("停止");
        $("#bgLuckyDrawEnd").removeClass("bg");
        flag = true
    }
    else {
        $("#btnStart").text("开始");//设置按钮文本为开始
        var luckyDrawNum = $("#txtNum").val();
        startLuckDraw();//抽奖开始
        $("#luckyDrawing").fadeOut();
        clearInterval(timer);//停止输入框动画展示
        $("#luckyDrawing").val(luckyMan[luckyMan.length - 1]);//输入框显示最后一个中奖名字
        $("#result").fadeIn().find("div").removeClass().addClass("p" + Number(luckyDrawNum));//隐藏输入框，显示中奖框
        $("#bgLuckyDrawEnd").addClass("bg");//添加中奖背景光辉
        $("#txtNum").attr("placeholder", "输入中奖人数(" + remainPerson.length + ")");
        sessionStorage.setItem('list', JSON.stringify(remainPerson))
        flag = false

        let selectedList = sessionStorage.getItem('selectedList') ? JSON.parse(sessionStorage.getItem('selectedList')) : []

        //本次中奖名单
        let currenSelectPer = luckyMan.filter(v => selectedList.indexOf(v) == -1)

        //记录已经中奖的名单
        if (selectedList.length) {
            selectedList = [...selectedList, ...luckyMan]
            sessionStorage.setItem('selectedList', JSON.stringify(selectedList))
        } else {
            sessionStorage.setItem('selectedList', JSON.stringify(luckyMan))
        }
        fetch(`/result?code=${currenSelectPer}`).then(res => res.json())
    }
}

//抽奖主程序
function startLuckDraw() {
    //抽奖人数
    var luckyDrawNum = $("#txtNum").val();
    if (luckyDrawNum > remainPerson.length) {
        alert("抽奖人数大于奖池人数！请修改人数。或者点重置开始将新一轮抽奖！");
        return false;
    }
    //随机中奖人
    var randomPerson = getRandomArrayElements(remainPerson, luckyDrawNum);
    var tempHtml = "";
    $.each(randomPerson, function (i, person) {
        var sizeStyle = "";
        if (person.length > 3) {
            sizeStyle = " style=font-size:" + 3 / person.length + "em";
        }
        tempHtml += "<span><span " + sizeStyle + ">" + person + "</span></span>";
    });
    $("#result>div").html(tempHtml);
    //剩余人数剔除已中奖名单
    remainPerson = remainPerson.delete(randomPerson);
    //中奖人员
    luckyMan = luckyMan.concat(randomPerson);
    //设置抽奖人数框数字为空
    $("#txtNum").val("");
}

//跳动的数字
function move() {
    var $showName = $("#showName"); //显示内容的input的ID
    var interTime = 30;//设置间隔时间
    timer = setInterval(function () {
        var i = GetRandomNum(0, remainPerson.length);
        $showName.val(remainPerson[i]);//输入框赋值
    }, interTime);
}

//顶上的小图标，随机动画
function iconAnimation() {
    var interTime = 200;//设置间隔时间
    var $icon = $("#iconDiv>span");
    var arrAnimatoin = ["bounce", "flash", "pulse", "rubberBand", "shake", "swing", "wobble", "tada"];
    setInterval(function () {
        var i = GetRandomNum(0, $icon.length);
        var j = GetRandomNum(0, arrAnimatoin.length);
        //console.log("i:" + i + ",j:" + j);
        $($icon[i]).removeClass().stop().addClass("animated " + arrAnimatoin[j]);//输入框赋值
    }, interTime);

}
