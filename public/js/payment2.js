function copyaddress() {
    var address = document.getElementById("address");
    address.select();
    address.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(address.value);
    alert("Copied!!");
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    var payidparam = urlParams.get("payid");
    const address = urlParams.get("finaladdress");
    var orderid = urlParams.get("payid");
    const amnt = urlParams.get("amnt");
    const symbol = urlParams.get("symbol");
    const srcurl = `https://api.qrserver.com/v1/create-qr-code/?data=${address}&amount=100&size=150x150`;

    const imageElement = document.getElementById('qr');
    imageElement.src = srcurl;
    document.getElementById('address').value = address;
    document.getElementById('orderid').innerText = orderid;
    document.getElementById('amnt').innerText = amnt;
    document.getElementById('symbol').innerText = symbol;


    const payunsuccess = document.getElementById("unsuccess");
    const paysuccess = document.getElementById("success");
    fetch('/payment/confirmation')
        .then(response => response.json())
        .then(data => {
            // Process the data here
            console.log(data);
            const matchingLogs = data.filter(log => log.payid == payidparam);
            if (matchingLogs.length > 0) {
                console.log('Found matching payid:', matchingLogs);
                paysuccess.classList.remove("displaynone");
                payunsuccess.classList.add("displaynone");
            }
        })
        .catch(error => console.error('Error:', error));
});