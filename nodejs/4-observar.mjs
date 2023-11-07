import fs from "fs";
import Web3 from "web3";  // Cargar paquete web3

try {
    // Usar Provider: GANACHE
    let web3 = new Web3("ws://127.0.0.1:7545");

    const abi = JSON.parse(fs.readFileSync("../contracts/build/Contador_sol_Contador.abi"));
    const addr = fs.readFileSync("./_last_deployed_address.txt").toString();

    const instance  = new web3.eth.Contract(abi, addr);

    instance.events.Tic()
        .on("error", error => {
            console.log("Se ha producido un ERROR en evento Tic:", error);
            process.exit(2);
        })
        .on('data', event => {
            console.log("Se ha producido un evento Tic:");
            console.log(" * Msg =", event.returnValues.msg);
            console.log(" * Account =", event.returnValues.account);
            console.log(" * Out =", event.returnValues.out);
        });

} catch (error) {
    console.log("Error =", error);
    process.exit(1);
}
