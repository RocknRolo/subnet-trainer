// Author: Roeland L.C. Kemp

function cidrToBinary(cidr) {
    if (Number.isNaN(cidr)) {
        return null;
    }
    if (cidr < 1 || cidr > 32) {
        return null;
    }
    let binaryString = "";
    for (let i = 0; i < cidr; i++) {
        binaryString += 1;
    }
    while (binaryString.length < 32) {
        binaryString += "0";
    }
    return binaryString;
}

function isBinaryString(binaryString) {
    for (let i = 0; i < binaryString.length; i++) {
        if (binaryString[i] !== "0" && binaryString[i] !== "1") {
            return false;
        }
    } 
    return true;
}

function binaryToDecIP(binaryString) {
    if (!isBinaryString(binaryString)) {
        return null;
    }
    if (binaryString.length > 32) {
        return null;
    }

    while (binaryString.length <= 32) {
        binaryString = "0" + binaryString;
    }
    
    return parseInt(binaryString.substring(0,8), 2)
    + "." + parseInt(binaryString.substring(8,16), 2)
    + "." + parseInt(binaryString.substring(16,24), 2)
    + "." + parseInt(binaryString.substring(24,32), 2);
}

function findSubnetSize(cidr) {
    return 2**Math.abs(cidr - 32);
}

function isIpAddr(ipAddr) {
    let ipArr = ipAddr.split(".");
    if (ipArr.length !== 4) {
        return false;
    }
    for (let i = 0; i < ipArr.length; i++) {
        if (ipArr[i] < 0 || ipArr[i] > 255 || isNaN(ipArr[i])) {
            return false;
        }
    }
    return true;
}

function compareIP(ip1, ip2) {
    if (!isIpAddr(ip1) || !isIpAddr(ip2)) {
        return null;
    }
    return IPToNum(ip2) - IPToNum(ip1);
}

function isCidr(cidr) {
    return (cidr < 0 || cidr > 32);
}


function generateSubnet(startIP, cidr) {
    if (!isIpAddr(startIP)) {
        return null;
    }
    if (!isCidr(cidr)) {
        return null;
    }
    startIndex = IPToNum(startIP);
    endIndex = startIndex + findSubnetSize(cidr);

    for (let i = startIndex; i < endIndex; i++) {

    }

}

function IPToNum(IPString) {
    let IP = IPString.split(".");
    return IP[0] * 256**3 + (IP[1] * 256**2) + (IP[2] * 256) + parseInt(IP[3]);
}

function numToIP(num) {
   let IPString = Math.floor((num - (num % 256**3)) / 256**3) + ".";
   
   num %= 256**3;
   IPString += Math.floor((num - (num % 256**2)) / 256**2) + ".";
   
   num %= 256**2;
   IPString += Math.floor((num - (num % 256)) / 256) + ".";

   return IPString + num % 256; 
}


function calcNewIP (oldIP, offset) {
    if (!isIpAddr(oldIP) || isNaN(offset)) {
        return null;
    }
    
    let newNum = IPToNum(oldIP) + Math.floor(offset);

    if (newNum < 0 || newNum >= 256**4) {
        return null;
    }
    
    return numToIP(newNum);
}