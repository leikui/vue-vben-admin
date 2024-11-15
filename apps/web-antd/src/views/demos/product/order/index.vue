<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message, Table, Button, Card, Image, Switch, Modal } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getProductOrderListApi } from '#/api';


const [QueryForm, form] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入名称',
      },
      // 字段名
      fieldName: 'name',
      // 界面显示的label
      label: '规格名称',
    },
  ],
  // 是否可展开
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-3',
});
async function onSubmit(values: Record<string, any>) {
  const res = await getProductOrderListApi({ ...values, page: 1, pageSize: 10 });
  dataSource.value = res.items;
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}

onMounted(() => {
  form.submitForm();
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
