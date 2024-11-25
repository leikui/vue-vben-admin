<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import {
  message,
  Table,
  Button,
  Card,
  Image,
  Switch,
  Modal,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import Add2Update from './component/Add2UpdateCategory.vue';
import { getCategoryApi } from '#/api';
import Add2UpdateCategory from './component/Add2UpdateCategory.vue';

const param = ref([
  {
    username: '全部',
    id: '-1',
  },
  {
    username: '显示',
    id: '1',
  },
  {
    username: '隐藏',
    id: '0',
  },
]);

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
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: false,
        options: param.value,
        placeholder: '请选择',
        showSearch: false,
        fieldNames: { label: 'username', value: 'id' },
      },
      defaultValue: '-1',
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
  const res = await getCategoryApi({ ...values, page: 1, limit: 9999,type:1 });
  dataSource.value = res;
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
    title: '操作',
    key: 'action',
  },
]);
const dataSource = ref();

const [ModalCom, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: Add2UpdateCategory,
  showCancelButton: false,
  showConfirmButton: false,
});
function openModal(type: number, recordData?: any, pid?: number) {
  modalApi.setData({
    record: recordData,
    pdata: dataSource.value,
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

const showDeleteConfirm = () => {
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

    <Table
      :columns="columns"
      :data-source="dataSource"
      childrenColumnName="child"
      rowKey="id"
      :pagination="false"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'extra'">
          <Image :width="30" :src="record.extra" />
        </template>
        <template v-if="column.key === 'action'">
          <Button
            type="link"
            :disabled="record.pid != 0"
            @click="openModal(1, record)"
            >添加子目录</Button
          >
          <Button type="link" @click="openModal(2, record)">编辑</Button>
          <Button type="link" danger @click="showDeleteConfirm">删除</Button>
        </template>
        <template v-if="column.key === 'type'">
          <div>产品分类</div>
        </template>
        <template v-if="column.key === 'status'">
          <Switch
            v-model:checked="record.status"
            checked-children="开"
            un-checked-children="关"
          />
        </template>
      </template>
      <template #title
        ><Button type="primary" @click="openModal(1)">新增</Button></template
      >
    </Table>

    <ModalCom />
  </Page>
</template>
