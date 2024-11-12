<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';
import {
  Button,
  message,
  Space,
  Upload,
  Image,
  Input,
  Tag,
  Tooltip,
} from 'ant-design-vue';
import {
  DeleteOutlined,
  TagsOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';
import { useVbenModal } from '@vben/common-ui';
import Dynamic from './dynamic.vue';
import TagInput from './TagInputComponent.vue';
const data = ref();

const attrRules = ref()

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    console.info('onConfirm');

    attrData.value.ruleValue = JSON.stringify(attrRules.value)
    console.log(attrData.value);

    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData<Record<string, any>>();
      attrData.value = data.value.attr ?? {
        id: '',
        ruleName: '',
        ruleValue: '',
      };
      attrRules.value = attrData.value.ruleValue? JSON.parse(attrData.value.ruleValue):[]
    }
  },
});

//规格表单
const attrData = ref({
  id: '',
  ruleName: '',
  ruleValue: attrRules.value,
});

//添加新规格按钮 /输入框 展示
const addAttrBtn = ref(true);

// 定义用于更新标签列表的函数，该函数会在子组件中被调用
const updateTagListFn = (newTagList: string[], valueName: string) => {
  // 这里可以根据具体需求更新父组件中的allTagLists数据，比如找到对应的索引并替换
  // 以下是简单示例，假设只更新第一个列表
  console.log(newTagList, valueName);
  // 先查找ruleVals中是否已存在具有相同valueName的对象
  const existingIndex = attrRules.value.findIndex(
    (obj) => obj.value === valueName,
  );

  if (existingIndex !== -1) {
    // 如果存在，直接替换整个对象
    attrRules.value[existingIndex] = {
      value: valueName,
      detail: newTagList,
      inputVisible: false,
    };
  } else {
    // 如果不存在，添加新对象
    const rvs = {
      value: valueName,
      detail: newTagList,
      inputVisible: false,
    };
    attrRules.value.push(rvs);
  }
};
//删除规格
const handelDelAttr = (valueName: string)=>{
   // 使用filter方法创建一个新数组，排除掉value值等于valueName的对象
   attrRules.value = attrRules.value.filter((obj) => obj.value!== valueName);
}

//添加新规格
const newAtt = ref(
  {
    ruleName:'',
    ruleValue:''
  }
)

const newAttrConfirm = () => {
  if (newAtt.value.ruleName.length < 1) {
    message.warning('请添加规格名称')
    return
  }
  if (newAtt.value.ruleValue.length < 1) {
    message.warning('请添加规格值')
    return
  }
  const rvs = {
      value: newAtt.value.ruleName,
      detail: [newAtt.value.ruleValue],
      inputVisible: false,
    };
  attrRules.value.push(rvs);
  newAttrCancle()

}


const newAttrCancle = () => {
  newAtt.value = {
    ruleName:'',
    ruleValue:''
  }
  addAttrBtn.value = !addAttrBtn.value
}


</script>
<template>
  <Modal>
    <div>
      <!-- //规格名称 -->
      <Space>
        <span>规格名称：</span>
        <Input v-model:value="attrData.ruleName" placeholder="Basic usage" />
      </Space>
      <div v-if="attrRules">
        <div class="ml-16 mt-5">
          <!-- <Dynamic  v-for="item in JSON.parse(attrData?.ruleValue)" :state="item" @update:state="updateParentState" /> -->
          <TagInput
            v-for="(tagList, index) in attrRules"
            :key="index"
            :tagList="tagList.detail"
            :stateValue="tagList.value"
            :updateTagList="updateTagListFn"
            :handelDelAttr="handelDelAttr"
          ></TagInput>
        </div>
      </div>

      <div v-if="!addAttrBtn" class="mt-10">
        <!-- //规格值 -->
        <Space>
          <span>规格：</span>
          <Input v-model:value="newAtt.ruleName" placeholder="Basic usage" />
          <span>规格值：</span>
          <Input v-model:value="newAtt.ruleValue" placeholder="Basic usage" />
          <Button type="primary" @click="newAttrConfirm" > 确定 </Button>
          <Button type="primary" @click="newAttrCancle" > 取消 </Button>
        </Space>
      </div>
      <div v-if="addAttrBtn" class="mt-12">
        <Button type="primary" @click="addAttrBtn = !addAttrBtn">
          添加新规格
        </Button>
      </div>
    </div>
  </Modal>
</template>
