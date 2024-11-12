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

const data = ref();

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    console.info('onConfirm');
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
    }
  },
});

//规格表单
const attrData = ref({
  id: '',
  ruleName: '',
  ruleValue: '',
});

//添加新规格按钮 /输入框 展示
const addAttrBtn = ref(true);

//动态字段
// 父组件中的state数据
const parentState = ref({
  tags: [],
  inputVisible: false,
  inputValue: '',
});

// 接收子组件传来的更新后的数据并更新父组件的state
const updateParentState = (newState) => {
  Object.assign(attrData.value.ruleValue, newState);
};
</script>
<template>
  <Modal>
    <div>
      <!-- //规格名称 -->
      <Space>
        <span>规格名称：</span>
        <Input v-model:value="attrData.ruleName" placeholder="Basic usage" />
      </Space>
      <div v-if="attrData?.ruleValue">
        <div class="ml-16 mt-5">
          <Dynamic  v-for="item in JSON.parse(attrData?.ruleValue)" :state="item" @update:state="updateParentState" />
        </div>
      </div>

      <div v-if="!addAttrBtn" class="mt-10">
        <!-- //规格值 -->
        <Space>
          <span>规格：</span>
          <Input v-model:value="attrData.ruleValue" placeholder="Basic usage" />
          <span>规格值：</span>
          <Input v-model:value="attrData.ruleValue" placeholder="Basic usage" />
          <Button type="primary"> 确定 </Button>
          <Button type="primary"> 取消 </Button>
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
