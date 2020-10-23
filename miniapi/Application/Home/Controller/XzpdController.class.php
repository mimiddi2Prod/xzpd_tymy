<?php
namespace Home\Controller;
use Think\Controller;

class XzpdController extends Controller {
    public $appid = "wx2d83b04a53139211";
    public $secret = "6482d5aa9931c6aea960d89beb2626ae";
    
    #生成带参数的小程序二维码
    public function getwxaqrcode()
    {
        $access_token = $this->AccessToken();
        $url = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token='.$access_token; //小程序二维码B接口，可带参数
        $page = "pages/index/index";
        $openid = $_GET['openid'];
        $width = 430;
        $data = '{"scene":"'.$openid.'","page":"'.$page.'","width":'.$width.'}';//以json str的形式传参
        $return = $this->curl_post($url,$data);
        $path = 'c:/project/miniapi/image/xzpd/'.$openid.'.jpg';
        file_put_contents($path,$return);
        #压缩图片功能
        $source = $path;//原图片名称
        $dst_img = $path;//压缩后图片的名称
        $percent = 0.5;  #原图压缩，不缩放，但体积大大降低
        $image = (new PubImageController($source,$percent))->compressImg($dst_img);
        #传给前端图片的地址
        $image = 'https://www.minidope.com/image/xzpd/'.$openid.'.jpg';
//        echo 123;
        echo $image;
    }
    #返回小程序令牌 access_token
    public function AccessToken()
    {
        $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={$this->appid}&secret={$this->secret}";
        $AccessToken = $this->curl_post($url);
        $AccessToken = json_decode($AccessToken , true);
        $AccessToken = $AccessToken['access_token'];
        return $AccessToken;
    }
    //通过动态code得到唯一openid
    function getopenid(){
        $code = $_GET['code'];
        $api = "https://api.weixin.qq.com/sns/jscode2session?appid={$this->appid}&secret={$this->secret}&js_code={$code}&grant_type=authorization_code";
        $str = $this->curl_get($api);
        $openid = json_decode($str);
        $this->finduser($openid->openid);
    }
    function finduser($_openid){
        $user = M('Xz_user');
        $openid['openid'] = $_openid;
        $data = $user->where($openid)->find();
        if($data){
            echo json_encode($data);
        }else{
            $arr_openid['openid'] =  $_openid;
            echo json_encode($arr_openid);
        }
    }
    function findfrienduser(){
        $user = M('Xz_user');
        $userarr = $_GET;
        $data = $user->where($userarr)->find();
        if($data){
            echo json_encode($data);
        }else{
            echo 0;
        }
    }
    function adduser(){
        $user = M('Xz_user');
		$openid['openid'] = $_GET['openid'];
        if($user->where($openid)->find()){
            exit;
        }
        $bool = $user->add($_GET);
        if($bool){
            echo 'success';
        }else{
            echo 'fail';
        }
    }
    //查找星座配对
    function findpair(){
        $pairpost = $_GET;
        $pair = M('Xz_pair');
        $data = $pair->where($pairpost)->select();
        echo json_encode($data);
    }
    #支付接口
    function ispaid(){
        $recard = M('Xz_recard');
        $ispaid['ispaid'] = 1;
        $recard->where($_GET)->save($ispaid);
        if(empty($_GET['openid2'])){
            $user = M('User');
            $arr['openid'] = $_GET['openid1'];
            $user->where($arr)->save($ispaid);
        }
    }
    function findrecard(){
        $recard = M('Xz_recard');
        if($_GET['myopenid']){
            $data = M()->query("select * from mn_xz_recard where openid1='".$_GET['openid1']."' order by case when openid2='".$_GET['myopenid']."' then 0 else 1 end desc");
        }else{
            $data = $recard->where($_GET)->select();
        }
        if($data){
            echo json_encode($data);
        }else{
            echo 0;
        }
    }
    function addrecard(){
        $codearr = $_GET;
        $recard = M('Xz_recard');
        $open['openid1'] = $codearr['openid1'];
        $open['openid2'] = $codearr['openid2'];
        if($recard->where($open)->find()){
            exit;
        }
        $recard1['openid1'] = $codearr['openid1'];
        $recard1['name1'] = $codearr['name1'];
        $recard1['avatar1'] = $codearr['avatar1'];
        $recard1['constellation1'] = $codearr['constellation1'];
        $recard1['staricon1'] = $codearr['staricon1'];
        $recard1['analysis'] = $codearr['analysis'];
        $recard1['cheats'] = $codearr['cheats'];
        $recard1['openid2'] = $codearr['openid2'];
        $recard1['name2'] = $codearr['name2'];
        $recard1['avatar2'] = $codearr['avatar2'];
        $recard1['constellation2'] = $codearr['constellation2'];
        $recard1['staricon2'] = $codearr['staricon2'];
        $recard1['score'] = $codearr['score'];
        $recard1['isshow'] = $codearr['isshow'];
        $recard1['ispaid'] = $codearr['ispaid'];
        $recard->add($recard1);
    }
    function isshow(){
        $user = M('Xz_recard');
        $userarr = $_GET;
        $data['isshow'] = 1;
        $bool = $user->where($userarr)->save($data);
        if($bool){
            echo 'success';
        }else{
            echo 'fail';
        }
    }
    function curl_get($url){
        $curl = curl_init();
        $header = "Accept-Charset: utf-8";
        curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "GET");
        $res = curl_exec($curl);
        curl_close($curl);
        if (curl_errno($curl)) {
            return false;
        }else{
            return $res;
        }
    }
   function curl_post($url,$data = 0){
        $curl = curl_init();
        $header = "Accept-Charset: utf-8";
        curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        $res = curl_exec($curl);
        curl_close($curl);
        if (curl_errno($curl)) {
            return false;
        }else{
            return $res;
        }
    }
    function payfee(){
        $fee = $_GET['money'];
        $openid= $_GET['openid'];
        $mch_id='1508603281';//商户号
        $key='81ef119935811ab9339b8c802a2ffc7B';
        $out_trade_no = $mch_id.time();
        $body = '星座拍档';
        $total_fee = $fee*100;
        $weixinpay = new PubWXPayController($this->appid,$openid,$mch_id,$key,$out_trade_no,$body,$total_fee);
        $return=$weixinpay->pay();
        echo json_encode($return);
    }
}