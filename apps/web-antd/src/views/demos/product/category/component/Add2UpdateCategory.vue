<script lang="ts" setup>
import { ref } from 'vue';
import { Button, message, Space, Upload,Image,} from 'ant-design-vue';

import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';

import { useVbenModal } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { upLoadFileAPI,saveCategoryApi,updateCategoryApi } from '#/api';
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
          imageUrl.value = data.value.record?.extra?? '';
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
          imageUrl.value = data.value.record?.extra?? '';
        } else {
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
          defaultValue:
            data.value?.action == 1 ? '' : (data.value.record?.name ?? ''),
          fieldName: 'name',
        },
        {
          defaultValue: data.value.record?.extra?? '',
          fieldName: 'extra',
        },
        {
          defaultValue: data.value.record?.sort?? 0,
          fieldName: 'sort',
        },
        {
          defaultValue: data.value.record?.status?? true,
          fieldName: 'status',
        },
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
  if (values.pid == null || values.pid == '' || values.pid == undefined) {
    values.pid = 0;
  }
  console.log(data.value);

  if (data.value.record.id) {
    updateCategoryApi({...values,id:data.value.record.id,type:1});
    message.success('编辑成功');
  }else{
    saveCategoryApi({...values,type:1});
    message.success('创建成功');
  }
  //关闭弹窗
  modalApi.close();
  //重置form
  formApi.resetForm();
}


//上传组件
const fileList = ref([]);
const loading = ref<boolean>(false);
const imageUrl = ref<string>('');

// 上传前校验
const beforeUpload = (file: File) => {
  const isImage = /^image\/(jpeg|png|jpg|gif)$/i.test(file.type);
  if (!isImage) {
    message.error('只能上传图片文件!');
    return Upload.LIST_IGNORE;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片必须小于2MB!');
    return Upload.LIST_IGNORE;
  }
  return true;
};

// 处理上传变化
const handleUploadChange = (info: any) => {
  const { status, response } = info.file;

  if (status === 'uploading') {
    loading.value = true;
    return;
  }

  if (status === 'done') {
    console.log(response);
    loading.value = false;
    if (response.url) {
      imageUrl.value = response.url;
      formApi.setFieldValue('extra', response.url);
      message.success('上传成功');
    } else {
      message.error(response.msg || '上传失败');
    }
  } else if (status === 'error') {
    loading.value = false;
    message.error('上传失败');
  }
};

// 自定义上传方法
const customRequest = async ({ file, onSuccess, onError }: any) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // 替换成你的实际上传API
    const res = await upLoadFileAPI(
      file,
    );
      onSuccess(res);
  } catch (error) {
    onError(error);
  }
};

</script>
<template>
  <Modal >
    <BaseForm>
      <template #extra>
        <Upload
          name="file"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :customRequest="customRequest"
          @change="handleUploadChange"
        >
          <div v-if="imageUrl" class="relative w-[100px] h-[100px]">
            <img :src="imageUrl" alt="avatar" class="w-full h-full object-cover" />
          </div>
          <div v-else class="upload-placeholder">
            <LoadingOutlined v-if="loading" />
            <PlusOutlined v-else />
            <div class="ant-upload-text">上传图片</div>
          </div>
        </Upload>
      </template>
    </BaseForm>
  </Modal>
</template>

<style scoped>
.avatar-uploader {
  :deep(.ant-upload) {
    width: 100px;
    height: 100px;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .ant-upload-text {
    margin-top: 8px;
    font-size: 12px;
  }
}
</style>
