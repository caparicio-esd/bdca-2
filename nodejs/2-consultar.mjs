import fs from "fs";
import Web3 from "web3";  // Cargar paquete web3

try {
    // Usar Provider: GANACHE
    let web3 = new Web3("ws://127.0.0.1:7545");

    const abi = JSON.parse(fs.readFileSync("../contracts/build/Contador_sol_Contador.abi"));
    console.log("ABI =", abi);

    const addr = fs.readFileSync("./_last_deployed_address.txt").toString();
    console.log("Address =", addr);

    const instance = new web3.eth.Contract(abi, addr);

    console.log("Creada la instancia", instance);

    const valor = await instance.methods.valor().call();

    console.log("Valor =", valor);

    process.exit(0);
} catch (error) {
    console.log("Error =", error);
    process.exit(1);
}
