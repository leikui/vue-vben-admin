<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Page, useVbenModal } from '@vben/common-ui';
import { message, Table, Button, Card } from 'ant-design-vue';
import dayjs from 'dayjs';
import { useVbenForm } from '#/adapter/form';
import { getScoreListApi } from '#/api/core/score';

// 积分类型
const scoreTypes = ref([
  { label: '全部', value: 'all' },
  { label: '购物获得', value: 'shopping' },
  { label: '推广获得', value: 'promotion' },
  { label: '签到获得', value: 'signin' },
  { label: '积分使用', value: 'used' },
]);

const rangePresets = ref([
  { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '最近30天', value: [dayjs().add(-30, 'd'), dayjs()] },
]);

// 查询表单配置
const [QueryForm, formApi] = useVbenForm({

  schema: [
    {
      component: 'Select',
      componentProps: {
        options: scoreTypes.value,
        placeholder: '请选择类型',
      },
      defaultValue: 'all',
      fieldName: 'type',
      label: '积分类型',
    },
    {
      component: 'RangePicker',
      componentProps: {
        presets: rangePresets.value,
      },
      fieldName: 'rangePicker',
      label: '获得时间',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID/手机号',
      },
      fieldName: 'keyword',
      label: '用户信息',
    },
  ],
  handleSubmit: onSubmit,
});

// 表格配置
const columns = ref([
  {
    title: '用户信息',
    dataIndex: 'userInfo',
    key: 'userInfo',
  },
  {
    title: '变动积分',
    dataIndex: 'scoreChange',
    key: 'scoreChange',
  },
  {
    title: '当前积分',
    dataIndex: 'currentScore',
    key: 'currentScore',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
]);

const dataSource = ref([]);
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
});

// 提交查询
async function onSubmit(values: Record<string, any>) {
  // TODO: 实现积分记录查询接口
  console.log('查询参数：', values);
  const res = await getScoreListApi({
    ...values,
    page: pagination.value.current,
    limit: pagination.value.pageSize,
  });
  dataSource.value = res.list;
  pagination.value.total = res.total;
  message.success('查询成功');
}

// 分页变化处理
const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  formApi.submitForm();
};

onMounted(() => {
  formApi.submitForm();
});
</script>

<template>
  <Page>
    <Card>
      <QueryForm />
    </Card>

    <Table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
      rowKey="id"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'userInfo'">
          <div>
            <div>{{ record.nickname }}</div>
            <div class="text-gray-400">ID: {{ record.userId }}</div>
            <div class="text-gray-400">手机: {{ record.phone }}</div>
          </div>
        </template>
        <template v-if="column.key === 'scoreChange'">
          <span :class="record.scoreChange > 0 ? 'text-green-500' : 'text-red-500'">
            {{ record.scoreChange > 0 ? '+' : '' }}{{ record.scoreChange }}
          </span>
        </template>
      </template>
    </Table>
  </Page>
</template>
