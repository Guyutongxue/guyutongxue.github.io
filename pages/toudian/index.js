var i = 0;
var j = 0;
var l = 1;
function P(e, num0, num1, x) {
    return e * Math.pow((1 - num0 / (num1 + x)), 0.55 * x + 0.5) * Math.pow(num1 / (num1 - num0), 0.5 - 0.45 * x)
}
function init() {
    // $("#toastBody").text("填好表格后点“计算”")
    $("#box #jieguo").each(function (i, e) {
        $(e).text("?")
    })
    $("#detail").hide()
}
$(function () {
    $("#box").on('click', '#addp', function () {
        init()

        l = l + 1;
        var addP = '<tr id="content"><td><p id="xuhao" style="text-align:center">1</p></td><td><input type="text" size=5 class="input1"></td><td><input type="text" size=5 class="input2"></td><td><input type="text" size=8 class="input3"></td><td><p id="jieguo" style="text-align:center">?</p></td></tr>'
        $("#innerBox").append(addP);
        $('#content p').filter("#xuhao").each(function (i, e) {
            $(e).text(i + 2);
        })
    });
    $("#box").on("click", '#delp', function () {
        if (l == 1) {
            $("#toastBody").text("不能再减啦，再减就没啦")
            $('#notify').toast('show');
        }
        else {
            $("#box #jieguo").each(function (i, e) {
                $(e).text("?")
            })
            $("#innerBox #content").last().remove();
            $('#content p').filter("#xuhao").each(function (i, e) {
                $(e).text(i + 2);
            })
            l = l - 1;
        }
    });
    $("#box").on('click', '#help', function () {
        $("#toastBody").text("“快乐值”越高越想选该课。可设为1、学分或其他任何正数")
        $('#notify').toast('show');
    });
    //主体计算部分
    $("#box").on('click', '#calp', function () {

        //初始化
        $("#box #jieguo").each(function (i, e) {
            $(e).text("?")
        })
        var a = 0           //临时变量
        var t = 0           //临时变量
        var num0 = new Array() //限选人数
        var num1 = new Array() //已选人数
        var Per = new Array() //人数比
        var per = new Array() //人数比修正
        var mean = new Array() //平均点数
        var hapy = new Array() //快乐值
        var poss = new Array() //概率
        var E = 0.0         //综合给分
        var X = new Array() //投点数
        var m = 99          //意愿点总点数
        var p2 = -101
        var p1 = 392.6
        var p0 = -347.8
        //正则表达式检验输入输出是否合理
        var reg1 = /^\d+$/     //自然数
        var reg2 = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/   //正数
        var right = true
        $("#innerBox .input3").each(function (i, e) {
            if (reg2.test(e.value) == false) {
                $("#toastBody").text("快乐值必须是正数");
                $('#notify').toast('show');
                right = false
            }
            else {
                hapy[i] = parseFloat(e.value)
            }
        })
        $("#innerBox .input2").each(function (i, e) {
            if (reg1.test(e.value) == false) {
                $("#toastBody").text("已选人数必须是正整数");
                $('#notify').toast('show');
                right = false
            }
            else {
                num1[i] = parseFloat(e.value)
            }
        })
        $("#innerBox .input1").each(function (i, e) {
            if (reg1.test(e.value) == false) {
                $("#toastBody").text("限选人数必须是正整数");
                $('#notify').toast('show');
                right = false
            }
            else {
                num0[i] = parseFloat(e.value)
                if (num0[i] >= num1[i]) {
                    right = false
                    $("#toastBody").text("每门课的已选人数必须大于限选人数");
                    $('#notify').toast('show');
                }
            }
        })
        //主体部分
        if (right == true) {
            X[0] = 99
            for (i = 1; i < l; i++) {
                X[i] = 0
            }
            for (i = 0; i < l; i++) {
                Per[i] = num1[i] / num0[i]
                per[i] = Math.pow(Per[i] - 1, 0.125) + 1
                mean[i] = p2 * Math.pow(per[i], 2) + p1 * per[i] + p0 + 0.5
                mean[i] = 0.92 * mean[i] + 0.08 * 99.5
            }
            for (i = 0; i < l; i++) {
                if (X[(a + i) % l] == 0) {
                    continue
                }
                for (j = 1; j < l; j++) {
                    if (P(hapy[(a + i) % l], num0[(a + i) % l], num1[(a + i) % l], (X[(a + i) % l] + 0.5) / mean[(a + i) % l]) + P(hapy[(a + i + j) % l], num0[(a + i + j) % l], num1[(a + i + j) % l], (X[(a + i + j) % l] + 0.5) / mean[(a + i + j) % l]) > P(hapy[(a + i) % l], num0[(a + i) % l], num1[(a + i) % l], (X[(a + i) % l] - 0.5) / mean[(a + i) % l]) + P(hapy[(a + i + j) % l], num0[(a + i + j) % l], num1[(a + i + j) % l], (X[(a + i + j) % l] + 1.5) / mean[(a + i + j) % l])) {
                        X[(a + i) % l] = X[(a + i) % l] - 1
                        X[(a + i + j) % l] = X[(a + i + j) % l] + 1
                        a = (a + i + j) % l
                        i = 0
                        j = 1
                        console.log(a)
                    }
                }
            }
            var towrite = ""
            for (i = 0; i < l; i++) {
                t = hapy[i] - P(hapy[i], num0[i], num1[i], (X[i] + 0.5) / mean[i])
                E = E + t
                poss[i] = t / hapy[i] * 100
                towrite += "课程" + (i + 1) + "选中概率：" + poss[i].toFixed(2) + "%" + "\n"
            }
            towrite += "总期望快乐值：" + E.toFixed(3)
            $('#box p').filter("#jieguo").each(function (i, e) {
                $(e).text(Math.round(X[i]))
            })


            $("#hint").text(towrite)
            $("#detail").show();
            $("#toastBody").text("计算完成");
            $('#notify').toast('show');
        }

    });
}
);