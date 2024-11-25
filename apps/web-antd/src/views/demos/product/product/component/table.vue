<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import {
  Button,
  message,
  Space,
  Upload,
  Image,
  Table,
  Descriptions,
  DescriptionsItem,
  Switch,
} from 'ant-design-vue';

import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';

import { useVbenForm } from '#/adapter/form';
import { useRouter } from 'vue-router';

import { getProductApi } from '#/api';

const router = useRouter();

const columns = ref([
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 50,
  },
  {
    title: '商品图',
    dataIndex: 'image',
    key: 'image',
    width: 80,
  },
  {
    title: '商品名称',
    dataIndex: 'storeName',
    key: 'storeName',
  },
  {
    title: '商品售价',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '销量',
    dataIndex: 'sales',
    key: 'sales',
  },
  {
    title: '库存',
    dataIndex: 'stock',
    key: 'stock',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 60,
  },
  {
    title: '添加时间',
    dataIndex: 'addTime',
    key: 'addTime',
  },
  {
    title: '状态',
    dataIndex: 'isShow',
    key: 'isShow',
    fixed: 'right',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 250,
  },
]);

const data = ref();

const props = defineProps({
  commonData: {
    type: Object,
    required: true,
  },
});

watch(props.commonData, () => {
  formApi.updateSchema([
    {
      componentProps: {
        options: props.commonData.categories,
      },
      fieldName: 'cateId',
    },
  ]);
});

onMounted(() => {
  formApi.submitForm();
});

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
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: [
    {
      component: 'Cascader',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: props.commonData.categories,
        fieldNames: { label: 'name', value: 'id', children: 'child' },
        placeholder: '请选择父级分类',
        showSearch: false,
      },
      fieldName: 'cateId',
      label: '父级分类',
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
  if (values.cateId && values.cateId.length > 0) {
    values.cateId = values.cateId[values.cateId.length - 1];
  }
  const res = await getProductApi({
    ...values,
    type: props.commonData.type,
    page: 1,
    pageSize: 10,
  });
  data.value = res.items;
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}

const toAdd = () => {
  router.push({
    path: '/demos/product/add',
    query: {
      type: props.commonData.type,
    },
  });
};
const updateProd = (id) => {
  router.push({
    path: '/demos/product/add',
    query: {
      productId: id,
    }
  });
}
const delProd = (id) => {

}
</script>
<template>
  <Table :columns="columns" :data-source="data" :scroll="{ x: 1500 }" rowKey="id" :expand-column-width="100">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <Button type="primary" @click="updateProd(record.id)" >编辑</Button>
        <Button type="text" danger @click="delProd(record.id)" >移入回收站</Button>
      </template>
      <template v-if="column.key === 'isShow'">
        <Switch v-model:checked="record.isShow" checked-children="上架" un-checked-children="下架" />
      </template>
      <template v-if="column.key === 'image'">
        <Image :width="30" :src="record.image" />
      </template>
    </template>
    <template #expandedRowRender="{ record }">
      <p style="margin: 0">
        <Descriptions>
          <DescriptionsItem label="商品分类："><span v-for="(item, index) in record.cateValues.split(',')" :key="index"
              class="mr10">{{ item }}</span></DescriptionsItem>
          <DescriptionsItem label="市场价："><span>{{ record.otPrice }}</span></DescriptionsItem>
          <DescriptionsItem label="成本价："><span>{{ record.cost }}</span></DescriptionsItem>
          <DescriptionsItem label="收藏："><span>{{ record.collectCount }}</span></DescriptionsItem>
          <DescriptionsItem label="虚拟销量：">
            <span>{{ record.ficti }}</span>
          </DescriptionsItem>
        </Descriptions>
      </p>
    </template>

    <template #expandColumnTitle>
      <span style="color: red"></span>
    </template>
    <template #title>
      <Space>
        <QueryForm />
      </Space>
      <div>
        <Button type="primary" @click="toAdd">
          <PlusOutlined />
          添加商品
        </Button>
      </div>
    </template>
  </Table>
</template>
