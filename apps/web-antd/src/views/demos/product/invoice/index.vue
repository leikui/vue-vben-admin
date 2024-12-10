<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message, Table, Button, Card, Image, Switch, Modal } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { useVbenForm } from '#/adapter/form';
import { getInvoiceListApi,getProductOrderDetailApi } from '#/api';


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
  // {
  //   title: '申请编号',
  //   dataIndex: 'invoiceId',
  //   key: 'invoiceId',
  //   width: 180,
  // },
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 180,
  },
  {
    title: '申请时间',
    dataIndex: 'createDate',
    key: 'createDate',
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
    dataIndex: 'type',
    key: 'type',
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

    <Table :columns="columns" :data-source="dataSource" :pagination="pagination" @change="handleTableChange" rowKey="orderNo" bordered :scroll="{ x: 1000 }"
      :expand-column-width="30">
      <template #bodyCell="{ column, record }">

        <template v-if="column.key === 'action'">
          <Button type="link" @click="showDetail(record.orderNo)">订单详情</Button>

        </template>
        <template v-if="column.key === 'type'">
         <div v-if="record.type === 'personal'">个人</div>
         <div v-else>单位</div>
        </template>
      <template v-if="column.key === 'status'">
         <div v-if="record.status === 1">待开票</div>
         <div v-else-if="record.status === 2">已开票</div>
         <div v-else-if="record.status === 0">订单待支付</div>
         <div v-else>未知</div>
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
        <div class="p-4">
          <div class="mb-4">
            <div class="font-bold mb-2">发票信息</div>
            <div class="ml-4">
              <template v-if="record.type === 'personal'">
                <!-- 个人发票信息 -->
                <div>发票类型：个人</div>
                <div>发票抬头：{{ record.title }}</div>
                <div>开票金额：{{ record.amount }}</div>
                <div>开票状态：
                  <span v-if="record.status === 1" class="text-orange-500">待开票</span>
                  <span v-else-if="record.status === 2" class="text-green-500">已开票</span>
                  <span v-else class="text-gray-500">未知</span>
                </div>
                <div>收票人电话：{{ record.receiverMoile || '-' }}</div>
                <div>收票人邮箱：{{ record.receiverEmail || '-' }}</div>
                <div>申请时间：{{ record.createDate }}</div>
                <div>开票时间：{{ record.invoiceTime || '-' }}</div>
                <div>发票备注：{{ record.remark || '-' }}</div>
              </template>

              <template v-else>
                <!-- 单位发票信息 -->
                <div>发票类型：单位</div>
                <div>发票抬头：{{ record.title }}</div>
                <div>税号：{{ record.taxNumber }}</div>
                <div>开票金额：{{ record.amount }}</div>
                <div>开票状态：
                  <span v-if="record.status === 1" class="text-orange-500">待开票</span>
                  <span v-else-if="record.status === 2" class="text-green-500">已开票</span>
                  <span v-else class="text-gray-500">未知</span>
                </div>
                <div>注册地址：{{ record.registerAddress || '-' }}</div>
                <div>注册电话：{{ record.registerTelephone || '-' }}</div>
                <div>开户银行：{{ record.bankName || '-' }}</div>
                <div>银行账号：{{ record.bankAccount || '-' }}</div>
                <div>收票人电话：{{ record.receiverMoile || '-' }}</div>
                <div>收票人邮箱：{{ record.receiverEmail || '-' }}</div>
                <div>申请时间：{{ record.createDate }}</div>
                <div>开票时间：{{ record.invoiceTime || '-' }}</div>
                <div>发票备注：{{ record.remark || '-' }}</div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </Table>

    <ModalCom />
    <div>

    <ModalDetail class="w-[800px]" title="订单详情">
      <div class="">
        <div class="mb-2 bg-gray-50 rounded-lg p-3">
          <div class="font-bold mb-3 text-lg border-b pb-2">用户信息</div>
          <div class="ml-4 grid grid-cols-2 gap-3">
            <div class="flex items-center">
              <span class="text-gray-500 w-24">用户昵称：</span>
              <span>{{ orderDetail?.nikeName }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 w-24">绑定电话：</span>
              <span>{{ orderDetail?.phone }}</span>
            </div>
          </div>
        </div>

        <div class="mb-2 bg-gray-50 rounded-lg p-3">
          <div class="font-bold mb-3 text-lg border-b pb-2">收货信息</div>
          <div class="ml-4 space-y-3">
            <div class="flex items-center">
              <span class="text-gray-500 w-24">收货人：</span>
              <span>{{ orderDetail?.realName }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 w-24">收货电话：</span>
              <span>{{ orderDetail?.userPhone }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 w-24">收货地址：</span>
              <span>{{ orderDetail?.userAddress }}</span>
            </div>
          </div>
        </div>

        <div class="mb-2 bg-gray-50 rounded-lg p-3">
          <div class="font-bold mb-3 text-lg border-b pb-2">订单信息</div>
          <div class="ml-4 grid grid-cols-2 gap-3">
            <div class="flex items-center">
              <span class="text-gray-500 w-24">订单编号：</span>
              <span>{{ orderDetail?.orderId }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 w-24">订单状态：</span>
              <span class="text-red-500 font-medium">{{ orderDetail?.statusStr.value }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 w-24">商品总数：</span>
              <span>{{ orderDetail?.totalNum }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 w-24">商品总价：</span>
              <span class="text-orange-500">¥{{ orderDetail?.totalPrice }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 w-24">支付邮费：</span>
              <span>¥{{ orderDetail?.payPostage }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 w-24">实际支付：</span>
              <span class="text-orange-500 font-medium">¥{{ orderDetail?.payPrice }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 w-24">退款金额：</span>
              <span class="text-red-500">¥{{ orderDetail?.refundPrice }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 w-24">支付方式：</span>
              <span>{{ orderDetail?.payTypeStr }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 w-24">创建时间：</span>
              <span>{{ orderDetail?.createTime }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 w-24">推广人：</span>
              <span>{{ orderDetail?.spreadUser || '-' }}</span>
            </div>
            <div class="col-span-2 flex items-start">
              <span class="text-gray-500 w-24">商家备注：</span>
              <span>{{ orderDetail?.remark || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </ModalDetail>
    </div>
  </Page>
</template>
