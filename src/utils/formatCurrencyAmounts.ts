import JSBI from 'jsbi'
import { utils } from "ethers";
import { isNumber } from '.';

export function formatCurrencyAmount(amount: JSBI | undefined , currency_decimals: number, expected_decimals:number) {
  if (!amount) {
    return '-'
  }

  if(currency_decimals < expected_decimals){
    return 'error'
  }

  if (JSBI.equal(amount, JSBI.BigInt(0))) {
    return '0'
  }

  if (JSBI.lessThan(amount, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency_decimals - expected_decimals)))){
    return '<' + utils.formatUnits(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency_decimals - expected_decimals)).toString(), currency_decimals);
  }
  const formated = utils.formatUnits(JSBI.subtract(amount, JSBI.remainder(amount, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency_decimals - expected_decimals)))).toString(), currency_decimals);
  if(formated.substring(formated.length-2, formated.length) === ".0"){
    return formated.substring(0, formated.length-2);
  }
  return formated;
  
}
export function parseAmount(amount: string | undefined , currency_decimals: number){
  if (!amount) {
    return '0'
  }
  if (amount === "0") {
    return '0'
  }
  if(isNumber(amount)){
    const parsed = utils.parseUnits(amount, currency_decimals).toString();//Fix it
    return parsed
  }
  
  return '0'
  
}