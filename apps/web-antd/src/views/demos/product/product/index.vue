<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import {message} from 'ant-design-vue';
import { useRouter } from 'vue-router';

import {
  Card,
  TabPane,
  Tabs
} from 'ant-design-vue';

import { getCategoryApi } from '#/api';

import DataTable from './component/table.vue'

const router = useRouter();

const searchType = ref('1');

onMounted(() => {
  getCommonData()
});

//common data
const commonData = ref(
  {
    categories: [],
    status: [],
    type: '1',
  }
)
const getCommonData = async () => {
  const res = await getCategoryApi({ status:-1, page: 1, limit: 9999});
  commonData.value.categories = res;

}

const handleChange = (key) => {
  searchType.value = key;
  commonData.value.type = searchType.value;
  console.log(commonData.value);
}

</script>

<template>
  <Page>
    <Tabs v-model:activeKey="searchType" @change="handleChange" >
      <TabPane key="1" tab="出售中商品"><DataTable :commonData="commonData"/></TabPane>
      <TabPane key="2" tab="仓库中商品"><DataTable :commonData="commonData"/></TabPane>
      <TabPane key="3" tab="已售罄商品"><DataTable :commonData="commonData"/></TabPane>
      <TabPane key="4" tab="警戒库存"><DataTable :commonData="commonData"/></TabPane>
      <TabPane key="5" tab="商品回收站"><DataTable :commonData="commonData"/></TabPane>
    </Tabs>



  </Page>
</template>
