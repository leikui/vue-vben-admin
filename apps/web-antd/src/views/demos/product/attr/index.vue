<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message, Table, Button, Card, Image, Switch, Modal } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import Attr from './component/attr.vue'
import { getProductRuleListApi } from '#/api';


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
  const res = await getProductRuleListApi({ ...values, page: 1, pageSize: 999 });
  dataSource.value = res.list;
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
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '规格名称',
    dataIndex: 'ruleName',
    key: 'ruleName',
  },
  {
    title: '商品规格属性',
    dataIndex: 'ruleValue',
    key: 'ruleValue',
  },

  {
    title: '操作',
    key: 'action',
  },
]);
const dataSource = ref();

const [ModalCom, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: Attr,
  showCancelButton: true,
  showConfirmButton: true,
  class: 'w-[60%]',
});
function openModal(type: number, recordData?: any, pid?: number) {
  modalApi.setData({
    attr: recordData,
    action: type,
  });
  modalApi.setState({
    title: '创建产品分类',
  });
  if (type == 2) {
    modalApi.setState({
      title: '编辑产品分类',
    });
  }

  modalApi.open();
}

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


//格式化数据方法
const parseRuleDetail = (ruleDetail: any) => {
  const rul = JSON.parse(ruleDetail);
  let result :string[] = [];
  rul.forEach((item: any) => {
    result.push(`${item.value}:[${item.detail}]`)
  });
  return result.join(',');
}

function saveRuleSuccess(){
  form.submitForm();
}
</script>

<template>
  <Page>
    <Card>
      <QueryForm />
    </Card>

    <Table :columns="columns" :data-source="dataSource" :pagination="false" rowKey="id" bordered>
      <template #bodyCell="{ column, record }">

        <template v-if="column.key === 'action'">
          <Button type="link" @click="openModal(2, record)">编辑</Button>
          <Button type="link" danger @click="showDeleteConfirm(record.id)">删除</Button>
        </template>
        <template v-if="column.key === 'ruleValue'">
          <div>{{ parseRuleDetail(record.ruleValue) }}</div>
        </template>
        <template v-if="column.key === 'status'">
          <Switch v-model:checked="record.status" checked-children="开" un-checked-children="关" />
        </template>
      </template>
      <template #title><Button type="primary" @click="openModal(1)">新增</Button></template>
    </Table>

    <ModalCom @saveRuleSuccess="saveRuleSuccess" />
  </Page>
</template>
