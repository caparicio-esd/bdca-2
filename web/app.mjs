// https://cdn.esm.sh/web3@1.10.0
// import Web3 from 'https://cdn.esm.sh/v92/web3@1.10.0/es2022/web3.js';
import Web3 from "https://esm.sh/web3@1.10.0";

const chainId = "0x539"; // Ganache: es donde he desplegado el contrato

let web3 = null; // Creare mi propio objeto web3, de la version 1.6.0

let contador = null; // Instancia desplegada del contrato

const init = async () => {
  console.log("Inicializando..");

  // Comprobar que el navegador soporta Ethereum
  if (typeof window.ethereum === "undefined") {
    alert("Instale MetaMask para usar esta aplicación.");
    return;
  }
  try {
    console.log("Configurando el manejo de cambio de red");
    ethereum.on("chainChanged", (chainId) => {
      // Recargar la pagina
      console.log("Seleccionada otra red.");
      window.location.reload();
    });

    console.log("Configurar cambio de cuenta selecionada");
    ethereum.on("accountsChanged", (accs) => {
      // Recargar el UI con la primera cuenta
      console.log("Seleccionada otra cuenta =", accs[0]);
      document.getElementById("cuenta").innerHTML = accs[0];
    });

    // Comprobar si MetaMask está conectado a la red deseada:
    const cid = await ethereum.request({ method: "eth_chainId" });
    if (cid !== chainId) {
      alert("Debe conectar MetaMask a Ganache.");
      return;
    }

    // Creo mi instancia de web3
    web3 = new Web3(ethereum);

    console.log("web3 =", web3.version);

    console.log("Obtener el ABI del contrato Contador.");
    const response = await fetch("Contador_sol_Contador.abi");
    const abi = await response.json();

    console.log("Obtener la direccion despliegue el contrato Contador.");
    const response2 = await fetch("_last_deployed_address.txt");
    const addr = await response2.text();

    console.log("Obtener instancia desplegada del contador.");
    contador = new web3.eth.Contract(abi, addr);

    console.log("Configurar Vigilancia del evento Tic.");
    contador.events
      .Tic()
      .on("error", (error) => {
        console.log("ERROR en evento Tic:", error);
      })
      .on("data", (event) => {
        console.log("Se ha producido un evento Tic:");
        console.log(" * Msg =", event.returnValues.msg);
        console.log(" * Account =", event.returnValues.account);
        console.log(" * Out =", event.returnValues.out);
        document.getElementById("valor").innerHTML = event.returnValues.out;
      });

    // ROUTER de eventos
    console.log("Configurando manejadores de eventos.");
    document.getElementById("cincr").addEventListener("click", handleIncr);
    document.getElementById("login").addEventListener("click", handleLogin);
    document.getElementById("cset2").addEventListener("click", handleSet);

    refreshContador();
    refreshAccount();
  } catch (error) {
    alert("Se ha producido un error inesperado: " + error);
  }
};

const handleLogin = async (event) => {
  // Hacer login en MetaMask para acceder a las cuentas

  console.log("Se ha hecho Click en el botón de Login.");

  event.preventDefault();

  refreshAccount();
};

const handleIncr = async (event) => {
  console.log("Se ha hecho Click en el botón de incrementar.");

  event.preventDefault();

  try {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    if (!account) {
      alert("No se puede acceder a las cuentas de usuario.");
      return;
    }
    console.log("Cuenta =", account);

    // Ejecutar incr como una transacción desde la cuenta account.
    await contador.methods.incr().send({
      from: account,
      gas: 200000,
    });
  } catch (error) {
    console.log(error);
  }
};

const refreshContador = async () => {
  console.log("Refrescando el valor mostrado del contador.");

  try {
    const valor = await contador.methods.valor().call();

    console.log("Valor =", valor);

    document.getElementById("valor").innerHTML = valor;
  } catch (error) {
    console.log(error);
  }
};

const refreshAccount = async () => {
  console.log("Refrescando la cuenta mostrada.");

  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];

    console.log("Logueado con la cuenta =", account);
    document.getElementById("cuenta").innerHTML = account;
  } catch (error) {
    console.log(error);
  }
};

const handleSet = async (event) => {
  console.log("Se está enviando un valor nuevo");

  event.preventDefault();
  const valueRaw = document.getElementById("cset1").value;
  const value = valueRaw == "" ? 0 : +valueRaw;

  try {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    if (!account) {
      alert("No se puede acceder a las cuentas de usuario.");
      return;
    }
    console.log("Cuenta =", account);

    // Ejecutar incr como una transacción desde la cuenta account.
    await contador.methods.set(value).send({
      from: account,
      gas: 200000,
    });
  } catch (error) {
    console.log(error);
  }
};

// Empezar la ejecución:
init();
