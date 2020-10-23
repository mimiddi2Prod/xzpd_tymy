<?php
namespace Home\Controller;
use Think\Controller;

class TymyController extends Controller {
    public $appid = "wx7ee729f7cfe651b5";
    public $secret = "ada8733bd83a79d2b5bf7876c4c48195";
    
    function user_add(){
        $user = M('Qqh_user');
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
    function user_find($openid){
        $user = M('Qqh_user');
        $where['openid'] = $openid;
        $data = $user->where($where)->find();
        if($data){#如果有记录
            echo json_encode($data);#用户信息
        }else{
            $arropenid['openid'] = $openid;
            echo json_encode($arropenid);#单独openid
        }
    }
    function message_add(){
        $message = M('Qqh_message');
        $bool = $message->add($_GET);
        if($bool){
            echo 'success';
        }else{
            echo 'fail';
        }
    }
    function message_delete(){
        $message = M('Qqh_message');
        $bool = $message->where($_GET)->delete();
        if($bool){
            echo 'success';
        }else{
            echo 'fail';
        }
    }
    function message_find_mine(){
        $message = M('Qqh_message');
        if($data = $message->where($_GET)->order('create_time desc')->select()){
            echo json_encode($data);
        }else{
            echo 'fail';
        }
    }
    function message_find_friend(){
        $data = M()->query("select * from mn_qqh_message where openid2='".$_GET['openid2']."' order by case when openid1='".$_GET['openid1']."' then 0 else 1 end asc");
        if($data){
            echo json_encode($data);
        }else{
            echo 'fail';
        }
    }
    #分享次数
    function message_count(){
        $message = M('Qqh_message');
        $data = $message->where($_GET)->find();
        $count = $data['count'];
        if($count<=0){
            echo 400;
        }else{
            $countmes['count'] = $count - 1;
            if($message->where($_GET)->save($countmes)){
                echo 200;
            }else{
                echo 300;
            }
        }
    }
    #被识破
    function message_change_cue(){
        $message = M('Qqh_message');
        $data['isshow'] = 1;
        $message->where($_GET)->save($data);
        echo 200;
    }
    #支付后更改展示状态
    function ispaid(){
        $recard = M('Qqh_message');
        $ispaid['ispaid'] = 1;
        $recard->where($_GET)->save($ispaid);
    }
    #获取openid
    function openid_get(){
        $code = $_GET['code'];
        $api = "https://api.weixin.qq.com/sns/jscode2session?appid={$this->appid}&secret={$this->secret}&js_code={$code}&grant_type=authorization_code";
        $openidjson = $this->curl_get($api);   #通过code请求微信接口获取openid
        echo $openidjson;
    }
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
        $path = 'c:/project/miniapi/image/tymy/'.$openid.'.jpg';
        file_put_contents($path,$return);
        #压缩图片功能
        $source = $path;//原图片名称
        $dst_img = $path;//压缩后图片的名称
        $percent = 0.5;  #原图压缩，不缩放，但体积大大降低
        $image = (new PubImageController($source,$percent))->compressImg($dst_img);
        #传给前端图片的地址
        $image = 'https://www.minidope.com/image/tymy/'.$openid.'.jpg';
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
    function payfee(){
        $fee = $_GET['money'];
        $openid= $_GET['openid'];
        $mch_id='1508603281';//商户号
        $key='81ef119935811ab9339b8c802a2ffc7B';
        $out_trade_no = $mch_id.time();
        $body = '填言觅语';
        $total_fee = $fee*100;
        $weixinpay = new PubWXPayController($this->appid,$openid,$mch_id,$key,$out_trade_no,$body,$total_fee);
        $return=$weixinpay->pay();
        echo json_encode($return);
    }
}