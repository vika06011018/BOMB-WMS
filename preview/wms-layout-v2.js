
(function(){
const replacements=[["\u7e3d\u90e8\u4e3b\u5009", "A1"], ["\u8fa6\u516c\u5ba4\u5099\u54c1\u5009", "B1"], ["\u4f01\u5283\u90e8\u5171\u7528\u54c1", "\u793a\u7bc4\u6d88\u8017\u54c1"], ["\u4f01\u5283\u90e8", "\u4f7f\u7528\u5340"], ["\u7e3d\u90e8", "\u793a\u7bc4\u64da\u9ede"], ["\u8fa6\u516c\u5ba4", "\u4f7f\u7528\u5340"], ["\u4f5c\u696d\u5340", "\u5009\u5132\u5340"], ["\u6a5f\u53f0\u5340", "\u8a2d\u5099\u5340"], ["\u68da\u53401 \u771f\u4eba", "\u793a\u7bc4\u4f4d\u7f6e C"], ["\u68da\u53402 RB", "\u793a\u7bc4\u4f4d\u7f6e D"], ["\u68da\u53403 MBL", "\u793a\u7bc4\u4f4d\u7f6e E"], ["\u6d17\u724c\u623f", "\u793a\u7bc4\u4f4d\u7f6e F"], ["\u5009\u67b6 2 \u5c64", "\u793a\u7bc4\u8ca8\u67b6"], ["\u4e3b\u5009", "A1"], ["\u5099\u54c1\u5009", "B1"], ["\u6d17\u724c\u8a2d\u5099", "\u4f5c\u696d\u8a2d\u5099"], ["\u724c\u76d2", "\u5468\u8f49\u7bb1"], ["\u724c\u9774", "\u5de5\u5177\u7bb1"], ["\u7403\u76d2", "\u96f6\u4ef6\u76d2"], ["\u64b2\u514b\u724c", "\u8017\u6750"], ["\u6a5f\u68b0\u624b\u81c2\u65b0\u724c", "\u8a2d\u5099\u8017\u6750"], ["\u6a5f\u68b0\u624b\u81c2", "\u8a2d\u5099"], ["\u76d8", "\u76e4"]];
function convert(v){if(typeof v==='string'){for(const [from,to] of replacements)v=v.split(from).join(to);return v;}if(Array.isArray(v))return v.map(convert);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,value])=>[k,convert(value)]));return v;}
for(const key of ['bomb-wms-prototype-created-records','bomb-wms-integrated-workspace-v1']){try{const raw=localStorage.getItem(key);if(raw){const next=JSON.stringify(convert(JSON.parse(raw)));if(next!==raw)localStorage.setItem(key,next);}}catch(e){}}
})();

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
        <div class="modal-list-row">
          <div>
            <strong>低庫存提醒</strong>
            <small>成品 ITM0003 可用量已低於安全庫存。</small>
          </div>
          <span class="modal-chip">待處理</span>
        </div>
        <div class="modal-list-row">
          <div>
            <strong>待驗收</strong>
            <small>目前共有 8 張驗收單尚未完成。</small>
          </div>
          <span class="modal-chip">8 單</span>
        </div>
        <div class="modal-list-row">
          <div>
            <strong>盤點差異</strong>
            <small>A1與B1共有 3 項差異待複核。</small>
          </div>
          <span class="modal-chip">3 項</span>
        </div>
      </div>
    `
  },

  'todo-all':{
    title:'我的待辦',
    subtitle:'目前需要處理的 WMS 作業',
    body:`
      <div class="modal-info-grid">
        <div class="modal-info-card"><span>待收貨</span><strong>12 單</strong></div>
        <div class="modal-info-card"><span>待驗收</span><strong>8 單</strong></div>
        <div class="modal-info-card"><span>待入庫</span><strong>15 單</strong></div>
        <div class="modal-info-card"><span>庫存異常</span><strong>6 項</strong></div>
      </div>
    `
  },

  'inventory-detail':{
    title:'庫存狀態摘要',
    subtitle:'現有量與異常概況',
    body:`
      <div class="modal-list">
        <div class="modal-list-row"><div><strong>成品</strong><small>目前庫存量 5,240</small></div><span class="modal-chip">42%</span></div>
        <div class="modal-list-row"><div><strong>原物料</strong><small>目前庫存量 3,120</small></div><span class="modal-chip">25%</span></div>
        <div class="modal-list-row"><div><strong>包裝材料</strong><small>目前庫存量 2,180</small></div><span class="modal-chip">17%</span></div>
        <div class="modal-list-row"><div><strong>半成品</strong><small>目前庫存量 1,260</small></div><span class="modal-chip">10%</span></div>
      </div>
    `
  },

  'warehouse-manage':{
    title:'A1',
    subtitle:'Warehouse → Zone → Location',
    body:`
      <div class="modal-list">
        <div class="modal-list-row"><div><strong>A 區</strong><small>電子零件與高周轉物料</small></div><span class="modal-chip">A-01 ～ A-09</span></div>
        <div class="modal-list-row"><div><strong>B 區</strong><small>包裝材料與一般耗材</small></div><span class="modal-chip">B-01 ～ B-12</span></div>
        <div class="modal-list-row"><div><strong>C 區</strong><small>成品與半成品</small></div><span class="modal-chip">C-01 ～ C-08</span></div>
      </div>
    `
  },

  'warehouse-manage-office':{
    title:'B1',
    subtitle:'使用區與示範消耗品',
    body:`
      <div class="modal-list">
        <div class="modal-list-row"><div><strong>SP 區</strong><small>辦公備品與行政耗材</small></div><span class="modal-chip">SP-01 ～ SP-06</span></div>
        <div class="modal-list-row"><div><strong>共用品</strong><small>衛生紙、漂白水等固定補貨品項</small></div><span class="modal-chip">不可取消</span></div>
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
        <div class="modal-list-row"><div><strong>成品 ITM0003</strong><small>現有量 980，可用量 760，低於安全庫存。</small></div><span class="modal-chip">待叫貨</span></div>
        <div class="modal-list-row"><div><strong>清潔耗材 ITM0012</strong><small>現有量 42，建議叫貨 60。</small></div><span class="modal-chip">待叫貨</span></div>
      </div>
    `
  },

  'inspection-alert':{
    title:'待驗收提醒',
    subtitle:'已收貨但尚未完成驗收',
    body:`
      <div class="modal-list">
        <div class="modal-list-row"><div><strong>RC261006001</strong><small>電子零件 500 PCS</small></div><span class="modal-chip">待驗收</span></div>
        <div class="modal-list-row"><div><strong>RC261006002</strong><small>包裝材料實收數量與預計數量不一致</small></div><span class="modal-chip">異常</span></div>
      </div>
    `
  },

  'stocktake-alert':{
    title:'盤點差異',
    subtitle:'需要複核的實盤結果',
    body:`
      <div class="modal-list">
        <div class="modal-list-row"><div><strong>包裝材料</strong><small>帳面 1,680，實盤 1,668，差異 -12。</small></div><span class="modal-chip">待複核</span></div>
        <div class="modal-list-row"><div><strong>成品</strong><small>帳面 980，實盤 985，差異 +5。</small></div><span class="modal-chip">待確認</span></div>
      </div>
    `
  },

  'inventory-log':{
    title:'庫存異動日誌',
    subtitle:'入庫 / 出庫 / 調撥留痕',
    body:`
      <div class="modal-list">
        <div class="modal-list-row"><div><strong>IN261006008</strong><small>電子零件 +500 / A1 A-01-02</small></div><span class="modal-chip">入庫</span></div>
        <div class="modal-list-row"><div><strong>OUT261006004</strong><small>成品 -120 / 使用區領用</small></div><span class="modal-chip">出庫</span></div>
        <div class="modal-list-row"><div><strong>TR261006002</strong><small>包裝材料 150 / A1 → B1</small></div><span class="modal-chip">調撥</span></div>
      </div>
    `
  },

  'asset-log':{
    title:'資產異動日誌',
    subtitle:'領用 / 歸還 / 移轉',
    body:`
      <div class="modal-list">
        <div class="modal-list-row"><div><strong>AST-0001</strong><small>企劃工作站保管人變更為 OG。</small></div><span class="modal-chip">異動</span></div>
        <div class="modal-list-row"><div><strong>AST-0006</strong><small>會議平板由 RU 領用。</small></div><span class="modal-chip">領用</span></div>
      </div>
    `
  },

  'operator-log':{
    title:'操作紀錄',
    subtitle:'操作人、時間與原因',
    body:`
      <div class="modal-list">
        <div class="modal-list-row"><div><strong>OG</strong><small>2026/10/06 14:10　調整資產保管人。</small></div><span class="modal-chip">資產</span></div>
        <div class="modal-list-row"><div><strong>KEN</strong><small>2026/10/06 11:25　完成會議平板領用。</small></div><span class="modal-chip">領用</span></div>
        <div class="modal-list-row"><div><strong>RU</strong><small>2026/10/05 16:40　完成示範消耗品盤點。</small></div><span class="modal-chip">盤點</span></div>
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
const sites=['A1','B1','使用區','示範位置 F','示範位置 C','示範位置 D','示範位置 E','設備區 / 示範貨架','設備區 / 維修區'];
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
let state;try{state=JSON.parse(localStorage.getItem(KEY)||'null');}catch(e){}
if(!state||!Array.isArray(state.records))state={records:[],field:[],logs:[]};if(!Array.isArray(state.field))state.field=[];if(!Array.isArray(state.logs))state.logs=[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch(e){showPrototypeToast('儲存失敗，請確認瀏覽器儲存空間');return false;}}
if(!state.seeded){Object.entries(definitions).forEach(([key,d],i)=>state.records.push({id:'DEMO-'+String(i+1).padStart(3,'0'),module:key,values:[...d.defaults],status:key==='supplies'?'15':d.status,time:'展示範例'}));state.seeded=true;save();}
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
 panel.innerHTML='<div class="workspace-panel-head"><div><h2>'+d.title+'</h2><p>'+d.subtitle+' · DEMO 為展示範例</p></div><button class="primary-btn" data-module-create="'+key+'">＋ 新增</button></div><div class="workspace-filter"><input type="search" placeholder="搜尋名稱、單號、狀態…" value="'+esc(term)+'" data-module-search="'+key+'"><span>共 '+rows.length+' 筆</span><button class="secondary-action-btn" data-module-export="'+key+'">匯出 CSV</button></div><div class="operation-table-wrap"><table class="operation-table"><thead><tr>'+d.headers.map(v=>'<th>'+v+'</th>').join('')+'<th>操作</th></tr></thead><tbody>'+ (rows.length?rows.map(r=>'<tr>'+[r.id,...r.values,r.status].slice(0,6).map(v=>'<td>'+esc(v)+'</td>').join('')+'<td><button class="secondary-action-btn" data-module-detail="'+r.id+'">查看</button></td></tr>').join(''):'<tr><td colspan="7" class="workspace-empty">尚無資料，點擊「新增」建立第一筆紀錄</td></tr>')+'</tbody></table></div>';
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
 field.innerHTML='<div class="page-head"><div class="page-title"><h1>現場作業</h1><p>OG · 同一帳號查看庫存與現場物品</p></div><span class="workspace-badge">操作展示 · 手動識別</span></div><div class="field-metrics"><div><span>我的搬運中物品</span><strong>'+state.field.filter(r=>r.status==='運送中').length+'</strong></div><div><span>今日操作</span><strong>'+state.field.length+'</strong></div><div><span>場域</span><strong>示範據點／使用區／現場</strong></div></div><div class="field-actions">'+[['領取','取出物品，加入身上貨品'],['存入','確認貨架，完成放置'],['歸還','物品先放待驗區'],['移轉','更新實體位置'],['盤點','核對系統與實際數量'],['手動驗證','輸入物品 6 碼識別碼']].map(([name,sub],i)=>'<button data-field-action="'+name+'"><span class="field-action-number">0'+(i+1)+'</span><strong>'+name+'</strong><small>'+sub+'</small><span class="field-action-arrow">↗</span></button>').join('')+'</div><div class="field-columns"><section class="card"><div class="card-head"><h2>我的現場紀錄</h2></div><div class="field-records">'+(state.field.length?state.field.map(r=>'<div class="field-record"><div><strong>'+esc(r.item)+'</strong><small>'+esc(r.code)+' · '+esc(r.qty)+' 件 · '+esc(r.location)+'</small></div><span class="status blue">'+esc(r.status)+'</span></div>').join(''):'<div class="workspace-empty">尚無操作紀錄，從上方選擇作業開始</div>')+'</div></section><section class="card"><div class="card-head"><h2>同時查詢庫存</h2></div><div class="field-shortcuts"><p>查看示範據點與使用區可用庫存，接續現場任務。</p><button class="primary-btn" data-field-stock>開啟庫存查詢</button><button class="secondary-action-btn" data-field-tasks>查看任務中心</button><button class="secondary-action-btn" data-field-log>操作日誌</button></div></section></div>';
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
const initial={sites:[{id:'S1',name:'示範據點',enabled:true}],zones:[{id:'Z1',site:'S1',name:'倉儲區',enabled:true},{id:'Z2',site:'S1',name:'使用區',enabled:true}],locations:[{id:'L1',zone:'Z1',name:'A1',type:'一般貨架',enabled:true},{id:'L2',zone:'Z1',name:'待驗位置',type:'待驗區',enabled:true},{id:'L3',zone:'Z2',name:'B1',type:'使用位置',enabled:true}],items:[{id:'I1',name:'清潔用品',unit:'瓶',mode:'數量管理',location:'L1',qty:30,used:0,min:10,fixed:false},{id:'I2',name:'清潔用品',unit:'瓶',mode:'數量管理',location:'L3',qty:2,used:0,min:6,fixed:false},{id:'I3',name:'筆記型電腦',unit:'台',mode:'個別資產',location:'L1',qty:4,used:0,min:2,fixed:false},{id:'I4',name:'筆記型電腦',unit:'台',mode:'個別資產',location:'L3',qty:1,used:3,min:1,fixed:false}],requests:[],logs:[]};
let db;try{db=JSON.parse(localStorage.getItem(KEY)||'null');}catch(e){}
if(!db||!['sites','zones','locations','items','requests','logs'].every(k=>Array.isArray(db[k])))db=initial;
let site='',zone='',location='',keyword='',status='all',view='work',stockCategory=null;
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
function render(){const navPage=view==='work'?'dashboard':'inventory';document.querySelectorAll('.nav-btn[data-page],[data-mobile]').forEach(b=>{b.classList.toggle('active',(b.dataset.page||b.dataset.mobile)===navPage&&view!=='config');});hub.dataset.view=['items','inbound'].includes(view)?'stock':view;view==='config'?renderConfig():view==='stock'?renderStockWork():view==='items'?renderItems():view==='inbound'?renderInbound():renderWork();}
function header(){return '<div class="hub-heading"><div><span class="hub-eyebrow">BOMB WMS · 通用倉儲工作台</span><h1>'+ (view==='config'?'據點與位置設定':view==='stock'?'庫存總覽':view==='items'?'品項管理':view==='inbound'?'收貨與入庫':'倉儲作業總覽')+'</h1><p>據點 → 區域 → 實際位置，依組織需求自行設定</p></div><button class="secondary-action-btn" data-g-view="'+(view==='config'?'work':'config')+'">'+(view==='config'?'返回作業總覽':'管理據點與位置')+'</button></div>';}

const excelItems=[{"id": "XL-20261007-B2", "name": "紅色撲克牌", "sourceLocation": "A1", "qty": 1240, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B3", "name": "營運用百家桌板", "sourceLocation": "A1", "qty": 3, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B4", "name": "營運用龍虎桌板", "sourceLocation": "A1", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B5", "name": "洗牌房桌板", "sourceLocation": "A1", "qty": 3, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B6", "name": "桌邊洗牌桌", "sourceLocation": "A1", "qty": 5, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B7", "name": "培訓練習桌板", "sourceLocation": "A1", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B8", "name": "紅色撲克牌", "sourceLocation": "A2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B9", "name": "紅色撲克牌", "sourceLocation": "A3", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B10", "name": "大字牌", "sourceLocation": "A3", "qty": 14968, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B12", "name": "伊萊克斯 無線吸塵器", "sourceLocation": "待設定位置", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B13", "name": "打卡鐘", "sourceLocation": "待設定位置", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B14", "name": "HP EliteDisplay E243螢幕(4F)", "sourceLocation": "待設定位置", "qty": 3, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B15", "name": "HP Elite Desk 800電腦(4F)", "sourceLocation": "待設定位置", "qty": 3, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B16", "name": "椅套(衣架下方)", "sourceLocation": "待設定位置", "qty": 18, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B17", "name": "領結(衣架上)", "sourceLocation": "待設定位置", "qty": 7, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B18", "name": "倉庫制服總數", "sourceLocation": "待設定位置", "qty": 0, "quantityPending": true, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B19", "name": "倉庫制服報廢", "sourceLocation": "待設定位置", "qty": 0, "quantityPending": true, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B20", "name": "MMCALL 呼叫鈴主機", "sourceLocation": "待設定位置", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B21", "name": "Lenovo T440筆電含電源線", "sourceLocation": "待設定位置", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B22", "name": "Ipad air(無盒付充電線）", "sourceLocation": "待設定位置", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-B23", "name": "HP電腦底座", "sourceLocation": "待設定位置", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F2", "name": "監控螢幕(32吋液晶電視)", "sourceLocation": "B1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F3", "name": "監控螢幕(32吋液晶電視)遙控器", "sourceLocation": "B1", "qty": 9, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F4", "name": "Philips 43吋螢幕", "sourceLocation": "B1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F5", "name": "Philips 55吋螢幕", "sourceLocation": "B1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F6", "name": "Philips 43吋螢幕遙控器", "sourceLocation": "B1", "qty": 4, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F7", "name": "NBC3-F電視架", "sourceLocation": "B1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F8", "name": "Model E3螢幕架", "sourceLocation": "B1", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F9", "name": "Inst360-link 2c網路攝影機", "sourceLocation": "B1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F10", "name": "Top cam", "sourceLocation": "B1", "qty": 17, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F11", "name": "Top cam夾", "sourceLocation": "B1", "qty": 13, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F12", "name": "Z CAM(E2-M4)", "sourceLocation": "B1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F13", "name": "Z CAM變壓器(原廠)", "sourceLocation": "B1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F14", "name": "Z CAM變壓器", "sourceLocation": "B1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F15", "name": "鏡頭(Panasonic Lumix 12-35mm)", "sourceLocation": "B1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F16", "name": "BI-鏡頭(Panasonic Lumix 7-14mm)", "sourceLocation": "B1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F17", "name": "雲台(BENRO GD3WH)", "sourceLocation": "B1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F18", "name": "雲台螺絲", "sourceLocation": "B1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F19", "name": "桌上小型掃描器(Honeywell HF521)", "sourceLocation": "B2", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F20", "name": "桌上大型掃描器(Honeywell)", "sourceLocation": "B2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F21", "name": "音源線(Kaiboer開博爾)", "sourceLocation": "B2", "qty": 10, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F22", "name": "麥克風(V-Mic D4 Mini)", "sourceLocation": "B2", "qty": 4, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F23", "name": "DP轉HDMI轉接頭", "sourceLocation": "B2", "qty": 4, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F24", "name": "HDMI to HDMI 1.4 (3M)", "sourceLocation": "B2", "qty": 31, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F25", "name": "Type-C轉USB延長線(5M)", "sourceLocation": "B2", "qty": 4, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F26", "name": "USB 3.0 Type A 公轉母 延長線 (3M)", "sourceLocation": "B2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F27", "name": "USB 3.0公轉母延長線(5M)", "sourceLocation": "B2", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F28", "name": "RS232連接線(3M)", "sourceLocation": "B2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F29", "name": "電源線(母)", "sourceLocation": "B2", "qty": 9, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F30", "name": "荷官螢幕(Lenovo D27-30)", "sourceLocation": "B3", "qty": 4, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F31", "name": "BlacKmagic design擷取卡", "sourceLocation": "B3", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F32", "name": "HP800 RS232專用介面卡", "sourceLocation": "B3", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F33", "name": "HP 有線鍵盤", "sourceLocation": "B3", "qty": 5, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F34", "name": "HP 有線滑鼠", "sourceLocation": "B3", "qty": 6, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F35", "name": "無線數字鍵盤", "sourceLocation": "B3", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F36", "name": "無線鍵盤", "sourceLocation": "B3", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F37", "name": "無線滑鼠", "sourceLocation": "B3", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F38", "name": "有線數字鍵盤", "sourceLocation": "B3", "qty": 3, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F39", "name": "16吋水平尺", "sourceLocation": "B3", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-F40", "name": "32吋輪盤水平儀", "sourceLocation": "B3", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J2", "name": "MM call呼叫器", "sourceLocation": "C1", "qty": 16, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J3", "name": "MM call遙控器", "sourceLocation": "C1", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J4", "name": "綠聯1尺 iphone 充電線", "sourceLocation": "C1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J5", "name": "平板套 10.2吋", "sourceLocation": "C1", "qty": 14, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J6", "name": "平板背帶", "sourceLocation": "C1", "qty": 15, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J7", "name": "Samsung 背帶平板套", "sourceLocation": "C1", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J8", "name": "ipad 10.2吋防窺膜", "sourceLocation": "C1", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J9", "name": "燈GVM 1000D 格罩+柔光罩", "sourceLocation": "C1", "qty": 73, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J10", "name": "Forti AP 221E", "sourceLocation": "C1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J11", "name": "無線ap基地台(WIFI訊號盒)", "sourceLocation": "C1", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J12", "name": "HDMI線(2M)", "sourceLocation": "C2", "qty": 18, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J13", "name": "HDMI線(5M)", "sourceLocation": "C2", "qty": 7, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J14", "name": "HDMI線(10米)", "sourceLocation": "C2", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J15", "name": "DIKE Type C5in 1多功能集線器", "sourceLocation": "C2", "qty": 5, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J16", "name": "BizLank DP線", "sourceLocation": "C2", "qty": 4, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J17", "name": "三星專用充電線(2米)", "sourceLocation": "C2", "qty": 4, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J18", "name": "三星專用充電頭(45W)", "sourceLocation": "C2", "qty": 4, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J19", "name": "柔光罩", "sourceLocation": "C2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J20", "name": "多向燈頭螺絲轉", "sourceLocation": "C2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J21", "name": "辦公室電腦(HP Elite Tower 600)", "sourceLocation": "C3", "qty": 4, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J22", "name": "LG Ultra寬螢幕", "sourceLocation": "C3", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J23", "name": "LG Ultra寬螢幕電源線", "sourceLocation": "C3", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J24", "name": "LG寬螢幕底座支架（1組3個配件）", "sourceLocation": "C3", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J25", "name": "荷官電腦(HP Elite Tower 800)", "sourceLocation": "C3", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-J26", "name": "荷官電腦(HP Elite Tower 800)無擷取卡", "sourceLocation": "C3", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N2", "name": "輪盤球", "sourceLocation": "D1", "qty": 6, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N3", "name": "掃描器壓克力盒", "sourceLocation": "D1", "qty": 4, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N4", "name": "骰盅A", "sourceLocation": "D1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N5", "name": "骰盅B", "sourceLocation": "D1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N6", "name": "骰盅C", "sourceLocation": "D1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N7", "name": "骰寶骰子", "sourceLocation": "D1", "qty": 14, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N8", "name": "骰寶玻璃罩", "sourceLocation": "D1", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N9", "name": "手動控制盒1號", "sourceLocation": "D1", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N10", "name": "手動控制盒2號", "sourceLocation": "D1", "qty": 0, "quantityPending": true, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N11", "name": "骰寶電源線1號", "sourceLocation": "D1", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N12", "name": "骰寶電源線2號", "sourceLocation": "D1", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N13", "name": "骰寶電源線3號", "sourceLocation": "D1", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N14", "name": "骰寶變壓器1號", "sourceLocation": "D1", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N15", "name": "骰寶變壓器2號", "sourceLocation": "D1", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N16", "name": "骰寶可變變壓器", "sourceLocation": "D1", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N17", "name": "壓克力平板支架", "sourceLocation": "D1", "qty": 12, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N18", "name": "魚蝦蟹骰子", "sourceLocation": "D1", "qty": 15, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N19", "name": "線性偏光片", "sourceLocation": "D1", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N20", "name": "鏡頭(Panasonic Lumix 14-140mm)", "sourceLocation": "D1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N21", "name": "4K相機影像擷取器(BU113)", "sourceLocation": "D1", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N22", "name": "CPL偏光鏡58mm", "sourceLocation": "D1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N23", "name": "DC 6V2A 變壓器", "sourceLocation": "D1", "qty": 8, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N24", "name": "骰盅控制盒", "sourceLocation": "D1", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N25", "name": "牌靴(含滾輪)", "sourceLocation": "D2", "qty": 15, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N26", "name": "牌靴", "sourceLocation": "D2", "qty": 3, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N27", "name": "滾輪", "sourceLocation": "D2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N28", "name": "營運用百家桌布", "sourceLocation": "D3", "qty": 5, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N29", "name": "營運用百家紅色桌布(綠幕桌)", "sourceLocation": "D3", "qty": 5, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N30", "name": "紅色桌布(斜紋布)", "sourceLocation": "D3", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N31", "name": "百家紅色桌布", "sourceLocation": "D3", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N32", "name": "綠幕測試桌布", "sourceLocation": "D3", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N33", "name": "裸色桌布", "sourceLocation": "D3", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N34", "name": "藍色桌布(大陸製)", "sourceLocation": "D3", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N35", "name": "綠色背景布3*5m", "sourceLocation": "D3", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N36", "name": "綠色背景布3*3m", "sourceLocation": "D3", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N37", "name": "牌盒", "sourceLocation": "D3", "qty": 130, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N38", "name": "霧面牌盒", "sourceLocation": "D3", "qty": 20, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-N39", "name": "霧面牌靴", "sourceLocation": "D3", "qty": 8, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R2", "name": "10吋顯示螢幕", "sourceLocation": "E1", "qty": 4, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R3", "name": "10吋顯示螢幕插座", "sourceLocation": "E1", "qty": 4, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R4", "name": "10吋顯示螢幕支架", "sourceLocation": "E1", "qty": 22, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R5", "name": "10吋顯示螢幕保護貼", "sourceLocation": "E1", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R6", "name": "2節伸縮桿", "sourceLocation": "E1", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R7", "name": "HDTV線5米", "sourceLocation": "E1", "qty": 11, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R8", "name": "耳機", "sourceLocation": "E2", "qty": 13, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R9", "name": "電腦耳機", "sourceLocation": "E2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R10", "name": "SMS ID卡", "sourceLocation": "E2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R11", "name": "廢牌盒消磁器", "sourceLocation": "E2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R12", "name": "平板充電線(黑/白色Type-C線)", "sourceLocation": "E2", "qty": 18, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R13", "name": "Samsung原廠充電頭", "sourceLocation": "E2", "qty": 5, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R14", "name": "Samsung taba 平板電腦", "sourceLocation": "E2", "qty": 5, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R15", "name": "apple ipad", "sourceLocation": "E2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R16", "name": "QL-1100大尺寸條碼列印機", "sourceLocation": "E2", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R17", "name": "方形標籤貼紙(DK-11221)", "sourceLocation": "E2", "qty": 3, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R18", "name": "長形標籤貼紙(DK-22214)", "sourceLocation": "E2", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R19", "name": "洗牌房號碼牌", "sourceLocation": "E2", "qty": 178, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R20", "name": "call機", "sourceLocation": "E2", "qty": 3, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R21", "name": "call機充電線", "sourceLocation": "E2", "qty": 15, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R22", "name": "call機底座", "sourceLocation": "E2", "qty": 16, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R23", "name": "call機電池", "sourceLocation": "E2", "qty": 15, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R24", "name": "長廢牌盒鎖", "sourceLocation": "E2", "qty": 280, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R25", "name": "短廢牌盒鎖 (規格不符暫不使用)", "sourceLocation": "E2", "qty": 70, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R26", "name": "量角尺", "sourceLocation": "E2", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R27", "name": "平板夾(黑)", "sourceLocation": "E3", "qty": 11, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R28", "name": "平板金色支架臂", "sourceLocation": "E3", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R29", "name": "PDU延長線", "sourceLocation": "E3", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R30", "name": "110V 白色4孔延長線", "sourceLocation": "E3", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R31", "name": "直立式110V白色延長線(3米)", "sourceLocation": "E3", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R32", "name": "220V 黑色8孔延長線", "sourceLocation": "E3", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R33", "name": "白色4孔220V延長線", "sourceLocation": "E3", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R34", "name": "骰寶屏風裝飾", "sourceLocation": "E3", "qty": 4, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-R35", "name": "骰寶節慶裝飾", "sourceLocation": "E3", "qty": 1, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-V2", "name": "Amaran 200 XS(雙色溫-可調)", "sourceLocation": "F2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-V3", "name": "Amaran 200 DS(色溫5600K)", "sourceLocation": "F2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-V4", "name": "Light Dome mimill 柔光罩", "sourceLocation": "F2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-V5", "name": "LIGHT DOME SE 柔光罩(82cm)", "sourceLocation": "F2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-V6", "name": "光罩＿葉片含蜂巢 (APTBARNDOOR)", "sourceLocation": "F2", "qty": 0, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-V7", "name": "神牛燈(單色版)", "sourceLocation": "F3", "qty": 6, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-V8", "name": "神牛燈(雙色版)+變壓器", "sourceLocation": "F3", "qty": 10, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}, {"id": "XL-20261007-V9", "name": "神牛燈變壓器", "sourceLocation": "F3", "qty": 2, "quantityPending": false, "category": "未分類", "mode": "數量管理", "identification": "無標籤", "unit": "件", "min": 0, "used": 0, "fixed": false, "enabled": true, "source": "倉儲品項.xlsx"}];
function importExcelItems(){
let added=0;
const ok=transact(()=>{
if(!db.sites.some(x=>x.id==='XL-SITE'))db.sites.push({id:'XL-SITE',name:'待設定據點',enabled:true});
if(!db.zones.some(x=>x.id==='XL-ZONE'))db.zones.push({id:'XL-ZONE',site:'XL-SITE',name:'待設定區域',enabled:true});
for(const record of excelItems){if(db.items.some(x=>x.id===record.id))continue;let loc=db.locations.find(x=>x.id==='XL-LOC-'+record.sourceLocation);if(!loc){loc={id:'XL-LOC-'+record.sourceLocation,zone:'XL-ZONE',name:record.sourceLocation,type:'一般貨架',enabled:true};db.locations.push(loc);}db.items.push({...record,location:loc.id});added++;}
log('載入Excel品項','倉儲品項.xlsx · 新增 '+added+' 筆；保留既有資料');
});if(ok)showPrototypeToast('新增 '+added+' 筆 Excel 品項');
}
let itemKeyword='',itemState='all';const selectedItems=new Set();
function visibleItems(){return db.items.filter(x=>(!itemKeyword||(x.name+' '+(x.category||'')+' '+x.id).toLowerCase().includes(itemKeyword.toLowerCase()))&&(itemState==='all'||(itemState==='active'?x.enabled!==false:x.enabled===false)));}
function itemTabs(){return '<div class="item-tabs"><button class="'+(view==='stock'?'active':'')+'" data-g-view="stock">庫存總覽</button><button class="'+(view==='items'?'active':'')+'" data-g-view="items">品項管理</button><button class="'+(view==='inbound'?'active':'')+'" data-g-view="inbound">收貨／驗收／入庫</button></div>';}
function renderItems(){
const list=visibleItems();
hub.innerHTML=header()+itemTabs()+'<section class="hub-card"><div class="hub-card-head"><div><h2>品項清單</h2><p>依企業需求設定分類、單位與管理方式</p></div><button class="secondary-action-btn" data-import-items>載入 Excel 品項</button><button class="primary-btn" data-g-create="item">新增品項</button></div><div class="hub-filters"><input id="itemKeyword" type="search" placeholder="搜尋品名、分類或編號" value="'+esc(itemKeyword)+'"><select id="itemState"><option value="all">全部狀態</option><option value="active" '+(itemState==='active'?'selected':'')+'>啟用</option><option value="inactive" '+(itemState==='inactive'?'selected':'')+'>停用</option></select><button class="primary-btn" data-item-search>查詢</button><span>'+list.length+' 筆</span></div><div class="hub-filters batch-toolbar"><span id="batchCount" role="status">已選 ' +selectedItems.size+ ' 筆</span><button class="primary-btn" data-batch-category ' +(selectedItems.size?'':'disabled')+ '>批次分類</button><button class="secondary-action-btn" data-batch-clear>清除選取</button><span>全選只選取目前查詢結果；重新查詢會清除選取。</span></div><div class="hub-table-wrap"><table class="hub-table"><thead><tr><th><input type="checkbox" data-item-all aria-label="全選查詢結果"></th><th>品項／編號</th><th>分類／單位</th><th>管理方式</th><th>識別方式</th><th>位置／門檻</th><th>狀態</th><th>操作</th></tr></thead><tbody>'+list.map(x=>'<tr><td><input type="checkbox" data-item-select="'+esc(x.id)+'" aria-label="選取 '+esc(x.name)+'" '+(selectedItems.has(x.id)?'checked':'')+'></td><td><strong>'+esc(x.name)+'</strong><small>'+esc(x.id)+'</small></td><td>'+esc(x.category||'未分類')+'<small>'+esc(x.unit)+'</small></td><td>'+esc(x.mode)+'</td><td>'+esc(x.identification||'無標籤')+'</td><td>'+esc(locName(x.location))+'<small>低庫存門檻 '+x.min+' '+esc(x.unit)+'</small></td><td><span class="hub-status">'+(x.quantityPending?'數量待確認':x.enabled===false?'停用':'啟用')+'</span></td><td><div class="hub-row-actions"><button data-g-edit="item" data-id="'+x.id+'">編輯</button><button data-g-toggle="item" data-id="'+x.id+'">'+(x.enabled===false?'啟用':'停用')+'</button></div></td></tr>').join('')+(list.length?'':'<tr><td colspan="8" class="workspace-empty">沒有符合的品項</td></tr>')+'</tbody></table></div></section><p class="hub-rule">Excel 品項暫以「件／數量管理／無標籤」建立，請依實際需求修改；空白數量須確認後才可作業。停用保留庫存與歷史。</p>';
updateBatchSelection();
}


function updateBatchSelection(){const list=visibleItems(),n=list.filter(x=>selectedItems.has(x.id)).length;const all=hub.querySelector('[data-item-all]');if(all){all.checked=list.length>0&&n===list.length;all.indeterminate=n>0&&n<list.length;all.disabled=!list.length;}const count=hub.querySelector('#batchCount');if(count)count.textContent='已選 '+selectedItems.size+' 筆';const button=hub.querySelector('[data-batch-category]');if(button)button.disabled=!selectedItems.size;}
hub.addEventListener('change',e=>{const el=e.target;if(el.hasAttribute('data-item-select')){el.checked?selectedItems.add(el.dataset.itemSelect):selectedItems.delete(el.dataset.itemSelect);updateBatchSelection();}if(el.hasAttribute('data-item-all')){visibleItems().forEach(x=>el.checked?selectedItems.add(x.id):selectedItems.delete(x.id));hub.querySelectorAll('[data-item-select]').forEach(x=>x.checked=selectedItems.has(x.dataset.itemSelect));updateBatchSelection();}});
hub.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-batch-clear')){selectedItems.clear();render();}if(b.hasAttribute('data-batch-category')&&selectedItems.size){const rows=db.items.filter(x=>selectedItems.has(x.id)),ids=rows.map(x=>x.id);openPrototypeModal({title:'批次分類',subtitle:'將更新 '+ids.length+' 筆品項的分類',body:'<form id="batchCategoryForm" class="workflow-form"><p>選取品項：'+rows.slice(0,5).map(x=>esc(x.name)).join('、')+(rows.length>5?'…':'')+'</p><div class="workflow-field"><label for="batchCategory">分類名稱</label><input id="batchCategory" name="category" required maxlength="80" list="batchCategories" placeholder="選擇既有分類或輸入新分類"><datalist id="batchCategories">'+[...new Set(db.items.map(x=>x.category||'未分類'))].map(x=>'<option value="'+esc(x)+'"></option>').join('')+'</datalist></div><p class="hub-rule">只更新分類，數量、單位與位置保留。</p><div class="workflow-form-actions"><button type="button" class="workflow-cancel-btn" data-workflow-cancel>取消</button><button type="submit" class="workflow-save-btn">確認套用 '+ids.length+' 筆</button></div></form>'});document.getElementById('batchCategoryForm').dataset.ids=JSON.stringify(ids);}});
prototypeModalBody.addEventListener('submit',e=>{if(e.target.id!=='batchCategoryForm')return;e.preventDefault();const f=e.target,category=f.elements.category.value.trim();if(!category){showPrototypeToast('請填寫分類名稱');return;}const ids=JSON.parse(f.dataset.ids);const ok=transact(()=>{const changes=db.items.filter(x=>ids.includes(x.id)).map(x=>({id:x.id,name:x.name,from:x.category||'未分類',to:category}));db.items.forEach(x=>{if(ids.includes(x.id))x.category=category;});log('批次分類',changes.map(x=>x.name+'（'+x.id+'）：'+x.from+' → '+x.to).join('；'));});if(ok){selectedItems.clear();closePrototypeModal();render();showPrototypeToast('已更新 '+ids.length+' 筆分類');}});
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
hub.innerHTML=header()+itemTabs()+stockEntryMenu()+'<div class="hub-filters generic-scope"><label>據點<select id="gSite">'+options(db.sites.filter(x=>x.enabled),site,'全部據點')+'</select></label><label>區域<select id="gZone">'+options(db.zones.filter(x=>x.enabled&&(!site||x.site===site)&&db.sites.find(s=>s.id===x.site)?.enabled),zone,'全部區域')+'</select></label><label>實際位置<select id="gLocation">'+options(db.locations.filter(x=>enabledLocation(x)&&(!zone||x.zone===zone)&&(!site||lineage(x.id).s?.id===site)),location,'全部位置')+'</select></label></div><div class="hub-summary"><div><span>庫存品項</span><strong>'+all.length+'<small>項</small></strong></div><div><span>低庫存</span><strong>'+all.filter(x=>x.qty<x.min).length+'<small>項</small></strong></div><div><span>使用中品項</span><strong>'+all.filter(x=>x.used>0).length+'<small>項</small></strong></div><div><span>補貨待辦</span><strong>'+rs.filter(r=>r.step<4).length+'<small>筆</small></strong></div></div><div class="hub-layout"><section class="hub-card"><div class="hub-card-head"><div><h2>庫存與使用狀況</h2><p>名稱與補貨來源依設定選擇；DEMO 為展示資料</p></div><button class="primary-btn" data-g-create="item">新增品項</button></div><div class="hub-filters"><input id="gKeyword" type="search" placeholder="搜尋品名或位置" value="'+esc(keyword)+'"><select id="gStatus">'+[['all','全部狀況'],['low','低庫存'],['used','使用中']].map(([k,v])=>'<option value="'+k+'" '+(status===k?'selected':'')+'>'+v+'</option>').join('')+'</select><button class="primary-btn" data-g-search>查詢</button><button class="secondary-action-btn" data-g-export>匯出</button></div>' +stockCategoryTabs(all)+stockTable()+ '</section><aside class="hub-side"><section class="hub-card"><div class="hub-card-head"><h2>補貨進度</h2></div>'+ (rs.length?rs.map(r=>{const t=db.items.find(x=>x.id===r.target),src=db.items.find(x=>x.id===r.source);return '<article class="hub-request"><div><strong>'+esc(t?.name)+'</strong><span>'+r.qty+' '+esc(t?.unit)+'</span></div><small>'+esc(r.id)+'</small><p>'+esc(locName(src?.location))+' → '+esc(locName(t?.location))+'</p><div class="hub-progress">'+steps.slice(0,4).map((n,i)=>'<span class="'+(r.step>=i?'done':'')+'">'+n+'</span>').join('')+'</div><p>'+steps[r.step]+(t?.fixed?' · 固定補貨不可取消':'')+'</p>'+(r.step<4?'<button class="primary-btn" data-g-next="'+r.id+'">'+['確認來源備貨','完成備貨','確認取貨／清點','確認上架／入庫'][r.step]+'</button>':'<span class="hub-status">已完成</span>')+'</article>';}).join(''):'<div class="hub-empty">尚無補貨申請，從品項按「補貨」開始。</div>')+'</section><section class="hub-card"><div class="hub-card-head"><h2>作業入口</h2></div><div class="hub-links"><button data-g-view="inbound">收貨／驗收／入庫 →</button><button data-g-page="purchase">採購與供應商 →</button><button data-g-page="asset">資產與維修 →</button><button data-g-page="stocktake">盤點與複查 →</button><button data-g-logs>異動紀錄 →</button></div></section></aside></div>';
}
function renderConfig(){hub.innerHTML=header()+['site','zone','location'].map(kind=>{const arr=db[{site:'sites',zone:'zones',location:'locations'}[kind]],label={site:'據點',zone:'區域',location:'實際位置'}[kind];return '<section class="hub-card generic-config"><div class="hub-card-head"><h2>'+label+'</h2><button class="primary-btn" data-g-create="'+kind+'">＋ 新增'+label+'</button></div><div class="hub-table-wrap"><table class="hub-table"><thead><tr><th>名稱</th><th>所屬層級</th><th>類型</th><th>狀態</th><th>操作</th></tr></thead><tbody>'+arr.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(kind==='zone'?siteName(x.site):kind==='location'?zoneName(x.zone):'—')+'</td><td>'+esc(x.type||'—')+'</td><td>'+ (x.enabled?'啟用':'停用')+'</td><td><div class="hub-row-actions"><button data-g-edit="'+kind+'" data-id="'+x.id+'">編輯</button><button data-g-toggle="'+kind+'" data-id="'+x.id+'">'+(x.enabled?'停用':'啟用')+'</button></div></td></tr>').join('')+'</tbody></table></div></section>';}).join('')+'<p class="hub-rule">停用保留庫存與歷史，新增作業不再提供停用位置。無刪除功能。</p>';}
const field=(name,label,value='',type='text')=>'<div class="workflow-field"><label for="gf-'+name+'">'+label+'</label><input id="gf-'+name+'" name="'+name+'" type="'+type+'" '+(type==='number'?'min="0" step="1"':'')+' value="'+esc(value)+'" required></div>';
const select=(name,label,list,chosen='')=>'<div class="workflow-field"><label for="gf-'+name+'">'+label+'</label><select id="gf-'+name+'" name="'+name+'" required>'+options(list,chosen,'請選擇')+'</select></div>';
function openEditor(kind,recordId){let obj=recordId?db[{site:'sites',zone:'zones',location:'locations',item:'items'}[kind]]?.find(x=>x.id===recordId):null;let fields='';
if(['site','zone','location'].includes(kind)){fields=field('name','名稱',obj?.name||'');if(kind==='zone')fields+=select('site','所屬據點',db.sites.filter(x=>x.enabled||x.id===obj?.site),obj?.site);if(kind==='location'){fields+=select('zone','所屬區域',db.zones.filter(x=>x.enabled||x.id===obj?.zone).map(x=>({...x,name:siteName(x.site)+' / '+x.name})),obj?.zone);fields+=select('type','位置類型',['一般貨架','待驗區','待上架區','維修區','待退貨區','報廢區','使用位置','暫存位置','其他'].map(n=>({id:n,name:n})),obj?.type);}}
else if(kind==='item'){
fields='<h3 class="item-form-title">基本資料</h3>'+field('name','品項名稱',obj?.name||'')+field('category','分類',obj?.category||'未分類')+field('unit','單位',obj?.unit||'個')+select('location','實際位置',db.locations.filter(x=>enabledLocation(x)||x.id===obj?.location).map(x=>({...x,name:siteName(lineage(x.id).s?.id)+' / '+zoneName(x.zone)+' / '+x.name})),obj?.location||location);
fields+='<h3 class="item-form-title">管理設定</h3>'+select('mode','管理方式',['數量管理','批次管理','個別資產',...(obj?.mode==='批量識別'?['批量識別']:[])].map(n=>({id:n,name:n})),obj?.mode||'數量管理')+select('identification','識別方式',['無標籤','QR','NFC＋QR'].map(n=>({id:n,name:n})),obj?.identification||'無標籤')+field('min','低庫存門檻',obj?.min??0,'number')+select('fixed','固定補貨',[{id:'no',name:'否'},{id:'yes',name:'是'}],obj?.fixed?'yes':'no');
fields+=obj&&!obj.quantityPending?'<p class="item-form-title hub-rule">目前可用 '+obj.qty+' '+esc(obj.unit)+'；使用中 '+obj.used+'。庫存數量請透過作業或盤點調整。</p><input type="hidden" name="qty" value="'+obj.qty+'">':field('qty',obj?.quantityPending?'確認可用數量':'期初可用數量',obj?.quantityPending?'':0,'number');
}

openPrototypeModal({title:(obj?'編輯':'新增')+({site:'據點',zone:'區域',location:'實際位置',item:'品項'}[kind]),subtitle:'設定後即時更新選單與作業資料',body:'<form id="genericEditor" data-kind="'+kind+'" data-id="'+esc(recordId||'')+'" class="workflow-form"><div class="workflow-form-grid">'+fields+'</div><div class="workflow-form-actions"><button type="button" class="workflow-cancel-btn" data-workflow-cancel>取消</button><button type="submit" class="workflow-save-btn">儲存</button></div></form>'});}
function syncForms(){const list=db.locations.filter(enabledLocation);const pipe=list.map(x=>locName(x.id)).join('|');
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
 const tasks=[{id:'DEMO-RC-001',title:'收貨核對',date:dayKey(new Date()),time:'09:00',page:'inventory',tab:'receiving',color:'blue',demo:true},{id:'DEMO-ST-003',title:'盤點任務',date:dayKey(new Date()),time:'11:00',page:'stocktake',tab:'task',color:'teal',demo:true},{id:'DEMO-QC-008',title:'驗收確認',date:dayKey(new Date()),time:'15:00',page:'inventory',tab:'inspection',color:'amber',demo:true}];
 for(const r of records){if(!names[r.type])continue;const d=r.data||{},at=new Date(r.createdAt);if(!Number.isFinite(at.getTime()))continue;if(location&&![locName(location)].includes(d.location||d.warehouse))continue;if(!location&&(site||zone)&&!db.locations.some(l=>enabledLocation(l)&&(!site||lineage(l.id).s?.id===site)&&(!zone||l.zone===zone)&&[d.location,d.warehouse,d.scope].includes(l.name)))continue;const n=names[r.type];tasks.push({id:r.id,title:n[0]+' · '+(d.item||d.name||''),date:/^\d{4}-\d{2}-\d{2}$/.test(d.date||'')?d.date:dayKey(at),time:at.toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit',hour12:false}),page:r.type==='stocktake'?'stocktake':'inventory',tab:n[1],color:n[2],demo:false});}
 return tasks.filter(t=>!t.demo||(!site&&!zone&&!location));
}
function readableLog(x){const detail=String(x.detail||'');if(x.action==='設定修改'){const split=detail.indexOf(' → ');try{const before=JSON.parse(detail.slice(0,split)),after=JSON.parse(detail.slice(split+3)),labels={name:'名稱',category:'分類',unit:'單位',mode:'管理方式',location:'位置',qty:'可用數量',used:'使用中',min:'補貨門檻',fixed:'固定補貨',identification:'識別方式',enabled:'啟用狀態',quantityPending:'數量待確認',site:'據點',zone:'區域',type:'位置類型'},value=(key,v)=>key==='location'?locName(v):key==='site'?siteName(v):key==='zone'?zoneName(v):typeof v==='boolean'?(v?'是':'否'):String(v??'未設定');const changes=Object.keys(labels).filter(k=>JSON.stringify(before[k])!==JSON.stringify(after[k])).map(k=>labels[k]+'：'+value(k,before[k])+' → '+value(k,after[k]));return (after.name||before.name||'設定')+' · '+(changes.join('；')||'資料已儲存');}catch{return '設定已更新，完整原始紀錄已保留';}}return detail;}
function renderWork(){
 const tasks=calendarTasks(),today=dayKey(new Date()),chosen=tasks.filter(t=>t.date===selectedDay).sort((a,b)=>a.time.localeCompare(b.time)),low=db.items.filter(x=>inScope(x)&&x.qty<x.min),first=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),1),start=new Date(first);start.setDate(1-first.getDay());const cells=Math.ceil((first.getDay()+new Date(first.getFullYear(),first.getMonth()+1,0).getDate())/7)*7;
 const kpis=[['truck','待收貨','receiving','blue'],['check','待驗收','inspection','teal'],['shelf','待上架','putaway','amber']].map(([icon,label,tab,color])=>({icon,label,tab,color,value:tasks.filter(t=>t.tab===tab).length}));kpis.push({icon:'clock',label:'逾期待辦',tab:'overdue',color:tasks.some(t=>t.date<today)?'red':'neutral',value:tasks.filter(t=>t.date<today).length});
 hub.innerHTML='<div class="home-heading"><div><h1>營運總覽</h1><p>掌握任務、到貨與庫存提醒。</p></div>'+scopeControls()+'</div><div class="home-kpis">'+kpis.map(k=>'<button class="home-kpi" data-home-kpi="'+k.tab+'"><span class="home-icon '+k.color+'">'+kpiIcon(k.icon)+'</span><span><span>'+k.label+'</span><strong>'+k.value+' <small>筆</small></strong></span></button>').join('')+'</div><div class="home-middle"><section class="home-card"><div class="home-card-head calendar-heading"><h2>作業月曆</h2><div class="calendar-controls"><button data-cal-prev aria-label="上個月">‹</button><strong>'+first.getFullYear()+' 年 '+(first.getMonth()+1)+' 月</strong><button data-cal-next aria-label="下個月">›</button><button data-cal-today>今天</button></div><div class="calendar-legend"><span class="blue">● 收貨</span><span class="teal">● 盤點</span><span class="amber">● 上架</span></div></div><div class="calendar-week">'+['日','一','二','三','四','五','六'].map(d=>'<span>'+d+'</span>').join('')+'</div><div class="calendar-grid">'+Array.from({length:cells},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);const key=dayKey(d),ts=tasks.filter(t=>t.date===key);return '<button class="calendar-day '+(d.getMonth()!==first.getMonth()?'outside ':'')+(key===selectedDay?'selected ':'')+(key===today?'today':'')+'" data-cal-day="'+key+'" aria-label="'+key+'，'+ts.length+'筆任務" aria-pressed="'+(key===selectedDay)+'"><span>'+d.getDate()+'</span>'+(ts.length?'<small class="calendar-count">'+ts.length+' 項待辦</small>':'')+'</button>';}).join('')+'</div></section><section class="home-card"><div class="home-card-head"><h2>'+Number(selectedDay.slice(5,7))+' 月 '+Number(selectedDay.slice(8))+' 日｜當日待辦</h2></div><div class="day-tasks">'+(chosen.length?chosen.map((t,i)=>'<article class="day-task"><span class="task-bar '+t.color+'"></span><strong>'+esc(t.time)+'</strong><div><div class="task-heading"><strong>'+esc(t.title)+'</strong><span class="task-status '+(t.tab==='task'?'in-progress':'')+'">'+(t.tab==='task'?'進行中':'待處理')+'</span></div><small>'+esc(t.id)+(t.demo?' · 示範':'')+'</small></div><button class="primary-btn '+(t.tab==='task'?'outline':'')+'" data-home-task="'+tasks.indexOf(t)+'">'+(t.tab==='task'?'查看':'執行')+'</button></article>').join(''):'<div class="home-empty">此日沒有待辦事項</div>')+'</div>'+(tasks.some(t=>t.date<today)?'<button class="home-overdue" data-home-kpi="overdue">'+homeIcon('clock')+'逾期 '+tasks.filter(t=>t.date<today).length+' 筆待辦<span>›</span></button>':'<div class="home-overdue is-clear" role="status">'+homeIcon('check')+'目前無逾期待辦</div>')+'<p class="home-caption">示範任務供體驗；新增單據依日期加入月曆。</p></section></div><div class="home-bottom"><section class="home-card"><div class="home-card-head"><h2>庫存提醒</h2><button data-g-view="stock">查看全部 →</button></div>'+ (low.length?low.slice(0,4).map(x=>'<article class="stock-alert"><span class="home-icon blue">'+homeIcon(x.mode==='個別資產'?'wrench':'bottle')+'</span><div><strong>'+esc(x.name)+'</strong><small>'+esc(locName(x.location))+' · 可用 '+x.qty+' / 門檻 '+x.min+'</small></div><meter min="0" max="'+Math.max(x.min,1)+'" value="'+x.qty+'"></meter><button class="secondary-action-btn" data-g-request="'+x.id+'">補貨</button></article>').join(''):'<div class="home-empty">目前沒有低庫存品項</div>')+'</section><section class="home-card"><div class="home-card-head"><h2>最近異動</h2><button data-g-logs>查看全部 →</button></div>'+ (db.logs.length?db.logs.slice(0,4).map(x=>'<article class="recent-row"><span class="teal">●</span><div><strong>'+esc(x.action)+'</strong><small>'+esc(readableLog(x))+'</small></div><small>'+esc(x.time)+'<br>'+esc(x.actor)+'</small></article>').join(''):'<div class="home-empty">尚無異動，完成新增或補貨後顯示於此。</div>')+'</section></div>';
}
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
if(b.hasAttribute('data-import-items'))importExcelItems();
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
const arr=db[{site:'sites',zone:'zones',location:'locations',item:'items'}[kind]],existing=arr.find(x=>x.id===f.dataset.id),parent=kind==='zone'?'site':kind==='location'?'zone':null;
if(arr.some(x=>x.id!==existing?.id&&x.name===data.name.trim()&&(!parent||x[parent]===data[parent]))&&kind!=='item'){showPrototypeToast('同一層級名稱不可重複');return;}
const ok=transact(()=>{const value={...data,name:data.name.trim(),id:existing?.id||id(kind),enabled:existing?.enabled??true};if(kind==='item')Object.assign(value,{qty:Number(data.qty),min:Number(data.min),quantityPending:false,used:existing?.used??0,fixed:data.fixed==='yes'});if(existing){const before=JSON.stringify(existing);Object.assign(existing,value);log('設定修改',before+' → '+JSON.stringify(existing));}else{arr.push(value);log('新增設定',kind+' · '+value.name);}});if(ok)closePrototypeModal();
}else{const x=db.items.find(v=>v.id===f.dataset.id),qty=Number(data.qty);if(!x||!Number.isInteger(qty)||qty<(kind==='count'?0:1)||!String(data.reason||'').trim()){showPrototypeToast('請確認數量與原因');return;}
if(kind==='request'){const source=db.items.find(v=>v.id===data.source);if(!source||source.location===x.location||source.name!==x.name||source.unit!==x.unit){showPrototypeToast('請選有效的同品項來源');return;}}
const ok=transact(()=>{if(kind==='count'){log('盤點送複查',x.name+' · 帳面 '+x.qty+'／實盤 '+qty+' · '+data.reason);db.logs[0].review='待複查';}else{db.requests.unshift({id:id('RP'),source:data.source,target:x.id,qty,step:0,reason:data.reason});log('建立補貨申請',x.name+' · '+qty+' '+x.unit);}});if(ok)closePrototypeModal();}
});

// Location management routes to the shared master configuration.
document.addEventListener('click',event=>{const b=event.target.closest('[data-module],[data-prototype-action]');if(!b)return;if(b.dataset.module==='locations'||['warehouse-manage','warehouse-manage-office','machine-location'].includes(b.dataset.prototypeAction)){event.stopImmediatePropagation();view='config';showPage('dashboard');}},true);
// Existing integrated forms also select locations from the shared master data.
document.addEventListener('click',event=>{const b=event.target.closest('[data-module-create],[data-field-action]');if(!b)return;const available=db.locations.filter(enabledLocation);const form=document.getElementById('integratedForm');if(form){const indexes={returns:3,maintenance:1,headsets:2,disposal:3,asset:2};const index=indexes[form.dataset.module];if(index!==undefined){const input=form.querySelector('[name="v'+index+'"]');if(input){const selectEl=document.createElement('select');selectEl.name=input.name;selectEl.id=input.id;selectEl.required=true;selectEl.innerHTML=options(available.map(x=>({id:x.name,name:x.name})),'','請選擇位置');input.replaceWith(selectEl);}}}const fieldForm=document.getElementById('fieldForm');if(fieldForm){const selectEl=fieldForm.querySelector('[name="location"]');if(selectEl)selectEl.innerHTML=options(available.map(x=>({id:x.name,name:x.name})),'','請選擇位置');}});

document.querySelectorAll('[data-page="dashboard"],[data-mobile="dashboard"]').forEach(b=>b.addEventListener('click',()=>{view='work';render();}));
prototypeModalBody.addEventListener('submit',()=>setTimeout(()=>{if(!hub.hidden&&view==='work')render();},0));
syncForms();showPage('dashboard');
})();

