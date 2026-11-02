(() => {
  "use strict";
  const groups = [
    {title:"Funding & Capital Partners",items:[
      ["Private Money Exchange","https://privatemoneyexchange.com/aff-page/richman/","Affiliate"],["7 Figures Credit","https://www.7figurescredit.com/?a_aid=ROLFunding","Affiliate"],["MyPartner · Business Financing","https://go.mypartner.io/business-financing/?ref=001Qk00000MkqgTIAR","Partner"],["Americas Funding Experts","https://my.americasfundingexperts.com/?id=1820217000190862001","Partner"],["GetYourBizLoan · LP1","https://getyourbizloan.io/lp1?pu=recqKxJNkvD70xMqi","Affiliate"],["GetYourBizLoan · LP2","https://getyourbizloan.io/lp2?pu=recqKxJNkvD70xMqi","Affiliate"],["BLN Portal","https://rootoflyfe.blnsoftware.com/","Partner portal"],["Root Holdings Funding","https://rootholdingsgetfund.rfsitebuilder.com/","Funding"],["MyPartner · Business Financing (Español)","https://go.mypartner.io/business-financing/?ref=001Qk00000MkqgTIAR&lang=es","Partner"],["MyPartner · Referral Partner","https://go.mypartner.io/referral-partner/?ref=001Qk00000MkqgTIAR","Partner"],["MyPartner · Socio de Referidos","https://go.mypartner.io/referral-partner/?ref=001Qk00000MkqgTIAR&lang=es","Partner"],["DDT Wealth · Underwriter Resource","https://ddtwealth.com/","Resource"],["National Corporate Credit","https://nationalcorporatecredit.com/","Partner"],["Kiavi Broker Portal","https://app.kiavi.com/my/loans/origination","Broker portal"],["COGO Capital","https://www.cogocapital.com/","Lender portal"],["COGO Application","https://www.borrowersviewcentral.com/portal/applynew?id=LCS","Application"]
    ]},
    {title:"Credit Monitoring, Building & Repair",items:[
      ["CreditScoreIQ","https://www.creditscoreiq.com/lander/bus?offercode=435404PA","Affiliate"],["MyScoreIQ · NZ","https://www.myscoreiq.com/get-fico-preferred.aspx?offercode=432142NZ","Affiliate"],["MyScoreIQ · NY","https://www.myscoreiq.com/get-fico-preferred.aspx?offercode=432142NY","Affiliate"],["MyScoreIQ · Additional","https://www.myscoreiq.com/get-fico-preferred.aspx?offercode=4321396B","Affiliate"],["IdentityIQ","https://www.identityiq.com/sc-securepreferred.aspx?offercode=431297MR","Affiliate"],["IdentityIQ · Member","https://member.identityiq.com/sc-securepreferred.aspx?offercode=431297MR","Affiliate"],["CreditBuilderIQ · WT","https://www.creditbuilderiq.com/lander/bus?offercode=437502WT","Affiliate"],["CreditBuilderIQ · J7","https://www.creditbuilderiq.com/lander/bus?offercode=437502J7","Affiliate"],["ASAP Credit Repair","https://funnel.asapcreditrepairusa.com/fast-results?affId=RichardsonLegagneur28158","Affiliate"],["Self Credit Builder","https://www.self.inc/","Credit building"]
    ]},
    {title:"Credit Cards & Credit-Building Products",items:[
      ["OpenSky","https://www.openskycc.com/","Card"],["Tomo Credit","https://www.tomocredit.com/","Card"],["Zolve","https://www.zolve.com/","Card"],["Grow Credit","https://www.growcredit.com/","Credit building"],["Discover Secured","https://www.discover.com/credit-cards/secured/","Card"],["Capital One Secured","https://www.capitalone.com/credit-cards/quicksilver-secured/","Card"]
    ]},
    {title:"RO’Lyfe Business & Document Tools",items:[
      ["Book a Call / Strategy Session","https://richman-rootoflyfe.zohobookings.com/#/4699692000000050014","Booking"],["Contract & Document Hub","https://rolrichman.github.io/rolyfe-contract-documents-hub/","RO’Lyfe"],["Deal / Contract Access","https://workdrive.zohoexternal.com/file/6zzgj6f913100497440d1b6166dfc729a61a4","RO’Lyfe"],["Writer Access","https://workdrive.zohopublic.com/writer/open/l7x0hdd90d494415d44698cf35f472437b7a1","RO’Lyfe"],["Quick Docs Upload","https://form.jotform.com/253154859148062","RO’Lyfe"],["Jamal AI","https://agent.jotform.com/019bdd1fe57172838101dccf3612b1e9e787","RO’Lyfe"],["RO’Lyfe Closers OS","https://rolrichman.github.io/RO-Lyfe-Closers-OS/","RO’Lyfe"],["DealForge OS","https://rolrichman.github.io/DealForge-OS/","RO’Lyfe"],["Buyer Network OS","https://rolrichman.github.io/RO-Lyfe-Buyer-Network-OS/","RO’Lyfe"],["Acquisition Engine","https://rolrichman.github.io/rolyfe-acquisition-engine/","RO’Lyfe"],["Overage Calculator","https://rolrichman.github.io/ROLyfe-Overage-Calculator/","RO’Lyfe"]
    ]},
    {title:"Property & Research Resources",items:[
      ["Philadelphia Property Search","https://property.phila.gov/","Public record"],["Philadelphia OPA Search","https://opainquiry.phila.gov/","Public record"],["PropertyChecker · Pennsylvania","https://pennsylvania.propertychecker.com/","Research"],["USDA Eligibility","https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do?pageAction=sfp","Eligibility"],["Property Research Intelligence","https://rolrichman.github.io/rolyfe-property-research-intelligence/","RO’Lyfe"],["Relocation Intelligence","https://rolrichman.github.io/rolyfe-relocation-intelligence/","RO’Lyfe"],["Vision Hub","https://rolrichman.github.io/rolyfe-video-hub/","RO’Lyfe"]
    ]}
  ];
  document.querySelectorAll("[data-rol-links-menu]").forEach(host => {
    if (host.dataset.ready === "true") return;
    groups.forEach(group => {
      const section = document.createElement("section"); section.className = "rol-link-group";
      const heading = document.createElement("h4"); heading.textContent = group.title;
      const grid = document.createElement("div"); grid.className = "rol-link-grid";
      group.items.forEach(([label, href, tag]) => {
        const a = document.createElement("a"); a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = label;
        const badge = document.createElement("span"); badge.className = "rol-link-tag"; badge.textContent = tag; a.appendChild(badge); grid.appendChild(a);
      });
      section.append(heading, grid); host.appendChild(section);
    });
    const note = document.createElement("p"); note.className = "rol-link-disclosure";
    note.textContent = "Some partner and affiliate links may provide compensation to RO’Lyfe. Review each provider’s current eligibility, terms, pricing, and disclosures before applying.";
    host.appendChild(note); host.dataset.ready = "true";
  });
})();