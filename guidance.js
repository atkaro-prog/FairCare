// "Get your actual number": routes each coverage type to the tool that can give a personal cost.
// Every claim here should match a federal or New York rule; keep links to stable official pages.
export const COVERAGE=[
 {value:'unsure',label:"I'm not sure"},
 {value:'private',label:'Insurance through work or the marketplace'},
 {value:'medicare',label:'Original Medicare'},
 {value:'advantage',label:'Medicare Advantage plan'},
 {value:'medicaid',label:'Medicaid or a Medicaid managed care plan'},
 {value:'self',label:'No insurance, or paying myself'}
];
const NO_SURPRISES={label:'Your rights under the No Surprises Act (CMS)',url:'https://www.cms.gov/nosurprises'};
const MEDICARE_LOOKUP={label:'Medicare Procedure Price Lookup',url:'https://www.medicare.gov/procedure-price-lookup/'};
const FAIR_HEALTH={label:'FAIR Health Consumer cost lookup',url:'https://www.fairhealthconsumer.org/'};
const GUIDES={
 private:{title:"Use your insurer's cost estimator",lead:'Most job-based and marketplace plans must offer an online tool that estimates your own cost for a covered service, based on your plan and how much of your deductible you have used.',steps:[
  {text:'Log in to your insurer’s member website or app and look for "cost estimator", "estimate costs" or "find care". Search for this procedure at this exact location. If you can’t find it, call the member services number on your card; the plan must also give the estimate by phone or on paper if you ask.'},
  {text:'Check whether the estimate includes a separate facility charge. If the location bills as a hospital outpatient department, your cost-sharing for that charge can be different from an office visit.'},
  {text:'Confirm that every billing entity (facility, doctor, imaging reading, anesthesia) is in-network for your plan. The No Surprises Act protects you from many, but not all, out-of-network bills.',link:NO_SURPRISES}
 ],caution:'Grandfathered plans and short-term plans may not have to offer this tool.'},
 medicare:{title:'Compare hospital and surgery-center costs in Medicare’s tool',lead:'With Original Medicare, a service done in a hospital outpatient department usually means paying coinsurance on both the doctor’s bill and the hospital’s facility bill.',steps:[
  {text:'Look up the procedure in Medicare’s Procedure Price Lookup. It shows national average amounts you would pay in a hospital outpatient department versus an ambulatory surgical center.',link:MEDICARE_LOOKUP},
  {text:'Ask the provider whether this appointment will be billed as hospital outpatient (two bills) or as a physician office (one bill).'},
  {text:'If you have a Medigap or retiree plan, ask it how much of the coinsurance it covers.'}
 ],caution:'Medicare’s tool shows national averages, not this location’s exact amount.'},
 advantage:{title:'Ask your Medicare Advantage plan directly',lead:'Medicare Advantage plans set their own copays and coinsurance, and the federal insurer price-tool rule does not cover them.',steps:[
  {text:'Call member services (number on your card) or check the plan’s website for a cost estimator. Ask what you would pay for this procedure at this location, including any facility charge.'},
  {text:'Ask whether this service needs prior authorization and whether the location and every billing entity are in the plan’s network.'},
  {text:'For a sense of the difference between hospital outpatient and surgery-center settings, Medicare’s Procedure Price Lookup can help, though your plan’s amounts may differ.',link:MEDICARE_LOOKUP}
 ]},
 medicaid:{title:'Confirm the provider accepts your Medicaid plan',lead:'Medicaid out-of-pocket costs are usually small or nothing. The bigger risk is seeing a provider that does not accept your plan.',steps:[
  {text:'Before scheduling, ask the provider whether it accepts New York Medicaid or your specific Medicaid managed care plan, by plan name.'},
  {text:'Call your plan (number on your card) to confirm the location is in network and whether the service needs prior authorization.'},
  {text:'If you receive a bill, call your plan before paying it.'}
 ]},
 self:{title:'Ask for a written Good Faith Estimate',lead:'If you have no insurance or choose not to use it, providers must give you a written Good Faith Estimate of expected charges.',steps:[
  {text:'Ask for the Good Faith Estimate when you schedule. If you book at least 3 business days ahead, the provider must send it to you; you can also ask for one before scheduling.',link:NO_SURPRISES},
  {text:'Keep the estimate. If a provider’s final bill is $400 or more above its estimate, you can start a federal dispute within 120 days of receiving the bill.'},
  {text:'Ask for the self-pay or cash price, and ask the hospital for its financial assistance application. New York hospitals must have a financial assistance policy.'},
  {text:'For a typical price range in your area, check FAIR Health Consumer. It is an area estimate, not this provider’s price.',link:FAIR_HEALTH}
 ]},
 unsure:{title:'Find out how you will pay, then get a personal estimate',lead:'The right tool depends on your coverage. Check your insurance card, or ask the provider which plan they have on file for you.',steps:[
  {text:'With job-based or marketplace insurance, use your insurer’s online cost estimator or call member services.'},
  {text:'With Original Medicare, compare hospital outpatient and surgery-center costs in Medicare’s Procedure Price Lookup.',link:MEDICARE_LOOKUP},
  {text:'With no insurance, ask the provider for a written Good Faith Estimate.',link:NO_SURPRISES}
 ]}
};
export function guidanceFor(coverage){return GUIDES[coverage]||GUIDES.unsure}
export function scriptAsk(coverage){
 return coverage==='self'?'(5) the self-pay price and whether a financial assistance policy applies, and (6) a written Good Faith Estimate?'
  :coverage==='medicaid'?'(5) whether this location and every billing entity accept my Medicaid plan, and (6) a complete written estimate?'
  :'(5) whether each billing entity is in-network for my specific plan, and (6) a complete written estimate?';
}
