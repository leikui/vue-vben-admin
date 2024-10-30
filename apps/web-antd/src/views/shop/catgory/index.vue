<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { Card, message, Table } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getCategoryApi } from "#/api";
import { ref } from 'vue';


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
        filterOption: true,
        options: [
          {
            label: '全部',
            value: '-1',
          },
          {
            label: '显示',
            value: '1',
          },
          {
            label: '不显示',
            value: '0',
          },
        ],
        defaultValue: '-1',
        placeholder: '请选择',
        showSearch: true,
      },
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
async function onSubmit(values: Record<string, any>) {
  data.value = await getCategoryApi(values)
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '分类图标',
    dataIndex: 'extra',
    key: 'extra',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Action',
    key: 'action',
  },
];
const data = ref()
</script>

<template>
  <Page>
    <div>
      <Card>
        <QueryForm />
      </Card>
      <Card>
        <Table :columns="columns" :data-source="data" />
      </Card>
    </div>
  </Page>
</template>
