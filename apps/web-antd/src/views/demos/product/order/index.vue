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
  const res = await getProductOrderListApi({
    ...values,
    page: pagination.value.current,
    pageSize: pagination.value.pageSize
  });
  dataSource.value = res.items;
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
          <Button type="link" danger @click="showDeleteConfirm(record.id)">删除</Button>
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

        <template v-if="column.key === 'status'">
          <Switch v-model:checked="record.status" checked-children="开" un-checked-children="关" />
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
  </Page>
</template>
