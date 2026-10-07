// One-time clean workspace migration. Back up only WMS business keys before reset.
(()=>{const marker='bomb-wms-clean-workspace-v1',backup='bomb-wms-clean-backup-v1';try{if(localStorage.getItem(marker))return;const keys=['bomb-wms-generic-workspace-v1','bomb-wms-integrated-workspace-v1','bomb-wms-prototype-created-records'];const saved=Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)]));localStorage.setItem(backup,JSON.stringify({savedAt:new Date().toISOString(),data:saved}));localStorage.setItem(keys[0],JSON.stringify({sites:[],zones:[],locations:[],items:[],requests:[],logs:[]}));localStorage.setItem(keys[1],JSON.stringify({records:[],field:[],logs:[],seeded:true}));localStorage.setItem(keys[2],'[]');localStorage.setItem(marker,'1');}catch(e){console.error('WMS 清空未完成；請確認瀏覽器儲存空間。');}})();
const dashboardPage=document.getElementById('dashboardPage');
const inventoryPage=document.getElementById('inventoryPage');
const purchasePage=document.getElementById('purchasePage');
const assetPage=document.getElementById('assetPage');
const stocktakePage=document.getElementById('stocktakePage');
const morePage=document.getElementById('morePage');

function showPage(page){

  dashboardPage.classList.toggle(
    'hidden',
    page!=='dashboard'
  );

  inventoryPage.classList.toggle(
    'active',
    page==='inventory'
  );

  purchasePage.classList.toggle(
    'active',
    page==='purchase'
  );

  assetPage.classList.toggle(
    'active',
    page==='asset'
  );

  stocktakePage.classList.toggle(
    'active',
    page==='stocktake'
  );

  morePage.classList.toggle(
    'active',
    page==='more'
  );

}

document.querySelectorAll('.nav-btn').forEach(btn=>{

  btn.addEventListener('click',()=>{

    document.querySelectorAll('.nav-btn').forEach(item=>{
      item.classList.remove('active');
    });

    btn.classList.add('active');

    const page=btn.dataset.page;

    if(page){
      showPage(page);
    }

  });

});

document.querySelectorAll('.mobile-bottom button').forEach(btn=>{

  btn.addEventListener('click',()=>{

    document.querySelectorAll('.mobile-bottom button').forEach(item=>{
      item.classList.remove('active');
    });

    btn.classList.add('active');

    const page=btn.dataset.mobile;

    if(page){
      showPage(page);
    }

  });

});

const inventoryTabs=
  document.querySelectorAll('[data-inventory-tab]');

const inventoryPanels=
  document.querySelectorAll('[data-inventory-panel]');

function showInventoryTab(name){

  inventoryTabs.forEach(tab=>{
    tab.classList.toggle(
      'active',
      tab.dataset.inventoryTab===name
    );
  });

  inventoryPanels.forEach(panel=>{
    panel.classList.toggle(
      'active',
      panel.dataset.inventoryPanel===name
    );
  });

}

inventoryTabs.forEach(tab=>{

  tab.addEventListener('click',()=>{

    showInventoryTab(
      tab.dataset.inventoryTab||'stock'
    );

  });

});

const inventoryWarehouseFilter=
  document.getElementById('inventoryWarehouseFilter');

const inventoryKeywordFilter=
  document.getElementById('inventoryKeywordFilter');

const inventoryStatusFilter=
  document.getElementById('inventoryStatusFilter');

const inventorySearchBtn=
  document.getElementById('inventorySearchBtn');

const inventoryTableBody=
  document.getElementById('inventoryTableBody');

const inventoryResultCount=
  document.getElementById('inventoryResultCount');

const inventoryExportBtn=
  document.getElementById('inventoryExportBtn');


function getInventoryRows(){
  if(!inventoryTableBody)return [];

  return [...inventoryTableBody.querySelectorAll('tr')]
    .filter(row=>row.id!=='inventoryEmptyRow');
}


function updateInventoryResultCount(count){
  if(inventoryResultCount){
    inventoryResultCount.textContent=`共 ${count} 筆`;
  }

  if(inventoryExportBtn){
    inventoryExportBtn.disabled=count===0;
  }
}


function filterInventoryTable(){

  if(!inventoryTableBody)return;

  const warehouse=
    String(inventoryWarehouseFilter?.value||'').trim();

  const keyword=
    String(inventoryKeywordFilter?.value||'')
      .trim()
      .toLowerCase();

  const status=
    String(inventoryStatusFilter?.value||'').trim();

  const rows=getInventoryRows();

  rows.forEach(row=>{

    const cells=row.querySelectorAll('td');

    if(cells.length<10)return;

    const itemNo=
      String(cells[0]?.textContent||'')
        .trim()
        .toLowerCase();

    const itemName=
      String(cells[1]?.textContent||'')
        .trim()
        .toLowerCase();

    const spec=
      String(cells[2]?.textContent||'')
        .trim()
        .toLowerCase();

    const rowWarehouse=
      String(cells[3]?.textContent||'').trim();

    const rowStatus=
      String(cells[8]?.textContent||'').trim();

    const matchWarehouse=
      !warehouse||rowWarehouse===warehouse;

    const matchStatus=
      !status||rowStatus===status;

    const matchKeyword=
      !keyword||
      itemNo.includes(keyword)||
      itemName.includes(keyword)||
      spec.includes(keyword);

    const matched=
      matchWarehouse&&matchStatus&&matchKeyword;

    row.style.display=
      matched?'':'none';

  });

  const visibleRows=
    rows.filter(row=>row.style.display!=='none');

  updateInventoryResultCount(visibleRows.length);

  let emptyRow=
    document.getElementById('inventoryEmptyRow');

  if(visibleRows.length===0){

    if(!emptyRow){

      emptyRow=document.createElement('tr');
      emptyRow.id='inventoryEmptyRow';

      emptyRow.innerHTML=`
        <td colspan="10" style="
          height:110px;
          text-align:center;
          color:#8a99ab;
          font-weight:700;
        ">
          查無符合條件的庫存資料
        </td>
      `;

      inventoryTableBody.appendChild(emptyRow);

    }

    emptyRow.style.display='';

  }else if(emptyRow){

    emptyRow.remove();

  }

}


inventorySearchBtn?.addEventListener(
  'click',
  filterInventoryTable
);


inventoryKeywordFilter?.addEventListener(
  'keydown',
  event=>{

    if(event.key==='Enter'){
      filterInventoryTable();
    }

  }
);


function csvCell(value){
  const text=String(value??'').replace(/\s+/g,' ').trim();
  return `"${text.replace(/"/g,'""')}"`;
}


function exportInventoryCsv(){
  const rows=getInventoryRows()
    .filter(row=>row.style.display!=='none');

  if(!rows.length)return;

  const headers=[
    '料號',
    '品名',
    '規格',
    '倉庫',
    '儲位',
    '現有量',
    '可用量',
    '單位',
    '狀態',
    '更新時間'
  ];

  const data=rows.map(row=>
    [...row.querySelectorAll('td')].map(cell=>
      cell.textContent
    )
  );

  const csv=[
    headers.map(csvCell).join(','),
    ...data.map(row=>row.map(csvCell).join(','))
  ].join('\r\n');

  const blob=new Blob(
    ['\ufeff'+csv],
    {type:'text/csv;charset=utf-8;'}
  );

  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  const date=new Date().toISOString().slice(0,10);

  link.href=url;
  link.download=`BOMB-WMS-庫存清單-${date}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}


inventoryExportBtn?.addEventListener(
  'click',
  exportInventoryCsv
);


updateInventoryResultCount(
  getInventoryRows().length
);



const purchaseTabs=
  document.querySelectorAll('[data-purchase-tab]');

const purchasePanels=
  document.querySelectorAll('[data-purchase-panel]');

function showPurchaseTab(name){

  purchaseTabs.forEach(tab=>{
    tab.classList.toggle(
      'active',
      tab.dataset.purchaseTab===name
    );
  });

  purchasePanels.forEach(panel=>{
    panel.classList.toggle(
      'active',
      panel.dataset.purchasePanel===name
    );
  });

}

purchaseTabs.forEach(tab=>{

  tab.addEventListener('click',()=>{

    showPurchaseTab(
      tab.dataset.purchaseTab||'request'
    );

  });

});


const purchaseWarehouseFilter=
  document.getElementById('purchaseWarehouseFilter');

const purchaseKeywordFilter=
  document.getElementById('purchaseKeywordFilter');

const purchaseStatusFilter=
  document.getElementById('purchaseStatusFilter');

const purchaseSearchBtn=
  document.getElementById('purchaseSearchBtn');

const purchaseResetBtn=
  document.getElementById('purchaseResetBtn');

const purchaseExportBtn=
  document.getElementById('purchaseExportBtn');

const purchaseRequestBody=
  document.getElementById('purchaseRequestBody');

const purchaseResultCount=
  document.getElementById('purchaseResultCount');

const purchaseNeedCount=
  document.getElementById('purchaseNeedCount');

const purchaseOrderedCount=
  document.getElementById('purchaseOrderedCount');


function getPurchaseRows(){
  if(!purchaseRequestBody)return [];

  return [...purchaseRequestBody.querySelectorAll('[data-purchase-row]')];
}


function setPurchaseStatus(row,status){

  if(!row)return;

  row.dataset.status=status;

  const statusCell=
    row.querySelector('[data-status-cell]');

  if(statusCell){

    let className='orange';

    if(status==='已叫貨'){
      className='blue';
    }else if(status==='無須叫貨'){
      className='green';
    }

    statusCell.innerHTML=
      `<span class="status ${className}">${status}</span>`;

  }

  const orderBtn=
    row.querySelector('[data-order-action]');

  const noOrderBtn=
    row.querySelector('[data-no-order-action]');

  if(orderBtn){
    orderBtn.disabled=status==='已叫貨';
    orderBtn.textContent=
      status==='已叫貨'
        ?'已叫貨'
        :'標記已叫貨';
  }

  if(noOrderBtn){
    noOrderBtn.disabled=status==='無須叫貨';
  }

  refreshPurchaseSummary();
  filterPurchaseTable();

}


function refreshPurchaseSummary(){

  const rows=getPurchaseRows();

  const needCount=
    rows.filter(
      row=>row.dataset.status==='待叫貨'
    ).length;

  const orderedCount=
    rows.filter(
      row=>row.dataset.status==='已叫貨'
    ).length;

  if(purchaseNeedCount){
    purchaseNeedCount.textContent=needCount;
  }

  if(purchaseOrderedCount){
    purchaseOrderedCount.textContent=orderedCount;
  }

}


function filterPurchaseTable(){

  const rows=getPurchaseRows();

  const warehouse=
    String(
      purchaseWarehouseFilter?.value||''
    ).trim();

  const keyword=
    String(
      purchaseKeywordFilter?.value||''
    )
      .trim()
      .toLowerCase();

  const status=
    String(
      purchaseStatusFilter?.value||''
    ).trim();

  let visibleCount=0;

  rows.forEach(row=>{

    const cells=
      row.querySelectorAll('td');

    const rowText=
      String(row.textContent||'')
        .toLowerCase();

    const rowWarehouse=
      String(row.dataset.warehouse||'');

    const rowStatus=
      String(row.dataset.status||'');

    const matched=
      (!warehouse||rowWarehouse===warehouse)&&
      (!status||rowStatus===status)&&
      (!keyword||rowText.includes(keyword));

    row.style.display=
      matched?'':'none';

    if(matched){
      visibleCount+=1;
    }

  });

  let emptyRow=
    document.getElementById('purchaseEmptyRow');

  if(visibleCount===0){

    if(!emptyRow){

      emptyRow=document.createElement('tr');
      emptyRow.id='purchaseEmptyRow';

      emptyRow.innerHTML=`
        <td colspan="11" class="purchase-empty">
          查無符合條件的採購需求
        </td>
      `;

      purchaseRequestBody?.appendChild(emptyRow);

    }

    emptyRow.style.display='';

  }else if(emptyRow){

    emptyRow.remove();

  }

  if(purchaseResultCount){
    purchaseResultCount.textContent=
      `共 ${visibleCount} 筆`;
  }

  if(purchaseExportBtn){
    purchaseExportBtn.disabled=
      visibleCount===0;
  }

}


purchaseSearchBtn?.addEventListener(
  'click',
  filterPurchaseTable
);


purchaseKeywordFilter?.addEventListener(
  'keydown',
  event=>{

    if(event.key==='Enter'){
      filterPurchaseTable();
    }

  }
);


purchaseResetBtn?.addEventListener(
  'click',
  ()=>{

    if(purchaseWarehouseFilter){
      purchaseWarehouseFilter.value='';
    }

    if(purchaseKeywordFilter){
      purchaseKeywordFilter.value='';
    }

    if(purchaseStatusFilter){
      purchaseStatusFilter.value='';
    }

    filterPurchaseTable();

  }
);


purchaseRequestBody?.addEventListener(
  'click',
  event=>{

    const button=
      event.target.closest(
        '[data-order-action],[data-no-order-action]'
      );

    if(!button||button.disabled)return;

    const row=
      button.closest('[data-purchase-row]');

    if(button.hasAttribute('data-order-action')){

      const qty=
        Number(
          row?.querySelector('.purchase-qty')?.value||0
        );

      if(qty<=0){
        alert('請先輸入大於 0 的叫貨數量');
        return;
      }

      setPurchaseStatus(
        row,
        '已叫貨'
      );

    }else{

      setPurchaseStatus(
        row,
        '無須叫貨'
      );

    }

  }
);


purchaseExportBtn?.addEventListener(
  'click',
  ()=>{

    const rows=
      getPurchaseRows()
        .filter(
          row=>row.style.display!=='none'
        );

    if(!rows.length)return;

    const header=[
      '需求單號',
      '品號',
      '品名',
      '倉庫',
      '現有量',
      '安全庫存',
      '建議叫貨',
      '叫貨數量',
      '狀態',
      '來源'
    ];

    const body=
      rows.map(row=>{

        const cells=
          row.querySelectorAll('td');

        return [
          cells[0]?.textContent,
          cells[1]?.textContent,
          cells[2]?.textContent,
          cells[3]?.textContent,
          cells[4]?.textContent,
          cells[5]?.textContent,
          cells[6]?.textContent,
          row.querySelector('.purchase-qty')?.value,
          row.dataset.status,
          cells[9]?.textContent
        ].map(value=>
          `"${String(value??'').trim().replaceAll('"','""')}"`
        ).join(',');

      });

    const csv=
      '\uFEFF'+
      [header.join(','),...body].join('\n');

    const blob=
      new Blob(
        [csv],
        {type:'text/csv;charset=utf-8;'}
      );

    const url=
      URL.createObjectURL(blob);

    const link=
      document.createElement('a');

    link.href=url;
    link.download=
      `BOMB-WMS-採購需求-${new Date().toISOString().slice(0,10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

  }
);


refreshPurchaseSummary();


const assetTabs=
  document.querySelectorAll('[data-asset-tab]');

const assetPanels=
  document.querySelectorAll('[data-asset-panel]');

function showAssetTab(name){

  assetTabs.forEach(tab=>{
    tab.classList.toggle(
      'active',
      tab.dataset.assetTab===name
    );
  });

  assetPanels.forEach(panel=>{
    panel.classList.toggle(
      'active',
      panel.dataset.assetPanel===name
    );
  });

}

assetTabs.forEach(tab=>{

  tab.addEventListener('click',()=>{

    showAssetTab(
      tab.dataset.assetTab||'list'
    );

  });

});


const assetLocationFilter=
  document.getElementById('assetLocationFilter');

const assetKeywordFilter=
  document.getElementById('assetKeywordFilter');

const assetStatusFilter=
  document.getElementById('assetStatusFilter');

const assetSearchBtn=
  document.getElementById('assetSearchBtn');

const assetResetBtn=
  document.getElementById('assetResetBtn');

const assetExportBtn=
  document.getElementById('assetExportBtn');

const assetTableBody=
  document.getElementById('assetTableBody');

const assetResultCount=
  document.getElementById('assetResultCount');


function getAssetRows(){

  if(!assetTableBody)return [];

  return [
    ...assetTableBody.querySelectorAll(
      '[data-asset-row]'
    )
  ];

}


function filterAssetTable(){

  const rows=getAssetRows();

  const location=
    String(
      assetLocationFilter?.value||''
    ).trim();

  const keyword=
    String(
      assetKeywordFilter?.value||''
    )
      .trim()
      .toLowerCase();

  const status=
    String(
      assetStatusFilter?.value||''
    ).trim();

  let visibleCount=0;

  rows.forEach(row=>{

    const rowText=
      String(row.textContent||'')
        .toLowerCase();

    const rowLocation=
      String(row.dataset.location||'');

    const rowStatus=
      String(row.dataset.status||'');

    const matched=
      (!location||rowLocation===location)&&
      (!status||rowStatus===status)&&
      (!keyword||rowText.includes(keyword));

    row.style.display=
      matched?'':'none';

    if(matched){
      visibleCount+=1;
    }

  });

  let emptyRow=
    document.getElementById('assetEmptyRow');

  if(visibleCount===0){

    if(!emptyRow){

      emptyRow=document.createElement('tr');
      emptyRow.id='assetEmptyRow';

      emptyRow.innerHTML=`
        <td colspan="9" class="asset-empty">
          查無符合條件的資產資料
        </td>
      `;

      assetTableBody?.appendChild(emptyRow);

    }

    emptyRow.style.display='';

  }else if(emptyRow){

    emptyRow.remove();

  }

  if(assetResultCount){
    assetResultCount.textContent=
      `共 ${visibleCount} 筆`;
  }

  if(assetExportBtn){
    assetExportBtn.disabled=
      visibleCount===0;
  }

}


assetSearchBtn?.addEventListener(
  'click',
  filterAssetTable
);


assetKeywordFilter?.addEventListener(
  'keydown',
  event=>{

    if(event.key==='Enter'){
      filterAssetTable();
    }

  }
);


assetResetBtn?.addEventListener(
  'click',
  ()=>{

    if(assetLocationFilter){
      assetLocationFilter.value='';
    }

    if(assetKeywordFilter){
      assetKeywordFilter.value='';
    }

    if(assetStatusFilter){
      assetStatusFilter.value='';
    }

    filterAssetTable();

  }
);


assetExportBtn?.addEventListener(
  'click',
  ()=>{

    const rows=
      getAssetRows().filter(
        row=>row.style.display!=='none'
      );

    if(!rows.length)return;

    const header=[
      '資產編號',
      '資產名稱',
      '類別',
      '所在區域',
      '保管人',
      '取得日期',
      '狀態',
      '盤點狀態',
      '最後異動'
    ];

    const body=
      rows.map(row=>{

        const cells=
          row.querySelectorAll('td');

        return [...cells]
          .map(cell=>
            `"${String(cell.textContent||'').trim().replaceAll('"','""')}"`
          )
          .join(',');

      });

    const csv=
      '\uFEFF'+
      [header.join(','),...body].join('\n');

    const blob=
      new Blob(
        [csv],
        {type:'text/csv;charset=utf-8;'}
      );

    const url=
      URL.createObjectURL(blob);

    const link=
      document.createElement('a');

    link.href=url;
    link.download=
      `BOMB-WMS-資產清單-${new Date().toISOString().slice(0,10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

  }
);


const stocktakeTabs=
  document.querySelectorAll('[data-stocktake-tab]');

const stocktakePanels=
  document.querySelectorAll('[data-stocktake-panel]');

function showStocktakeTab(name){

  stocktakeTabs.forEach(tab=>{
    tab.classList.toggle(
      'active',
      tab.dataset.stocktakeTab===name
    );
  });

  stocktakePanels.forEach(panel=>{
    panel.classList.toggle(
      'active',
      panel.dataset.stocktakePanel===name
    );
  });

}

stocktakeTabs.forEach(tab=>{

  tab.addEventListener('click',()=>{

    showStocktakeTab(
      tab.dataset.stocktakeTab||'task'
    );

  });

});


const stocktakeWarehouseFilter=
  document.getElementById('stocktakeWarehouseFilter');

const stocktakeKeywordFilter=
  document.getElementById('stocktakeKeywordFilter');

const stocktakeVarianceFilter=
  document.getElementById('stocktakeVarianceFilter');

const stocktakeSearchBtn=
  document.getElementById('stocktakeSearchBtn');

const stocktakeExportBtn=
  document.getElementById('stocktakeExportBtn');

const stocktakeTableBody=
  document.getElementById('stocktakeTableBody');

const stocktakeResultCount=
  document.getElementById('stocktakeResultCount');


function getStocktakeRows(){
  if(!stocktakeTableBody)return [];

  return [
    ...stocktakeTableBody.querySelectorAll(
      '[data-stocktake-row]'
    )
  ];
}


function updateStocktakeRow(row){

  const bookQty=
    Number(
      row.querySelector('[data-book-qty]')?.textContent||0
    );

  const actualQty=
    Number(
      row.querySelector('.count-input')?.value||0
    );

  const variance=
    actualQty-bookQty;

  const varianceCell=
    row.querySelector('[data-variance]');

  const resultCell=
    row.querySelector('[data-result]');

  if(varianceCell){

    varianceCell.textContent=
      variance>0
        ?`+${variance}`
        :String(variance);

    varianceCell.className=
      variance===0
        ?'variance-zero'
        :variance>0
          ?'variance-positive'
          :'variance-negative';

  }

  row.dataset.varianceStatus=
    variance===0
      ?'一致'
      :'有差異';

  if(resultCell){

    resultCell.innerHTML=
      variance===0
        ?'<span class="status green">一致</span>'
        :'<span class="status orange">有差異</span>';

  }

}


getStocktakeRows().forEach(row=>{

  updateStocktakeRow(row);

  row.querySelector('.count-input')
    ?.addEventListener(
      'input',
      ()=>{
        updateStocktakeRow(row);
        filterStocktakeTable();
      }
    );

});


function filterStocktakeTable(){

  const rows=getStocktakeRows();

  const warehouse=
    String(
      stocktakeWarehouseFilter?.value||''
    ).trim();

  const keyword=
    String(
      stocktakeKeywordFilter?.value||''
    )
      .trim()
      .toLowerCase();

  const varianceStatus=
    String(
      stocktakeVarianceFilter?.value||''
    ).trim();

  let visibleCount=0;

  rows.forEach(row=>{

    const rowText=
      String(row.textContent||'')
        .toLowerCase();

    const rowWarehouse=
      String(row.dataset.warehouse||'');

    const rowVarianceStatus=
      String(row.dataset.varianceStatus||'');

    const matched=
      (!warehouse||rowWarehouse===warehouse)&&
      (!varianceStatus||rowVarianceStatus===varianceStatus)&&
      (!keyword||rowText.includes(keyword));

    row.style.display=
      matched?'':'none';

    if(matched){
      visibleCount+=1;
    }

  });

  let emptyRow=
    document.getElementById('stocktakeEmptyRow');

  if(visibleCount===0){

    if(!emptyRow){

      emptyRow=document.createElement('tr');
      emptyRow.id='stocktakeEmptyRow';

      emptyRow.innerHTML=`
        <td colspan="9" class="stocktake-empty">
          查無符合條件的盤點資料
        </td>
      `;

      stocktakeTableBody?.appendChild(emptyRow);

    }

    emptyRow.style.display='';

  }else if(emptyRow){

    emptyRow.remove();

  }

  if(stocktakeResultCount){
    stocktakeResultCount.textContent=
      `共 ${visibleCount} 筆`;
  }

  if(stocktakeExportBtn){
    stocktakeExportBtn.disabled=
      visibleCount===0;
  }

}


stocktakeSearchBtn?.addEventListener(
  'click',
  filterStocktakeTable
);


stocktakeKeywordFilter?.addEventListener(
  'keydown',
  event=>{

    if(event.key==='Enter'){
      filterStocktakeTable();
    }

  }
);


stocktakeExportBtn?.addEventListener(
  'click',
  ()=>{

    const rows=
      getStocktakeRows()
        .filter(
          row=>row.style.display!=='none'
        );

    if(!rows.length)return;

    const header=[
      '料號',
      '品名',
      '倉庫',
      '儲位',
      '帳面量',
      '實盤量',
      '差異',
      '結果',
      '備註'
    ];

    const body=
      rows.map(row=>{

        const cells=
          row.querySelectorAll('td');

        const values=[
          cells[0]?.textContent,
          cells[1]?.textContent,
          cells[2]?.textContent,
          cells[3]?.textContent,
          cells[4]?.textContent,
          row.querySelector('.count-input')?.value,
          cells[6]?.textContent,
          row.dataset.varianceStatus,
          cells[8]?.textContent
        ];

        return values
          .map(value=>
            `"${String(value??'').trim().replaceAll('"','""')}"`
          )
          .join(',');

      });

    const csv=
      '\uFEFF'+
      [header.join(','),...body].join('\n');

    const blob=
      new Blob(
        [csv],
        {type:'text/csv;charset=utf-8;'}
      );

    const url=
      URL.createObjectURL(blob);

    const link=
      document.createElement('a');

    link.href=url;
    link.download=
      `BOMB-WMS-盤點清單-${new Date().toISOString().slice(0,10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

  }
);


document.querySelectorAll('[data-more-page]')
  .forEach(button=>{

    button.addEventListener('click',()=>{

      const target=
        button.dataset.morePage;

      if(!target)return;

      showPage(target);

      document.querySelectorAll('.nav-btn')
        .forEach(item=>{
          item.classList.toggle(
            'active',
            item.dataset.page===target
          );
        });

      const purchaseTab=
        button.dataset.morePurchaseTab;

      if(
        target==='purchase'&&
        purchaseTab
      ){
        showPurchaseTab(purchaseTab);
      }

    });

  });


document.querySelectorAll('[data-quick-page]')
  .forEach(button=>{

    button.addEventListener('click',()=>{

      const page=
        button.dataset.quickPage;

      showPage(page);

      document.querySelectorAll('.nav-btn')
        .forEach(item=>{
          item.classList.toggle(
            'active',
            item.dataset.page===page
          );
        });

      const inventoryTab=
        button.dataset.quickInventoryTab;

      if(inventoryTab){
        showInventoryTab(inventoryTab);
      }

    });

  });


const prototypeModal=
  document.getElementById('prototypeModal');

const prototypeModalTitle=
  document.getElementById('prototypeModalTitle');

const prototypeModalSubtitle=
  document.getElementById('prototypeModalSubtitle');

const prototypeModalBody=
  document.getElementById('prototypeModalBody');

const prototypeModalClose=
  document.getElementById('prototypeModalClose');

const prototypeToast=
  document.getElementById('prototypeToast');

const prototypeToastText=
  document.getElementById('prototypeToastText');

let prototypeToastTimer=null;


function showPrototypeToast(message){

  if(!prototypeToast||!prototypeToastText)return;

  prototypeToastText.textContent=message;
  prototypeToast.classList.add('active');

  clearTimeout(prototypeToastTimer);

  prototypeToastTimer=setTimeout(
    ()=>{
      prototypeToast.classList.remove('active');
    },
    2200
  );

}


function openPrototypeModal({
  title='詳細資料',
  subtitle='BOMB WMS',
  body=''
}={}){

  if(
    !prototypeModal||
    !prototypeModalTitle||
    !prototypeModalSubtitle||
    !prototypeModalBody
  )return;

  prototypeModalTitle.textContent=title;
  prototypeModalSubtitle.textContent=subtitle;
  prototypeModalBody.innerHTML=body;

  prototypeModal.classList.add('active');
  prototypeModal.setAttribute('aria-hidden','false');

}


function closePrototypeModal(){

  if(!prototypeModal)return;

  prototypeModal.classList.remove('active');
  prototypeModal.setAttribute('aria-hidden','true');

}


prototypeModalClose?.addEventListener(
  'click',
  closePrototypeModal
);


prototypeModal?.addEventListener(
  'click',
  event=>{

    if(event.target===prototypeModal){
      closePrototypeModal();
    }

  }
);


document.addEventListener(
  'keydown',
  event=>{

    if(event.key==='Escape'){
      closePrototypeModal();
    }

  }
);


const modalContentMap={

  notifications:{
    title:'通知中心',
    subtitle:'即時待辦與異常提醒',
    body:`
      <div class="modal-list">
        
        
        
        
      </div>
    `
  },

  'warehouse-manage':{
    title:'A1',
    subtitle:'Warehouse → Zone → Location',
    body:`
      <div class="modal-list">
        
        
        
      </div>
    `
  },

  'warehouse-manage-office':{
    title:'B1',
    subtitle:'使用區與示範消耗品',
    body:`
      <div class="modal-list">
        
        
      </div>
    `
  },

  'machine-location':{
    title:'設備區',
    subtitle:'倉架與維修區',
    body:`
      <div class="modal-info-grid">
        <div class="modal-info-card"><span>倉架</span><strong>2 層機台備品架</strong></div>
        <div class="modal-info-card"><span>維修區</span><strong>待修 / 維修中 / 完成</strong></div>
      </div>
    `
  },

  'low-stock':{
    title:'低庫存提醒',
    subtitle:'需補貨或採購的品項',
    body:`
      <div class="modal-list">
        
        
      </div>
    `
  },

  'inspection-alert':{
    title:'待驗收提醒',
    subtitle:'已收貨但尚未完成驗收',
    body:`
      <div class="modal-list">
        
        
      </div>
    `
  },

  'stocktake-alert':{
    title:'盤點差異',
    subtitle:'需要複核的實盤結果',
    body:`
      <div class="modal-list">
        
        
      </div>
    `
  },

  'inventory-log':{
    title:'庫存異動日誌',
    subtitle:'入庫 / 出庫 / 調撥留痕',
    body:`
      <div class="modal-list">
        
        
        
      </div>
    `
  },

  'asset-log':{
    title:'資產異動日誌',
    subtitle:'領用 / 歸還 / 移轉',
    body:`
      <div class="modal-list">
        
        
      </div>
    `
  },

  'operator-log':{
    title:'操作紀錄',
    subtitle:'操作人、時間與原因',
    body:`
      <div class="modal-list">
        
        
        
      </div>
    `
  }

};


document.querySelectorAll('[data-prototype-action]')
  .forEach(button=>{

    button.addEventListener('click',()=>{

      const action=
        button.dataset.prototypeAction;

      const config=
        modalContentMap[action];

      if(config){
        openPrototypeModal(config);
      }

    });

  });


document.querySelectorAll('.purchase-action-btn')
  .forEach(button=>{

    button.addEventListener('click',()=>{

      if(button.disabled)return;

      showPrototypeToast('採購需求狀態已更新');

    });

  });


const workflowDefinitions={

  receiving:{
    title:'新增收貨',
    subtitle:'建立到貨登記',
    fields:[
      ['supplier','供應商','text','宏達材料'],
      ['item','品項','text','電子零件'],
      ['qty','預計數量','number','500'],
      ['received','實收數量','number','500'],
      ['warehouse','目的倉庫','select','A1|B1'],
      ['note','備註','textarea','']
    ]
  },

  inspection:{
    title:'新增驗收',
    subtitle:'確認送驗數量與驗收結果',
    fields:[
      ['source','來源收貨單','text','RC261006001'],
      ['item','品項','text','電子零件'],
      ['qty','送驗數量','number','500'],
      ['pass','合格數量','number','500'],
      ['fail','不良數量','number','0'],
      ['result','驗收結果','select','驗收合格|部分異常|驗收不合格']
    ]
  },

  putaway:{
    title:'新增入庫',
    subtitle:'驗收合格後建立入庫資料',
    fields:[
      ['item','品項','text','電子零件'],
      ['qty','入庫數量','number','500'],
      ['warehouse','目標倉庫','select','A1|B1'],
      ['location','儲位','text','A-01-02'],
      ['lot','批號','text','LOT261006A'],
      ['note','備註','textarea','']
    ]
  },

  outbound:{
    title:'新增出庫',
    subtitle:'建立領用或出庫需求',
    fields:[
      ['department','需求單位','select','使用區|使用區|倉儲區|設備區'],
      ['item','品項','text','成品'],
      ['qty','需求數量','number','120'],
      ['warehouse','來源倉庫','select','A1|B1'],
      ['location','揀貨儲位','text','C-01-02'],
      ['note','用途 / 備註','textarea','']
    ]
  },

  transfer:{
    title:'新增調撥',
    subtitle:'跨倉庫或儲位移轉',
    fields:[
      ['item','品項','text','包裝材料'],
      ['qty','調撥數量','number','150'],
      ['from','來源','text','A1 / B-02-03'],
      ['to','目的','text','B1 / SP-01-02'],
      ['applicant','申請人','text','OG'],
      ['note','備註','textarea','']
    ]
  },

  purchase:{
    title:'新增採購需求',
    subtitle:'建立外部採購或低庫存需求',
    fields:[
      ['itemNo','品號','text','ITM0003'],
      ['item','品名','text','成品'],
      ['warehouse','需求倉庫','select','A1|B1'],
      ['qty','叫貨數量','number','500'],
      ['source','需求來源','select','低庫存自動|人工申請'],
      ['note','備註','textarea','']
    ]
  },

  asset:{
    title:'新增資產',
    subtitle:'建立新的資產管理資料',
    fields:[
      ['assetName','資產名稱','text','新設備'],
      ['category','類別','select','電腦設備|行動設備|工具設備|作業設備|其他'],
      ['location','所在區域','select','使用區|使用區|設備區|倉儲區'],
      ['custodian','保管人','text','OG'],
      ['date','取得日期','date','2026-10-06'],
      ['note','備註','textarea','']
    ]
  },

  stocktake:{
    title:'新增盤點任務',
    subtitle:'建立盤點範圍與負責人',
    fields:[
      ['scope','盤點範圍','select','A1 / A 區|A1 / B 區|A1 / C 區|B1|示範消耗品|設備區'],
      ['owner','負責人','text','OG'],
      ['date','盤點日期','date','2026-10-06'],
      ['mode','盤點方式','select','例行盤點|低庫存複核|臨時盤點'],
      ['note','備註','textarea','']
    ]
  }

};


function workflowFieldHtml(field){

  const [name,label,type,value]=field;

  if(type==='select'){

    const options=
      String(value)
        .split('|')
        .map(option=>
          `<option value="${option}">${option}</option>`
        )
        .join('');

    return `
      <div class="workflow-field">
        <label for="wf-${name}">${label}</label>
        <select id="wf-${name}" name="${name}">
          ${options}
        </select>
      </div>
    `;

  }

  if(type==='textarea'){

    return `
      <div class="workflow-field full">
        <label for="wf-${name}">${label}</label>
        <textarea id="wf-${name}" name="${name}">${value}</textarea>
      </div>
    `;

  }

  return `
    <div class="workflow-field">
      <label for="wf-${name}">${label}</label>
      <input
        id="wf-${name}"
        name="${name}"
        type="${type}"
        value="${value}"
        ${type==='number'?'min="0" step="1"':''}
        required
      >
    </div>
  `;

}


function openWorkflowForm(type){

  const definition=
    workflowDefinitions[type];

  if(!definition)return;

  const fields=
    definition.fields
      .map(workflowFieldHtml)
      .join('');

  openPrototypeModal({
    title:definition.title,
    subtitle:definition.subtitle,
    body:`
      <form class="workflow-form" id="workflowForm" data-workflow-type="${type}">
        <div class="workflow-form-grid">
          ${fields}
        </div>

        <div class="workflow-hint">
          儲存後會加入對應清單，重新整理後仍會保留。
        </div>

        <div class="workflow-form-actions">
          <button class="workflow-cancel-btn" type="button" data-workflow-cancel>
            取消
          </button>
          <button class="workflow-save-btn" type="submit">
            <svg class="material-symbols-rounded wms-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 3h13l4 4v14H3V3ZM7 3v6h9V3M7 21v-8h10v8"/></svg>
            儲存
          </button>
        </div>
      </form>
    `
  });

}


document.querySelectorAll('[data-create-workflow]')
  .forEach(button=>{

    button.addEventListener('click',()=>{

      openWorkflowForm(
        button.dataset.createWorkflow
      );

    });

  });


prototypeModalBody?.addEventListener(
  'click',
  event=>{

    const cancel=
      event.target.closest(
        '[data-workflow-cancel]'
      );

    if(cancel){
      closePrototypeModal();
    }

  }
);


prototypeModalBody?.addEventListener(
  'submit',
  event=>{

    const form=
      event.target.closest(
        '#workflowForm'
      );

    if(!form)return;

    event.preventDefault();

    const type=
      form.dataset.workflowType;

    const data=
      Object.fromEntries(
        new FormData(form).entries()
      );

    const key=
      'bomb-wms-prototype-created-records';

    let records=[];

    try{
      records=
        JSON.parse(
          localStorage.getItem(key)||'[]'
        );
    }catch(error){
      records=[];
    }

    if(!Array.isArray(records))records=[];
    if(type==='inspection' && Number(data.pass)+Number(data.fail)!==Number(data.qty)){showPrototypeToast('合格與不良數量合計必須等於送驗數量');return;}
    if(['receiving','putaway','outbound','transfer','purchase'].includes(type) && Number(data.qty)<=0){showPrototypeToast('數量必須大於 0');return;}
    if(type==='transfer' && data.from.trim()===data.to.trim()){showPrototypeToast('來源與目的不可相同');return;}
    records.unshift({
      id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),
      type,
      data,
      createdAt:new Date().toISOString()
    });

    try { localStorage.setItem(key,JSON.stringify(records)); }
    catch(error){ showPrototypeToast('儲存失敗，請確認瀏覽器儲存空間'); return; }
    renderCreatedRecords();

    closePrototypeModal();

    showPrototypeToast(
      '新增資料已儲存於 Prototype'
    );

  }
);

function applyTheme(theme){
 document.documentElement.dataset.theme=theme;
 document.querySelectorAll('[data-set-theme]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.setTheme===theme)));
}
applyTheme(localStorage.getItem('bomb-wms-theme')||'light');
document.querySelectorAll('[data-set-theme]').forEach(button=>button.addEventListener('click',()=>{
 const theme=button.dataset.setTheme;
 localStorage.setItem('bomb-wms-theme',theme);
 applyTheme(theme);
}));

function escapeRecord(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderCreatedRecords(){
 document.querySelectorAll('[data-created-record]').forEach(row=>row.remove());
 let records=[];try{records=JSON.parse(localStorage.getItem('bomb-wms-prototype-created-records')||'[]');}catch(e){}
 if(!Array.isArray(records))return;
 const selectors={receiving:'[data-inventory-panel="receiving"] tbody',inspection:'[data-inventory-panel="inspection"] tbody',putaway:'[data-inventory-panel="putaway"] tbody',outbound:'[data-inventory-panel="outbound"] tbody',transfer:'[data-inventory-panel="transfer"] tbody',purchase:'#purchaseRequestBody',asset:'#assetTableBody',stocktake:'[data-stocktake-panel="task"] tbody'};
 const prefixes={receiving:'RC',inspection:'QC',putaway:'IN',outbound:'OUT',transfer:'TR',purchase:'PR',asset:'AST',stocktake:'ST'};
 records.slice().reverse().forEach((r,index)=>{
  if(!r||!selectors[r.type]||!r.data||typeof r.data!=='object')return;
  const d=r.data,body=document.querySelector(selectors[r.type]);if(!body)return;
  const row=document.createElement('tr');row.dataset.createdRecord=r.id||String(index);
  const stamp=new Date(r.createdAt);const date=Number.isNaN(stamp.getTime())?'':stamp.toLocaleDateString('zh-TW');
  const id=prefixes[r.type]+'-'+(r.id||String(index+1));let values=[];let status='';
  switch(r.type){
   case 'receiving':values=[id,d.supplier,d.item,d.qty,d.received,date];status='待驗收';break;
   case 'inspection':values=[id,d.source,d.item,d.qty,d.pass,d.fail];status=d.result;break;
   case 'putaway':values=[id,d.item,d.qty,d.warehouse,d.location,d.lot];status='待入庫';break;
   case 'outbound':values=[id,d.department,d.item,d.qty,d.location,date];status='待揀貨';break;
   case 'transfer':values=[id,d.item,d.qty,d.from,d.to,d.applicant];status='待調撥';break;
   case 'stocktake':values=[id,d.scope,d.owner,d.date,'0 / 0','0'];status='待開始';break;
   case 'asset':
    row.dataset.assetRow='';row.dataset.location=d.location;row.dataset.status='使用中';
    values=[id,d.assetName,d.category,d.location,d.custodian,d.date,'使用中','待盤點',date];break;
   case 'purchase':
    row.dataset.purchaseRow='';row.dataset.warehouse=d.warehouse==='A1'?'A1':'B1';row.dataset.status='待叫貨';
    row.innerHTML=[id,d.itemNo,d.item,d.warehouse,'—','—',d.qty].map(v=>'<td>'+escapeRecord(v)+'</td>').join('')+
     '<td><input class="purchase-qty" type="number" min="1" step="1" value="'+escapeRecord(d.qty)+'"></td><td data-status-cell><span class="status orange">待叫貨</span></td><td>'+escapeRecord(d.source)+'</td><td><div class="purchase-row-actions"><button class="purchase-action-btn primary" type="button" data-order-action>標記已叫貨</button><button class="purchase-action-btn muted" type="button" data-no-order-action>無須叫貨</button></div></td>';
    break;
  }
  if(r.type!=='purchase')row.innerHTML=values.map(v=>'<td>'+escapeRecord(v)+'</td>').join('')+(status?'<td><span class="status blue">'+escapeRecord(status)+'</span></td>':'');
  body.prepend(row);
 });
 filterInventoryTable();filterPurchaseTable();filterAssetTable();filterStocktakeTable();refreshPurchaseSummary();
}
renderCreatedRecords();
// Keep desktop and mobile navigation in sync regardless of entry point.
const originalShowPage=showPage;
showPage=function(page){originalShowPage(page);document.querySelectorAll('[data-page],[data-mobile]').forEach(btn=>btn.classList.toggle('active',(btn.dataset.page||btn.dataset.mobile)===page));};
// The top search opens stock search; the warehouse selector applies to stock search.
const globalSearch=document.querySelector('.search input');
globalSearch?.addEventListener('keydown',e=>{if(e.key==='Enter'){inventoryKeywordFilter.value=globalSearch.value;showPage('inventory');showInventoryTab('stock');filterInventoryTable();}});
const globalWarehouse=document.querySelector('.warehouse select');
globalWarehouse?.addEventListener('change',()=>{inventoryWarehouseFilter.value=globalWarehouse.selectedIndex===0?'':globalWarehouse.value;showPage('inventory');showInventoryTab('stock');filterInventoryTable();});

/* Integrated field and management workspace */
(()=>{
const KEY='bomb-wms-integrated-workspace-v1';
const esc=escapeRecord;
const sites=[];
const definitions={
 returns:{page:'inventory',title:'歸還',subtitle:'先回待驗區，驗收後才可上架',headers:['單號','物品','數量','歸還人','目的位置','狀態'],fields:['物品','數量','歸還人','目的位置'],defaults:['耳機 EQ-0001','1','OG','A1 / 待驗區'],status:'待驗中'},
 supplierReturn:{page:'inventory',title:'退貨',subtitle:'保留原採購與驗收關聯，追蹤交付供應商',headers:['單號','物品','數量','供應商','原因','狀態'],fields:['物品','數量','供應商','原因'],defaults:['Mini PC','1','宏達材料','功能異常'],status:'待主管確認'},
 exceptions:{page:'inventory',title:'驗收異常',subtitle:'缺件、短少與換貨分開追蹤，合格部分可先入庫',headers:['單號','來源驗收單','物品','異常數量','處理方式','狀態'],fields:['來源驗收單','物品','異常數量','處理方式'],defaults:['QC261006004','Mini PC','1','等待補件'],options:{'處理方式':['等待補件','等待補送','換貨','重新驗收','退貨','報廢評估']},status:'待處理'},
 quotations:{page:'purchase',title:'詢價與比價',subtitle:'比較價格、交期、規格與替代方案',headers:['單號','物品','供應商','單價','交期天數','狀態'],fields:['物品','供應商','單價','交期天數'],defaults:['Mini PC','宏達材料','18000','7'],status:'待確認'},
 categories:{page:'asset',title:'分類管理',subtitle:'父階層 → 子階層 → 品項；停用保留既有資料',headers:['代碼','分類名稱','父階層','標籤類型','識別方式','狀態'],fields:['分類名稱','父階層','標籤類型','識別方式'],defaults:['耳機','通訊設備','個別識別','QR兩層'],options:{'標籤類型':['個別識別','批量識別','無標籤'],'識別方式':['QR兩層','NFC三層','不適用']},status:'啟用'},
 labels:{page:'asset',title:'標籤管理',subtitle:'物品身份固定，換發紀錄延續；此處提供操作原型',headers:['編號','物品業務編號','6碼識別碼','識別方式','換發原因','狀態'],fields:['物品業務編號','6碼識別碼','識別方式','換發原因'],defaults:['EQ-TC-00001','120001','QR兩層','首次產製'],options:{'識別方式':['QR兩層','NFC三層']},status:'待產製'},
 disposal:{page:'asset',title:'報廢與丟棄',subtitle:'待報廢 → 核准 → 留存 → 處置；永久保留履歷',headers:['單號','物品','數量','報廢原因','留存位置','狀態'],fields:['物品','數量','報廢原因','留存位置'],defaults:['損壞螢幕','1','無法修復','A1 / 報廢區'],status:'待核准'},
 maintenance:{page:'asset',title:'保養任務',subtitle:'與送修分開；就地保養保留原配置位置',headers:['單號','設備','所在位置','負責人','預計日期','狀態'],fields:['設備','所在位置','負責人','預計日期'],defaults:['作業設備','示範位置 F','OG','2026-10-10'],status:'待執行'},
 review:{page:'stocktake',title:'複查',subtitle:'複查人不可與執行人相同；異常案件保留原紀錄',headers:['單號','來源盤點單','範圍','執行人','複查人','狀態'],fields:['來源盤點單','範圍','執行人','複查人'],defaults:['ST261006001','A1 / A 區','PB','SM'],status:'待複查'},
 variance:{page:'stocktake',title:'盤點異常',subtitle:'原因調查、補登與沖正均需留下紀錄',headers:['單號','來源盤點單','物品','差異數量','調查說明','狀態'],fields:['來源盤點單','物品','差異數量','調查說明'],defaults:['ST261006001','耳機','-1','待核對領用紀錄'],status:'調查中'},
 tasks:{page:'more',title:'任務中心',subtitle:'統一管理負責人、期限、改派與強制結案原因',headers:['單號','任務內容','負責人','期限','備註','狀態'],fields:['任務內容','負責人','期限','備註'],defaults:['示範消耗品補貨','OG','2026-10-07','示範據點備貨後通知取貨'],status:'待執行'},
 supplies:{page:'more',title:'備品區',subtitle:'無標籤；三班盤點與進貨登記，不走一般領用',headers:['紀錄','品項','前次數量','期間進貨','本次數量','消耗量'],fields:['品項','前次數量','期間進貨','本次數量'],defaults:['衛生紙','30','10','25'],status:''},
 uniforms:{page:'more',title:'制服配發',subtitle:'依尺碼批量管理；個人持有或共用尺碼池',headers:['單號','尺碼','數量','配發對象','追蹤方式','狀態'],fields:['尺碼','數量','配發對象','追蹤方式'],defaults:['M','2','PB-001','個人持有'],options:{'追蹤方式':['個人持有','共用尺碼池']},status:'待領取'},
 headsets:{page:'more',title:'耳機配發',subtitle:'個別耳機綁定人員；歸還解除綁定',headers:['單號','耳機編號','人員','使用位置','備註','狀態'],fields:['耳機編號','人員','使用位置','備註'],defaults:['EQ-TC-00001','PB-001','示範位置 C','長期配置'],status:'待領取'},
 locations:{page:'more',title:'位置設定',subtitle:'據點 → 區域／廳別 → 貨架 → 桌台／櫃位',headers:['代碼','名稱','上層位置','類型','6碼識別碼','狀態'],fields:['名稱','上層位置','類型','6碼識別碼'],defaults:['A1','A1','一般貨架','220001'],options:{'類型':['一般貨架','待驗區','待退貨區','維修區','報廢區','使用位置']},status:'啟用'},
 rules:{page:'more',title:'流程參數',subtitle:'依企業設定期限與上限，預設值待企劃確認',headers:['代碼','參數名稱','設定值','單位','適用範圍','狀態'],fields:['參數名稱','設定值','單位','適用範圍'],defaults:['身上貨品上限','10','項','現場作業'],status:'草案'}
};
Object.values(definitions).forEach(d=>{d.defaults=d.fields.map(()=> '');});
let state;try{state=JSON.parse(localStorage.getItem(KEY)||'null');}catch(e){}
if(!state||!Array.isArray(state.records))state={records:[],field:[],logs:[]};if(!Array.isArray(state.field))state.field=[];if(!Array.isArray(state.logs))state.logs=[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch(e){showPrototypeToast('儲存失敗，請確認瀏覽器儲存空間');return false;}}
// No automatic demonstration records.
function log(action,item){state.logs.unshift({action,item,time:new Date().toLocaleString('zh-TW'),operator:'OG'});}
const pages={inventory:inventoryPage,purchase:purchasePage,asset:assetPage,stocktake:stocktakePage,more:morePage};
const localFilters={};
Object.entries(pages).forEach(([page,root])=>{
 const tabs=document.createElement('div');tabs.className='workspace-tabs';tabs.dataset.workspaceTabs=page;
 tabs.innerHTML='<button class="workspace-tab active" data-module="base">主要作業</button>'+Object.entries(definitions).filter(([_,d])=>d.page===page).map(([key,d])=>'<button class="workspace-tab" data-module="'+key+'">'+d.title+'</button>').join('');
 const head=root.querySelector('.page-head');head.after(tabs);
 const panel=document.createElement('section');panel.className='integrated-panel';panel.hidden=true;root.append(panel);
 tabs.addEventListener('click',e=>{const b=e.target.closest('[data-module]');if(!b)return;openModule(page,b.dataset.module);});
});
function openModule(page,key){
 const root=pages[page],panel=root.querySelector('.integrated-panel'),tabs=root.querySelector('.workspace-tabs');
 [...root.children].forEach(n=>{if(!n.classList.contains('page-head')&&n!==tabs&&n!==panel){if(key==='base'){n.style.display=n.dataset.beforeWorkspaceDisplay||'';}else{if(n.dataset.beforeWorkspaceDisplay===undefined)n.dataset.beforeWorkspaceDisplay=n.style.display;n.style.display='none';}}});
 tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.module===key));panel.hidden=key==='base';panel.dataset.module=key;
 if(key!=='base')renderModule(key);
}
function renderModule(key){
 const d=definitions[key],panel=pages[d.page].querySelector('.integrated-panel');const term=localFilters[key]||'';
 const rows=state.records.filter(r=>r.module===key&&JSON.stringify(r).toLowerCase().includes(term.toLowerCase()));
 panel.innerHTML='<div class="workspace-panel-head"><div><h2>'+d.title+'</h2><p>'+d.subtitle+'</p></div><button class="primary-btn" data-module-create="'+key+'">＋ 新增</button></div><div class="workspace-filter"><input type="search" placeholder="搜尋名稱、單號、狀態…" value="'+esc(term)+'" data-module-search="'+key+'"><span>共 '+rows.length+' 筆</span><button class="secondary-action-btn" data-module-export="'+key+'">匯出 CSV</button></div><div class="operation-table-wrap"><table class="operation-table"><thead><tr>'+d.headers.map(v=>'<th>'+v+'</th>').join('')+'<th>操作</th></tr></thead><tbody>'+ (rows.length?rows.map(r=>'<tr>'+[r.id,...r.values,r.status].slice(0,6).map(v=>'<td>'+esc(v)+'</td>').join('')+'<td><button class="secondary-action-btn" data-module-detail="'+r.id+'">查看</button></td></tr>').join(''):'<tr><td colspan="7" class="workspace-empty">尚無資料，點擊「新增」建立第一筆紀錄</td></tr>')+'</tbody></table></div>';
}
function createModule(key){const d=definitions[key];openPrototypeModal({title:'新增'+d.title,subtitle:d.subtitle,body:'<form id="integratedForm" data-module="'+key+'" class="workflow-form"><div class="workflow-form-grid">'+d.fields.map((f,i)=>'<div class="workflow-field"><label for="im-'+i+'">'+f+'</label>'+(d.options?.[f]?'<select name="v'+i+'" id="im-'+i+'">'+d.options[f].map(o=>'<option>'+o+'</option>').join('')+'</select>':'<input id="im-'+i+'" name="v'+i+'" required value="'+esc(d.defaults[i])+'" '+(f==='6碼識別碼'?'pattern="[0-9]{6}" inputmode="numeric" maxlength="6"':'')+'>')+'</div>').join('')+'</div><div class="workflow-form-actions"><button type="button" class="workflow-cancel-btn" data-workflow-cancel>取消</button><button type="submit" class="workflow-save-btn">儲存</button></div></form>'});}
document.addEventListener('click',e=>{
 const create=e.target.closest('[data-module-create]');if(create)createModule(create.dataset.moduleCreate);
 const detail=e.target.closest('[data-module-detail]');if(detail){const r=state.records.find(r=>r.id===detail.dataset.moduleDetail),d=definitions[r.module];openPrototypeModal({title:r.id,subtitle:d.title,body:'<div class="modal-info-grid">'+d.fields.map((f,i)=>'<div class="modal-info-card"><span>'+f+'</span><strong>'+esc(r.values[i])+'</strong></div>').join('')+'</div><p>狀態：'+esc(r.status)+'</p><p>操作人員：OG · '+esc(r.time)+'</p>'});}
 const exp=e.target.closest('[data-module-export]');if(exp){const key=exp.dataset.moduleExport,d=definitions[key],term=localFilters[key]||'';const rows=state.records.filter(r=>r.module===key&&JSON.stringify(r).toLowerCase().includes(term.toLowerCase()));const csv='\uFEFF'+[d.headers,...rows.map(r=>[r.id,...r.values,r.status])].map(row=>row.map(csvCell).join(',')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='BOMB-WMS-'+d.title+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
});
document.addEventListener('change',e=>{if(e.target.matches('[data-module-search]')){const key=e.target.dataset.moduleSearch;localFilters[key]=e.target.value;renderModule(key);}});
prototypeModalBody.addEventListener('submit',e=>{if(e.target.id!=='integratedForm')return;e.preventDefault();const key=e.target.dataset.module,d=definitions[key],fd=new FormData(e.target),values=d.fields.map((_,i)=>String(fd.get('v'+i)||'').trim());
 if(key==='review'&&values[2]===values[3]){showPrototypeToast('複查人不可與執行人相同');return;}
 let status=d.status;
 if(key==='supplies'){const nums=values.slice(1).map(Number);if(nums.some(v=>!Number.isFinite(v)||v<0)){showPrototypeToast('數量須為非負數');return;}status=String(nums[0]+nums[1]-nums[2]);if(Number(status)<0){showPrototypeToast('本次數量高於前次加進貨，請核對數量');return;}}
 const r={id:key.slice(0,3).toUpperCase()+'-'+Date.now().toString(36).toUpperCase(),module:key,values,status,time:new Date().toLocaleString('zh-TW')};state.records.unshift(r);log('新增'+d.title,r.id);if(!save()){state.records.shift();state.logs.shift();return;}closePrototypeModal();renderModule(key);showPrototypeToast('已儲存並加入清單');
});
const field=document.createElement('div');field.id='fieldWorkspace';field.className='field-workspace';field.hidden=true;document.querySelector('section.page').append(field);
const switcher=document.createElement('div');switcher.className='workspace-switch';switcher.innerHTML='<button class="active" data-workspace="manage">倉儲管理</button><button data-workspace="field">現場作業</button>';document.querySelector('.topbar').prepend(switcher);
function renderField(){
 field.innerHTML='<div class="page-head"><div class="page-title"><h1>現場作業</h1><p>OG · 同一帳號查看庫存與現場物品</p></div><span class="workspace-badge">操作展示 · 手動識別</span></div><div class="field-metrics"><div><span>我的搬運中物品</span><strong>'+state.field.filter(r=>r.status==='運送中').length+'</strong></div><div><span>今日操作</span><strong>'+state.field.length+'</strong></div><div><span>場域</span><strong>依位置設定</strong></div></div><div class="field-actions">'+[['領取','取出物品，加入身上貨品'],['存入','確認貨架，完成放置'],['歸還','物品先放待驗區'],['移轉','更新實體位置'],['盤點','核對系統與實際數量'],['手動驗證','輸入物品 6 碼識別碼']].map(([name,sub],i)=>'<button data-field-action="'+name+'"><span class="field-action-number">0'+(i+1)+'</span><strong>'+name+'</strong><small>'+sub+'</small><span class="field-action-arrow">↗</span></button>').join('')+'</div><div class="field-columns"><section class="card"><div class="card-head"><h2>我的現場紀錄</h2></div><div class="field-records">'+(state.field.length?state.field.map(r=>'<div class="field-record"><div><strong>'+esc(r.item)+'</strong><small>'+esc(r.code)+' · '+esc(r.qty)+' 件 · '+esc(r.location)+'</small></div><span class="status blue">'+esc(r.status)+'</span></div>').join(''):'<div class="workspace-empty">尚無操作紀錄，從上方選擇作業開始</div>')+'</div></section><section class="card"><div class="card-head"><h2>同時查詢庫存</h2></div><div class="field-shortcuts"><p>查看權限範圍內的可用庫存，接續現場任務。</p><button class="primary-btn" data-field-stock>開啟庫存查詢</button><button class="secondary-action-btn" data-field-tasks>查看任務中心</button><button class="secondary-action-btn" data-field-log>操作日誌</button></div></section></div>';
}
const showBeforeWorkspace=showPage;showPage=function(page){field.hidden=page!=='field';showBeforeWorkspace(page);switcher.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.workspace===(page==='field'?'field':'manage')));if(page==='field')renderField();};
switcher.addEventListener('click',e=>{const b=e.target.closest('[data-workspace]');if(b)showPage(b.dataset.workspace==='field'?'field':'dashboard');});
document.addEventListener('click',e=>{
 if(e.target.closest('[data-field-stock]')){showPage('inventory');openModule('inventory','base');showInventoryTab('stock');}
 if(e.target.closest('[data-field-tasks]')){showPage('more');openModule('more','tasks');}
 if(e.target.closest('[data-field-log]'))openPrototypeModal({title:'現場操作日誌',subtitle:'操作人員與時間留存',body:state.logs.length?state.logs.map(r=>'<div class="modal-list-row"><div><strong>'+esc(r.action)+'</strong><small>'+esc(r.item)+' · '+esc(r.time)+' · '+esc(r.operator)+'</small></div></div>').join(''):'<p>尚無紀錄</p>'});
 const action=e.target.closest('[data-field-action]');if(!action)return;const name=action.dataset.fieldAction;
 openPrototypeModal({title:name,subtitle:'手動操作展示；NFC／相機 QR 掃描尚待設備與後端串接',body:'<div class="field-steps"><span>1 識別物品</span><span>2 確認數量／位置</span><span>3 完成並留存</span></div><form id="fieldForm" data-action="'+name+'" class="workflow-form"><div class="workflow-form-grid"><div class="workflow-field"><label>6 碼識別碼</label><input name="code" required pattern="[0-9]{6}" inputmode="numeric" maxlength="6" placeholder="例如 120001"></div><div class="workflow-field"><label>物品名稱（展示資料）</label><input name="item" required placeholder="例如 耳機"></div><div class="workflow-field"><label>數量</label><input name="qty" required type="number" min="1" step="1" value="1"></div><div class="workflow-field"><label>目的場域</label><select name="location">'+sites.map(v=>'<option>'+v+'</option>').join('')+'</select></div><div class="workflow-field full"><label>位置／貨架</label><input name="rack" required placeholder="歸還請填待驗區；存入請填一般貨架"></div></div><div class="workflow-form-actions"><button type="button" class="workflow-cancel-btn" data-workflow-cancel>取消</button><button type="submit" class="workflow-save-btn">確認完成</button></div></form>'});
});
prototypeModalBody.addEventListener('submit',e=>{if(e.target.id!=='fieldForm')return;e.preventDefault();const fd=new FormData(e.target),action=e.target.dataset.action,code=String(fd.get('code')),rack=String(fd.get('rack')).trim();if(!/^\d{6}$/.test(code)){showPrototypeToast('請輸入 6 碼數字識別碼');return;}if(action==='歸還'&&!rack.includes('待驗')){showPrototypeToast('歸還物品須先放置於待驗區');return;}if(action==='存入'&&/待驗|報廢/.test(rack)){showPrototypeToast('正式上架請選一般貨架');return;}
 const status=({'領取':'運送中','存入':'在貨架上','歸還':'待驗中','移轉':'位置已更新','盤點':'待複查','手動驗證':'手動驗證'}[action]);const r={code,item:String(fd.get('item')),qty:fd.get('qty'),location:String(fd.get('location'))+' / '+rack,status,action,time:new Date().toLocaleString('zh-TW')};state.field.unshift(r);log(action+'／手動驗證',code);if(!save()){state.field.shift();state.logs.shift();return;}closePrototypeModal();renderField();showPrototypeToast('操作紀錄已保存');});
})();

/* Configurable site -> zone -> location workspace. */
(()=>{
const KEY='bomb-wms-generic-workspace-v1',esc=escapeRecord;
const initial={sites:[],zones:[],locations:[],items:[],requests:[],logs:[]};
let db;try{db=JSON.parse(localStorage.getItem(KEY)||'null');}catch(e){}
if(!db||!['sites','zones','locations','items','requests','logs'].every(k=>Array.isArray(db[k])))db=initial;
let site='',zone='',location='',keyword='',status='all',view='work',stockCategory=null;
const HOME_PROFILE_KEY='bomb-wms-home-preview-v1';
const SESSION_KEY='bomb-wms-prototype-session-v1';
let homeProfile={role:'manager',id:'OG',name:'OG'},activeSession=false;
try{const v=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');if(v&&['manager','employee'].includes(v.role)&&String(v.id||'').trim()&&String(v.name||'').trim()){homeProfile=v;activeSession=true;}}catch(e){}
const managerHome=()=>homeProfile.role==='manager';
const id=prefix=>prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6);
const locName=n=>db.locations.find(x=>x.id===n)?.name||'未指定';
const zoneName=n=>db.zones.find(x=>x.id===n)?.name||'未指定';
const siteName=n=>db.sites.find(x=>x.id===n)?.name||'未指定';
function lineage(n){const l=db.locations.find(x=>x.id===n),z=db.zones.find(x=>x.id===l?.zone);return {l,z,s:db.sites.find(x=>x.id===z?.site)};}
function enabledLocation(x){const a=lineage(x.id);return x.enabled&&a.z?.enabled&&a.s?.enabled;}
const options=(list,selected,empty)=>'<option value="">'+empty+'</option>'+list.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===selected?'selected':'')+'>'+esc(x.name)+'</option>').join('');
function persist(){try{localStorage.setItem(KEY,JSON.stringify(db));return true;}catch(e){showPrototypeToast('無法保存，請確認瀏覽器儲存空間');return false;}}
function transact(fn){const before=JSON.stringify(db);fn();if(!persist()){db=JSON.parse(before);return false;}syncForms();render();return true;}
function log(action,detail){db.logs.unshift({action,detail,time:new Date().toLocaleString('zh-TW'),actor:'OG'});}
function inScope(item){const a=lineage(item.location);return (!site||a.s?.id===site)&&(!zone||a.z?.id===zone)&&(!location||item.location===location);}
function rows(){return db.items.filter(x=>inScope(x)&&(stockCategory===null||(x.category||'未分類')===stockCategory)&&(!keyword||(x.name+x.mode+locName(x.location)).toLowerCase().includes(keyword.toLowerCase()))&&(status!=='low'||x.qty<x.min)&&(status!=='used'||x.used>0));}
const steps=['申請','來源備貨','取貨／清點','上架／入庫','完成'];
const hub=document.createElement('div');hub.id='siteHub';document.querySelector('section.page').append(hub);
function render(){const navPage=view==='work'?'dashboard':'inventory';document.querySelectorAll('.nav-btn[data-page],[data-mobile]').forEach(b=>{b.classList.toggle('active',(b.dataset.page||b.dataset.mobile)===navPage&&view!=='config');});hub.dataset.view=['items','inbound','disposal'].includes(view)?'stock':view;view==='config'?renderConfig():view==='stock'?renderStockWork():view==='items'?renderItems():view==='inbound'?renderInbound():view==='disposal'?renderDisposal():renderWork();}
function header(){return '<div class="hub-heading"><div><span class="hub-eyebrow">BOMB WMS · 通用倉儲工作台</span><h1>'+ (view==='config'?'據點與位置設定':view==='stock'?'庫存總覽':view==='items'?'品項管理':view==='inbound'?'收貨與入庫':view==='disposal'?'報廢管理':'倉儲作業總覽')+'</h1><p>'+(view==='items'?'管理品項與存放位置':'據點 → 區域 → 實際位置，依組織需求自行設定')+'</p></div><button class="secondary-action-btn" data-g-view="'+(view==='config'?'work':'config')+'">'+(view==='config'?'返回作業總覽':'管理據點與位置')+'</button></div>';}

let itemKeyword='',itemState='all',parentCategory='',childCategory='';
if(!Array.isArray(db.categories))db.categories=[];const selectedItems=new Set();
function visibleItems(){return db.items.filter(x=>(!parentCategory||x.categoryId===parentCategory||db.categories.find(c=>c.id===x.categoryId)?.parent===parentCategory)&&(!childCategory||x.categoryId===childCategory)&&(!itemKeyword||(x.name+' '+(x.category||'')+' '+x.id).toLowerCase().includes(itemKeyword.toLowerCase()))&&(itemState==='all'||(itemState==='active'?x.enabled!==false:x.enabled===false)));}
function itemTabs(){return '<div class="item-tabs"><button class="'+(view==='stock'?'active':'')+'" data-g-view="stock">庫存總覽</button><button class="'+(view==='items'?'active':'')+'" data-g-view="items">品項管理</button><button class="'+(view==='inbound'?'active':'')+'" data-g-view="inbound">收貨／驗收／入庫</button><button class="'+(view==='disposal'?'active':'')+'" data-g-view="disposal">報廢管理</button></div>';}
function categoryPath(c){if(!c)return '';return (c.parent?db.categories.find(p=>p.id===c.parent)?.name+' → ':'')+c.name;}
function categoryEnabled(c){return !!c&&c.enabled!==false&&(!c.parent||db.categories.find(p=>p.id===c.parent)?.enabled!==false);}
function categoryOptions(chosen=''){return options(db.categories.filter(c=>categoryEnabled(c)||c.id===chosen).map(c=>({...c,name:categoryPath(c)})),chosen,'請選擇分類');}
function renderItems(){
const parents=db.categories.filter(c=>!c.parent),children=db.categories.filter(c=>parentCategory&&c.parent===parentCategory),chosen=db.categories.find(c=>c.id===(childCategory||parentCategory)),list=visibleItems();
const panel=(label,arr,kind,selected)=>'<section class="category-panel category-tabbar"><div class="category-choices"><button class="category-choice '+(!selected?'selected':'')+'" data-category-pick="'+kind+'" data-id="">全部</button>'+arr.map(c=>'<article class="category-row"><button class="category-choice '+(selected===c.id?'selected':'')+'" data-category-pick="'+kind+'" data-id="'+esc(c.id)+'">'+esc(c.name)+(c.enabled===false?' · 停用':'')+'</button><details class="category-tools"><summary aria-label="管理 '+esc(c.name)+'">⋯</summary><div class="hub-row-actions"><button data-category-edit="'+esc(c.id)+'">編輯</button><button data-category-toggle="'+esc(c.id)+'">'+(c.enabled===false?'啟用':'停用')+'</button></div></details></article>').join('')+(arr.length?'':'<span class="category-tab-empty">'+(kind==='parent'?'新增分類，開始整理品項':parentCategory?'尚無細分類':'選擇上方分類')+'</span>')+'</div><button class="secondary-action-btn" data-category-new="'+kind+'" '+(kind==='child'&&!categoryEnabled(db.categories.find(c=>c.id===parentCategory))?'disabled':'')+'>＋ 新增</button></section>';
hub.innerHTML=header()+itemTabs()+'<div class="category-layout"><aside class="category-sidebar">'+panel('1 父分類',parents,'parent',parentCategory)+panel('2 子分類',children,'child',childCategory)+'</aside><section class="hub-card category-items"><div class="hub-card-head"><div><h2>品項清單</h2><p>'+esc(chosen?categoryPath(chosen):'全部品項（含尚未整理的既有分類）')+'</p></div><button class="primary-btn" data-g-create="item" '+(!categoryEnabled(chosen)?'disabled':'')+'>新增品項</button></div><div class="hub-filters"><input id="itemKeyword" type="search" placeholder="搜尋品名或編號" value="'+esc(itemKeyword)+'"><select id="itemState"><option value="all">全部狀態</option><option value="active" '+(itemState==='active'?'selected':'')+'>啟用</option><option value="inactive" '+(itemState==='inactive'?'selected':'')+'>停用</option></select><button class="primary-btn" data-item-search>查詢</button><span>'+list.length+' 筆</span></div><div class="hub-filters batch-toolbar"><label><input type="checkbox" data-item-all> 全選結果</label><span id="batchCount">已選 '+selectedItems.size+' 筆</span><button class="primary-btn" data-batch-category '+(selectedItems.size?'':'disabled')+'>批次分類</button><button class="secondary-action-btn" data-batch-clear>清除選取</button></div><div class="category-item-list">'+list.map(x=>'<article class="category-item"><label><input type="checkbox" data-item-select="'+esc(x.id)+'" '+(selectedItems.has(x.id)?'checked':'')+' aria-label="選取 '+esc(x.name)+'"></label><div class="category-item-main"><strong>'+esc(x.name)+'</strong><small>'+esc(x.id)+'</small><p>'+esc(categoryPath(db.categories.find(c=>c.id===x.categoryId))||x.category||'未分類')+'</p><p>'+esc(locName(x.location))+'</p><small>'+esc(x.mode)+' · '+esc(x.identification||'無標籤')+' · '+(x.enabled===false?'停用':'啟用')+'</small></div><div class="category-item-actions"><strong>'+ (x.quantityPending?'待確認':x.qty+' '+esc(x.unit))+'</strong><div class="hub-row-actions"><button data-g-edit="item" data-id="'+esc(x.id)+'">編輯</button><button data-g-toggle="item" data-id="'+esc(x.id)+'">'+(x.enabled===false?'啟用':'停用')+'</button></div></div></article>').join('')+(list.length?'':'<div class="hub-empty">'+(chosen?'此分類尚無品項，點「新增品項」。':'先選分類；既有品項可全選後「批次分類」。')+'</div>')+'</div></section></div><p class="hub-rule">分類停用後保留品項與歷史；新增品項須使用啟用分類。</p>';updateBatchSelection();
}
function openCategory(kind,categoryId){const c=db.categories.find(x=>x.id===categoryId),parent=c?.parent|| (kind==='child'?parentCategory:'');
openPrototypeModal({title:(c?'編輯':'新增')+(parent?'子分類':'父分類'),subtitle:'分類物品用途；存放位置另外設定',body:'<form id="categoryEditor" data-id="'+esc(c?.id||'')+'" data-parent="'+esc(parent)+'" class="workflow-form"><div class="workflow-form-grid">'+field('name','分類名稱',c?.name||'')+(parent?'<div class="workflow-field"><label>所屬父分類</label><p>'+esc(db.categories.find(x=>x.id===parent)?.name)+'</p></div>':'')+select('labelType','識別標籤類型',['個別識別','批量識別','無標籤'].map(n=>({id:n,name:n})),c?.labelType||'批量識別')+select('identification','識別方式',[{id:'QR',name:'QR兩層'},{id:'NFC＋QR',name:'NFC三層'}],c?.identification||'QR')+field('unit','單位',c?.unit||'個')+'</div><p class="hub-rule">無標籤分類不需識別方式。此步先建立分類與品項關係。</p><div class="workflow-form-actions"><button type="button" class="workflow-cancel-btn" data-workflow-cancel>取消</button><button type="submit" class="workflow-save-btn">儲存</button></div></form>'});syncCategoryFields();}
function syncCategoryFields(){const f=document.getElementById('categoryEditor');if(!f)return;const none=f.elements.labelType.value==='無標籤';f.elements.identification.closest('.workflow-field').hidden=none;f.elements.identification.disabled=none;}
prototypeModalBody.addEventListener('change',e=>{if(e.target.name==='labelType')syncCategoryFields();});
hub.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-category-pick')){if(b.dataset.categoryPick==='parent'){parentCategory=b.dataset.id;childCategory='';}else childCategory=b.dataset.id;selectedItems.clear();render();}if(b.dataset.categoryNew)openCategory(b.dataset.categoryNew);if(b.dataset.categoryEdit)openCategory('',b.dataset.categoryEdit);if(b.dataset.categoryToggle){const c=db.categories.find(x=>x.id===b.dataset.categoryToggle);transact(()=>{c.enabled=c.enabled===false;log(c.enabled?'啟用分類':'停用分類',categoryPath(c));});}});
prototypeModalBody.addEventListener('submit',e=>{const f=e.target;if(f.id!=='categoryEditor')return;e.preventDefault();const d=Object.fromEntries(new FormData(f)),c=db.categories.find(x=>x.id===f.dataset.id),parent=f.dataset.parent,name=d.name.trim();if(!name||!d.unit.trim()||db.categories.some(x=>x.id!==c?.id&&x.parent===parent&&x.name===name)){showPrototypeToast('請填名稱與單位；同層名稱不可重複');return;}if(parent&&!categoryEnabled(db.categories.find(x=>x.id===parent))){showPrototypeToast('父分類已停用');return;}const digits=parent?6:4,seq=Math.max(0,...db.categories.filter(x=>!!x.parent===!!parent).map(x=>Number(x.code)||0))+1;if(!c&&seq>=10**digits){showPrototypeToast('分類代碼已達上限');return;}const ok=transact(()=>{const v={id:c?.id||id('category'),code:c?.code||String(seq).padStart(digits,'0'),name,parent,labelType:d.labelType,identification:d.labelType==='無標籤'?'無標籤':d.identification,unit:d.unit.trim(),enabled:c?.enabled??true};if(c)Object.assign(c,v);else db.categories.push(v);db.items.filter(x=>x.categoryId===v.id||db.categories.find(k=>k.id===x.categoryId)?.parent===v.id).forEach(x=>x.category=categoryPath(db.categories.find(k=>k.id===x.categoryId)));log(c?'修改分類':'新增分類',categoryPath(v));});if(ok){closePrototypeModal();render();}});


function updateBatchSelection(){const list=visibleItems(),n=list.filter(x=>selectedItems.has(x.id)).length;const all=hub.querySelector('[data-item-all]');if(all){all.checked=list.length>0&&n===list.length;all.indeterminate=n>0&&n<list.length;all.disabled=!list.length;}const count=hub.querySelector('#batchCount');if(count)count.textContent='已選 '+selectedItems.size+' 筆';const button=hub.querySelector('[data-batch-category]');if(button)button.disabled=!selectedItems.size;}
hub.addEventListener('change',e=>{const el=e.target;if(el.hasAttribute('data-item-select')){el.checked?selectedItems.add(el.dataset.itemSelect):selectedItems.delete(el.dataset.itemSelect);updateBatchSelection();}if(el.hasAttribute('data-item-all')){visibleItems().forEach(x=>el.checked?selectedItems.add(x.id):selectedItems.delete(x.id));hub.querySelectorAll('[data-item-select]').forEach(x=>x.checked=selectedItems.has(x.dataset.itemSelect));updateBatchSelection();}});
hub.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-batch-clear')){selectedItems.clear();render();}if(b.hasAttribute('data-batch-category')&&selectedItems.size){const rows=db.items.filter(x=>selectedItems.has(x.id)),ids=rows.map(x=>x.id);openPrototypeModal({title:'批次分類',subtitle:'將更新 '+ids.length+' 筆品項的分類',body:'<form id="batchCategoryForm" class="workflow-form"><p>選取品項：'+rows.slice(0,5).map(x=>esc(x.name)).join('、')+(rows.length>5?'…':'')+'</p><div class="workflow-field"><label for="batchCategory">目標分類</label><select id="batchCategory" name="categoryId" required>'+categoryOptions()+'</select></div><p class="hub-rule">只更新分類，數量、單位與位置保留。</p><div class="workflow-form-actions"><button type="button" class="workflow-cancel-btn" data-workflow-cancel>取消</button><button type="submit" class="workflow-save-btn">確認套用 '+ids.length+' 筆</button></div></form>'});document.getElementById('batchCategoryForm').dataset.ids=JSON.stringify(ids);}});
prototypeModalBody.addEventListener('submit',e=>{if(e.target.id!=='batchCategoryForm')return;e.preventDefault();const f=e.target,categoryId=f.elements.categoryId.value,c=db.categories.find(x=>x.id===categoryId),category=categoryPath(c);if(!categoryEnabled(c)){showPrototypeToast('請填寫分類名稱');return;}const ids=JSON.parse(f.dataset.ids);const ok=transact(()=>{const changes=db.items.filter(x=>ids.includes(x.id)).map(x=>({id:x.id,name:x.name,from:x.category||'未分類',to:category}));db.items.forEach(x=>{if(ids.includes(x.id)){x.category=category;x.categoryId=categoryId;}});log('批次分類',changes.map(x=>x.name+'（'+x.id+'）：'+x.from+' → '+x.to).join('；'));});if(ok){selectedItems.clear();closePrototypeModal();render();showPrototypeToast('已更新 '+ids.length+' 筆分類');}});
function inboundRows(){return db.inbound||[];}
function inboundStatus(r){return r.stage==='inspection'?'待驗收':r.stage==='putaway'?'待入庫':r.stage==='rejected'?'不合格待處理':r.failed>0?'已入庫・不合格待處理':'已完成';}
function renderInbound(){const list=inboundRows();
hub.innerHTML=header()+itemTabs()+'<section class="hub-card"><div class="hub-card-head"><div><h2>收貨單據</h2><p>收貨與驗收尚不增加可用庫存，確認入庫後才更新。</p></div><button class="primary-btn" data-inbound-create>新增收貨</button></div><div class="hub-table-wrap"><table class="hub-table"><thead><tr><th>單號／日期</th><th>品項／供應商</th><th>到貨</th><th>合格</th><th>不合格</th><th>狀態</th><th>操作</th></tr></thead><tbody>'+list.map(r=>'<tr><td><strong>'+esc(r.id)+'</strong><small>'+esc(r.date)+'</small></td><td><strong>'+esc(r.name)+'</strong><small>'+esc(r.supplier)+'</small></td><td>'+r.qty+' '+esc(r.unit)+'</td><td>'+(r.stage==='inspection'?'—':r.passed)+'</td><td>'+(r.stage==='inspection'?'—':r.failed)+'</td><td><span class="hub-status '+(r.failed>0?'low':'')+'">'+inboundStatus(r)+'</span></td><td><div class="hub-row-actions">'+(r.stage==='inspection'?'<button data-inbound-inspect="'+r.id+'">驗收</button>':r.stage==='putaway'?'<button data-inbound-putaway="'+r.id+'">入庫</button>':'')+'<button data-inbound-detail="'+r.id+'">履歷</button></div></td></tr>').join('')+(list.length?'':'<tr><td colspan="7" class="workspace-empty">尚無收貨單，點「新增收貨」開始。</td></tr>')+'</tbody></table></div></section><p class="inbound-note">不合格數量保留於單據，等待後續退貨、重驗或報廢處置。</p>';
}
function inboundForm(kind,r){let fields='';
if(kind==='receive'){const items=db.items.filter(x=>x.enabled!==false&&!x.quantityPending&&enabledLocation(db.locations.find(l=>l.id===x.location)||{}));fields=select('item','品項',items.map(x=>({id:x.id,name:x.name+' · '+locName(x.location)+' · '+x.unit})))+field('supplier','供應商')+field('date','到貨日期',dayKey(new Date()),'date')+field('qty','到貨數量',1,'number')+select('holding','待驗位置',db.locations.filter(enabledLocation))+field('note','備註','').replace(' required','');}
if(kind==='inspect')fields='<p class="item-form-title">'+esc(r.name)+' · 到貨 '+r.qty+' '+esc(r.unit)+'</p>'+field('passed','合格數量',r.qty,'number')+field('failed','不合格數量',0,'number')+'<div class="workflow-field"><label for="inbound-reason">驗收說明（有不合格時必填）</label><input id="inbound-reason" name="reason"></div>';
if(kind==='putaway')fields='<p class="item-form-title">'+esc(r.name)+' · 入庫 '+r.passed+' '+esc(r.unit)+'；不合格 '+r.failed+' 留待處理。</p>'+select('destination','入庫位置',db.locations.filter(enabledLocation))+field('note','入庫備註','確認清點上架');
openPrototypeModal({title:{receive:'新增收貨',inspect:'驗收確認',putaway:'確認入庫'}[kind],subtitle:'選擇企業設定的位置，數量異動留存於履歷',body:'<form id="inboundForm" data-kind="'+kind+'" data-id="'+esc(r?.id||'')+'" class="workflow-form"><div class="workflow-form-grid">'+fields+'</div><div class="workflow-form-actions"><button type="button" class="workflow-cancel-btn" data-workflow-cancel>取消</button><button type="submit" class="workflow-save-btn">'+(kind==='putaway'?'確認入庫':'儲存')+'</button></div></form>'});}
function inboundHistory(r,action,detail){(r.history||=[]).push({action,detail,time:new Date().toLocaleString('zh-TW'),actor:'OG'});log(action,r.id+' · '+detail);}
hub.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-inbound-create'))inboundForm('receive');const id=b.dataset.inboundInspect||b.dataset.inboundPutaway||b.dataset.inboundDetail;if(!id)return;const r=inboundRows().find(x=>x.id===id);if(!r)return;if(b.dataset.inboundInspect&&r.stage==='inspection')inboundForm('inspect',r);if(b.dataset.inboundPutaway&&r.stage==='putaway')inboundForm('putaway',r);if(b.dataset.inboundDetail)openPrototypeModal({title:'收貨履歷 · '+r.id,subtitle:r.name+' · '+inboundStatus(r),body:'<p>待驗位置：'+esc(locName(r.holding))+'</p>'+(r.destination?'<p>入庫位置：'+esc(locName(r.destination))+'</p>':'')+(r.history||[]).map(h=>'<div class="modal-list-row"><div><strong>'+esc(h.action)+'</strong><small>'+esc(h.detail)+' · '+esc(h.actor)+' · '+esc(h.time)+'</small></div></div>').join('')});});
prototypeModalBody.addEventListener('submit',e=>{const f=e.target;if(f.id!=='inboundForm')return;e.preventDefault();const d=Object.fromEntries(new FormData(f)),kind=f.dataset.kind,r=inboundRows().find(x=>x.id===f.dataset.id),validQty=v=>String(v).trim()!==''&&Number.isSafeInteger(Number(v))&&Number(v)>=0,validLocation=id=>db.locations.some(x=>x.id===id&&enabledLocation(x));
if(kind==='receive'){const item=db.items.find(x=>x.id===d.item);if(!item||item.enabled===false||item.quantityPending||!validLocation(item.location)||!validLocation(d.holding)||!validQty(d.qty)||Number(d.qty)<1||!d.supplier.trim()||!d.date){showPrototypeToast('請確認品項、位置、供應商與正整數數量');return;}const ok=transact(()=>{const row={id:id('RC'),item:item.id,name:item.name,unit:item.unit,category:item.category||'未分類',mode:item.mode,identification:item.identification||'無標籤',supplier:d.supplier.trim(),date:d.date,qty:Number(d.qty),holding:d.holding,note:d.note,stage:'inspection',passed:0,failed:0,history:[]};(db.inbound||=[]).unshift(row);inboundHistory(row,'收貨登記','到貨 '+row.qty+' '+row.unit+' · '+locName(row.holding));});if(ok)closePrototypeModal();return;}
if(!r)return;
if(kind==='inspect'){if(r.stage!=='inspection')return;if(!validQty(d.passed)||!validQty(d.failed)||Number(d.passed)+Number(d.failed)!==r.qty||Number(d.failed)>0&&!String(d.reason||'').trim()){showPrototypeToast('合格＋不合格須等於到貨數量；不合格須填說明');return;}const ok=transact(()=>{r.passed=Number(d.passed);r.failed=Number(d.failed);r.reason=d.reason||'';r.stage=r.passed>0?'putaway':'rejected';inboundHistory(r,'驗收確認','合格 '+r.passed+'／不合格 '+r.failed+' · '+r.reason);});if(ok)closePrototypeModal();return;}
if(kind==='putaway'){if(r.stage!=='putaway')return;const original=db.items.find(x=>x.id===r.item);if(!original||original.enabled===false||!validLocation(d.destination)){showPrototypeToast('品項或入庫位置已停用');return;}let dest=db.items.find(x=>x.name===r.name&&x.unit===r.unit&&x.location===d.destination);if(dest&&(dest.enabled===false||dest.quantityPending||dest.mode!==r.mode)){showPrototypeToast('目的位置品項已停用、數量待確認或管理方式不同');return;}if(dest&&!Number.isSafeInteger(dest.qty+r.passed)){showPrototypeToast('入庫數量超出範圍');return;}const ok=transact(()=>{if(!dest){dest={...original,id:id('item'),location:d.destination,qty:0,used:0,enabled:true};db.items.push(dest);}const before=dest.qty;dest.qty+=r.passed;r.destination=d.destination;r.stage='completed';inboundHistory(r,'入庫完成',locName(dest.location)+' · '+before+' → '+dest.qty+' '+dest.unit+' · '+d.note);});if(ok)closePrototypeModal();}
});

function stockEntryMenu(){return '<div class="stock-entry-menu"><button data-stock-entry="lookup"><strong>查庫存</strong><small>找品項、看位置與數量</small></button><button data-stock-entry="issue"><strong>領用／歸還</strong><small>開啟領用與歸還登記入口</small></button><button data-stock-entry="count"><strong>盤點／補貨</strong><small>選品項，核對數量或申請補貨</small></button></div>';}
hub.addEventListener('click',e=>{const b=e.target.closest('[data-stock-entry]');if(!b)return;const kind=b.dataset.stockEntry;if(kind==='lookup'){document.getElementById('gKeyword').scrollIntoView({block:'center'});document.getElementById('gKeyword').focus();}else if(kind==='count'){openPrototypeModal({title:'盤點與補貨',subtitle:'從庫存清單選擇要處理的品項',body:'<p>盤點：找到品項，點該列「盤點」，輸入現場實際數量並送出複查。</p><p>補貨：點該列「補貨」，選來源位置與數量，接續備貨、取貨與入庫。</p><button class="primary-btn" data-stock-low>查看低庫存品項</button>'});}else{openPrototypeModal({title:'領用與歸還',subtitle:'目前為既有登記功能；尚未連動此庫存總覽扣帳或回補',body:'<div class="hub-links"><button data-stock-legacy="outbound">領用／出庫登記 →</button><button data-stock-legacy="returns">歸還登記 →</button></div><p>歸還物品須先驗收，再確認入庫。</p>'});}});
prototypeModalBody.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-stock-low')){status='low';stockCategory=null;keyword='';closePrototypeModal();render();document.getElementById('gStatus').scrollIntoView({block:'center'});}if(b.dataset.stockLegacy){const kind=b.dataset.stockLegacy;closePrototypeModal();showPage('inventory',true);document.querySelector('[data-workspace-tabs="inventory"] [data-module="'+(kind==='returns'?'returns':'base')+'"]').click();if(kind==='outbound')showInventoryTab('outbound');}});
function stockCategoryTabs(all){const cats=[...new Set(all.map(x=>x.category||'未分類'))];return '<nav class="stock-category-tabs" aria-label="庫存分類">'+[null,...cats].map(cat=>'<button type="button" data-stock-category="'+esc(JSON.stringify(cat))+'" aria-pressed="'+(stockCategory===cat)+'" class="'+(stockCategory===cat?'active':'')+'">'+esc(cat===null?'全部':cat)+'<span>'+all.filter(x=>cat===null||(x.category||'未分類')===cat).length+'</span></button>').join('')+'</nav>';}
function stockTable(){const list=rows();return '<div class="hub-table-wrap generic-stock-table-wrap"><table class="hub-table generic-stock-table"><thead><tr><th>品項</th><th>實際位置</th><th>可用數量</th><th>使用中</th><th>補貨門檻</th><th>狀況</th><th>操作</th></tr></thead><tbody>'+list.map(x=>{const a=lineage(x.location);return '<tr><td data-label="品項"><strong>'+esc(x.name)+'</strong><small>'+esc(x.category||'未分類')+' · '+esc(x.mode)+(x.fixed?' · 固定補貨':'')+'</small></td><td data-label="實際位置"><strong>'+esc(locName(x.location))+'</strong><small>'+esc(a.s?.name||'待設定據點')+'</small><small>'+esc(a.z?.name||'待設定區域')+'</small></td><td data-label="可用數量" class="hub-number"><strong>'+ (x.quantityPending?'待確認':x.qty)+'</strong><small>'+esc(x.unit)+'</small></td><td data-label="使用中" class="hub-number">'+x.used+'</td><td data-label="補貨門檻"><span class="stock-threshold">'+x.min+' '+esc(x.unit)+'</span></td><td data-label="狀況"><span class="hub-status '+(!x.quantityPending&&x.qty<x.min?'low':'')+'">'+(x.quantityPending?'數量待確認':x.qty<x.min?'需補貨':'正常')+'</span></td><td data-label="操作"><div class="hub-row-actions"><button data-g-count="'+esc(x.id)+'">盤點</button><button data-g-request="'+esc(x.id)+'">補貨</button></div></td></tr>';}).join('')+(list.length?'':'<tr><td colspan="7" class="workspace-empty">此分類沒有符合資料，可調整查詢条件。</td></tr>')+'</tbody></table></div>';}
hub.addEventListener('click',e=>{const b=e.target.closest('[data-stock-category]');if(b){stockCategory=JSON.parse(b.dataset.stockCategory);render();}});
function renderStockWork(){const all=db.items.filter(inScope);if(stockCategory!==null&&!all.some(x=>(x.category||'未分類')===stockCategory))stockCategory=null;const rs=db.requests.filter(r=>{const x=db.items.find(x=>x.id===r.target);return x&&inScope(x);});
hub.innerHTML=header()+itemTabs()+stockEntryMenu()+'<div class="hub-filters generic-scope"><label>據點<select id="gSite">'+options(db.sites.filter(x=>x.enabled),site,'全部據點')+'</select></label><label>區域<select id="gZone">'+options(db.zones.filter(x=>x.enabled&&(!site||x.site===site)&&db.sites.find(s=>s.id===x.site)?.enabled),zone,'全部區域')+'</select></label><label>實際位置<select id="gLocation">'+options(db.locations.filter(x=>enabledLocation(x)&&(!zone||x.zone===zone)&&(!site||lineage(x.id).s?.id===site)),location,'全部位置')+'</select></label></div><div class="hub-summary"><div><span>庫存品項</span><strong>'+all.length+'<small>項</small></strong></div><div><span>低庫存</span><strong>'+all.filter(x=>x.qty<x.min).length+'<small>項</small></strong></div><div><span>使用中品項</span><strong>'+all.filter(x=>x.used>0).length+'<small>項</small></strong></div><div><span>補貨待辦</span><strong>'+rs.filter(r=>r.step<4).length+'<small>筆</small></strong></div></div><div class="hub-layout"><section class="hub-card"><div class="hub-card-head"><div><h2>庫存與使用狀況</h2><p>先設定位置與品項，再開始庫存作業。</p></div><button class="primary-btn" data-g-create="item">新增品項</button></div><div class="hub-filters"><input id="gKeyword" type="search" placeholder="搜尋品名或位置" value="'+esc(keyword)+'"><select id="gStatus">'+[['all','全部狀況'],['low','低庫存'],['used','使用中']].map(([k,v])=>'<option value="'+k+'" '+(status===k?'selected':'')+'>'+v+'</option>').join('')+'</select><button class="primary-btn" data-g-search>查詢</button><button class="secondary-action-btn" data-g-export>匯出</button></div>' +stockCategoryTabs(all)+stockTable()+ '</section><aside class="hub-side"><section class="hub-card"><div class="hub-card-head"><h2>補貨進度</h2></div>'+ (rs.length?rs.map(r=>{const t=db.items.find(x=>x.id===r.target),src=db.items.find(x=>x.id===r.source);return '<article class="hub-request"><div><strong>'+esc(t?.name)+'</strong><span>'+r.qty+' '+esc(t?.unit)+'</span></div><small>'+esc(r.id)+'</small><p>'+esc(locName(src?.location))+' → '+esc(locName(t?.location))+'</p><div class="hub-progress">'+steps.slice(0,4).map((n,i)=>'<span class="'+(r.step>=i?'done':'')+'">'+n+'</span>').join('')+'</div><p>'+steps[r.step]+(t?.fixed?' · 固定補貨不可取消':'')+'</p>'+(r.step<4?'<button class="primary-btn" data-g-next="'+r.id+'">'+['確認來源備貨','完成備貨','確認取貨／清點','確認上架／入庫'][r.step]+'</button>':'<span class="hub-status">已完成</span>')+'</article>';}).join(''):'<div class="hub-empty">尚無補貨申請，從品項按「補貨」開始。</div>')+'</section><section class="hub-card"><div class="hub-card-head"><h2>作業入口</h2></div><div class="hub-links"><button data-g-view="inbound">收貨／驗收／入庫 →</button><button data-g-page="purchase">採購與供應商 →</button><button data-g-page="asset">資產與維修 →</button><button data-g-page="stocktake">盤點與複查 →</button><button data-g-logs>異動紀錄 →</button></div></section></aside></div>';
}
function renderConfig(){
const selectedSite=db.sites.find(x=>x.id===site);if(!selectedSite){site=db.sites[0]?.id||'';zone='';location='';}
const zones=db.zones.filter(x=>x.site===site);if(!zones.some(x=>x.id===zone)){zone=zones[0]?.id||'';location='';}
const places=db.locations.filter(x=>x.zone===zone);if(!places.some(x=>x.id===location))location='';
const path=[siteName(site),zoneName(zone),location?locName(location):''].filter(x=>x&&x!=='—');
const column=(kind,label,arr,selected,parentReady)=>'<section class="hub-card hierarchy-column"><div class="hub-card-head"><h2>'+label+'</h2><button class="primary-btn" data-g-create="'+kind+'" '+(!parentReady?'disabled':'')+'>＋ 新增</button></div><p class="hierarchy-help">'+({site:'先選擇要管理的據點',zone:'只顯示所選據點的區域',location:'只顯示所選區域的位置'}[kind])+'</p><div class="hierarchy-list">'+(arr.length?arr.map(x=>'<article class="hierarchy-row '+(selected===x.id?'selected':'')+'"><button class="hierarchy-select" data-hierarchy="'+kind+'" data-id="'+esc(x.id)+'" aria-pressed="'+(selected===x.id)+'"><strong>'+esc(x.name)+'</strong><small>'+esc(x.type||({site:'據點',zone:'區域'}[kind]))+(x.enabled?'':' · 已停用')+'</small></button><div class="hub-row-actions"><button data-g-edit="'+kind+'" data-id="'+esc(x.id)+'">編輯</button><button data-g-toggle="'+kind+'" data-id="'+esc(x.id)+'">'+(x.enabled?'停用':'啟用')+'</button></div></article>').join(''):'<div class="hub-empty">'+(parentReady?'尚未建立，點上方「＋ 新增」。':'請先建立並選擇上一層。')+'</div>')+'</div></section>';
hub.innerHTML=header()+'<div class="hierarchy-path" role="status"><span>目前路徑</span><strong>'+esc(path.join(' → ')||'尚未建立據點')+'</strong></div><div class="hierarchy-grid">'+column('site','1 據點',db.sites,site,true)+column('zone','2 區域',zones,zone,!!db.sites.find(x=>x.id===site&&x.enabled))+column('location','3 實際位置',places,location,!!db.zones.find(x=>x.id===zone&&x.enabled))+'</div>'+(location?'<section class="hub-card hierarchy-detail"><div class="hub-card-head"><div><h2>此位置的品項</h2><p>'+esc(path.join(' → '))+'</p></div><button class="primary-btn" data-g-create="item" '+(!enabledLocation(db.locations.find(x=>x.id===location))?'disabled':'')+'>新增品項</button></div>'+ (db.items.filter(x=>x.location===location).map(x=>'<div class="hierarchy-item"><strong>'+esc(x.name)+'</strong><span>'+esc(x.category||'未分類')+' · '+(x.quantityPending?'數量待確認':x.qty+' '+esc(x.unit))+(x.enabled?'':' · 已停用')+'</span></div>').join('')||'<div class="hub-empty">此位置尚無品項，可點「新增品項」。</div>')+'</section>':'<p class="hub-rule">點選實際位置，即可查看存放品項。</p>')+'<button class="secondary-action-btn" data-clean-backup>下載清空前資料備份</button>';
}

const field=(name,label,value='',type='text')=>'<div class="workflow-field"><label for="gf-'+name+'">'+label+'</label><input id="gf-'+name+'" name="'+name+'" type="'+type+'" '+(type==='number'?'min="0" step="1"':'')+' value="'+esc(value)+'" required></div>';
const select=(name,label,list,chosen='')=>'<div class="workflow-field"><label for="gf-'+name+'">'+label+'</label><select id="gf-'+name+'" name="'+name+'" required>'+options(list,chosen,'請選擇')+'</select></div>';
function openEditor(kind,recordId){let obj=recordId?db[{site:'sites',zone:'zones',location:'locations',item:'items'}[kind]]?.find(x=>x.id===recordId):null;let fields='';
if(['site','zone','location'].includes(kind)){fields=field('name','名稱',obj?.name||'');if(kind==='zone')fields+=select('site','所屬據點',db.sites.filter(x=>x.enabled||x.id===obj?.site),obj?.site||site);if(kind==='location'){fields+=select('zone','所屬區域',db.zones.filter(x=>x.enabled||x.id===obj?.zone).map(x=>({...x,name:siteName(x.site)+' / '+x.name})),obj?.zone||zone);fields+=select('type','位置類型',['一般貨架','待驗區','待上架區','維修區','待退貨區','報廢區','使用位置','暫存位置','其他'].map(n=>({id:n,name:n})),obj?.type);}}
else if(kind==='item'){
fields='<h3 class="item-form-title">基本資料</h3>'+field('name','品項名稱',obj?.name||'')+'<div class="workflow-field"><label for="gf-categoryId">所屬分類</label><select id="gf-categoryId" name="categoryId" required>'+categoryOptions(obj?.categoryId||childCategory||parentCategory)+(obj&&!obj.categoryId?'<option value="" selected>保留既有分類：'+esc(obj.category||'未分類')+'</option>':'')+'</select></div>'+field('unit','單位',obj?.unit||'個')+select('location','實際位置',db.locations.filter(x=>enabledLocation(x)||x.id===obj?.location).map(x=>({...x,name:siteName(lineage(x.id).s?.id)+' / '+zoneName(x.zone)+' / '+x.name})),obj?.location||location);
fields+='<h3 class="item-form-title">管理設定</h3>'+select('mode','管理方式',['數量管理','批次管理','個別資產',...(obj?.mode==='批量識別'?['批量識別']:[])].map(n=>({id:n,name:n})),obj?.mode||'數量管理')+select('identification','識別方式',['無標籤','QR','NFC＋QR'].map(n=>({id:n,name:n})),obj?.identification||'無標籤')+field('min','低庫存門檻',obj?.min??0,'number')+select('fixed','固定補貨',[{id:'no',name:'否'},{id:'yes',name:'是'}],obj?.fixed?'yes':'no');
fields+=obj&&!obj.quantityPending?'<p class="item-form-title hub-rule">目前可用 '+obj.qty+' '+esc(obj.unit)+'；使用中 '+obj.used+'。庫存數量請透過作業或盤點調整。</p><input type="hidden" name="qty" value="'+obj.qty+'">':field('qty',obj?.quantityPending?'確認可用數量':'期初可用數量',obj?.quantityPending?'':0,'number');
}

openPrototypeModal({title:(obj?'編輯':'新增')+({site:'據點',zone:'區域',location:'實際位置',item:'品項'}[kind]),subtitle:'設定後即時更新選單與作業資料',body:'<form id="genericEditor" data-kind="'+kind+'" data-id="'+esc(recordId||'')+'" class="workflow-form"><div class="workflow-form-grid">'+fields+'</div><div class="workflow-form-actions"><button type="button" class="workflow-cancel-btn" data-workflow-cancel>取消</button><button type="submit" class="workflow-save-btn">儲存</button></div></form>'});if(kind==='item'){const f=document.getElementById('genericEditor');if(obj&&!obj.categoryId)f.elements.categoryId.required=false;if(!obj)f.elements.categoryId.dispatchEvent(new Event('change',{bubbles:true}));}}
prototypeModalBody.addEventListener('change',e=>{const f=e.target.closest('#genericEditor');if(!f||f.dataset.kind!=='item'||f.dataset.id||e.target.name!=='categoryId')return;const c=db.categories.find(x=>x.id===e.target.value);if(!c)return;f.elements.unit.value=c.unit;f.elements.mode.value=c.labelType==='個別識別'?'個別資產':c.labelType==='批量識別'?'批次管理':'數量管理';f.elements.identification.value=c.identification;});
function syncForms(){Object.values(workflowDefinitions).forEach(d=>d.fields.forEach(f=>{if(f[2]!=='select')f[3]='';}));const list=db.locations.filter(enabledLocation);const pipe=list.map(x=>locName(x.id)).join('|');
Object.values(workflowDefinitions).forEach(d=>d.fields.forEach(f=>{if(['warehouse','department','location','scope'].includes(f[0])){f[2]='select';f[3]=pipe;}}));
// Update all warehouse and location filters from the same master configuration.
['inventoryWarehouseFilter','purchaseWarehouseFilter','assetLocationFilter','stocktakeWarehouseFilter'].forEach(key=>{const el=document.getElementById(key);if(!el)return;const old=el.value;el.innerHTML=options(list.map(x=>({id:x.name,name:x.name})),old,'全部位置');});
}
// Homepage presentation shares the existing location master and workflow records.
let calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1),selectedDay=dayKey(new Date());
function dayKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
const homeIcons={"home": "<rect x=\"4\" y=\"4\" width=\"6\" height=\"6\" rx=\"2\"/><rect x=\"14\" y=\"4\" width=\"6\" height=\"6\" rx=\"2\"/><rect x=\"4\" y=\"14\" width=\"6\" height=\"6\" rx=\"2\"/><rect x=\"14\" y=\"14\" width=\"6\" height=\"6\" rx=\"2\"/>", "box": "<rect x=\"4\" y=\"5\" width=\"16\" height=\"15\" rx=\"3\"/><path d=\"M4 10h16M10 5v5M9 15h6\"/>", "truck": "<rect x=\"3\" y=\"5\" width=\"12\" height=\"12\" rx=\"2\"/><path d=\"M15 9h3l3 4v4h-6M6 9h5\"/><circle cx=\"7\" cy=\"18\" r=\"2\" fill=\"var(--surface)\"/><circle cx=\"18\" cy=\"18\" r=\"2\" fill=\"var(--surface)\"/>", "check": "<rect x=\"5\" y=\"4\" width=\"14\" height=\"17\" rx=\"3\"/><rect x=\"9\" y=\"2\" width=\"6\" height=\"4\" rx=\"1.5\" fill=\"var(--surface)\"/><path d=\"m8 13 3 3 5-6\"/>", "shelf": "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"3\"/><path d=\"M4 12h16M9 7h6M9 17h6\"/>", "clock": "<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M12 7v5l3 2\"/>", "cart": "<path d=\"M3 4h2l2 11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l2-7H6\"/><circle cx=\"9\" cy=\"21\" r=\"1\"/><circle cx=\"18\" cy=\"21\" r=\"1\"/>", "asset": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"13\" rx=\"3\"/><path d=\"M9 21h6M12 17v4\"/>", "count": "<rect x=\"5\" y=\"4\" width=\"14\" height=\"17\" rx=\"3\"/><path d=\"M9 3h6M9 10h6M9 15h6\"/>", "more": "<circle cx=\"5\" cy=\"12\" r=\"1\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/><circle cx=\"19\" cy=\"12\" r=\"1\"/>", "settings": "<path d=\"M4 7h16M4 17h16\"/><circle cx=\"9\" cy=\"7\" r=\"3\" fill=\"var(--surface)\"/><circle cx=\"15\" cy=\"17\" r=\"3\" fill=\"var(--surface)\"/>", "bottle": "<path d=\"M10 3h4v4l3 4v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-8l3-4ZM10 3v-1h4v1M10 14h4\"/>", "wrench": "<path d=\"M20 4a5 5 0 0 1-6 7L6 20a2 2 0 0 1-3-3l9-8a5 5 0 0 1 7-6l-4 4 2 2Z\"/>"};
function homeIcon(name){return '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(homeIcons[name]||homeIcons.box)+'</svg>';}
function kpiIcon(name){return homeIcon(name);}
function scopeControls(){return '<div class="hub-filters generic-scope"><label>據點<select id="gSite">'+options(db.sites.filter(x=>x.enabled),site,'全部據點')+'</select></label><label>區域<select id="gZone">'+options(db.zones.filter(x=>x.enabled&&(!site||x.site===site)&&db.sites.find(s=>s.id===x.site)?.enabled),zone,'全部區域')+'</select></label><label>實際位置<select id="gLocation">'+options(db.locations.filter(x=>enabledLocation(x)&&(!zone||x.zone===zone)&&(!site||lineage(x.id).s?.id===site)),location,'全部位置')+'</select></label></div>';}
function calendarTasks(){
 let records=[];try{records=JSON.parse(localStorage.getItem('bomb-wms-prototype-created-records')||'[]');}catch(e){}
 const names={receiving:['收貨核對','receiving','blue'],inspection:['驗收確認','inspection','teal'],putaway:['上架入庫','putaway','amber'],stocktake:['盤點任務','task','teal']};
 const tasks=[];
 for(const r of records){if(!names[r.type])continue;const d=r.data||{},at=new Date(r.createdAt);if(!Number.isFinite(at.getTime()))continue;if(location&&![locName(location)].includes(d.location||d.warehouse))continue;if(!location&&(site||zone)&&!db.locations.some(l=>enabledLocation(l)&&(!site||lineage(l.id).s?.id===site)&&(!zone||l.zone===zone)&&[d.location,d.warehouse,d.scope].includes(l.name)))continue;const n=names[r.type];tasks.push({assignee:d.assignee||d.operatorId||r.assignee,id:r.id,title:n[0]+' · '+(d.item||d.name||''),date:/^\d{4}-\d{2}-\d{2}$/.test(d.date||'')?d.date:dayKey(at),time:at.toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit',hour12:false}),page:r.type==='stocktake'?'stocktake':'inventory',tab:n[1],color:n[2],demo:false});}
 return tasks.filter(t=>(!t.demo||(!site&&!zone&&!location))&&(managerHome()||t.assignee===homeProfile.id));
}
function readableLog(x){const detail=String(x.detail||'');if(x.action==='設定修改'){const split=detail.indexOf(' → ');try{const before=JSON.parse(detail.slice(0,split)),after=JSON.parse(detail.slice(split+3)),labels={name:'名稱',category:'分類',unit:'單位',mode:'管理方式',location:'位置',qty:'可用數量',used:'使用中',min:'補貨門檻',fixed:'固定補貨',identification:'識別方式',enabled:'啟用狀態',quantityPending:'數量待確認',site:'據點',zone:'區域',type:'位置類型'},value=(key,v)=>key==='location'?locName(v):key==='site'?siteName(v):key==='zone'?zoneName(v):typeof v==='boolean'?(v?'是':'否'):String(v??'未設定');const changes=Object.keys(labels).filter(k=>JSON.stringify(before[k])!==JSON.stringify(after[k])).map(k=>labels[k]+'：'+value(k,before[k])+' → '+value(k,after[k]));return (after.name||before.name||'設定')+' · '+(changes.join('；')||'資料已儲存');}catch{return '設定已更新，完整原始紀錄已保留';}}return detail;}
function renderSchedule(){
 const tasks=calendarTasks(),today=dayKey(new Date()),chosen=tasks.filter(t=>t.date===selectedDay).sort((a,b)=>a.time.localeCompare(b.time)),low=db.items.filter(x=>inScope(x)&&x.qty<x.min),first=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),1),start=new Date(first);start.setDate(1-first.getDay());const cells=Math.ceil((first.getDay()+new Date(first.getFullYear(),first.getMonth()+1,0).getDate())/7)*7;
 const kpis=[['truck','待收貨','receiving','blue'],['check','待驗收','inspection','teal'],['shelf','待上架','putaway','amber']].map(([icon,label,tab,color])=>({icon,label,tab,color,value:tasks.filter(t=>t.tab===tab).length}));kpis.push({icon:'clock',label:'逾期待辦',tab:'overdue',color:tasks.some(t=>t.date<today)?'red':'neutral',value:tasks.filter(t=>t.date<today).length});
 hub.innerHTML=(!db.sites.length?'<section class="hub-card clean-start"><div><h2>開始建立你的倉儲</h2><p>1 設定據點與位置　→　2 建立品項　→　3 收貨入庫</p></div><button class="primary-btn" data-g-view="config">設定據點與位置</button></section>':'')+'<div class="home-heading"><div><h1>營運總覽</h1><p>掌握任務、到貨與庫存提醒。</p></div>'+scopeControls()+'</div><div class="home-kpis">'+kpis.map(k=>'<button class="home-kpi" data-home-kpi="'+k.tab+'"><span class="home-icon '+k.color+'">'+kpiIcon(k.icon)+'</span><span><span>'+k.label+'</span><strong>'+k.value+' <small>筆</small></strong></span></button>').join('')+'</div><div class="home-middle"><section class="home-card"><div class="home-card-head calendar-heading"><h2>作業月曆</h2><div class="calendar-controls"><button data-cal-prev aria-label="上個月">‹</button><strong>'+first.getFullYear()+' 年 '+(first.getMonth()+1)+' 月</strong><button data-cal-next aria-label="下個月">›</button><button data-cal-today>今天</button></div><div class="calendar-legend"><span class="blue">● 收貨</span><span class="teal">● 盤點</span><span class="amber">● 上架</span></div></div><div class="calendar-week">'+['日','一','二','三','四','五','六'].map(d=>'<span>'+d+'</span>').join('')+'</div><div class="calendar-grid">'+Array.from({length:cells},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);const key=dayKey(d),ts=tasks.filter(t=>t.date===key);return '<button class="calendar-day '+(d.getMonth()!==first.getMonth()?'outside ':'')+(key===selectedDay?'selected ':'')+(key===today?'today':'')+'" data-cal-day="'+key+'" aria-label="'+key+'，'+ts.length+'筆任務" aria-pressed="'+(key===selectedDay)+'"><span>'+d.getDate()+'</span>'+(ts.length?'<small class="calendar-count">'+ts.length+' 項待辦</small>':'')+'</button>';}).join('')+'</div></section><section class="home-card"><div class="home-card-head"><h2>'+Number(selectedDay.slice(5,7))+' 月 '+Number(selectedDay.slice(8))+' 日｜當日待辦</h2></div><div class="day-tasks">'+(chosen.length?chosen.map((t,i)=>'<article class="day-task"><span class="task-bar '+t.color+'"></span><strong>'+esc(t.time)+'</strong><div><div class="task-heading"><strong>'+esc(t.title)+'</strong><span class="task-status '+(t.tab==='task'?'in-progress':'')+'">'+(t.tab==='task'?'進行中':'待處理')+'</span></div><small>'+esc(t.id)+(t.demo?' · 示範':'')+'</small></div><button class="primary-btn '+(t.tab==='task'?'outline':'')+'" data-home-task="'+tasks.indexOf(t)+'">'+(t.tab==='task'?'查看':'執行')+'</button></article>').join(''):'<div class="home-empty">此日沒有待辦事項</div>')+'</div>'+(tasks.some(t=>t.date<today)?'<button class="home-overdue" data-home-kpi="overdue">'+homeIcon('clock')+'逾期 '+tasks.filter(t=>t.date<today).length+' 筆待辦<span>›</span></button>':'<div class="home-overdue is-clear" role="status">'+homeIcon('check')+'目前無逾期待辦</div>')+'<p class="home-caption">新增作業後，依日期顯示待辦。</p></section></div><div class="home-bottom"><section class="home-card"><div class="home-card-head"><h2>庫存提醒</h2><button data-g-view="stock">查看全部 →</button></div>'+ (low.length?low.slice(0,4).map(x=>'<article class="stock-alert"><span class="home-icon blue">'+homeIcon(x.mode==='個別資產'?'wrench':'bottle')+'</span><div><strong>'+esc(x.name)+'</strong><small>'+esc(locName(x.location))+' · 可用 '+x.qty+' / 門檻 '+x.min+'</small></div><meter min="0" max="'+Math.max(x.min,1)+'" value="'+x.qty+'"></meter><button class="secondary-action-btn" data-g-request="'+x.id+'">補貨</button></article>').join(''):'<div class="home-empty">目前沒有低庫存品項</div>')+'</section><section class="home-card"><div class="home-card-head"><h2>最近異動</h2><button data-g-logs>查看全部 →</button></div>'+ (db.logs.length?db.logs.slice(0,4).map(x=>'<article class="recent-row"><span class="teal">●</span><div><strong>'+esc(x.action)+'</strong><small>'+esc(readableLog(x))+'</small></div><small>'+esc(x.time)+'<br>'+esc(x.actor)+'</small></article>').join(''):'<div class="home-empty">尚無異動，完成新增或補貨後顯示於此。</div>')+'</section></div>';
}

function homeWorkRows(){const tasks=calendarTasks().map(t=>({...t,kind:'legacy'}));
for(const r of inboundRows()){if(!['inspection','putaway'].includes(r.stage)||(!managerHome()&&r.assignee!==homeProfile.id))continue;if(site||zone||location){const item=db.items.find(x=>x.id===r.item);if(!item||!inScope(item))continue;}tasks.push({id:r.id,title:(r.stage==='inspection'?'驗收':'入庫')+' · '+r.name,kind:'inbound',state:r.stage==='inspection'?'待驗收':'待入庫',date:r.date});}
for(const r of disposalRows()){if(!['pending','retained'].includes(r.stage)||(!managerHome()&&r.applicant!==homeProfile.id))continue;if(site||zone||location){const item=db.items.find(x=>x.id===r.item);if(!item||!inScope(item))continue;}tasks.push({id:r.id,title:'報廢 · '+r.name,kind:'disposal',state:r.stage==='pending'?'待簽核':'報廢留存',date:r.due?r.due.slice(0,10):dayKey(new Date()),passive:!managerHome()||r.stage==='retained'&&Date.now()<Date.parse(r.due)});}
return tasks.sort((a,b)=>String(a.date).localeCompare(String(b.date)));}
function renderWork(){renderSchedule();const calendar=hub.querySelector('.home-middle')?.outerHTML||'',recent=hub.querySelector('.home-bottom')?.outerHTML||'',isManager=managerHome(),tasks=homeWorkRows(),today=dayKey(new Date()),overdue=tasks.filter(t=>t.date<today&&t.kind!=='disposal'),approval=tasks.filter(t=>t.kind==='disposal'&&t.state==='待簽核'),low=db.items.filter(x=>inScope(x)&&x.enabled!==false&&!x.quantityPending&&x.qty<x.min),mine=tasks.filter(t=>t.date===today);
const stats=isManager?[['待簽核',approval.length,'disposal','check'],['待驗收／入庫',tasks.filter(t=>t.kind==='inbound').length,'inbound','truck'],['低庫存品項',low.length,'stock','box'],['逾期待辦',overdue.length,'schedule','clock']]:[['我的待辦',tasks.length,'schedule','check'],['今日待辦',mine.length,'schedule','clock'],['我的報廢申請',tasks.filter(t=>t.kind==='disposal').length,'disposal','box']];
const actions=isManager?[['inbound','收貨與入庫','登記到貨、驗收與上架','truck'],['disposal','報廢簽核','檢視申請與留存狀況','check'],['stock','庫存查詢','查看數量、位置及補貨','box'],['config','倉儲設定','建立據點、區域與位置','settings']]:[['issue','領用物品','登記領取品項與數量','box'],['return','歸還物品','登記物品歸還','shelf'],['count','盤點作業','查看盤點任務與清點入口','count'],['disposal','報廢申請','送出原因與數量','check']];
hub.innerHTML='<div class="role-home-heading"><div><span class="role-home-eyebrow">'+(isManager?'管理者工作台':'員工作業台')+'</span><h1>'+esc(homeProfile.name)+'，你好</h1><p>'+new Date().toLocaleDateString('zh-TW',{year:'numeric',month:'long',day:'numeric',weekday:'long'})+' · '+(isManager?'先處理需要你決定的事':'先完成指派給你的工作')+'</p></div><button class="secondary-action-btn" data-session-logout>登出</button></div>'+(isManager&&db.sites.length?scopeControls():'')+'<div class="role-home-stats">'+stats.map(([label,n,target,icon])=>'<button data-home-route="'+target+'"><span>'+esc(label)+'</span><strong>'+n+'<small> '+(label.includes('品項')?'項':'筆')+'</small></strong>'+homeIcon(icon)+'</button>').join('')+'</div><div class="role-home-main"><section class="home-card role-home-tasks"><div class="home-card-head"><h2>'+(isManager?'待處理事項':'我的待辦')+'</h2><span>'+tasks.length+' 筆</span></div>'+(tasks.length?tasks.slice(0,6).map((t,i)=>'<article class="role-task"><div><strong>'+esc(t.title)+'</strong><small>'+esc(t.id)+' · '+esc(t.date||'未排定日期')+'</small></div><span class="hub-status">'+esc(t.state||'待處理')+'</span><button class="secondary-action-btn" data-role-task="'+i+'">'+(t.passive?'查看':'處理')+'</button></article>').join(''):'<div class="role-empty">'+homeIcon('check')+'<h3>'+(isManager?'目前沒有待處理事項':'目前沒有指派給你的待辦')+'</h3><p>'+(isManager?'新增作業後，相關提醒會集中顯示在這裡。':'指派的任務與本人申請會顯示在這裡。')+'</p></div>')+'</section><section class="home-card role-home-actions"><div class="home-card-head"><h2>開始作業</h2></div><div>'+actions.map(([target,label,sub,icon])=>'<button data-home-route="'+target+'">'+homeIcon(icon)+'<span><strong>'+label+'</strong><small>'+sub+'</small></span><span>›</span></button>').join('')+'</div></section></div>'+(!db.sites.length?'<div class="role-setup-note">'+(isManager?'<div><strong>尚未建立倉儲資料</strong><p>先設定位置，再建立品項，就能開始收貨。</p></div><button class="secondary-action-btn" data-home-route="config">開始設定</button>':'<div><strong>倉儲資料尚未建立</strong><p>管理者完成位置與品項設定後，即可開始作業。</p></div>')+'</div>':'')+'<details class="role-home-details" id="homeSchedule"><summary>作業月曆</summary>'+calendar+'</details>'+(isManager?'<details class="role-home-details"><summary>庫存提醒與最近異動</summary>'+recent+'</details>':'')+'<p class="role-preview-caption">原型登入；正式帳號驗證與權限控制尚未串接。</p>';
document.documentElement.dataset.homeRole=homeProfile.role;document.querySelectorAll('.user-avatar,.top-avatar').forEach(el=>el.textContent=homeProfile.name.slice(0,2));document.querySelector('.user-info strong').textContent=homeProfile.name;document.querySelector('.user-info small').textContent=isManager?'管理者':'員工';}
function homeRoute(target){if(target==='schedule'){const d=document.getElementById('homeSchedule');d.open=true;d.scrollIntoView({block:'start',behavior:'smooth'});return;}if(['stock','inbound','disposal','config'].includes(target)){view=target;render();return;}if(target==='count'){showPage('stocktake',true);return;}if(target==='issue'||target==='return'){showPage('inventory',true);if(target==='issue')document.querySelector('[data-inventory-tab="outbound"]')?.click();else document.querySelector('[data-module="returns"]')?.click();}}
hub.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.homeRoute)homeRoute(b.dataset.homeRoute);if(b.dataset.roleTask!==undefined){const t=homeWorkRows()[Number(b.dataset.roleTask)];if(!t)return;if(t.kind==='legacy'){showPage(t.page,true);document.querySelector('[data-'+(t.page==='stocktake'?'stocktake':'inventory')+'-tab="'+t.tab+'"]')?.click();}else{view=t.kind;render();}}});

hub.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-cal-prev')||b.hasAttribute('data-cal-next')){calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+(b.hasAttribute('data-cal-prev')?-1:1),1);render();}if(b.hasAttribute('data-cal-today')){calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);selectedDay=dayKey(new Date());render();}if(b.dataset.calDay){selectedDay=b.dataset.calDay;render();}if(b.dataset.homeTask!==undefined){const t=calendarTasks()[Number(b.dataset.homeTask)];if(t){showPage(t.page,true);document.querySelector('[data-workspace-tabs="'+t.page+'"] [data-module="base"]')?.click();t.page==='inventory'?showInventoryTab(t.tab):showStocktakeTab(t.tab);}}if(b.dataset.homeKpi){const tab=b.dataset.homeKpi;if(tab==='overdue'){const overdue=calendarTasks().filter(t=>t.date<dayKey(new Date()));openPrototypeModal({title:'逾期待辦',subtitle:'以單據日期比對今日；Prototype 待辦尚未串接正式期限引擎',body:overdue.length?overdue.map(t=>'<div class="modal-list-row"><strong>'+esc(t.title)+'</strong><small>'+esc(t.id)+' · '+t.date+'</small></div>').join(''):'<p>目前沒有逾期待辦。</p>'});}else{showPage('inventory',true);document.querySelector('[data-workspace-tabs="inventory"] [data-module="base"]')?.click();showInventoryTab(tab);}}});
document.querySelector('.brand-title').textContent='BOMB WMS';
document.querySelector('.brand-mark').innerHTML='<svg class="ui-icon" viewBox="0 0 40 44" aria-hidden="true"><path d="m20 2 17 9-7 4-10-6-10 6-7-4Z" fill="#c3dbef"/><path d="m3 14 12 7v19L3 33Z" fill="#0089ff"/><path d="m37 14-12 7v19l12-7Z" fill="#1876dd"/><path d="m20 16 7 4-7 4-7-4Z" fill="#94cfff"/><path d="M17 27v13l3 2 3-2V27l-3 2Z" fill="#d4e9fa"/><path d="m3 14 5 3v10l7 4v9L3 33ZM37 14l-5 3v10l-7 4v9l12-7Z" fill="#0874bd"/></svg>';
document.querySelector('.user-info strong').textContent='系統管理員';
const navIconNames={dashboard:'home',inventory:'box',purchase:'cart',asset:'asset',stocktake:'count',more:'more'};
document.querySelectorAll('.nav-btn[data-page]').forEach(b=>{const n=b.querySelector('.nav-icon');if(n)n.innerHTML=homeIcon(navIconNames[b.dataset.page]);});

const oldShow=showPage;showPage=function(page,legacy=false){const home=page==='dashboard'||page==='field'||(page==='inventory'&&!legacy);if(page==='inventory'&&!legacy)view='stock';oldShow(home?'dashboard':page);hub.hidden=!home;if(home){dashboardPage.classList.add('hidden');document.getElementById('fieldWorkspace').hidden=true;render();}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-page="dashboard"],[data-mobile="dashboard"]');if(b)view='work';},true);

document.querySelector('.workspace-switch').style.display='none';document.querySelector('.warehouse').style.display='none';document.querySelector('.search').style.display='none';const title=document.createElement('strong');title.className='hub-top-title';title.textContent='BOMB WMS · 通用倉儲管理';document.querySelector('.topbar').prepend(title);
const setup=document.createElement('button');setup.type='button';setup.className='nav-btn';setup.innerHTML=homeIcon('settings')+'<span>設定</span>';setup.setAttribute('aria-label','據點與位置設定');setup.addEventListener('click',()=>{view='config';showPage('dashboard');});const setupWrap=document.createElement('div');setupWrap.className='sidebar-settings';setupWrap.append(setup);document.querySelector('.sidebar-user').before(setupWrap);
hub.addEventListener('change',ev=>{if(ev.target.id==='gSite'){site=ev.target.value;zone='';location='';render();}if(ev.target.id==='gZone'){zone=ev.target.value;location='';render();}if(ev.target.id==='gLocation'){location=ev.target.value;render();}});
hub.addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;
if(b.hasAttribute('data-clean-backup')){const raw=localStorage.getItem('bomb-wms-clean-backup-v1');if(raw){const url=URL.createObjectURL(new Blob([raw],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='BOMB-WMS-清空前備份.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}else showPrototypeToast('沒有清空前備份');}

if(b.dataset.hierarchy){if(b.dataset.hierarchy==='site'){site=b.dataset.id;zone='';location='';}else if(b.dataset.hierarchy==='zone'){zone=b.dataset.id;location='';}else location=b.dataset.id;render();return;}
if(b.dataset.gView){view=b.dataset.gView;render();}if(b.dataset.gCreate)openEditor(b.dataset.gCreate);if(b.dataset.gEdit)openEditor(b.dataset.gEdit,b.dataset.id);
if(b.dataset.gToggle){const arr=db[{site:'sites',zone:'zones',location:'locations',item:'items'}[b.dataset.gToggle]],x=arr.find(v=>v.id===b.dataset.id);transact(()=>{x.enabled=x.enabled===false;log(x.enabled?'啟用':'停用',x.name);});}
if(b.hasAttribute('data-item-search')){selectedItems.clear();itemKeyword=document.getElementById('itemKeyword').value.trim();itemState=document.getElementById('itemState').value;render();}
if(b.hasAttribute('data-g-search')){keyword=document.getElementById('gKeyword').value;status=document.getElementById('gStatus').value;render();}
if(b.dataset.gPage)showPage(b.dataset.gPage,true);
if(b.hasAttribute('data-g-logs'))openPrototypeModal({title:'異動紀錄',subtitle:'操作前後資料與來源、目的皆保留',body:db.logs.length?db.logs.map(x=>'<div class="modal-list-row"><div><strong>'+esc(x.action)+'</strong><small>'+esc(readableLog(x))+' · '+esc(x.actor)+' · '+esc(x.time)+'</small></div></div>').join(''):'<p>尚無紀錄</p>'});
const itemId=b.dataset.gCount||b.dataset.gRequest;
if(itemId){const x=db.items.find(v=>v.id===itemId);if(!x||x.enabled===false||x.quantityPending){showPrototypeToast('品項已停用或數量待確認，請先至品項管理處理');return;}const count=!!b.dataset.gCount,candidates=db.items.filter(v=>v.enabled!==false&&v.id!==x.id&&v.name===x.name&&v.unit===x.unit&&v.location!==x.location&&enabledLocation(db.locations.find(l=>l.id===v.location)||{}));
openPrototypeModal({title:(count?'盤點：':'補貨：').replace('盤','盤')+x.name,subtitle:count?'提交盤點差異，待複查後調整':'來源由人員選擇，不固定任何據點',body:'<form id="genericOperation" data-kind="'+(count?'count':'request')+'" data-id="'+x.id+'" class="workflow-form">'+(!count?select('source','補貨來源',candidates.map(v=>({id:v.id,name:locName(v.location)+' · 可用 '+v.qty+' '+v.unit}))):'')+field('qty',count?'實盤數量':'申請數量',count?x.qty:Math.max(1,x.min-x.qty),'number')+field('reason','原因／備註',count?'現場清點':'低庫存補貨')+(candidates.length||count?'':'<p class="hub-rule">沒有相同品項的可用來源，請新增來源庫存或建立採購需求。</p>')+'<div class="workflow-form-actions"><button type="button" class="workflow-cancel-btn" data-workflow-cancel>取消</button><button type="submit" class="workflow-save-btn">送出</button></div></form>'});}
if(b.dataset.gNext){const r=db.requests.find(v=>v.id===b.dataset.gNext);if(!r||r.step>=4)return;const src=db.items.find(v=>v.id===r.source),dst=db.items.find(v=>v.id===r.target);if(!src||!dst)return;
if(!enabledLocation(db.locations.find(x=>x.id===src.location)||{})||!enabledLocation(db.locations.find(x=>x.id===dst.location)||{})){showPrototypeToast('來源或目的位置已停用，請先啟用或改派');return;}
const reserved=db.requests.filter(x=>x.id!==r.id&&x.source===r.source&&x.step>=1&&x.step<4).reduce((n,x)=>n+x.qty,0);if((r.step===0||r.step===3)&&src.qty-reserved<r.qty){showPrototypeToast('來源可用庫存不足，請調整補貨或採購');return;}
transact(()=>{if(r.step===3){const before=src.qty+'/'+dst.qty;src.qty-=r.qty;dst.qty+=r.qty;log('補貨入庫',locName(src.location)+' → '+locName(dst.location)+' · '+before+' → '+src.qty+'/'+dst.qty);}r.step++;log('補貨進度',r.id+' · '+steps[r.step]);});}
if(b.hasAttribute('data-g-export')){const csv='\uFEFF'+[['品項','據點','區域','位置','可用','使用中','單位'],...rows().map(x=>{const a=lineage(x.location);return [x.name,a.s?.name,a.z?.name,a.l?.name,x.qty,x.used,x.unit];})].map(r=>r.map(csvCell).join(',')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='BOMB-WMS-庫存.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
});
prototypeModalBody.addEventListener('submit',ev=>{const f=ev.target;if(!['genericEditor','genericOperation'].includes(f.id))return;ev.preventDefault();const data=Object.fromEntries(new FormData(f)),kind=f.dataset.kind;
if(f.id==='genericEditor'){
if(!String(data.name||'').trim()){showPrototypeToast('請填名稱');return;}
if(kind==='zone'&&!db.sites.some(x=>x.id===data.site&&x.enabled)||kind==='location'&&!db.zones.some(x=>x.id===data.zone&&x.enabled)){showPrototypeToast('請選擇有效上層');return;}
if(kind==='item'&&(!db.locations.some(x=>x.id===data.location&&enabledLocation(x))||![data.qty,data.min].every(v=>Number.isInteger(Number(v))&&Number(v)>=0))){showPrototypeToast('請確認有效位置與非負整數數量');return;}
const itemBefore=kind==='item'?db.items.find(x=>x.id===f.dataset.id):null;if(kind==='item'&&(!itemBefore||data.categoryId!==itemBefore.categoryId)&&!(itemBefore&&!itemBefore.categoryId&&!data.categoryId)&&!categoryEnabled(db.categories.find(x=>x.id===data.categoryId))){showPrototypeToast('請先選擇啟用分類');return;}
const arr=db[{site:'sites',zone:'zones',location:'locations',item:'items'}[kind]],existing=arr.find(x=>x.id===f.dataset.id),parent=kind==='zone'?'site':kind==='location'?'zone':null;
if(arr.some(x=>x.id!==existing?.id&&x.name===data.name.trim()&&(!parent||x[parent]===data[parent]))&&kind!=='item'){showPrototypeToast('同一層級名稱不可重複');return;}
const ok=transact(()=>{const value={...data,name:data.name.trim(),id:existing?.id||id(kind),enabled:existing?.enabled??true};if(kind==='item')Object.assign(value,{category:categoryPath(db.categories.find(x=>x.id===data.categoryId))||existing?.category||'未分類',qty:Number(data.qty),min:Number(data.min),quantityPending:false,used:existing?.used??0,fixed:data.fixed==='yes'});if(existing){const before=JSON.stringify(existing);Object.assign(existing,value);log('設定修改',before+' → '+JSON.stringify(existing));}else{arr.push(value);log('新增設定',kind+' · '+value.name);}});if(ok)closePrototypeModal();
}else{const x=db.items.find(v=>v.id===f.dataset.id),qty=Number(data.qty);if(!x||!Number.isInteger(qty)||qty<(kind==='count'?0:1)||!String(data.reason||'').trim()){showPrototypeToast('請確認數量與原因');return;}
if(kind==='request'){const source=db.items.find(v=>v.id===data.source);if(!source||source.location===x.location||source.name!==x.name||source.unit!==x.unit){showPrototypeToast('請選有效的同品項來源');return;}}
const ok=transact(()=>{if(kind==='count'){log('盤點送複查',x.name+' · 帳面 '+x.qty+'／實盤 '+qty+' · '+data.reason);db.logs[0].review='待複查';}else{db.requests.unshift({id:id('RP'),source:data.source,target:x.id,qty,step:0,reason:data.reason});log('建立補貨申請',x.name+' · '+qty+' '+x.unit);}});if(ok)closePrototypeModal();}
});


// Disposal quantities are isolated from usable stock; historical records are never deleted.
const disposalRows=()=>db.disposals||[];
const disposalLabels={pending:'待報廢',retained:'報廢留存',discarded:'已丟棄',rejected:'已駁回'};
function disposalHistory(r,action,detail){const h={action,detail,actor:'OG',time:new Date().toLocaleString('zh-TW')};r.history.push(h);log(action,r.id+' · '+r.name+' · '+detail);}
function renderDisposal(){const list=disposalRows();hub.innerHTML=header()+itemTabs()+'<section class="hub-card"><div class="hub-card-head"><div><h2>報廢作業</h2><p>申請後隔離數量，簽核後留存，期限到期才能丟棄。OG 原型帳號可體驗全部操作。</p></div><button class="primary-btn" data-disposal-action="create">申請報廢</button></div><div class="hub-summary">'+['pending','retained','discarded'].map(k=>'<div><span>'+disposalLabels[k]+'</span><strong>'+list.filter(r=>r.stage===k).length+'<small>筆</small></strong></div>').join('')+'</div><div class="disposal-list">'+(list.length?list.map(r=>'<article class="disposal-card"><div><h3>'+esc(r.name)+' <span class="hub-status">'+disposalLabels[r.stage]+'</span></h3><p>'+r.qty+' '+esc(r.unit)+' · '+esc(r.reason)+'</p><small>'+esc(r.id)+' · '+esc(r.detail)+'</small><p>來源：'+esc(locName(r.source))+(r.holding?'　留存：'+esc(locName(r.holding)):'')+'</p>'+(r.due?'<p>可丟棄日期：'+esc(r.due.slice(0,10))+'</p>':'')+'</div><div class="hub-row-actions">'+(r.stage==='pending'?'<button data-disposal-action="approve" data-id="'+r.id+'">主管簽核</button><button data-disposal-action="reject" data-id="'+r.id+'">駁回</button>':r.stage==='retained'?'<button data-disposal-action="discard" data-id="'+r.id+'">丟棄確認</button>':'')+'<button data-disposal-action="history" data-id="'+r.id+'">歷程</button></div></article>').join(''):'<div class="hub-empty">尚無報廢申請。牌、球與其他品項皆可使用此流程。</div>')+'</div></section>';}
function disposalModal(kind,r){const available=db.locations.filter(enabledLocation).map(x=>({id:x.id,name:(lineage(x.id).s?.name||'')+' → '+(lineage(x.id).z?.name||'')+' → '+x.name}));let body='';
if(kind==='create')body=select('item','品項與來源',db.items.filter(x=>x.enabled!==false&&!x.quantityPending&&(x.qty>0||x.used>0)).map(x=>({id:x.id,name:x.name+' · '+locName(x.location)+' · 可用 '+x.qty+'／使用中 '+x.used})))+select('pool','報廢數量來源',[{id:'qty',name:'可用庫存'},{id:'used',name:'使用中'}])+field('qty','報廢數量',1,'number')+select('reason','報廢原因',['物理損壞','使用年限到期','規格不符','其他'].map(name=>({id:name,name})))+field('detail','原因說明');
if(kind==='approve')body='<p>'+esc(r.name)+' · '+r.qty+' '+esc(r.unit)+'</p>'+select('holding','報廢留存位置',available)+field('days','留存天數（0 表示可立即丟棄）',r.days??30,'number')+field('detail','簽核說明');
if(kind==='reject')body=field('detail','駁回原因');
if(kind==='discard')body='<p>確認丟棄 '+esc(r.name)+' '+r.qty+' '+esc(r.unit)+'。丟棄後移出作業清單，完整歷程仍保留。</p><label><input type="checkbox" name="confirm" required> 我已確認實物與數量，並執行丟棄</label>'+field('detail','丟棄說明');
openPrototypeModal({title:{create:'申請報廢',approve:'主管簽核',reject:'駁回申請',discard:'丟棄二次確認'}[kind],subtitle:'原型操作人員：OG；正式角色與簽呈串接待技術團隊接入',body:'<form id="disposalForm" data-kind="'+kind+'" data-id="'+(r?.id||'')+'" class="workflow-form">'+body+'<div class="workflow-form-actions"><button type="button" class="workflow-cancel-btn" data-workflow-cancel>取消</button><button class="workflow-save-btn" type="submit">確認送出</button></div></form>'});}
hub.addEventListener('click',e=>{const b=e.target.closest('[data-disposal-action]');if(!b)return;const kind=b.dataset.disposalAction,r=disposalRows().find(x=>x.id===b.dataset.id);if(kind==='history'){openPrototypeModal({title:'報廢歷程',body:r.history.map(h=>'<div class="modal-list-row"><div><strong>'+esc(h.action)+'</strong><small>'+esc(h.detail)+' · '+esc(h.actor)+' · '+esc(h.time)+'</small></div></div>').join('')});return;}if(kind!=='create'&&!r)return;if(kind==='discard'&&Date.now()<Date.parse(r.due)){showPrototypeToast('留存期限尚未到期');return;}disposalModal(kind,r);});
prototypeModalBody.addEventListener('submit',e=>{const f=e.target;if(f.id!=='disposalForm')return;e.preventDefault();const d=Object.fromEntries(new FormData(f)),kind=f.dataset.kind,r=disposalRows().find(x=>x.id===f.dataset.id);const fail=m=>showPrototypeToast(m);if(!String(d.detail||'').trim())return fail('請填寫原因或操作說明');
if(kind==='create'){const x=db.items.find(x=>x.id===d.item),qty=Number(d.qty);if(!x||x.enabled===false||x.quantityPending||!['qty','used'].includes(d.pool)||!Number.isSafeInteger(qty)||qty<1||qty>x[d.pool]||!['物理損壞','使用年限到期','規格不符','其他'].includes(d.reason))return fail('請確認來源、原因與可報廢數量');const reserved=db.requests.filter(z=>z.source===x.id&&z.step>=1&&z.step<4).reduce((n,z)=>n+z.qty,0);if(d.pool==='qty'&&qty>x.qty-reserved)return fail('數量已被補貨作業保留');const ok=transact(()=>{const row={applicant:homeProfile.id,id:id('DP'),item:x.id,name:x.name,unit:x.unit,source:x.location,pool:d.pool,qty,reason:d.reason,detail:d.detail.trim(),stage:'pending',history:[]};x[d.pool]-=qty;(db.disposals||=[]).unshift(row);disposalHistory(row,'申請報廢','隔離 '+qty+' '+x.unit+' · '+d.reason+' · '+d.detail);});if(ok)closePrototypeModal();return;}
if(!r)return;if(['approve','reject'].includes(kind)&&r.stage!=='pending'||kind==='discard'&&r.stage!=='retained')return fail('狀態已變更，請重新開啟');
if(kind==='approve'&&(!db.locations.some(x=>x.id===d.holding&&enabledLocation(x))||!/^\d+$/.test(d.days)||Number(d.days)>36500))return fail('請選有效留存位置與 0–36500 天');
if(kind==='discard'&&(!d.confirm||Date.now()<Date.parse(r.due)))return fail('請確認丟棄與留存期限');
const x=db.items.find(x=>x.id===r.item);if(kind==='reject'&&(!x||!Number.isSafeInteger(x[r.pool]+r.qty)))return fail('來源數量異常，無法退回');
const ok=transact(()=>{if(kind==='approve'){r.stage='retained';r.holding=d.holding;r.days=Number(d.days);r.retainedAt=new Date().toISOString();r.due=new Date(Date.now()+r.days*86400000).toISOString();}if(kind==='reject'){r.stage='rejected';x[r.pool]+=r.qty;}if(kind==='discard'){r.stage='discarded';r.discardedAt=new Date().toISOString();}disposalHistory(r,{approve:'主管核准報廢',reject:'駁回報廢並退回數量',discard:'丟棄確認'}[kind],d.detail+(kind==='approve'?' · '+locName(r.holding)+' · 留存 '+r.days+' 天':''));});if(ok)closePrototypeModal();
});

// Location management routes to the shared master configuration.
document.addEventListener('click',event=>{const b=event.target.closest('[data-module],[data-prototype-action]');if(!b)return;if(b.dataset.module==='locations'||['warehouse-manage','warehouse-manage-office','machine-location'].includes(b.dataset.prototypeAction)){event.stopImmediatePropagation();view='config';showPage('dashboard');}},true);
// Existing integrated forms also select locations from the shared master data.
document.addEventListener('click',event=>{const b=event.target.closest('[data-module-create],[data-field-action]');if(!b)return;const available=db.locations.filter(enabledLocation);const form=document.getElementById('integratedForm');if(form){const indexes={returns:3,maintenance:1,headsets:2,disposal:3,asset:2};const index=indexes[form.dataset.module];if(index!==undefined){const input=form.querySelector('[name="v'+index+'"]');if(input){const selectEl=document.createElement('select');selectEl.name=input.name;selectEl.id=input.id;selectEl.required=true;selectEl.innerHTML=options(available.map(x=>({id:x.name,name:x.name})),'','請選擇位置');input.replaceWith(selectEl);}}}const fieldForm=document.getElementById('fieldForm');if(fieldForm){const selectEl=fieldForm.querySelector('[name="location"]');if(selectEl)selectEl.innerHTML=options(available.map(x=>({id:x.name,name:x.name})),'','請選擇位置');}});

document.querySelectorAll('[data-page="dashboard"],[data-mobile="dashboard"]').forEach(b=>b.addEventListener('click',()=>{view='work';render();}));
prototypeModalBody.addEventListener('submit',()=>setTimeout(()=>{if(!hub.hidden&&view==='work')render();},0));
syncForms();showPage('dashboard');

const loginScreen=document.getElementById('wmsLogin'),appShell=document.querySelector('.app'),loginForm=document.getElementById('wmsLoginForm');
document.getElementById('loginLogo').innerHTML=document.querySelector('.brand-mark').innerHTML;document.querySelectorAll('[data-login-theme]').forEach(el=>{el.innerHTML=document.querySelector('[data-set-theme="'+el.dataset.loginTheme+'"] svg').outerHTML;});
function displaySession(){appShell.hidden=!activeSession;loginScreen.hidden=activeSession;document.documentElement.dataset.session=activeSession?'in':'out';if(activeSession){site=zone=location='';view='work';showPage('dashboard');document.querySelector('.top-user-text strong').textContent=homeProfile.name;document.querySelector('.top-user-text small').textContent=managerHome()?'管理者':'員工';}else{loginForm.reset();document.getElementById('loginError').hidden=true;document.getElementById('loginId').focus();}}
loginForm.addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(loginForm)),id=String(d.profileId||'').trim(),name=String(d.profileName||'').trim(),error=document.getElementById('loginError');if(!['manager','employee'].includes(d.role)||!id||!name){error.textContent='請選擇身分，並填寫人員編號與姓名。';error.hidden=false;return;}const next={role:d.role,id,name};try{sessionStorage.setItem(SESSION_KEY,JSON.stringify(next));homeProfile=next;activeSession=true;displaySession();window.scrollTo(0,0);}catch{error.textContent='無法建立原型工作階段，請確認瀏覽器儲存設定。';error.hidden=false;}});
document.addEventListener('click',e=>{const theme=e.target.closest('[data-login-theme]');if(theme){applyTheme(theme.dataset.loginTheme);localStorage.setItem('bomb-wms-theme',theme.dataset.loginTheme);}if(e.target.closest('[data-session-logout]')){sessionStorage.removeItem(SESSION_KEY);activeSession=false;closePrototypeModal();displaySession();window.scrollTo(0,0);}});
displaySession();

})();

