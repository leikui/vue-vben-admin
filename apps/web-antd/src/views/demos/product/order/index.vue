<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message, Table, Button, Card, Image, Switch, Modal } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { useVbenForm } from '#/adapter/form';
import { getProductOrderListApi } from '#/api';

const orderStatus = ref([
  {
    label: '全部',
    value: '-1',
  },
  {
    label: '待付款',
    value: '0',
  },
  {
    label: '待发货',
    value: '1',
  },
  {
    label: '待收货',
    value: '2',
  },
  {
    label: '已完成',
    value: '3',
  },
  {
    label: '已关闭',
    value: '4',
  },
  {
    label: '已退款',
    value: '5',
  },
  {
    label: '已删除',
    value: '6',
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
        // fieldNames: { label: 'username', value: 'id' },
      },
      defaultValue: '-1',
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
  const res = await getProductOrderListApi({ ...values, page: 1, pageSize: 10 });
  dataSource.value = res.items;
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



</script>

<template>
  <Page>
    <Card>
      <QueryForm />
    </Card>

    <Table :columns="columns" :data-source="dataSource" rowKey="id" bordered>
      <template #bodyCell="{ column, record }">

        <template v-if="column.key === 'action'">
          <Button type="link" danger @click="showDeleteConfirm(record.id)">删除</Button>
        </template>

        <template v-if="column.key === 'status'">
          <Switch v-model:checked="record.status" checked-children="开" un-checked-children="关" />
        </template>
      </template>
    </Table>

    <ModalCom />
  </Page>
</template>
