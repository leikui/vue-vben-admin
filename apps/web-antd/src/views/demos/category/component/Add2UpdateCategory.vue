<script lang="ts" setup>
import { ref } from 'vue';
import { Button, message, Space } from 'ant-design-vue';

import { useVbenModal } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';

const data = ref();

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    console.info('onConfirm');
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData<Record<string, any>>();
      console.log(data.value);

      if (data.value.record != undefined) {
        //编辑 -》pid == 0 pid ！= 0
        if (data.value.action == 2 && data.value.record.pid == 0) {
          formApi.setFieldValue('pid', '根目录');
          formApi.updateSchema([
            {
              dependencies: {
                disabled() {
                  return true;
                },
                triggerFields: ['pid'],
              },
              fieldName: 'pid',
            },
          ]);
        } else if (data.value.action == 2 && data.value.record.pid != 0) {
          formApi.updateSchema([
            {
              dependencies: {
                disabled() {
                  return false;
                },
                triggerFields: ['pid'],
              },
              fieldName: 'pid',
            },
          ]);
          formApi.setFieldValue('pid', data.value.record.pid);

        }else {
          formApi.setFieldValue('pid', data.value.record.id);

        }

      }

      formApi.updateSchema([
        {
          componentProps: {
            options: data.value.pdata,
          },
          fieldName: 'pid',
        },
        {
          defaultValue: data.value?.action ==1? '': data.value.record?.name??'',
          fieldName: 'name',
        }
      ]);
    }
  },
});

//form 数据
const [BaseForm, formApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 使用 tailwindcss grid布局
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  layout: 'horizontal',
  // 水平布局，label和input在同一行
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入分类名称',
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
        filterOption: true,
        options: [],
        fieldNames: { label: 'name', value: 'id' },
        placeholder: '请选择父级分类',
        showSearch: false,
      },
      fieldName: 'pid',
      label: '父级分类',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'field3',
      label: '自定义组件(slot)',
      rules: 'required',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-1',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}

</script>
<template>
  <Modal title="数据共享示例">
    <BaseForm >
      <template #field3="slotProps">
      <Input placeholder="请输入" v-bind="slotProps" />
    </template>
    </BaseForm>
  </Modal>
</template>
