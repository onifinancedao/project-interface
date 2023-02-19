import { Trans } from '@lingui/macro'
import JSBI from 'jsbi'
import React from 'react'

import { useMaxTotalSupply, useStartMinting } from '../../state/mint/hooks'
import { useUserLocale, useUserTheme } from '../../state/user/hooks'
import './index.css'
function AccordionItem({id, parent, title, children}:{id: string, parent: string, title?: React.ReactNode, children?: React.ReactNode}){
    const theme = useUserTheme()
    return(
        <div className={"accordion-themed-item "  + theme}>
            <h2 className={"accordion-themed-header "  + theme} id={"heading" + id}>
                <button className={"accordion-themed-button collapsed "  + theme} type="button" data-bs-toggle="collapse" data-bs-target={"#collapse"+id} aria-expanded="false" aria-controls={"collapse"+id}>
                    <h6 className='fw-semibold'>{title}</h6>
                </button>
            </h2>
            <div id={"collapse"+id} className={"accordion-themed-collapse collapse "  + theme} aria-labelledby={"heading"+id} data-bs-parent={"#"+parent}>
                <div className={"accordion-themed-body "  + theme}>
                    {children}
                </div>
            </div>
        </div>
    )
}
export default function Faq() {
    const theme = useUserTheme()
    const startMinting = useStartMinting()
    const maxTotalSupply = useMaxTotalSupply()
    const locale = useUserLocale()
    return (
        <div className='row pb-4'>
            <div className='col-12 mb-2'>
                <h3 className='fw-semibold'><Trans>FAQs</Trans></h3>
            </div>
            <div className='col-12 my-2 px-4'>
                <div className='col-12 my-4'>
                    <h5 className='fw-semibold'><Trans>Onifinance Project</Trans></h5>
                </div>
                <div className={"accordion-themed "  + theme} id="accordionOnifinanceProject">
                    <AccordionItem id='q7nh' parent='accordionOnifinanceProject' 
                        title={<Trans>What is the Onifinance Project?</Trans>}
                    >
                        <p>
                            <Trans>The Onifinance Project is an initiative aimed at creating and launching the Onifinance DAO. To achieve this, the project allows users to mint OFP tokens in exchange for USDC tokens, each of which entitles them to one vote in the project's governance system. A total of 20000 OFP tokens will be allowed to be minted, and once minted, seven decentralized raffles will take place, each with different USDC token prizes. There will also be a community raffle on Twitter with 50 prizes of 1000 USDC tokens each. Users will be able to claim OFI tokens in exchange for their OFP tokens 60 days after the launch of the Onifinance DAO, and in case of emergency, the project has a mechanism to distribute the OFP contract balance among holders in exchange for their OFP tokens.</Trans>
                        </p>    
                    </AccordionItem>
                    <AccordionItem id='qthhjrt' parent='accordionOnifinanceProject' 
                        title={<Trans>What are OFP tokens and what is their utility?</Trans>}
                    >
                        <p><Trans>The OFP (Onifinance Project) tokens are a non-fungible or NFT token type created as part of the Onifinance Project. Their main utility is to serve as a means to participate in the Onifinance Project governance system and obtain OFI tokens. OFP token holders can exchange them for OFI tokens once the Onifinance DAO has been launched.</Trans></p>
                        <p><Trans>Additionally, OFP tokens can also be used to participate in decentralized raffles where USDC tokens will be distributed. In case of emergency, OFP tokens can also be used to obtain a portion of the OFP contract balance through a distribution mechanism activated by the governance system.</Trans></p>
                        <p><Trans>In summary, OFP tokens allow their holders to participate in the building of the Onifinance DAO through the Onifinance Project governance system, and once the construction of the Onifinance DAO is complete, to obtain OFI tokens. They can also be used to obtain USDC tokens through raffles and to receive a portion of the OFP contract balance in case of emergency.</Trans></p>
                    
                    </AccordionItem>
                    <AccordionItem id='qbvbnmgw' parent='accordionOnifinanceProject' 
                        title={<Trans>How much will it cost to mint OFP tokens?</Trans>}
                    >
                        <p><Trans>Minting 1 OFP token will cost 100 USDC tokens plus the transaction fee.</Trans></p>    
                    </AccordionItem>
                    <AccordionItem id='qfsglo' parent='accordionOnifinanceProject' 
                        title={<Trans>How many OFP tokens can be minted?</Trans>}
                    >
                        <p><Trans>It will be allowed to mint a total of {maxTotalSupply?.toLocaleString()} OFP tokens and each user will be able to mint a maximum of 20 OFP tokens per transaction.</Trans></p>  
                    </AccordionItem>
                    <AccordionItem id='qmfvkdd' parent='accordionOnifinanceProject' 
                        title={<Trans>When does the minting of OFP tokens begin and end?</Trans>}
                    >
                        <p>
                            <Trans>Minting begins on { startMinting?new Date(JSBI.toNumber(startMinting) * 1000).toLocaleDateString(locale??"en-EN", { year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', hour12:true, minute:'numeric' }) + " " + Intl.DateTimeFormat().resolvedOptions().timeZone:""} and ends once token number {maxTotalSupply?.toLocaleString()} is minted.</Trans>
                        </p>    
                    </AccordionItem>
                    <AccordionItem id='qdfkdgff' parent='accordionOnifinanceProject' 
                        title={<Trans>What are random seeds, how are they obtained and how are they used?</Trans>}
                    >
                        <p><Trans>Random seeds are randomly generated sequences of numbers or characters that are used to create random results or to ensure randomness in certain processes. These seeds can be obtained in different ways, such as through specialized physical devices that generate random numbers or through software that uses algorithms to generate random numbers.</Trans></p>
                        <p><Trans>In the Onifinance Project, 7 random seeds generated by <a className='text-reset' href='https://docs.chain.link/vrf/v2/introduction' target='_blank' rel="noopener noreferrer">Chainlink VRF</a> will be used as a basis for selecting the winning OFP token IDs in each decentralized draw. This ensures that the winner selection process is fair and transparent.</Trans></p>    
                    </AccordionItem>
                    <AccordionItem id='qfdgfdmpa' parent='accordionOnifinanceProject' 
                        title={<Trans>How and when will the raffles be held?</Trans>}
                    >
                        <p><Trans>In the Onifinance Project, seven decentralized raffles will be held once {maxTotalSupply?.toLocaleString()} OFP tokens have been minted. These raffles will be conducted using random numbers generated with <a className='text-reset' href='https://docs.chain.link/vrf/v2/introduction' target='_blank' rel="noopener noreferrer " >Chainlink VRF</a> as a seed to select the IDs of the winning OFP tokens. Each raffle will have a certain number of winners and prizes in USDC tokens.</Trans></p>
                        <p><Trans>The raffles will be conducted as follows:</Trans></p> 
                        <p><Trans>The first decentralized raffle will have one winner, and the prize will be 100000 USDC tokens.</Trans></p> 
                        <p><Trans>The second decentralized raffle will have four winners of 50000 USDC tokens each.</Trans></p> 
                        <p><Trans>The third decentralized raffle will have 30 winners of 10000 USDC tokens each.</Trans></p>  
                        <p><Trans>The fourth decentralized raffle will have 200 winners of 2000 USDC tokens each.</Trans></p> 
                        <p><Trans>The fifth decentralized raffle will have 200 winners of 200 USDC tokens each.</Trans></p> 
                        <p><Trans>The sixth decentralized raffle will have 200 winners of 100 USDC tokens each.</Trans></p> 
                        <p><Trans>The seventh decentralized raffle will have 200 winners of 50 USDC tokens each.</Trans></p> 
                        <p><Trans>There will also be a community raffle on Twitter with 50 prizes of 1000 USDC tokens each. To participate, users must follow <a className='text-reset' href="https://twitter.com/OnifinanceDao" target='_blank' rel='noopener noreferrer'>Onifinance's</a> official Twitter account and retweet a tweet specified by the account. The delivery of such prizes must be approved by the community using the governance system of the Onifinance Project.</Trans></p> 
                    </AccordionItem>
                    <AccordionItem id='sdfasdsre' parent='accordionOnifinanceProject' 
                        title={<Trans>What resources will be under the control of Onifinance Project's governance system to create Onifinance DAO?</Trans>}
                    >
                        <p><Trans>The Onifinance Project will have available for funding the creation, auditing, launch, and initial liquidity of the Onifinance DAO:</Trans></p>   
                        <p><Trans>800000 USDC tokens, 850 million OFI tokens (85% of the initial supply), and the ability to create new OFI tokens.</Trans></p>
                        
                    </AccordionItem>
                    <AccordionItem id='lassddv' parent='accordionOnifinanceProject' 
                        title={<Trans>When does the construction of Onifinance DAO begin?</Trans>}
                    >
                        <p><Trans>The construction of the Onifinance DAO will begin immediately after the execution and delivery of the community raffle prizes.</Trans></p>   
                    </AccordionItem>
                    <AccordionItem id='pasdsdeererty' parent='accordionOnifinanceProject' 
                        title={<Trans>How and when can OFP tokens be exchanged for OFI tokens?</Trans>}
                    >
                        <p><Trans>OFP tokens can be exchanged for OFI tokens 60 days after the Onifinance DAO has been launched, the exchange of OFP tokens for OFI tokens can be done in the <a className='text-reset' href='#/exchange'>"Exchange"</a> option that will appear in the navigation bar of the Onifinance Project interface.</Trans></p>    
                    </AccordionItem>
                    <AccordionItem id='fesassvx' parent='accordionOnifinanceProject' 
                        title={<Trans>How many OFI tokens will be obtained for each OFP token?</Trans>}
                    >
                        <p><Trans>Each OFP token can be exchanged for 5000 OFI tokens.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='23dsfsdrd' parent='accordionOnifinanceProject' 
                        title={<Trans>How to get votes in the Onifinance Project governance system?</Trans>}
                    >
                        <p><Trans>The votes in the governance system of the Onifinance Project are obtained by owning OFP tokens and self-delegating them, or having someone with OFP tokens delegate their votes to you.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='dsferyyryyes' parent='accordionOnifinanceProject' 
                        title={<Trans>How many votes are required to start a proposal?</Trans>}
                    >
                        <p><Trans>A minimum of 10 votes is required to start a proposal.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='wettut8765432w' parent='accordionOnifinanceProject' 
                        title={<Trans>How many votes are required for a proposal to be successful?</Trans>}
                    >
                        <p><Trans>A minimum of 800 votes is required and there must be more votes for than against.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='hackuz98' parent='accordionOnifinanceProject' 
                        title={<Trans>Who is the developer of the Onifinance Project (Hacku)?</Trans>}
                    >
                        <p><Trans>The developer of the Onifinance Project prefers to remain anonymous and would be willing to reveal their true identity if necessary. Although the true identity of the developer may not be as important, what really matters is the transparency and reliability of the project. The project's source code is the true proof of its quality and reliability.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='hackuz98reward' parent='accordionOnifinanceProject' 
                        title={<Trans>How much does the developer of the Onifinance Project earn?</Trans>}
                    >
                        <p><Trans>The Onifinance Project developer may claim the following rewards over time:</Trans></p>
                        <p><Trans>The first 10 OFP tokens are automatically delivered to the developer.</Trans></p> 
                        <p><Trans>1 USDC token for every OFP token minted.</Trans></p> 
                        <p><Trans>19000 USDC tokens in total will be distributed over a period of 6 months after the community raffle is completed.</Trans></p> 
                        <p><Trans>40000 USDC tokens, which can be claimed 60 days after the launch of Onifinance DAO.</Trans></p> 
                        <p><Trans>50 million OFI tokens that will be delivered over the course of 5 years and its delivery will start 60 days after the launch of the Onifinance DAO.</Trans></p>
                    </AccordionItem>
                </div>
            </div>

            <div className='col-12 my-2 px-4'>
                <div className='col-12 my-4'>
                    <h5 className='fw-semibold'><Trans>Onifinance DAO</Trans></h5>
                </div>
                <div className={"accordion-themed "  + theme} id="accordionOnifinanceDAO">
                    <AccordionItem id='54gfdfdsa' parent='accordionOnifinanceDAO' 
                        title={<Trans>What is the Onifinance DAO?</Trans>}
                    >
                        <p><Trans>The Onifinance DAO will be a decentralized autonomous organization (DAO) governed by a decentralized governance system. It will consist of three main elements:</Trans></p>
                        <p><Trans>The OFI token, which will be used as the utility token of the Onifinance DAO.</Trans></p>
                        <p><Trans>An Automated Market Maker (AMM) that will feature liquidity mining for the first three months in some selected token pairs.</Trans></p>
                        <p><Trans>The Onifinance Dollar (OFD) will be a stablecoin pegged to the US dollar.</Trans></p>
                        <p><Trans>In addition, shortly after its launch, the Onifinance DAO will introduce the Onifinance Name System, which will be a naming system that will allow users to purchase .ofi domains in exchange for OFD tokens.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='56731cxvxvgfrd' parent='accordionOnifinanceDAO' 
                        title={<Trans>What is a Decentralized Autonomous Organization (DAO)?</Trans>}
                    >
                        <p><Trans>A DAO is a decentralized organization based on blockchain technology that allows its participants to make collective decisions through a voting system. Instead of having a traditional hierarchical structure with centralized authority, a DAO relies on the participation of its members to make decisions about how the organization's resources should be used. DAOs often use tokens to represent ownership and vote on organizational decisions. In the case of Onifinance DAO, OFI tokens will give the right to vote in the organization's governance system.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='dsgsdfsa5422' parent='accordionOnifinanceDAO' 
                        title={<Trans>What is the OFI token and how useful is it?</Trans>}
                    >
                        <p><Trans>The OFI token (Onifinance) is an ERC20 token created to participate in the Onifinance DAO governance system, each OFI token will represent 1 vote in the Onifinance DAO governance system.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='fnjsfosuqwdzschz' parent='accordionOnifinanceDAO' 
                        title={<Trans>What will be the price of each OFI token?</Trans>}
                    >
                        <p><Trans>The OFI token will have an initial price of 0.7 USDC for each OFI. The price will be subject to supply and demand.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='xzcxaws23411' parent='accordionOnifinanceDAO' 
                        title={<Trans>How many OFI tokens will exist and how will they be distributed?</Trans>}
                    >
                        <p><Trans>The initial amount is one billion OFI tokens and it will be distributed as follows:</Trans></p>
                        <p><Trans>650 million to be distributed through the Liquidity Mining system (65% of the initial supply).</Trans></p>
                        <p><Trans>100 million to be exchanged for OFP tokens.</Trans></p>
                        <p><Trans>100 million for the treasury of Onifinance DAO.</Trans></p>
                        <p><Trans>50 million for the Airdrop.</Trans></p>
                        <p><Trans>50 million for the developer of the Onifinance Project (hacku).</Trans></p>
                        <p><Trans>50 million for the staff who contribute significantly to the creation and implementation of the Onifinance DAO, excluding the developer of the Onifinance Project (hacku).</Trans></p>
                        <p><Trans>Additionally, the community will be able to mint, through the Onifinance DAO governance system, no more than 4% of the total supply once a year.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='45csf34fvaS' parent='accordionOnifinanceDAO' 
                        title={<Trans>When will Onifinance DAO be launched?</Trans>}
                    >
                        <p><Trans>Once the smart contracts of the Onifinance DAO are completed, they must be audited by a professional company specializing in smart contract auditing. If the results of the audit are positive, the launch will proceed. Otherwise, recommended corrections will be made and the launch will proceed.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='04dasaes1' parent='accordionOnifinanceDAO' 
                        title={<Trans>What is liquidity mining and which pairs will participate?</Trans>}
                    >
                        <p><Trans>Liquidity mining is a technique that will allow users to earn a reward in OFI tokens for providing liquidity during the first 90 days on some Automated Market Maker (AMM) pairs.</Trans></p>
                        <p><Trans>There will be a total of 6 pairs participating in the liquidity mining program.</Trans></p>
                        <p><Trans>1 OFI/USDC</Trans></p>
                        <p><Trans>2 WETH/USDC</Trans></p>
                        <p><Trans>3 USDT/USDC</Trans></p>
                        <p><Trans>4 WMATIC/USDC</Trans></p>
                        <p><Trans>5 WBTC/USDC</Trans></p>
                        <p><Trans>6 DAI/USDC</Trans></p>
                        <p><Trans>In total, 650 million OFI tokens (65% of the initial supply) will be distributed in the liquidity mining program.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='hz98dsfnasasdX' parent='accordionOnifinanceDAO' 
                        title={<Trans>What is the Airdrop and how many OFI tokens will be distributed?</Trans>}
                    >
                        <p><Trans>The Airdrop will consist of the free distribution of 50 million OFI tokens (5% of the initial supply) to all users who meet the requirements or conditions that the community decides in the governance system.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='hackuz9883428428rfcx' parent='accordionOnifinanceDAO' 
                        title={<Trans>What is Onifinace Dollar?</Trans>}
                    >
                        <p><Trans>Onifinance Dollar (OFD) will be a stablecoin pegged to the US dollar, backed by several different assets and over-collateralized to ensure its stability. <a className='text-reset' target='_blank' rel="noopener noreferrer" href="https://data.chain.link/">Chainlink Data Feeds</a> will be used to maintain the price of the OFD token pegged to the US dollar.</Trans></p>
                        <p><Trans>Onifinance Dollar (OFD) will allow any token that has liquidity in the Automated Market Maker to be exchanged (AMM) for OFD tokens and will be controlled by the governance system of the Onifinance DAO.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='dyfdhsde8382311' parent='accordionOnifinanceDAO' 
                        title={<Trans>What is Onifinance Name system?</Trans>}
                    >
                        <p><Trans>Onifinance Name System will be a service that will allow users to register decentralized .ofi domain names in exchange for any token that has liquidity in the Automated Market Maker, and the initial price for each domain will be 1 OFD token per year. During the first 6 months, the free registration of 1 .ofi domain per address will be allowed, excluding contract addresses.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='4321sdcvcnfgtyhtyjc' parent='accordionOnifinanceDAO' 
                        title={<Trans>What networks will Onifinance DAO work on?</Trans>}
                    >
                        <p><Trans>The Onifinance DAO will initially run on the Polygon network and may expand to other networks such as Ethereum, Binance Smart Chain, Arbitrum, etc. in the future, as required by the community.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='3gasd3ecdscsxazzaxx' parent='accordionOnifinanceDAO' 
                        title={<Trans>What other stablecoins will Onifinance DAO have?</Trans>}
                    >
                        <p><Trans>Onifinance DAO will start with Onifinance Dollar and in the future new stablecoins may be created at the request of the community through the governance system such as: Onifinance Gold (OFG), Onifinance Euro (OFE), Onifinance Silver (OFS), etc.</Trans></p>
                    </AccordionItem>
                    <AccordionItem id='rsdcswewq1259pil' parent='accordionOnifinanceDAO' 
                        title={<Trans>What reward will the creators of Onifinance DAO receive?</Trans>}
                    >
                        <p><Trans>In total, 50 million OFI tokens will be distributed among the staff who significantly contribute to the creation and implementation of the Onifinance DAO.</Trans></p>
                        <p><Trans>The mentioned reward will be delivered over the course of 5 years, and the developer of the Onifinance Project (Hacku) is excluded from it.</Trans></p>
                    </AccordionItem>
                </div>
                <div className='col-12 my-4'>
                    <h5 className='fw-semibold'><Trans>Important</Trans></h5>
                    <p className='mx-2'><Trans>The construction and implementation of the Onifinance DAO will be the responsibility of the community and will be open to changes proposed by the community in the governance system of the Onifinance Project. If the community decides it is necessary, all or some aspects of the Onifinance DAO can be modified to adapt to the needs and preferences of the community.</Trans></p>
                </div>
            </div>
        </div>
    )
}