<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message, Table, Button, Card, Image, Switch, Modal } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { useVbenForm } from '#/adapter/form';
import { getInvoiceListApi } from '#/api';


const rangePresets = ref([
  { label: '7天之前', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '14天之前', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '30天之前', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '90天之前', value: [dayjs().add(-90, 'd'), dayjs()] },
]);

const invoiceStatus = ref([
  { label: '全部', value: '0' },
  { label: '待开票', value: '1' },
  { label: '已开票', value: '2' },
  { label: '已驳回', value: 'rejected' },
]);

const [QueryForm, formApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  fieldMappingTime: [['rangePicker', ['startTime', 'endTime'], 'YYYY-MM-DD']],
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: invoiceStatus.value,
        placeholder: '请选择开票状态',
        showSearch: false,
        fieldNames: { label: 'label', value: 'value' },
      },
      defaultValue: '0',
      fieldName: 'status',
      label: '开票状态',
    },
    {
      component: 'RangePicker',
      componentProps: {
        presets: rangePresets.value,
        onChange: (value: Dayjs[], dateString: string[]) => {
          if (!value) {
            formApi.setFieldValue('rangePicker', []);
          }
        },
      },
      fieldName: 'rangePicker',
      label: '申请时间',
    },
  ],
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

async function onSubmit(values: Record<string, any>) {
  const res = await getInvoiceListApi({
    ...values,
    page: pagination.value.current,
    limit: pagination.value.pageSize
  });
  dataSource.value = res.list;
  pagination.value.total = res.total;
}

onMounted(() => {
  formApi.submitForm();
});

// table
const columns = ref([
  {
    title: '申请编号',
    dataIndex: 'invoiceId',
    key: 'invoiceId',
    width: 180,
  },
  {
    title: '订单编号',
    dataIndex: 'orderId',
    key: 'orderId',
    width: 180,
  },
  {
    title: '申请时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
  {
    title: '发票金额',
    dataIndex: 'amount',
    key: 'amount',
    width: 120,
  },
  {
    title: '发票类型',
    dataIndex: 'invoiceType',
    key: 'invoiceType',
    width: 120,
  },
  {
    title: '开票状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
  },
]);
const dataSource = ref();

// 添加分页相关的响应式变量
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
});

const showDeleteConfirm = (attrId) => {
  Modal.confirm({
    title: '删除产品分类',
    content: '确认删除产品分类？',
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      console.log('OK');
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

// 添加分页改变处理函数
const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  formApi.submitForm();
};


//订单详情
const [ModalDetail, modalApi] = useVbenModal();
const orderDetail = ref()
const showDetail = async (id: string) => {
  console.log(id);
  const res = await getProductOrderDetailApi({
    orderNo: id,
  });
  console.log(res);
  orderDetail.value = res
  modalApi.open()
};

</script>

<template>
  <Page>
    <Card>
      <QueryForm />
    </Card>

    <Table :columns="columns" :data-source="dataSource" :pagination="pagination" @change="handleTableChange" rowKey="orderId" bordered :scroll="{ x: 1000 }"
      :expand-column-width="30">
      <template #bodyCell="{ column, record }">

        <template v-if="column.key === 'action'">
          <Button type="link" @click="showDetail(record.orderId)">详情</Button>

        </template>
        <template v-if="column.key === 'productList'">
          <div v-for="item in record.productList" :key="item.id">
            <div style="display: flex; align-items: center;">
              <Image :height="50" :width="50" :src="item.info.image" alt="avatar" style="margin-right: 8px;" />
              <span :title="item.info.productName"
                style="display: inline-block; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{
                  item.info.productName }}...</span>
            </div>
          </div>
        </template>

        <template v-if="column.key === 'refundStatus'">
          <!-- //订单状态 -->
          {{ record.statusStr?.value }}
        </template>

      </template>
      <template #expandedRowRender="{ record }">
        <div v-for="item in record.productList" :key="item.id" class="mb-4">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <Image :height="80" :width="80" :src="item.info.image" alt="商品图片" style="margin-right: 16px;" />
            <div class="ml-4">
              <div style="font-size: 14px; margin-bottom: 8px;">{{ item.info.productName }}</div>
              <div style="color: #999;">规格: {{ item.info.sku }}</div>
              <div style="color: #f5222d; font-size: 16px;">¥{{ item.info.price }}</div>
              <div style="color: #999;">数量: {{ item.info.payNum }}</div>
            </div>
          </div>
        </div>
      </template>
    </Table>

    <ModalCom />
    <div>

    <ModalDetail class="w-[600px]" title="订单详情">
      <div class="p-4">
        <div class="mb-4">
          <div class="font-bold mb-2">用户信息</div>
          <div class="ml-4">
            <div>用户昵称：{{ orderDetail?.nikeName }}</div>
            <div>绑定电话：{{ orderDetail?.phone }}</div>
          </div>
        </div>

        <div class="mb-4">
          <div class="font-bold mb-2">收货信息</div>
          <div class="ml-4">
            <div>收货人：{{ orderDetail?.realName }}</div>
            <div>收货电话：{{ orderDetail?.userPhone }}</div>
            <div>收货地址：{{ orderDetail?.userAddress }}</div>
          </div>
        </div>

        <div class="mb-4">
          <div class="font-bold mb-2">订单信息</div>
          <div class="ml-4">
            <div>订单编号：{{ orderDetail?.orderId }}</div>
            <div class="text-red-500">订单状态：{{ orderDetail?.statusStr.value }}</div>
            <div>商品总数：{{ orderDetail?.totalNum }}</div>
            <div>商品总价：{{ orderDetail?.totalPrice }}</div>
            <div>支付邮费：{{ orderDetail?.payPostage }}</div>
            <div>实际支付：{{ orderDetail?.payPrice }}</div>
            <div>退款金额：{{ orderDetail?.refundPrice }}</div>
            <div>创建时间：{{ orderDetail?.createTime }}</div>
            <div>支付方式：{{ orderDetail?.payTypeStr }}</div>
            <div>推广人：{{ orderDetail?.spreadUser || '-' }}</div>
            <div>商家备注：{{ orderDetail?.remark || '' }}</div>
          </div>
        </div>
      </div>
    </ModalDetail>
    </div>
  </Page>
</template>
