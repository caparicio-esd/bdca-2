import fs from "fs";
import Web3 from "web3";  // Cargar paquete web3

try {
    // Usar Provider: GANACHE
    let web3 = new Web3("ws://127.0.0.1:7545");

    const addresses = await web3.eth.getAccounts();
    const primaryAddress = addresses[0];

    const abi = JSON.parse(fs.readFileSync("../contracts/build/Contador_sol_Contador.abi"));
    const addr = fs.readFileSync("./_last_deployed_address.txt").toString();

    const instance = new web3.eth.Contract(abi, addr);

    const valor1 = await instance.methods.valor().call();

    console.log("Valor Inicial =", valor1);

    // Este ejemplo es igual que 3-incrementar, pero atendiendo los eventos javascript (Event Emitter) que genera send
    instance.methods.incr().send({
        from: primaryAddress,
        gas: 200000
    }).on('sending', function (x) {
        console.log("Enviando la transaccion.", x);
    }).on('sent', function (x) {
        console.log("Transaccion enviada.", x);
    }).on('transactionHash', function (hash) {
        console.log("Hash de la transaccion:", hash);
    }).on('confirmation', function (confirmationNumber, receipt) {
        console.log("Confirmacion de la transaccion:", confirmationNumber);
    }).on('receipt', async function (receipt) {
        console.log("Recibo", receipt);

        const valor2 = await instance.methods.valor().call();
        console.log("Valor final =", valor2);

        //process.exit(0);
    }).on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log("Error:", error);
    });


} catch (error) {
    console.log("Error =", error);
    process.exit(1);
}
