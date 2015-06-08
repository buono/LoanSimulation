<?php
/**
 * Created by PhpStorm.
 * User: yakko_tofu
 * Date: 2015/04/14
 * Time: 21:19
 */


//読み込み
$kariirekin     = $_POST['kariirekin'];
$kariirekikan   = $_POST['kariirekikan'];
$kinri          = $_POST['kinri'];
$kinritype      = $_POST['kinritype'];

include_once ( __DIR__ . '/Classes/PHPExcel.php');
include_once ( __DIR__ . '/Classes/PHPExcel/IOFactory.php');

//エクセルファイルの新規作成
//$excel = new PHPExcel();
$reader = PHPExcel_IOFactory::createReader('Excel2007');
$excel = $reader->load("calc.xlsx");


// シートの設定
$excel->setActiveSheetIndex(0);//何番目のシートか
$sheet = $excel->getActiveSheet();//有効になっているシートを代入

// セルに値を入力
$sheet->setCellValue('B5',  $kariirekin);
$sheet->setCellValue('B6',  $kariirekikan);
$sheet->setCellValue('B7',  $kinri);
$sheet->setCellValue('B8',  $kinritype);

// Excel2007形式で出力する
$writer = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
$writer->save('calc.xlsx');


// 計算結果を取得
$reader = PHPExcel_IOFactory::createReader('Excel2007');
$excel = $reader->load("calc.xlsx");

$excel->setActiveSheetIndex(0);//何番目のシートか
$sheet = $excel->getActiveSheet();//有効になっているシートを代入

//元利均等方式
if($kinritype == 'motori_kinto') {
    //$kariire_sogaku = $sheet->getCell('B16')->getCalculatedValue();
    $kariire_sogaku = $sheet->getCell('B16')->getCalculatedValue();
    $rishi_total    = $sheet->getCell('B17')->getCalculatedValue();
    $tsuki_hensai   = $sheet->getCell('B18')->getCalculatedValue();
//元金均等方式
}else{
    $kariire_sogaku = $sheet->getCell('F16')->getCalculatedValue();
    $rishi_total    = $sheet->getCell('F17')->getCalculatedValue();
    $tsuki_hensai   = $sheet->getCell('F18')->getCalculatedValue();
}

//json形式にして返す
$calc_result = array('kariire_sogaku' => $kariire_sogaku, 'rishi_total' => $rishi_total, 'tsuki_hensai' => $tsuki_hensai);
header('Content-type: application/json');
echo json_encode($calc_result);

?>
