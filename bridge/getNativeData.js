import   {  getEnv , deviceDetection }  from '../../commons/libs/appbridge';
//设置url头里面的参数
let setHead = (obj) => {
    zxr_js.header = {
        appVersion:window.zxr_js.appVersion,
        deviceNumber:obj.deviceNumber,
        environment:getEnv(),
        osType:deviceDetection() ? 'Android' : 'IOS',
        userToken:obj.tokenId
    };
    zxr_js.userId = obj.userId;
};
export const getUserData = (resolve) => {
    zxr_js.getMobileAppCallBack = function(data) {

        if( typeof data === 'string' ) {
            let str = zxrAppBridge.base64.decode(data);
            let userData = JSON.parse(str);
            setHead(userData);
            resolve(userData);
        } else {
            setHead(data);
            resolve(data);
        }
    };
    //获取用户信息
    zxrAppBridge.getMobileApp(window.zxr_js.getMobileAppCallBack);
};