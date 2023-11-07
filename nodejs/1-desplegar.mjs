import fs from "fs";
import Web3 from "web3";  // Cargar paquete web3

try {
    // Usar Provider: GANACHE
    const web3 = new Web3("ws://127.0.0.1:7545");

    const addresses = await web3.eth.getAccounts();
    const primaryAddress = addresses[0];
    console.log("primaryAddress =", primaryAddress);

    const abi = JSON.parse(fs.readFileSync("../contracts/build/Contador_sol_Contador.abi"));
    //console.log("ABI =", abi);

    const code = "0x" + fs.readFileSync("../contracts/build/Contador_sol_Contador.bin");
    //console.log("Code =", code);

    const contract = new web3.eth.Contract(abi);

    const instance = await contract.deploy({
        data: code,
        arguments: []
    }).send({
        from: primaryAddress,
        gas: 500000
    });
    console.log("Contrato desplegado en", instance.options.address);
    fs.writeFileSync("_last_deployed_address.txt", instance.options.address)

    process.exit(0);
} catch (error) {
    console.log("Error =", error);
    process.exit(1);
}
