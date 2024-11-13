<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Step, Steps, Switch } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const currentTab = ref(0);
function onFirstSubmit(values: Record<string, any>) {
  message.success({
    content: `form1 values: ${JSON.stringify(values)}`,
  });
  currentTab.value = 1;
}

function onSecondReset() {
  currentTab.value = 0;
}
function onSecondSubmit(values: Record<string, any>) {
  currentTab.value = 2;
  message.success({
    content: `form3 values: ${JSON.stringify(values)}`,
  });
}
function onThirdReset() {
  currentTab.value = 1;
}
function onThirdSubmit(values: Record<string, any>) {
  message.success({
    content: `form3 values: ${JSON.stringify(values)}`,
  });
}


const [FirstForm, firstFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onFirstSubmit,
  layout: 'horizontal',
  resetButtonOptions: {
    show: false,
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'formFirst',
      label: '表单1字段',
      rules: 'required',
    },
  ],
  submitButtonOptions: {
    content: '下一步',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1',
});
const [SecondForm, secondFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleReset: onSecondReset,
  handleSubmit: onSecondSubmit,
  layout: 'horizontal',
  resetButtonOptions: {
    content: '上一步',
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'formSecond',
      label: '表单2字段',
      rules: 'required',
    },
  ],
  submitButtonOptions: {
    content: '下一步',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1',
});

const [ThirdForm, thirdFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleReset: onThirdReset,
  handleSubmit: handleMergeSubmit,
  layout: 'horizontal',
  resetButtonOptions: {
    content: '上一步',
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'formThird',
      label: '表单3字段',
      rules: 'required',
    },
  ],
  submitButtonOptions: {
    content: '完成',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1',
});


const needMerge = ref(true);
async function handleMergeSubmit() {
  const values = await firstFormApi
    .merge(secondFormApi)
    .merge(thirdFormApi)
    .submitAllForm(needMerge.value);
  message.success({
    content: `merged form values: ${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Page>
    <Card title="基础示例">
      <template #extra>
        <Switch v-model:checked="needMerge" checked-children="开启字段合并" class="mr-4" un-checked-children="关闭字段合并" />
        <Button type="primary" @click="handleMergeSubmit">合并提交</Button>
      </template>
      <div class="mx-auto max-w-lg">
        <Steps :current="currentTab" class="steps">
          <Step title="商品信息" />
          <Step title="商品详情" />
          <Step title="其他设置" />
        </Steps>
        <div class="p-20">
          <FirstForm v-show="currentTab === 0" />
          <SecondForm v-show="currentTab === 1" />
          <ThirdForm v-show="currentTab === 2" />
        </div>
      </div>
    </Card>
  </Page>
</template>
