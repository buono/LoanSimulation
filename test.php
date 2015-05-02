<?php
/**
 * Created by PhpStorm.
 * User: yakko_tofu
 * Date: 2015/04/15
 * Time: 0:04
 */
/**
 * exportRecのテスト
 */

require_once 'calc.php';

class exportRecTest extends PHPUnit_Framework_TestCase
{
    /** 出力先フォルダ*/
    protected static $okdir = "okdir";
    /** 出力失敗用パス*/
    protected static $ngdir = "ngdir";

    /**
     * 記録開始
     */
    public function testStart()
    {
        // 失敗テスト
        $test = new exportRec;
        $this->assertFalse($test->start(self::$ngdir));

        // 開始成功
        $this->assertTrue($test->start(self::$okdir));
    }

    public static function setUpBeforeClass(){
        if(!file_exists(dirname(self::$okdir))){
            mkdir(dirname(self::$okdir));
        }
    }

    public function testExport(){
        $test = new exportRec;
        $test->start(self::$okdir);

        $data = array('one', 'two', '参', '四');
        $test->export($data);

        $this->markTestIncomplete();
        //これから実装する
    }
}

?>