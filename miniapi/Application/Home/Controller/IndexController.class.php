<?php
namespace Home\Controller;
use Think\Controller;
//首页控制器
class IndexController extends Controller {
    //主页面
    function index(){
        $xzpd = M('Xz_user');
        $tymy = M('Qqh_user');
        $xz = $xzpd->count();
        $qqh = $tymy->count();
        echo "<h1>星座拍档：{$xz}</br>填言觅语：{$qqh}";
    }
}