/**
 * Created by yakko_tofu on 2015/06/02.
 */

$(function(){
    google.setOnLoadCallback(chart);

    $("#main_02>p").hide();

    $("#test_btn").click(function(){
        $('#kariirekin').val(1000);
        $('#kariirekikan').val(35);
        $('#kinri').val(2);
    });
    $("#calc_btn").click(function(){
        $("#main_02>p").show("slow");
        var data = {
            kariirekin      : $('#kariirekin').val(),
            kariirekikan    : $('#kariirekikan').val(),
            kinri           : $('#kinri').val(),
            kinritype       : $('[name=kinritype]').val()
        };
        $.ajax({
            type: 'post',
            url: '/LoanSimulation/calc.php', //データの送信先
            data: data, //サーバへ送信するデータ
            dataType: 'json', //サーバからの応答
            success: function(data){
                //結果を表示
                show_result(data);

            },
            error: function(){
                //nothing
            },
            complete: function(){
                //nothing
            }
        });
       return false;
    });
})

function show_result(data)
{
    var _calc_result = JSON.stringify(data);
    var calc_result = jQuery.parseJSON(_calc_result);
    show_whole(calc_result);
    show_chart(calc_result);
    show_graph(calc_result);
}

function calc_zandaka(tsuki_hensai, num)
{
    var kariirekin      = $('#kariirekin').val();
    var kinri           = $('#kinri').val() /12 /100;
    var zandaka         = Math.pow(1+kinri, num) * kariirekin - (tsuki_hensai * (Math.pow(1+kinri, num) - 1) / kinri) / 10000;
    return zandaka;
}

function show_whole(calc_result)
{
    var html;
    var kariirekin = $('#kariirekin').val() * 10000;
    var kariirekin_s = Math.floor(kariirekin).toLocaleString();
    var kariirekikan = $('#kariirekikan').val() * 12;
    var shiharai_sogaku = calc_result.tsuki_hensai * kariirekikan;
    var shiharai_sogaku_s = Math.floor(shiharai_sogaku).toLocaleString();
    var kinribun = shiharai_sogaku - kariirekin;
    var kinribun_s = Math.floor(kinribun).toLocaleString();
    var tsuki_hensai = calc_result.tsuki_hensai;
    var tsuki_hensai_s = Math.floor(tsuki_hensai).toLocaleString();

    html = "<table id='whole_result'>";
    html += "<tr><td>借入金(円)</td><td>支払総額(円)</td><td>金利分(円)</td><td>月々の支払額(円)</td></tr>";
    html += "<tr>";
    html += "<td>" + kariirekin_s +"</td>";
    html += "<td>" + shiharai_sogaku_s +"</td>";
    html += "<td>" + kinribun_s +"</td>";
    html += "<td>" + tsuki_hensai_s +"</td>";
    html += "</tr>";
    html += "</table>";
    $('#whole').html(html);
}


function show_graph(calc_result)
{
    var kariirekin      = $('#kariirekin').val();

    //残高を計算
    var tsuki_hensai = calc_result.tsuki_hensai;
    var kariirekikan = $('#kariirekikan').val() * 12;

    var point_count = 16;
    for (var i=1; i<=point_count; i++){
        eval("var kariirekikan" + i + "= kariirekikan *"+ i +"/point_count;");
    }

    for (var i=1; i<=point_count; i++){
        eval("var zandaka" + i + "= calc_zandaka(tsuki_hensai, kariirekikan" + i +");");
    }

    //数字に変換
    var kariirekin      = Number(kariirekin);
    for (var i=1; i<=point_count; i++){
        eval("var zandaka" + i + "= Number(zandaka" + i +");");
        eval("var kariirekikan" + i + "= Number(kariirekikan" + i +");");
    }

    //グラフデータ
    var data = new google.visualization.DataTable();
    data.addColumn('number', '回目 (回)');
    data.addColumn('number', '残高 (万円)');

    data.addRows([
        [0,               kariirekin],
        [kariirekikan1,   zandaka1],
        [kariirekikan2,   zandaka2],
        [kariirekikan3,   zandaka3],
        [kariirekikan4,   zandaka4],
        [kariirekikan5,   zandaka5],
        [kariirekikan6,   zandaka6],
        [kariirekikan7,   zandaka7],
        [kariirekikan8,   zandaka8],
        [kariirekikan9,   zandaka9],
        [kariirekikan10,  zandaka10],
        [kariirekikan11,  zandaka11],
        [kariirekikan12,  zandaka12],
        [kariirekikan13,  zandaka13],
        [kariirekikan14,  zandaka14],
        [kariirekikan15,  zandaka15],
        [kariirekikan16,  zandaka16]
    ]);
    var options = {
        width: 770,
        height: 300,
        axes: {
            y: {
                //MotivationLevel: {label: '残高 (万円)'},
            }
        },
        hAxis: {
            title: '回目 (回)',
            viewWindow: {
                min: [0],
                max: [500]
            }
        },
        vAxis: {
            title: '残高 (万円)'
        }
    };
    var graph = new google.visualization.LineChart(document.getElementById('graph'));

    graph.draw(data, options);
}

function show_chart(calc_result)
{
    var html;
    var kariirekin   = $('#kariirekin').val() * 10000;
    var kariirekikan = $('#kariirekikan').val() * 12;
    var tsuki_hensai = Math.floor(calc_result.tsuki_hensai);
    var tsuki_hensai_s = tsuki_hensai.toLocaleString();
    var _zandaka; //前の月の残高。元金分計算用

    html = "<table id='chart_result'>";
    html += "<tr><td>回目(回)</td><td>返済額(円)</td><td>元金分(円)</td><td>利子分(円)</td><td>残高(円)</td></tr>";
    for (var i=1; i <= kariirekikan; i++){
        var zandaka = Math.floor(calc_zandaka(tsuki_hensai, i) * 10000);
        var zandaka_s = zandaka.toLocaleString();
        //最初は借入金からひく
        if(i==1){
            _zandaka = kariirekin;
        }
        var motokin = Math.floor(_zandaka - zandaka);
        var motokin_s = motokin.toLocaleString();
        var rishibun = Math.floor(tsuki_hensai - motokin);
        var rishibun_s = rishibun.toLocaleString();
        _zandaka = zandaka;
        html += "<tr>";
        html += "<td>" + i + "</td>";
        html += "<td>" + tsuki_hensai_s + "</td>";
        html += "<td>" + motokin_s + "</td>";
        html += "<td>" + rishibun_s + "</td>";
        html += "<td>" + zandaka_s + "</td>";
        html += "</tr>";
    }
    html += "</table>";
    $('#chart').html(html);
}

/*
function addFigure(str) {
    var num = str;
    //var num = new String(str).replace(/,/g, "");
    while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
    return num;
}
*/

