// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Contador {
    
    uint8 public valor = 0;
    
    event Tic(string msg, address account, uint8 out);
        
    function incr() public {
        valor++;
        emit Tic("Actualizado", msg.sender, valor);
    }
    function set(uint8 _value) public {
        valor = _value;
        emit Tic("Actualizado", msg.sender, valor);
    }
    
    receive() external payable { 
        revert(); 
    }
}
