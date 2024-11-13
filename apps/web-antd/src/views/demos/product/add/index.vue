<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Step, Steps, Switch ,Upload} from 'ant-design-vue';
import { LoadingOutlined ,PlusOutlined} from "@ant-design/icons-vue";
import { useVbenForm } from '#/adapter/form';
import { getCategoryApi } from "#/api";

onMounted(() => {
  getCateGoryData()
})


const categoryData = ref()
const getCateGoryData = async () => {
  const res = await getCategoryApi({})
  categoryData.value = res
  firstFormApi.updateSchema([
    {
      componentProps: {
        options: categoryData.value
      },
      fieldName: 'cateIds',
    }
  ])
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
      fieldName: 'storeName',
      label: '商品名称',
      rules: 'required',
    },

    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'unitName',
      label: '单位',
      rules: 'required',
    },

    {
      component: 'Input',

      fieldName: 'sliderImages',
      label: '商品轮播图',
      rules: 'required',
    },
    {
      component: 'Cascader',
      componentProps: {
        allowClear: false,
        filterOption: true,
        options: [],
        fieldNames: { label: 'name', value: 'id', children: 'child' },
        placeholder: '请选择父级分类',
        showSearch: false,
        multiple: true,
        maxTagCount: "responsive",
        showCheckedStrategy: 'SHOW_CHILD',
        class: 'w-[200px]',
      },
      fieldName: 'cateIds',
      label: '商品分类',
    },

    {
      component: 'Switch',
      componentProps: {
        checkedChildren: '上架',
        unCheckedChildren: '下架',
        class: 'w-auto',
      },
      defaultValue: true,
      fieldName: 'status',
      label: '商品状态',
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
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2',
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
      <div class="">
        <Steps :current="currentTab" class="steps">
          <Step title="商品信息" />
          <Step title="商品详情" />
          <Step title="其他设置" />
        </Steps>
        <div class="p-20">
          <FirstForm v-show="currentTab === 0">
            <template #sliderImages="slotProps">
              <Upload v-bind="slotProps" v-model:file-list="fileList" name="avatar" list-type="picture-card"
                class="avatar-uploader" :show-upload-list="false" :before-upload="beforeUpload" @change="handleChange">
                <Image v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                  <loading-outlined v-if="loading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">上传</div>
                </div>
              </Upload>
            </template>
          </FirstForm>
          <SecondForm v-show="currentTab === 1" />
          <ThirdForm v-show="currentTab === 2" />
        </div>
      </div>
    </Card>
  </Page>
</template>
