// MetamaskLogin.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserSession } from '../utils/common';
import { Button } from '@mui/material';
import { useSDK } from '@metamask/sdk-react';
import { AuthContext } from '../context';
import { getUser, getUserId } from '../utils/common';
import { Web3 } from "web3";
import { postAPI } from '../utils/axios';

const Web3Login = () => {
  const history = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [context, setContext] = useContext(AuthContext);


  const { sdk, connected, connecting, provider, chainId } = useSDK();
  const switchChain = async () => {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0xa869`,
          chainName: "Avalanche Fuji Testnet",
          nativeCurrency: {
            name: "AVAX",
            symbol: "AVAX",
            decimals: 18
          },
          rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
          blockExplorerUrls: ["https://testnet.snowtrace.io"]
        }
      ],
    })
  }


  const handleMetamaskLogin = async () => {
    try {
      const accounts = await sdk?.connect();
      console.log(provider);

      if (chainId !== "0xa869") {
        await switchChain();
      }
      console.log(chainId);

      if (accounts) {
        const account = accounts[0];
        setError(null);
        setLoading(true);

        postAPI('/user/login-web3/', { "address": account })
          .then(response => {
            setLoading(false);
            setUserSession(response.data.access);
            history('/dashboard');
            setContext((prevContext) => ({ ...prevContext, username: getUser(), id: getUserId() }));
          })
          .catch(error => {
            setLoading(false);
            if (error?.response?.status === 401) setError(error.response?.data?.error);
            else setError('Something went wrong, please try again');
          });
      };

      const avalancheRpcEndpoint = 'https://api.avax-test.network/ext/bc/C/rpc';
      const web3 = new Web3(new Web3.providers.HttpProvider(avalancheRpcEndpoint));
      async function getBalance() {
        try {
          const balance = await web3.eth.getBalance(accounts[0]);

          console.log(`Balance of ${accounts[0]}: ${balance} Wei`);
          const balanceInAVAX = web3.utils.fromWei(balance, 'ether');
          console.log(`Balance in AVAX: ${balanceInAVAX} AVAX`);
        } catch (error) {
          console.error('Error fetching balance:', error.message);
        }
      }
      getBalance();
    } catch (error) {
      // Handle errors
      console.error('Metamask login error:', error);
      setError('Metamask login failed');
    }
  }

  return (
    <div>
      <Button variant="contained" onClick={handleMetamaskLogin} disabled={loading}>
        {loading ? 'Loading...' : 'Login with Metamask'}
      </Button>
      {error && <small className="error">{error}</small>}
    </div>
  );
};

export default Web3Login;
