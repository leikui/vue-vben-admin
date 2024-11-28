<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Step, Steps, Switch ,Upload,Image} from 'ant-design-vue';
import { LoadingOutlined ,PlusOutlined} from "@ant-design/icons-vue";
import { useVbenForm } from '#/adapter/form';
import { getCategoryApi ,getProductInfoApi, upLoadFileAPI,saveProductApi,getProductRuleListApi} from "#/api";
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
  getProductRuleList()
})

const prodContent = ref()
const getProductInfo = async (productId:string) => {
  const res = await getProductInfoApi({id:productId})
  firstFormApi.setValues(res)
  secondFormApi.setValues(res)
  thirdFormApi.setValues(res)
  prodContent.value = res.content

  if (res.sliderImages) {
    firstImageUrl.value = res.sliderImages.split(',');
  }

}

const productRuleList = ref([])
const getProductRuleList = async () => {
  const res = await getProductRuleListApi({page:1,limit:9999})
  productRuleList.value = res.list
  console.log(res);
  secondFormApi.updateSchema([
    {
      componentProps: {
        options: productRuleList.value
      },
      fieldName: 'selectRule',
    }
  ])

}


const categoryData = ref()
const getCateGoryData = async () => {
  const res = await getCategoryApi({type:1,page:1,limit:999,status:-1})
  categoryData.value = res
  firstFormApi.updateSchema([
    {
      componentProps: {
        treeData: categoryData.value
      },
      fieldName: 'cateIds',
    }
  ])
}


//上传组件相关变量
const loading = ref<boolean>(false);
const firstImageUrl = ref<string[]>([]);
const fileList = ref<any[]>([]);

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
const handleUploadChange = async (info: any) => {
  const { status, response } = info.file;

  if (status === 'uploading') {
    loading.value = true;
    return;
  }

  if (status === 'done') {
    loading.value = false;
    console.log('response', response);

    if (response.url) {
      firstImageUrl.value = [...firstImageUrl.value, response.url];
      firstFormApi.setFieldValue('sliderImages', firstImageUrl.value.join(','));
      message.success('上传成功');
    } else {
      message.error('上传失败');
    }
  } else if (status === 'error') {
    loading.value = false;
    message.error('上传失败');
  }
};

// 添加删除图片的方法
const handleRemove = (index: number) => {
  firstImageUrl.value.splice(index, 1);
  firstFormApi.setFieldValue('sliderImages', firstImageUrl.value.join(','));
};

// 自定义上传方法
const customRequest = async ({ file, onSuccess, onError }: any) => {

  try {
    const res = await upLoadFileAPI(file);
    console.log(res);

    if (res.url) {
      onSuccess(res);
    } else {
      onError(new Error( '上传失败'));
    }
  } catch (error) {
    onError(error);
  }
};



const currentTab = ref(0);
async function onFirstSubmit(values: Record<string, any>) {
  message.success({
    content: `form1 values: ${JSON.stringify(values)}`,
  });
  await firstFormApi.getValues();
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
      // rules: 'required',
    },

    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'unitName',
      label: '单位',
      // rules: 'required',
    },

    {
      component: 'Input',

      fieldName: 'sliderImages',
      label: '商品轮播图',
      // rules: 'required',
    },

    {
      component: 'TreeSelect',
      componentProps: {
        allowClear: true,
        placeholder: '请选择',
        fieldNames: { label: 'name', value: 'id', children: 'child' },
        multiple: true,
        treeCheckable: true,
        labelInValue: false,
        treeNodeFilterProp: 'label',
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
      fieldName: 'isShow',
      label: '商品状态',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
      },

      fieldName: 'sort',
      label: '排序',
      rules:'required',
      defaultValue: 0,
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
      component: 'Select',
      componentProps: {
        allowClear: false,
        filterOption: true,
        options: productRuleList.value,
        fieldNames: { label: 'ruleName', value: 'id' },
        placeholder: '请选择规格',
        showSearch: false,
        mode: 'multiple',
        onChange: (value:any) => {
          console.log(value);
        }
      },
      fieldName: 'selectRule',
      label: '规格',
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
    //   fieldName: 'slider_image',
    //   label: '图片',
    //   // rules: 'required',
    // },
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
      defaultValue: 0,
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
      defaultValue: 0,
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
      defaultValue: 0,
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
      defaultValue: 10000,
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

    },

    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        addonAfter:"件"
      },

      fieldName: 'ficti',
      label: '虚拟销量',
      defaultValue: 0,
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
      },
      dependencies: {
        if(values) {
          return values.radioGroup == 1;
        },
        // 只有指定的字段改变时，才会触发
        triggerFields: ['radioGroup'],
      },
      defaultValue: 0,
      fieldName: 'weight',
      label: '重量',
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
      defaultValue: 0,
      fieldName: 'volume',
      label: '体积',
    },

    {
      component: 'EditTable',
      fieldName: 'specTable',
      label: '规格明细',
      componentProps: {
        columns: [
          { 
            title: '规格', 
            dataIndex: 'specs',
            width: 200,
          },
          {
            title: '图片',
            dataIndex: 'image',
            component: 'Upload',
            componentProps: {
              listType: 'picture-card',
              maxCount: 1,
              accept: 'image/*'
            },
            width: 100,
          },
          {
            title: '售价',
            dataIndex: 'price',
            component: 'InputNumber',
            componentProps: {
              min: 0,
              precision: 2,
              addonAfter: '元'
            },
            width: 150,
          },
          {
            title: '成本价',
            dataIndex: 'cost',
            component: 'InputNumber',
            componentProps: {
              min: 0,
              precision: 2,
              addonAfter: '元'
            },
            width: 150,
          },
          {
            title: '原价',
            dataIndex: 'otPrice',
            component: 'InputNumber',
            componentProps: {
              min: 0,
              precision: 2,
              addonAfter: '元'
            },
            width: 150,
          },
          {
            title: '库存',
            dataIndex: 'stock',
            component: 'InputNumber',
            componentProps: {
              min: 0,
              addonAfter: '件'
            },
            width: 150,
          },
          {
            title: '商品编号',
            dataIndex: 'barCode',
            component: 'Input',
            width: 150,
          },
          {
            title: '重量',
            dataIndex: 'weight',
            component: 'InputNumber',
            componentProps: {
              min: 0,
              addonAfter: 'KG'
            },
            width: 150,
          },
          {
            title: '体积',
            dataIndex: 'volume',
            component: 'InputNumber',
            componentProps: {
              min: 0,
              addonAfter: 'm³'
            },
            width: 150,
          }
        ]
      }
    }
  ],
  submitButtonOptions: {
    content: '下一步',
  },
  wrapperClass: 'grid-cols-12 md:grid-cols-1 lg:grid-cols-1',
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

  let attrvalue:any[] = []
  let av = await secondFormApi.getValues()

  const avnew = {...av,attrValue:JSON.stringify({规格:"默认"})}

  console.log(attrvalue);

  const values = await firstFormApi
    .merge(secondFormApi)
    .merge(thirdFormApi)
    .submitAllForm(needMerge.value)
    //组装数据
    values.specType = 0
    values.cateId = values.cateIds.join(',')
    values.type = 1

    //选中的规格attr
    // const ruleV = JSON.parse(productRuleList.value.find(item => item.id == values.selectRule).ruleValue)\
    // ruleV.attrName = ruleV.value
    // ruleV.

    values.attr = [productRuleList.value.find(item => item.id == values.selectRule)]
    console.log(avnew);

    attrvalue.push(avnew)
    //规格属性attrValue
    values.attrValue = attrvalue
    saveProductApi(values)
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
            <template #sliderImages>
              <div class="flex flex-wrap gap-2">
                <Upload
                  name="file"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :multiple="true"
                  :before-upload="beforeUpload"
                  :custom-request="customRequest"
                  @change="handleUploadChange"
                >
                  <div class="upload-placeholder">
                    <LoadingOutlined v-if="loading" />
                    <PlusOutlined v-else />
                    <div class="ant-upload-text">上传商品图片</div>
                  </div>
                </Upload>
                <div v-for="(url, index) in firstImageUrl" :key="index" class="relative">
                  <img :src="url" alt="商品图片" class="w-[100px] h-[100px] object-cover rounded" />
                  <Button
                    type="link"
                    class="absolute top-0 right-0 text-red-500"
                    @click.stop="handleRemove(index)"
                  >
                    删除
                  </Button>
                </div>
              </div>
            </template>
          </FirstForm>
          <SecondForm v-show="currentTab === 1" >
            <!-- <template #image="slotProps">
              <Upload v-bind="slotProps" v-model:file-list="fileList" name="avatar" list-type="picture-card"
                class="avatar-uploader" :show-upload-list="false" :before-upload="beforeUpload" @change="handleUploadChange">
                <Image v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                  <loading-outlined v-if="loading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">上传</div>
                </div>
              </Upload>
            </template> -->
          </SecondForm>
          <ThirdForm v-show="currentTab === 2" >
            <template #content="slotProps">
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

.ant-upload-text {
  margin-top: 8px;
  font-size: 12px;
}

:deep(.ant-upload-list) {
  display: none;
}
</style>
