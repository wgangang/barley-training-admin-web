import React, { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DataPage from '@pages/DataPage';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

const SupplierPage = lazy(() => import('@pages/SupplierPage'));
const ContractPage = lazy(() => import('@pages/ContractPage'));
const MallPromisePage = lazy(() => import('@pages/MallPromisePage'));
const MallBrand = lazy(() => import('@pages/MallBrandPage'));
const MallGoodsPage = lazy(() => import('@pages/MallGoodsPage'));
const MallInventoryPage = lazy(() => import('@pages/MallInventoryPage'));
const MallInventoryDetailPage = lazy(() => import('@pages/MallInventoryDetailPage'));
const MallSpecificationsPage = lazy(() => import('@pages/MallSpecificationsPage'));
const PurchaseGoodsPage = lazy(() => import('@pages/PurchaseGoodsPage'));
const PurchaseOrderPage = lazy(() => import('@pages/PurchaseOrderPage'));
const SupplierOrderPage = lazy(() => import('@pages/SupplierOrderPage'));
const SupplierRecordPage = lazy(() => import('@pages/SupplierRecordPage'));
const MallCategoryPage = lazy(() => import('@pages/MallCategoryPage'));

const SupplierDetailPage = lazy(() => import('@pages/SupplierDetailPage'));
const SupplierOrderDetailPage = lazy(() => import('@pages/SupplierOrderDetailPage'));
const SupplierRecordDetailPage = lazy(() => import('@pages/SupplierRecordDetailPage'));
const ContractDetailPage = lazy(() => import('@pages/ContractDetailPage'));
const MallGoodsDetailPage = lazy(() => import('@pages/MallGoodsDetailPage'));
const PurchaseOrderDetailPage = lazy(() => import('@pages/PurchaseOrderDetailPage'));
const MallSpecificationsDetailPage = lazy(() => import('@pages/MallSpecificationsDetailPage'));
const PurchaseGoodsDetailPage = lazy(() => import('@pages/PurchaseGoodsDetailPage'));

const SupplierAuditPage = lazy(() => import('@pages/SupplierAuditPage'));
const ContractAuditPage = lazy(() => import('@pages/ContractAuditPage'));
const PurchaseGoodsAuditPage = lazy(() => import('@pages/PurchaseGoodsAuditPage'));
const PurchaseOrderAuditPage = lazy(() => import('@pages/PurchaseOrderAuditPage'));
const MallGoodsAuditPage = lazy(() => import('@pages/MallGoodsAuditPage'));
const SupplierRecordAuditPage = lazy(() => import('@pages/SupplierRecordAuditPage'));

const SupplyChainLogsPage = lazy(() => import('@pages/SupplyChainLogsPage'));
const SupplyChainApiLogsPage = lazy(() => import('@pages/SupplyChainApiLogsPage'));

const App: FC = () => {
  return <div>
    <ConfigProvider theme={{
      algorithm: theme.defaultAlgorithm,
      token: {
        borderRadius: 4,
        fontSize: 13,
        controlHeight: 30,
        padding: 12,
        fontWeightStrong: 500
      },
      components: {
        Table: {
          motion: false,
          headerColor: '#333',
          rowHoverBg: '#f5f6f7',
          rowSelectedBg: '#f4f5f6',
          rowSelectedHoverBg: '#e6e7e8',
          headerBg: '#fafafa',
          cellPaddingInlineSM: 6,
          cellPaddingBlockSM: 7
        },
        Form: {
          verticalLabelPadding: '0 0 6px 0'
        },
        Input: {},
        Button: {
          paddingInline: '12px 4px'
        },
        Tooltip: {}
      }
    }} locale={zhCN}>
      <BrowserRouter basename={process.env.ROUTE_BASE || ''}>
        <Routes>
          <Route path="/supplier" element={<Suspense><SupplierPage/></Suspense>}>
            <Route path="create/:id" element={<Suspense><SupplierDetailPage/></Suspense>}/>
            <Route path="edit/:id" element={<Suspense><SupplierDetailPage/></Suspense>}/>
            <Route path="preview/:id" element={<Suspense><SupplierDetailPage preview/></Suspense>}/>
          </Route>
          <Route path="/contract" element={<Suspense><ContractPage/></Suspense>}>
            <Route path="create/:id" element={<Suspense><ContractDetailPage/></Suspense>}/>
            <Route path="edit/:id" element={<Suspense><ContractDetailPage/></Suspense>}/>
            <Route path="preview/:id" element={<Suspense><ContractDetailPage preview/></Suspense>}/>
          </Route>
          <Route path="/mall-promise" element={<Suspense><MallPromisePage/></Suspense>}/>
          <Route path="/mall-brand" element={<Suspense><MallBrand/></Suspense>}/>
          <Route path="/mall-goods" element={<Suspense><MallGoodsPage/></Suspense>}/>
          <Route path="/mall-goods/:type/:id" element={<Suspense><MallGoodsDetailPage/></Suspense>}/>
          <Route path="/mall-inventory" element={<Suspense><MallInventoryPage/></Suspense>}>
            <Route path="preview/:id" element={<Suspense><MallInventoryDetailPage/></Suspense>}/>
          </Route>
          <Route path="/mall-specifications" element={<Suspense><MallSpecificationsPage/></Suspense>}>
            <Route path="detail/:id" element={<Suspense><MallSpecificationsDetailPage/></Suspense>}/>
          </Route>
          <Route path="/purchase-goods" element={<Suspense><PurchaseGoodsPage/></Suspense>}>
            <Route path="create/:id" element={<Suspense><PurchaseGoodsDetailPage/></Suspense>}/>
            <Route path="edit/:id" element={<Suspense><PurchaseGoodsDetailPage edit/></Suspense>}/>
            <Route path="preview/:id" element={<Suspense><PurchaseGoodsDetailPage preview/></Suspense>}/>
          </Route>
          <Route path="/purchase-order" element={<Suspense><PurchaseOrderPage/></Suspense>}>
            <Route path="create/:id" element={<Suspense><PurchaseOrderDetailPage/></Suspense>}/>
            <Route path="edit/:id" element={<Suspense><PurchaseOrderDetailPage/></Suspense>}/>
            <Route path="read/:id" element={<Suspense><PurchaseOrderDetailPage read/></Suspense>}/>
            <Route path="preview/:id" element={<Suspense><PurchaseOrderDetailPage preview/></Suspense>}/>
          </Route>
          <Route path="/supplier-order" element={<Suspense><SupplierOrderPage/></Suspense>}>
            <Route path="preview/:id" element={<Suspense><SupplierOrderDetailPage/></Suspense>}/>
          </Route>
          <Route path="/supplier-record" element={<Suspense><SupplierRecordPage/></Suspense>}>
            <Route path="create/:id" element={<Suspense><SupplierRecordDetailPage/></Suspense>}/>
            <Route path="read/:id" element={<Suspense><SupplierRecordDetailPage read/></Suspense>}/>
            <Route path="preview/:id" element={<Suspense><SupplierRecordDetailPage preview/></Suspense>}/>
          </Route>
          <Route path="/interests/:id" element={<Suspense><DataPage/></Suspense>}/>
          <Route path="/supplier-audit" element={<Suspense><SupplierAuditPage/></Suspense>}>
            <Route path="audit/:id" element={<Suspense><SupplierDetailPage audit preview/></Suspense>}/>
            <Route path="preview/:id" element={<Suspense><SupplierDetailPage preview/></Suspense>}/>
          </Route>
          <Route path="/contract-audit" element={<Suspense><ContractAuditPage/></Suspense>}>
            <Route path="audit/:id" element={<Suspense><ContractDetailPage audit preview/></Suspense>}/>
            <Route path="preview/:id" element={<Suspense><ContractDetailPage preview/></Suspense>}/>
          </Route>
          <Route path="/purchase-goods-audit" element={<Suspense><PurchaseGoodsAuditPage/></Suspense>}>
            <Route path="audit/:id" element={<Suspense><PurchaseGoodsDetailPage audit preview/></Suspense>}/>
            <Route path="preview/:id" element={<Suspense><PurchaseGoodsDetailPage preview/></Suspense>}/>
          </Route>
          <Route path="/purchase-order-audit" element={<Suspense><PurchaseOrderAuditPage/></Suspense>}>
            <Route path="audit/:id" element={<Suspense><PurchaseOrderDetailPage audit preview/></Suspense>}/>
            <Route path="preview/:id" element={<Suspense><PurchaseOrderDetailPage preview/></Suspense>}/>
          </Route>
          <Route path="/mall-goods-audit" element={<Suspense><MallGoodsAuditPage/></Suspense>}>
            <Route path="audit/:id" element={<Suspense><MallGoodsDetailPage audit/></Suspense>}/>
            <Route path="preview/:id" element={<Suspense><MallGoodsDetailPage preview/></Suspense>}/>
          </Route>
          <Route path="/supplier-record-audit" element={<Suspense><SupplierRecordAuditPage/></Suspense>}>
            <Route path="audit/:id" element={<Suspense><SupplierRecordDetailPage audit preview/></Suspense>}/>
            <Route path="preview/:id" element={<Suspense><SupplierRecordDetailPage preview/></Suspense>}/>
          </Route>
          <Route path="/supply-chain-logs" element={<Suspense><SupplyChainLogsPage/></Suspense>}></Route>
          <Route path="/supply-chain-api-logs" element={<Suspense><SupplyChainApiLogsPage/></Suspense>}></Route>
          {/* 商城分类 */}
          <Route path="/mall-category" element={<Suspense><MallCategoryPage/></Suspense>}></Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  </div>;
};
export default App;
