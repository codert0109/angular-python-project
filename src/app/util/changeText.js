export function changeText(message){
    var key = CryptoJS.enc.Utf8.parse("AAAAAAAAAAAAAAAA");
    var iv = CryptoJS.enc.Utf8.parse("BBBBBBBBBBBBBBBB");
    var encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv, mode: CryptoJS.mode.CBC});
    return encrypted.toString(); 
}