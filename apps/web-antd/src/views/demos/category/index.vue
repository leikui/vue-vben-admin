<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { message, Table } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const param = ref([
  {
    username: 'admin',
    id: '1',
  },
  {
    username: 'admin2',
    id: '11',
  },
]);

const [QueryForm] = useVbenForm({
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
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: false,
        options: param.value,
        placeholder: '请选择',
        showSearch: false,
        fieldNames: { label: 'username', value: 'id' },
      },
      defaultValue: '1',
      fieldName: 'status',
      label: '状态',
    },
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
      label: '名称',
    },
  ],
  // 是否可展开
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-3',
});
function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}

// table
const columns = ref([
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
]);
const dataSource = ref();
</script>

<template>
  <Page>
    <QueryForm />
    <Table :columns="columns" :data-source="dataSource" />
  </Page>
</template>
