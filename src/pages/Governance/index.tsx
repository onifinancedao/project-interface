import { Route, Routes } from 'react-router-dom'
import JSBI from 'jsbi';
import { isAddress } from "@ethersproject/address"; 
import { Interface } from '@ethersproject/abi'
import { BigNumber } from "@ethersproject/bignumber"

import CreateProposal from './CreateProposal'
import Proposals from './Proposals'
import VotePage from './VotePage'

import { COMMON_CONTRACT_NAMES } from '../../constants/governance'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'

import { FOUR_BYTES_DIR, ProposalDetail } from '../../state/governance/hooks';

import './index.css'

export const linkIfAddress = (content: string, chainId: number | undefined) => {
  if(isAddress(content) && chainId) {
    const commonName = COMMON_CONTRACT_NAMES[chainId]?.[content] ?? content
    return (
      <a className='text-decoration-none' href={getExplorerLink(chainId, content, ExplorerDataType.ADDRESS)} target='_blank' rel="noopener noreferrer">{commonName}</a>
    )
  }
  return <span>{content}</span>
}

function parseText(str: string) {
  if(str.length > 0){
    switch(str.toLowerCase()) {
      case "true":
        return [true];
      case "false":
        return [false];
      default:
        try {
          return JSON.parse(str);
        } catch(error) {
          return str.split(',');
        }
    }
  }else{
      return []
  }
  
}  

export function encodeData(functionSig:string, callData:string){
  try {
      const iface = new Interface(["function " + functionSig]);
      const encodedData = iface.encodeFunctionData(iface.fragments[0].name, parseText(callData))
  return {
      encodedData,
      error: false
  }
  }catch(error){
      return {
          encodedData: "",
          error: true
      }
  }
}

function ExtractBigNumber(str:string){
  let value = new RegExp(/{"type":"BigNumber","hex":"([0-9a-zA-z]*)"}/).exec(str) 
  try{
    return JSBI.BigInt(BigNumber.from(value?.[1]).toString()).toString();
  } catch(error){
    return "0"
  }
}

function modifyMatchedText(str:string) {
  let match;
  while ((match = new RegExp(/{"type":"BigNumber","hex":"[0-9a-zA-z]*"}/).exec(str)) !== null) {
    if(match){
      str = str.replace(new RegExp(match[0]), ExtractBigNumber(match[0]))
    }
  }
  return str.replace(/.$/g,"").replace(/^./g,"").replace(/\"+/g,'');
}

export function decodeData(functionSig:string, callData:string){
  
  if(functionSig === "UNKNOWN()"){
    return {
      decodedData: callData.slice(10),
      error: false
    }
  }

  try {
    const iface = new Interface(["function " + functionSig]);
    const decodedData = iface.decodeFunctionData(iface.fragments[0].name, callData)
    return {
      decodedData: modifyMatchedText(JSON.stringify(decodedData)),
      error: false
    }
  }catch(error){
      return {
          decodedData: "",
          error: true
      }
  }
}

export function extractProposalDetail(targets: string[], signatures: string[], calldatas: string[], values: string[] | any[]){
  let data:ProposalDetail[] = []
  for (let i = 0; i < targets.length; i++) {
    let signature = ''
    let calldata = ''
    
    if (signatures[i] === '') {
      const fourbyte = calldatas[i].slice(0, 10)
      const sig = FOUR_BYTES_DIR[fourbyte] ?? 'UNKNOWN()'
      signature = sig
      if (!sig) throw new Error('Missing four byte sig')
      //calldata = `0x${calldatas[i].slice(10)}`
      calldata = calldatas[i]
    }else{
      signature = signatures[i]
      calldata = calldatas[i]
    }
      data.push({target: targets[i],functionSig: signature, callData: calldata, value: JSBI.BigInt(values[i].toString())})
    }
  return data
}

export default function Governance() {
    return (
        <Routes>
          <Route path="/" element={<Proposals />} />
          <Route path=":id" element={<VotePage />} />
          <Route path="create-proposal" element={<CreateProposal />} />
        </Routes>
      )
}