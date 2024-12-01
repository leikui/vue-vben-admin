<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message, Table, Button, Card, Image, Switch, Modal } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { useVbenForm } from '#/adapter/form';
import { getProductOrderListApi, getProductOrderDetailApi } from '#/api';


//订单状态（all 总数； 未支付 unPaid； 未发货 notShipped；待收货 spike；待评价 bargain；已完成 complete；待核销 toBeWrittenOff；退款中:refunding；已退款:refunded；已删除:deleted
const orderStatus = ref([
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '待付款',
    value: 'unPaid',
  },
  {
    label: '待发货',
    value: 'notShipped',
  },
  {
    label: '待收货',
    value: 'spike',
  },
  {
    label: '已完成',
    value: 'complete',
  },
  {
    label: '退款中',
    value: 'refunding',
  },
  {
    label: '已退款',
    value: 'refunded',
  },
  {
    label: '已删除',
    value: 'deleted',
  },
]);
const rangePresets = ref([
  { label: '7天之前', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '14天之前', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '30之前', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '90天之前', value: [dayjs().add(-90, 'd'), dayjs()] },
]);

const [QueryForm, formApi] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖

  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  fieldMappingTime: [['rangePicker', ['startTime', 'endTime'], 'YYYY-MM-DD']],
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: false,
        options: orderStatus.value,
        placeholder: '请选择',
        showSearch: false,
        fieldNames: { label: 'label', value: 'value' },
      },
      defaultValue: 'all',
      fieldName: 'status',
      label: '订单状态',
    },
    {
      component: 'RangePicker',
      componentProps: {
        presets: rangePresets.value,
        onChange: (value: Dayjs[], dateString: string[]) => {
          console.log(value, dateString);
          if (!value) {
            formApi.setFieldValue('rangePicker', []);
          }
        },
      },
      fieldName: 'rangePicker',
      label: '创建时间',
    },
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入订单号',
      },
      // 字段名
      fieldName: 'orderNo',
      // 界面显示的label
      label: '订单号',
    },
  ],
  // 是否可展开
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});
async function onSubmit(values: Record<string, any>) {
  const res = await getProductOrderListApi({
    ...values,
    type: '0',
    page: pagination.value.current,
    limit: pagination.value.pageSize
  });
  dataSource.value = res.list;
  pagination.value.total = res.total; // 假设API返回总数
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}

onMounted(() => {
  formApi.submitForm();
});

// table
const columns = ref([
  {
    title: '订单号',
    dataIndex: 'orderId',
    key: 'orderId',
    width: 100,
  },
  {
    title: '订单类型',
    dataIndex: 'orderType',
    key: 'orderType',
  },
  {
    title: '收货人',
    dataIndex: 'realName',
    key: 'realName',
  },
  {
    title: '商品信息',
    dataIndex: 'productList',
    key: 'productList',
    width: 400,
  },
  {
    title: '实际支付',
    dataIndex: 'payPrice',
    key: 'payPrice',
  },
  {
    title: '支付方式',
    dataIndex: 'payTypeStr',
    key: 'payTypeStr',
  },
  {
    title: '订单状态',
    dataIndex: 'refundStatus',
    key: 'refundStatus',
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },


  {
    title: '操作',
    key: 'action',
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
