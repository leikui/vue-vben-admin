<script lang="ts" setup>
import { ref } from 'vue';
import { Button, message, Space, Upload,Image,} from 'ant-design-vue';

import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';

import { useVbenModal } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';

const data = ref();
//form 数据
const [BaseForm, formApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      // class: 'w-full',
      class: 'w-auto',
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
      fieldName: 'extra',
      label: '分类图标',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
        class: 'w-auto',
      },
      fieldName: 'sort',
      label: '排序',
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        checkedChildren: '开',
        unCheckedChildren: '关',
        class: 'w-auto',
      },
      defaultValue: true,
      fieldName: 'status',
      label: '状态',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-1',
});

function onSubmit(values: Record<string, any>) {
  // message.success({
  //   content: `form values: ${JSON.stringify(values)}`,
  // });
}


//上传组件
const fileList = ref([]);
const loading = ref<boolean>(false);
const imageUrl = ref<string>('');

const handleChange = (info) => {
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    // Get this url from response in real world.

    getBase64(info.file.originFileObj, (base64Url: string) => {
      imageUrl.value = base64Url;
      loading.value = false;
    });
  }
  if (info.file.status === 'error') {
    loading.value = false;
    message.error('upload error');
  }
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return false;
};
function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}



</script>
<template>
  <Modal >
    <BaseForm>
      <template #extra="slotProps">
        <Upload
          v-bind="slotProps"
          v-model:file-list="fileList"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <Image v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">上传</div>
          </div>
        </Upload>
      </template>
    </BaseForm>
  </Modal>
</template>
