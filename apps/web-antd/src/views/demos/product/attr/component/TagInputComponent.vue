
<script lang="ts" setup>
import { ref, reactive, nextTick, type PropType } from 'vue';
import { Tooltip, Tag, Input, Space } from 'ant-design-vue';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';

// 定义props接收父组件传递的数据和更新函数
const props = defineProps({
  tagList: {
    type: Array as PropType<string[]>,
    required: true,
  },
  updateTagList: {
    type: Function as PropType<(newTagList: string[],valueName:string) => void>,
    required: true,
  },
  handelDelAttr: {
    type: Function as PropType<(valueName:string) => void>,
    required: true,
  },
  stateValue: {
    type: Object,
    required: true,
  },
});

const inputRef = ref();
// 使用接收的tagList初始化state.tags
const state = reactive({
  tags: props.tagList,
  inputVisible: false,
  inputValue: '',
  stateValue: props.stateValue,
});

const handleClose = (removedTag: string) => {
  const tags = state.tags.filter((tag) => tag !== removedTag);
  console.log(tags);
  // 更新state.tags后通过updateTagList回传数据给父组件
  state.tags = tags;
  props.updateTagList(tags,state.stateValue );
};

const showInput = () => {
  state.inputVisible = true;
  nextTick(() => {
    inputRef.value.focus();
  });
};

const handleInputConfirm = () => {
  const inputValue = state.inputValue;
  let tags = state.tags;
  if (inputValue && tags.indexOf(inputValue) === -1) {
    tags = [...tags, inputValue];
  }
  console.log(tags);
  // 更新state.tags后通过updateTagList回传数据给父组件
  state.tags = tags;
  props.updateTagList(tags,state.stateValue );

  Object.assign(state, {
    tags,
    inputVisible: false,
    inputValue: '',
  });
};

const delAttr = ()=>{
  props.handelDelAttr(state.stateValue)
}

</script>
<template>
  <div>
    <Space>
      <span>{{ state.stateValue }}:</span>
      <span @click="delAttr"><DeleteOutlined /></span>
    </Space>
  </div>
  <div class="m-5" >
    <template v-for="(tag, index) in state.tags" :key="tag">
      <Tooltip v-if="tag.length > 20" :title="tag">
        <Tag color="processing" closable @close="handleClose(tag)">
          {{ `${tag.slice(0, 20)}...` }}
        </Tag>
      </Tooltip>
      <Tag color="processing" v-else closable @close="handleClose(tag)">
        {{ tag }}
      </Tag>
    </template>
    <Input
      v-if="state.inputVisible"
      ref="inputRef"
      v-model:value="state.inputValue"
      type="text"
      size="small"
      :style="{ width: '78px' }"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <Tag
      v-else
      style="background: #fff; border-style: dashed"
      @click="showInput"
    >
      <plus-outlined />
      New Tag
    </Tag>
  </div>
</template>
