<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Step, Steps, Switch ,Upload,Image,Table,Input,InputNumber,Modal} from 'ant-design-vue';
import { LoadingOutlined ,PlusOutlined,DeleteOutlined} from "@ant-design/icons-vue";
import { useVbenForm } from '#/adapter/form';
import { getCategoryApi ,getProductInfoApi, upLoadFileAPI,saveProductApi,getProductRuleListApi} from "#/api";
import TEditor from './component/TinyEditor.vue';
import {useRoute} from 'vue-router';
import type { UploadProps } from 'ant-design-vue';

// 在文件顶部添加类型定义
interface ColumnType {
  title: string;
  dataIndex: string;
}

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
const fileList = ref<UploadProps['fileList']>([]);

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
  fileList.value = info.fileList;

  if (status === 'uploading') {
    loading.value = true;
    return;
  }

  if (status === 'done') {
    loading.value = false;
    if (response.url) {
      firstImageUrl.value = fileList.value.map(file => file.response?.url || file.url);
      firstFormApi.setFieldValue('sliderImage', firstImageUrl.value.join(','));
      message.success('上传成功');
    } else {
      message.error('上传失败');
    }
  } else if (status === 'error') {
    loading.value = false;
    message.error('上传失败');
  }
};

// 修改删除方法
const handleRemove = (file: any) => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;

  firstImageUrl.value = newFileList.map(file => file.response?.url || file.url);
  firstFormApi.setFieldValue('sliderImage', firstImageUrl.value.join(','));
  return true;
};

// 添加预览相关的响应式变量
const previewVisible = ref<boolean>(false);
const previewImage = ref<string>('');
const previewTitle = ref<string>('');

// 修改预览处理函数
const handlePreview = async (file: UploadProps['fileList'][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

// 添加取消预览函数
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
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
fieldName: 'storeInfo',
label: '商品简介',
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
      fieldName: 'image',
      label: '商品主图',
    },
    {
      component: 'Input',

      fieldName: 'sliderImage',
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
      component: 'Select',
      componentProps: {
        allowClear: false,
        filterOption: true,
        options: productRuleList.value,
        fieldNames: { label: 'ruleName', value: 'id' },
        placeholder: '请选择规格',
        showSearch: false,
        onChange: (value:any) => {
          console.log(value);
          const combinations = getSpecCombinations(value);
          // 从组合中提取唯一的规格名称作为表头
          const headers = combinations.length > 0
            ? Object.keys(combinations[0]).map(key => ({
                title: key,
                dataIndex: key
              }))
            : [];

          // 添加规格和规格值列
          attrColumns.value = [
            ...headers,
            {title:'图片',dataIndex:'image'},
            {title:'售价',dataIndex:'price'},
            {title:'库存',dataIndex:'stock'},
            {title:'重量',dataIndex:'weight'},
            {title:'体积',dataIndex:'volume'},
            {title:'商品编号',dataIndex:'sales'},

            {title:'操作',dataIndex:'action'},

          ];

          console.log(combinations);

          // 转换数据格式
          specData.value = combinations.map(item => {
            // 将每个规格组合转换为表格行数据
            const rowData:any = {
              ...item, // 展开规格值作为独立列
              attrValue:JSON.stringify(item),
              image: '', // 图片列
              price: 0, // 售价列
              stock: 1000, // 库存列
              sales: '', // 商品编号列
              weight: 0, // 重量列
              volume: 0, // 体积列

            };
            return rowData;
          });
          console.log(JSON.stringify(combinations));
        }
      },
      fieldName: 'selectRule',
      label: '规格',
    },

    {
      component: 'Input',
      dependencies: {

        // 只有指定的字段改变时，才会触发
        triggerFields: ['radioGroup'],
      },
      fieldName: 'test',
      label: '商品属性',
      // rules: 'required',
    },

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

  console.log(specData.value);


  const values = await firstFormApi
    .merge(secondFormApi)
    .merge(thirdFormApi)
    .submitAllForm(needMerge.value)
    //组装数据

    values.cateId = values.cateIds.join(',')
    values.type = 1

    //选中的规格attr
    // const ruleV = JSON.parse(productRuleList.value.find(item => item.id == values.selectRule).ruleValue)\
    // ruleV.attrName = ruleV.value
    // ruleV.
    const attr = productRuleList.value.find(item => item.id == values.selectRule)
    if(attr) {
      const ruleValue = JSON.parse(attr.ruleValue)
      // 确保 values.attr 是一个数组
      values.attr = []
      // 将解析后的规格值添加到数组中
      ruleValue.forEach((item:any) => {
        values.attr.push({
          attrName: item.value,
          attrValues: item.detail.join(',')
        })
      })
    }

    attrvalue.push(avnew)
    //规格属性attrValue
    values.attrValue = specData.value
    values.specType = values.attrValue.length > 0 ? 1 : 0

    saveProductApi(values)
  message.success({
    content: `merged form values: ${JSON.stringify(values)}`,
  });
}

//获取规格值
// 获取规格组合
const getSpecCombinations = (ruleId: string) => {
  const rule = productRuleList.value.find(item => item.id == ruleId);
  if (!rule) return [];

  const ruleValue = JSON.parse(rule.ruleValue);

  // 获取所有规格值数组
  const specArrays = ruleValue.map(item => {
    return item.detail.map(detail => ({
      [item.value]: detail
    }));
  });

  // 递归组合所有规格
  const combine = (arrays: any[]) => {
    if (arrays.length === 0) return [{}];

    const [first, ...rest] = arrays;
    const restCombinations = combine(rest);

    return first.reduce((acc: any[], item: any) => {
      return [
        ...acc,
        ...restCombinations.map(combination => ({
          ...combination,
          ...item
        }))
      ];
    }, []);
  };

  return combine(specArrays);
};


const attrColumns = ref<ColumnType[]>([]);
const specData = ref([])

// 添加图片上传处理函数
const handleSpecImageUpload = async (file: File, record: any) => {
  try {
    const res = await upLoadFileAPI(file);
    if (res.url) {
      record.image = res.url;
      message.success('上传成功');
    } else {
      message.error('上传失败');
    }
  } catch (error) {
    message.error('上传失败');
  }
};

// 删除规格图片
const handleSpecImageRemove = (record: any) => {
  record.image = '';
};

// 添加 base64 转换函数
function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function handleSpecDelete(record: any) {
  specData.value = specData.value.filter(item => item !== record);
}

// 添加主图上传相关变量和方法
const mainImageUrl = ref<string>('');
const mainImageLoading = ref<boolean>(false);
const mainImageFileList = ref<UploadProps['fileList']>([]);

// 处理主图上传
const handleMainImageUpload = async (info: any) => {
  const { status, response } = info.file;
  mainImageFileList.value = info.fileList;

  if (status === 'uploading') {
    mainImageLoading.value = true;
    return;
  }

  if (status === 'done') {
    mainImageLoading.value = false;
    if (response.url) {
      mainImageUrl.value = response.url;
      firstFormApi.setFieldValue('image', response.url);
      message.success('上传成功');
    } else {
      message.error('上传失败');
    }
  } else if (status === 'error') {
    mainImageLoading.value = false;
    message.error('上传失败');
  }
};

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
            <template #sliderImage>
              <div class="clearfix">
                <Upload
                  v-model:file-list="fileList"
                  list-type="picture-card"
                  :before-upload="beforeUpload"
                  :custom-request="customRequest"
                  @change="handleUploadChange"
                  @preview="handlePreview"
                >
                  <div v-if="fileList.length < 8">
                    <PlusOutlined />
                    <div style="margin-top: 8px">上传图片</div>
                  </div>
                </Upload>
                <Modal
                  :open="previewVisible"
                  :title="previewTitle"
                  :footer="null"
                  @cancel="handleCancel"
                >
                  <img alt="预图片" style="width: 100%" :src="previewImage" />
                </Modal>
              </div>
            </template>
            <template #image>
              <div class="clearfix">
                <Upload
                  v-model:file-list="mainImageFileList"
                  :maxCount="1"
                  list-type="picture-card"
                  :before-upload="beforeUpload"
                  :custom-request="customRequest"
                  @change="handleMainImageUpload"
                  @preview="handlePreview"
                >
                  <div v-if="mainImageFileList.length < 1">
                    <PlusOutlined />
                    <div style="margin-top: 8px">上传主图</div>
                  </div>
                </Upload>
              </div>
            </template>
          </FirstForm>
          <SecondForm v-show="currentTab === 1" >
            <template #test="slotProps">
              <div class="w-full" v-bind="slotProps">
                <Table :columns="attrColumns" :dataSource="specData" bordered :pagination="false">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'price'">
                      <InputNumber
                        v-model:value="record.price"
                        :min="0"
                        :step="0.01"
                        :precision="2"
                        :addon-after="'元'"
                      />
                    </template>
                    <template v-else-if="column.dataIndex === 'stock'">
                      <InputNumber
                        v-model:value="record.stock"
                        :min="0"
                        :addon-after="'件'"
                      />
                    </template>
                    <template v-else-if="column.dataIndex === 'image'">
                      <Upload
                        :showUploadList="false"
                        :maxCount="1"
                        accept="image/*"
                        :beforeUpload="(file) => {
                          handleSpecImageUpload(file, record);
                          return false;
                        }"
                        listType="picture-card"
                        class="spec-upload"
                      >
                        <div v-if="!record.image" style="width: 40px; height: 40px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                          <PlusOutlined style="font-size: 12px;" />
                          <div style="margin-top: 2px; font-size: 10px;">上传</div>
                        </div>
                        <div v-else class="relative" style="width: 40px; height: 40px;">
                          <img :src="record.image" style="width: 40px; height: 40px; object-fit: cover;" />
                          <Button
                            type="link"
                            class="absolute bottom-0 left-0 right-0 text-red-500 bg-white/80"
                            style="padding: 0; height: auto; font-size: 10px;"
                            @click.stop="(e) => {
                              e.stopPropagation();
                              handleSpecImageRemove(record);
                            }"
                          >
                            删除
                          </Button>
                        </div>
                      </Upload>
                    </template>

                    <template v-else-if="column.dataIndex === 'weight'">
                      <InputNumber v-model:value="record.weight" :min="0" :addon-after="'kg'" />
                    </template>
                    <template v-else-if="column.dataIndex === 'volume'">
                      <InputNumber v-model:value="record.volume" :min="0" :addon-after="'m³'" />
                    </template>
                    <template v-else-if="column.dataIndex === 'sales'">
                      <Input v-model:value="record.sales" />
                    </template>
                    <template v-else-if="column.dataIndex === 'action'">
                      <Button type="link" @click="handleSpecDelete(record)">删除</Button>
                    </template>
                  </template>
                </Table>
              </div>


            </template>
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

<style lang="less" scoped>
:deep(.spec-upload) {
  .ant-upload.ant-upload-select {
    width: 40px !important;
    height: 40px !important;
    margin: 0 !important;
  }

  .ant-upload-list-item {
    width: 40px !important;
    height: 40px !important;
  }
}
</style>
