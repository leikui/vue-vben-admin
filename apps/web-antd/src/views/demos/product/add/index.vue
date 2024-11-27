<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Step, Steps, Switch ,Upload,Image} from 'ant-design-vue';
import { LoadingOutlined ,PlusOutlined} from "@ant-design/icons-vue";
import { useVbenForm } from '#/adapter/form';
import { getCategoryApi ,getProductInfoApi, upLoadFileAPI} from "#/api";
import TEditor from './component/TinyEditor.vue';
import {useRoute} from 'vue-router';


const router = useRoute();
onMounted(() => {
  console.log(router.query.productId);
  const productId= router.query.productId;
  if (productId) {
    getProductInfo(productId)
  }

  getCateGoryData()
})

const prodContent = ref()
const getProductInfo = async (productId) => {
  const res = await getProductInfoApi(productId)
  firstFormApi.setValues(res)
  secondFormApi.setValues(res)
  thirdFormApi.setValues(res)
  prodContent.value = res.content

  if (res.sliderImages) {
    firstImageUrl.value = res.sliderImages;
  }
  if (res.content) {
    thirdImageUrl.value = res.content;
  }
}


const categoryData = ref()
const getCateGoryData = async () => {
  const res = await getCategoryApi({type:1,page:1,limit:999,status:-1})
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
const firstFileList = ref([]);
const thirdFileList = ref([]);
const firstImageUrl = ref('');
const thirdImageUrl = ref('');
const loading = ref(false);

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
const handleUploadChange = (info: any,) => {
  const { status, response } = info.file;

  if (status === 'uploading') {
    loading.value = true;
    return;
  }

  if (status === 'done') {
    console.log(response);
    loading.value = false;
    if (response.url) {
      firstFormApi.setFieldValue('image', response.url);
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
      // rules: 'required',
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
      defaultValue: false,
      fieldName: 'isShow',
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
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: '单规格',
            value: '1',
          },
          // {
          //   label: '多规格',
          //   value: '2',
          // },
        ],
      },
      fieldName: 'radioGroup',
      label: '单选组',
      defaultValue: '1',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      dependencies: {
        if(values) {
          return values.radioGroup == 1;
        },
        // 只有指定的字段改变时，才会触发
        triggerFields: ['radioGroup'],
      },
      fieldName: 'image',
      label: '图片',
      // rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        step:0.01,
        precision: 2,
        addonAfter:"元"
      },
      dependencies: {
        if(values) {
          return values.radioGroup == 1;
        },
        // 只有指定的字段改变时，才会触发
        triggerFields: ['radioGroup'],
      },
      fieldName: 'price',
      label: '售价',
      rules:'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        step:0.01,
        precision: 2,
        addonAfter:"元"
      },
      dependencies: {
        if(values) {
          return values.radioGroup == 1;
        },
        // 只有指定的字段改变时，才会触发
        triggerFields: ['radioGroup'],
      },
      fieldName: 'cost',
      label: '成本价',
      rules:'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        step:0.01,
        precision: 2,
        addonAfter:"元"
      },
      dependencies: {
        if(values) {
          return values.radioGroup == 1;
        },
        // 只有指定的字段改变时，才会触发
        triggerFields: ['radioGroup'],
      },
      fieldName: 'otPrice',
      label: '划线价',
      rules:'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        addonAfter:"件"
      },
      dependencies: {
        if(values) {
          return values.radioGroup == 1;
        },
        // 只有指定的字段改变时，才会触发
        triggerFields: ['radioGroup'],
      },
      fieldName: 'stock',
      label: '库存',
      rules:'required',
    },
    {
      component: 'Input',
      dependencies: {
        if(values) {
          return values.radioGroup == 1;
        },
        // 只有指定的字段改变时，才会触发
        triggerFields: ['radioGroup'],
      },
      fieldName: 'barCode',
      label: '商品编码',
      rules:'required',
    },
    // {
    //   component: 'Input',

    //   dependencies: {
    //     if(values) {
    //       return values.radioGroup == 1;
    //     },
    //     // 只有指定的字段改变时，才会触发
    //     triggerFields: ['radioGroup'],
    //   },
    //   fieldName: 'field1',
    //   label: '条形码',
    //   rules:'required',
    // },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        addonAfter:"kg"
      },
      dependencies: {
        if(values) {
          return values.radioGroup == 1;
        },
        // 只有指定的字段改变时，才会触发
        triggerFields: ['radioGroup'],
      },
      fieldName: 'weight',
      label: '重量',
      rules:'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        addonAfter:"m³"
      },
      dependencies: {
        if(values) {
          return values.radioGroup == 1;
        },
        // 只有指定的字段改变时，才会触发
        triggerFields: ['radioGroup'],
      },
      fieldName: 'volume',
      label: '体积',
      rules:'required',
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
      class: 'w-auto',
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
      fieldName: 'content',
      label: '商品详情',
      // rules: 'required',
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
    <Card>
      <div class="">
        <Steps :current="currentTab" class="steps">
          <Step title="基础信息" />
          <Step title="规格库存" />
          <Step title="商品详情" />
          <!-- <Step title="其他设置" /> -->
        </Steps>
        <div class="p-10">
          <FirstForm v-show="currentTab === 0">
            <template #sliderImages="slotProps">

              <Upload
                v-bind="slotProps"
                name="file"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :before-upload="beforeUpload"
                :customRequest="customRequest"
                @change="(info) => handleUploadChange(info, 'first')"
              >
                <div v-if="firstImageUrl" class="relative w-[100px] h-[100px]">
                  <img :src="firstImageUrl" alt="商品图片" class="w-full h-full object-cover" />
                </div>
                <div v-else class="upload-placeholder">
                  <LoadingOutlined v-if="loading" />
                  <PlusOutlined v-else />
                  <div class="ant-upload-text">上传商品图片</div>
                </div>
              </Upload>
            </template>
          </FirstForm>
          <SecondForm v-show="currentTab === 1" >
            <template #image="slotProps">
              <Upload v-bind="slotProps" v-model:file-list="fileList" name="avatar" list-type="picture-card"
                class="avatar-uploader" :show-upload-list="false" :before-upload="beforeUpload" @change="handleUploadChange">
                <Image v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                  <loading-outlined v-if="loading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">上传</div>
                </div>
              </Upload>
            </template>
          </SecondForm>
          <ThirdForm v-show="currentTab === 2" >
            <template #content="slotProps">
              <div class="mb-4">
                <Upload
                  v-bind="slotProps"
                  name="file"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  :customRequest="customRequest"
                  @change="(info) => handleUploadChange(info, 'third')"
                >
                  <div v-if="thirdImageUrl" class="relative w-[100px] h-[100px]">
                    <img :src="thirdImageUrl" alt="详情图片" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="upload-placeholder">
                    <LoadingOutlined v-if="loading" />
                    <PlusOutlined v-else />
                    <div class="ant-upload-text">上传详情图片</div>
                  </div>
                </Upload>
              </div>
              <TEditor v-bind="slotProps" :value="prodContent" />
            </template>
          </ThirdForm>
        </div>
      </div>
    </Card>
  </Page>
</template>

<style scoped>
.avatar-uploader {
  :deep(.ant-upload) {
    width: 100px;
    height: 100px;
  }
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
