<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';
import { ref } from 'vue';

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

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    console.info('onConfirm');
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData<Record<string, any>>().record;
      pdata.value = modalApi.getData<Record<string, any>>().pdata;
      formApi.setFieldValue('pid', pdata.value);

      pid.value = modalApi.getData<Record<string, any>>().pid;

      console.log(pdata.value);
    }
  },
});

const data = ref();
const pid = ref(0);
const pdata = ref();

const [Form, formApi] = useVbenForm({
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
        placeholder: '分类名称',
      },
      // 字段名
      fieldName: 'name',
      // 界面显示的label
      label: '分类名称',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: false,
        filterOption: false,
        options: pdata.value,
        placeholder: '请选择',
        showSearch: false,
        fieldNames: { label: 'name', value: 'id' },
      },
      // defaultValue: 245,
      fieldName: 'pid',
      label: '父级分类',
      dependencies: {
        componentProps(values) {
          console.log('data,',data.value);

          formApi.setValues(data.value);
          return {
            options: pdata.value,
            defaultValue: data.value?.pid ===0? data.value?.id  : 0,
          };
        },
        disabled(values) {
          console.log('values,',values);

          return !(data.value != null && data.value != undefined) && data.value?.pid === 0 ;
        },

        triggerFields: ['id'],
      },
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '排序',
      },
      fieldName: 'number',
      defaultValue: 0,
      label: '排序',
    },
  ],
  wrapperClass: 'grid-cols-1',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
