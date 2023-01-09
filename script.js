// Author: Roeland L.C. Kemp

const MAX_IP = 256**4;

function isCidr(cidr) {
    return !(cidr < 0 || cidr > 32) && !isNaN(cidr);
}

function cidrToBinary(cidr) {
    if (!isCidr(cidr)) {
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

    while (binaryString.length < 32) {
        binaryString = "0" + binaryString;
    }
    
    return (parseInt(binaryString.substring(0,8), 2)) 
    + "." + (parseInt(binaryString.substring(8,16), 2)) 
    + "." + (parseInt(binaryString.substring(16,24), 2)) 
    + "." + (parseInt(binaryString.substring(24,32), 2));
}

function findSubnetSize(cidr) {
    return isCidr(cidr) ? 2**Math.abs(cidr - 32) : null;
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


function cidrToSubnetMask(cidr) {
    return isCidr(cidr) ? binaryToDecIP(cidrToBinary(cidr)) : null;
}

function IPToNum(IPString) {
    if (!isIpAddr(IPString)) {
        return null;
    }

    let IP = IPString.split(".");
    return IP[0] * 256**3 + (IP[1] * 256**2) 
    + (IP[2] * 256) + parseInt(IP[3]);
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

    if (newNum < 0 || newNum >= MAX_IP) {
        return null;
    }
    
    return numToIP(newNum);
}

function findSubnetRange(ip, cidr) {
    let subnetSize = findSubnetSize(cidr);
    let ipNum = IPToNum(ip);
    let subnetStartNum = ipNum - (ipNum % subnetSize);
    
    let startIP = numToIP(subnetStartNum);
    let endIP = numToIP(subnetStartNum + subnetSize - 1);
    return startIP + " - " + endIP;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MIN_CIDR = 5;
const MAX_CIDR = 30;

const ip_and_cidr_text = document.getElementById("ip_and_cidr_text");
const subnet_mask_text = document.getElementById("subnet_mask_text");
const subnet_start_text = document.getElementById("subnet_start_text");
const subnet_end_text = document.getElementById("subnet_end_text");

subnet_start_text.onkeypress = function(e) {
    return checkInput(e);
};

subnet_end_text.onkeypress = function(e) {
    return checkInput(e);
};

function checkInput(e) {
    let chr = String.fromCharCode(e.which);
    return ("1234567890.".indexOf(chr) >= 0);
} 

let IP;
let cidr;
let subnetMask;
let answer;

function newQuestion() {
    IP = numToIP(Math.floor(MAX_IP * Math.random()));
    cidr = Math.floor(((MAX_CIDR - MIN_CIDR) * Math.random()) + MIN_CIDR);
    ip_and_cidr_text.textContent = IP + "/" + cidr;    

    subnetMask = cidrToSubnetMask(cidr);
    subnet_mask_text.textContent = subnetMask;

    answer = findSubnetRange(IP, cidr).split(" - ");
}

newQuestion();