<?php
/**
 * Created by PhpStorm.
 * User: yakko_tofu
 * Date: 2015/04/14
 * Time: 21:19
 */

class exportRec
{
    /**
     * 指定のファイル名でファイルの作成を開始する
     * @param string $file ファイルパス。拡張子の前に数字を挿入したファイルを連蔵で出力する準備
     * @return bool true=成功 / false=失敗
     */
    public function start($file)
    {
        $this->count = 0;
        if(file_exists(dirname($file))){
            $this->filename = $file;
            return true;
        }
        return false;
    }


    public function export($data){
        return true;
    }
}

?>
