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

    await instance.methods.incr().send({
        from: primaryAddress,
        gas: 200000
    });

    const valor2 = await instance.methods.valor().call();
    console.log("Valor final =", valor2);

    process.exit(0);
} catch (error) {
    console.log("Error =", error);
    process.exit(1);
}
